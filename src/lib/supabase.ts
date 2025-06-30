import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  display_name: string;
  total_points: number;
  current_level: number;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  points_required: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge: Badge;
}

export interface Simulation {
  id: string;
  name: string;
  display_name: string;
  type: 'email' | 'sms';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points_reward: number;
}

export interface UserSimulationProgress {
  id: string;
  user_id: string;
  simulation_id: string;
  completed_at: string;
  score: number;
  time_taken: number;
  red_flags_found: number;
  total_red_flags: number;
  simulation: Simulation;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_data: any;
  points_earned: number;
  created_at: string;
}