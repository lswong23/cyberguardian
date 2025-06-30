import { useState, useEffect } from 'react';
import { supabase, UserBadge, UserSimulationProgress, ActivityLog } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useUserProgress() {
  const { user, userProfile } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [completedSimulations, setCompletedSimulations] = useState<UserSimulationProgress[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    } else {
      setBadges([]);
      setCompletedSimulations([]);
      setActivityLog([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user badges
      const { data: badgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (badgesError) {
        console.error('Error fetching badges:', badgesError);
      } else {
        setBadges(badgesData || []);
      }

      // Fetch completed simulations
      const { data: simulationsData, error: simulationsError } = await supabase
        .from('user_simulation_progress')
        .select(`
          *,
          simulation:simulations(*)
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (simulationsError) {
        console.error('Error fetching simulations:', simulationsError);
      } else {
        setCompletedSimulations(simulationsData || []);
      }

      // Fetch activity log
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityError) {
        console.error('Error fetching activity log:', activityError);
      } else {
        setActivityLog(activityData || []);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (points: number, activityType: string = 'points_earned', activityData: any = {}) => {
    if (!user || !userProfile) return;

    try {
      // Update user points
      const newTotalPoints = userProfile.total_points + points;
      const { error: updateError } = await supabase
        .from('users')
        .update({ total_points: newTotalPoints })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating points:', updateError);
        return;
      }

      // Log the activity
      const { error: logError } = await supabase
        .from('user_activity_log')
        .insert({
          user_id: user.id,
          activity_type: activityType,
          activity_data: activityData,
          points_earned: points,
        });

      if (logError) {
        console.error('Error logging activity:', logError);
      }

      // Check for new badges
      await checkAndAwardBadges();

      // Refresh user progress
      await fetchUserProgress();
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const completeSimulation = async (
    simulationName: string,
    score: number,
    timeTaken: number,
    redFlagsFound: number,
    totalRedFlags: number
  ) => {
    if (!user) return;

    try {
      // Get simulation details
      const { data: simulation, error: simError } = await supabase
        .from('simulations')
        .select('*')
        .eq('name', simulationName)
        .single();

      if (simError || !simulation) {
        console.error('Error fetching simulation:', simError);
        return;
      }

      // Record simulation completion
      const { error: progressError } = await supabase
        .from('user_simulation_progress')
        .upsert({
          user_id: user.id,
          simulation_id: simulation.id,
          score,
          time_taken: timeTaken,
          red_flags_found: redFlagsFound,
          total_red_flags: totalRedFlags,
        });

      if (progressError) {
        console.error('Error recording simulation progress:', progressError);
        return;
      }

      // Award points
      await addPoints(
        simulation.points_reward,
        'simulation_completed',
        {
          simulation_name: simulation.display_name,
          score,
          time_taken: timeTaken,
        }
      );
    } catch (error) {
      console.error('Error completing simulation:', error);
    }
  };

  const checkAndAwardBadges = async () => {
    if (!user) return;

    try {
      // Call the database function to check and award badges
      const { error } = await supabase.rpc('check_and_award_badges', {
        user_id_param: user.id,
      });

      if (error) {
        console.error('Error checking badges:', error);
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const isSimulationCompleted = (simulationName: string): boolean => {
    return completedSimulations.some(
      (progress) => progress.simulation.name === simulationName
    );
  };

  const getBadgeNames = (): string[] => {
    return badges.map((userBadge) => userBadge.badge.name);
  };

  return {
    badges,
    completedSimulations,
    activityLog,
    loading,
    addPoints,
    completeSimulation,
    isSimulationCompleted,
    getBadgeNames,
    refreshProgress: fetchUserProgress,
  };
}