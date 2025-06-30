/*
  # Cyber Guardian Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth user ID
      - `email` (text, unique) - user's email address
      - `display_name` (text) - user's display name
      - `total_points` (integer) - total points earned
      - `current_level` (integer) - current level based on points
      - `created_at` (timestamp) - account creation date
      - `updated_at` (timestamp) - last update date

    - `badges`
      - `id` (uuid, primary key)
      - `name` (text, unique) - badge identifier
      - `display_name` (text) - human-readable badge name
      - `description` (text) - badge description
      - `icon` (text) - icon name for the badge
      - `points_required` (integer) - points needed to unlock
      - `created_at` (timestamp)

    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `badge_id` (uuid, foreign key to badges)
      - `earned_at` (timestamp) - when the badge was earned

    - `simulations`
      - `id` (uuid, primary key)
      - `name` (text, unique) - simulation identifier
      - `display_name` (text) - human-readable simulation name
      - `type` (text) - 'email' or 'sms'
      - `difficulty` (text) - 'beginner', 'intermediate', 'advanced'
      - `points_reward` (integer) - points awarded for completion
      - `created_at` (timestamp)

    - `user_simulation_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `simulation_id` (uuid, foreign key to simulations)
      - `completed_at` (timestamp) - when simulation was completed
      - `score` (integer) - score achieved (0-100)
      - `time_taken` (integer) - time taken in seconds
      - `red_flags_found` (integer) - number of red flags identified
      - `total_red_flags` (integer) - total red flags in simulation

    - `user_activity_log`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `activity_type` (text) - 'simulation_completed', 'badge_earned', 'level_up'
      - `activity_data` (jsonb) - additional activity details
      - `points_earned` (integer) - points earned from this activity
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public badge and simulation data

  3. Functions
    - Function to calculate user level based on points
    - Function to check and award badges automatically
    - Function to update user statistics
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  display_name text DEFAULT '',
  total_points integer DEFAULT 0,
  current_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'award',
  points_required integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create simulations table
CREATE TABLE IF NOT EXISTS simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  points_reward integer DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

-- Create user_simulation_progress table
CREATE TABLE IF NOT EXISTS user_simulation_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  simulation_id uuid REFERENCES simulations(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  score integer DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  time_taken integer DEFAULT 0,
  red_flags_found integer DEFAULT 0,
  total_red_flags integer DEFAULT 0,
  UNIQUE(user_id, simulation_id)
);

-- Create user_activity_log table
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}',
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_simulation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for badges table (public read)
CREATE POLICY "Anyone can read badges"
  ON badges
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_badges table
CREATE POLICY "Users can read own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for simulations table (public read)
CREATE POLICY "Anyone can read simulations"
  ON simulations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user_simulation_progress table
CREATE POLICY "Users can read own progress"
  ON user_simulation_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_simulation_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_simulation_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for user_activity_log table
CREATE POLICY "Users can read own activity"
  ON user_activity_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON user_activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to calculate level based on points
CREATE OR REPLACE FUNCTION calculate_level(points integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Level 1: 0-99 points
  -- Level 2: 100-299 points  
  -- Level 3: 300-599 points
  -- Level 4: 600-999 points
  -- Level 5+: 1000+ points (every 500 points = 1 level)
  
  IF points < 100 THEN
    RETURN 1;
  ELSIF points < 300 THEN
    RETURN 2;
  ELSIF points < 600 THEN
    RETURN 3;
  ELSIF points < 1000 THEN
    RETURN 4;
  ELSE
    RETURN 5 + ((points - 1000) / 500);
  END IF;
END;
$$;

-- Function to update user level when points change
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.current_level := calculate_level(NEW.total_points);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- Trigger to automatically update level when points change
CREATE TRIGGER update_user_level_trigger
  BEFORE UPDATE OF total_points ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_level();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(user_id_param uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  user_points integer;
  badge_record record;
BEGIN
  -- Get user's current points
  SELECT total_points INTO user_points
  FROM users
  WHERE id = user_id_param;
  
  -- Check each badge the user doesn't have yet
  FOR badge_record IN
    SELECT b.id, b.name, b.points_required
    FROM badges b
    WHERE b.points_required <= user_points
    AND NOT EXISTS (
      SELECT 1 FROM user_badges ub 
      WHERE ub.user_id = user_id_param AND ub.badge_id = b.id
    )
  LOOP
    -- Award the badge
    INSERT INTO user_badges (user_id, badge_id)
    VALUES (user_id_param, badge_record.id);
    
    -- Log the activity
    INSERT INTO user_activity_log (user_id, activity_type, activity_data)
    VALUES (
      user_id_param, 
      'badge_earned', 
      jsonb_build_object('badge_name', badge_record.name)
    );
  END LOOP;
END;
$$;

-- Insert default badges
INSERT INTO badges (name, display_name, description, icon, points_required) VALUES
  ('security-novice', 'Safety Student', 'You completed your first training lesson!', 'shield', 25),
  ('phishing-detector', 'Email Detective', 'You spotted all the tricks in a fake email!', 'mail', 75),
  ('sms-guardian', 'Text Message Hero', 'You caught all the red flags in a scam text!', 'message-square', 75),
  ('eagle-eye', 'Sharp Eyes', 'You found suspicious things very quickly!', 'target', 100),
  ('scam-buster', 'Scam Fighter', 'You completed both email and text training!', 'award', 150),
  ('point-collector', 'Point Collector', 'You earned 200 points!', 'trending-up', 200),
  ('level-master', 'Level Master', 'You reached level 3!', 'star', 300),
  ('cyber-guardian', 'Cyber Guardian', 'You completed all available training!', 'shield-check', 500)
ON CONFLICT (name) DO NOTHING;

-- Insert default simulations
INSERT INTO simulations (name, display_name, type, difficulty, points_reward) VALUES
  ('phishing-email-1', 'Email Safety Training', 'email', 'beginner', 75),
  ('sms-scam-1', 'Text Message Safety Training', 'sms', 'beginner', 75),
  ('advanced-phishing', 'Advanced Email Threats', 'email', 'intermediate', 100),
  ('social-engineering', 'Social Engineering Awareness', 'sms', 'intermediate', 100)
ON CONFLICT (name) DO NOTHING;

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();