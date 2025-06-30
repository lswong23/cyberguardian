import React, { useState } from 'react';
import { User, Settings, LogOut, Trophy, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProgress } from '../hooks/useUserProgress';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, userProfile, signOut, updateProfile } = useAuth();
  const { badges, activityLog } = useUserProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.display_name || '');

  if (!isOpen || !user || !userProfile) return null;

  const handleSaveProfile = async () => {
    if (displayName.trim()) {
      await updateProfile({ display_name: displayName.trim() });
      setIsEditing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-warm border-4 border-navy">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-elderly-2xl font-bold text-navy">Your Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Profile Info */}
        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-accent p-4 rounded-full">
              <User className="h-8 w-8 text-warm-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl text-elderly-lg focus:border-blue-accent focus:outline-none"
                    placeholder="Enter your name"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-success-green text-white px-4 py-2 rounded-xl text-elderly-base font-semibold hover:bg-green-600 transition-colors duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(userProfile.display_name);
                      }}
                      className="bg-gray-300 text-navy px-4 py-2 rounded-xl text-elderly-base font-semibold hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-elderly-xl font-bold text-navy">{userProfile.display_name}</h3>
                  <p className="text-elderly-lg text-gray-600">{userProfile.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-accent font-semibold text-elderly-base hover:underline mt-2 flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-xl p-4">
              <p className="text-elderly-2xl font-bold text-success-green">{userProfile.total_points}</p>
              <p className="text-elderly-base text-gray-600">Total Points</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-elderly-2xl font-bold text-warning-amber">{badges.length}</p>
              <p className="text-elderly-base text-gray-600">Badges Earned</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-elderly-2xl font-bold text-blue-accent">{userProfile.current_level}</p>
              <p className="text-elderly-base text-gray-600">Current Level</p>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        {badges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-elderly-xl font-bold text-navy mb-4 flex items-center">
              <Trophy className="h-6 w-6 mr-2" />
              Recent Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.slice(0, 4).map((userBadge) => (
                <div key={userBadge.id} className="bg-yellow-50 border-2 border-warning-amber rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-warning-amber p-2 rounded-full">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-elderly-lg font-bold text-navy">{userBadge.badge.display_name}</h4>
                      <p className="text-elderly-base text-gray-600">
                        {formatDate(userBadge.earned_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {activityLog.length > 0 && (
          <div className="mb-6">
            <h3 className="text-elderly-xl font-bold text-navy mb-4 flex items-center">
              <Activity className="h-6 w-6 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {activityLog.slice(0, 10).map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-elderly-lg font-semibold text-navy">
                      {activity.activity_type === 'simulation_completed' && 'Completed Training'}
                      {activity.activity_type === 'badge_earned' && 'Earned Badge'}
                      {activity.activity_type === 'points_earned' && 'Earned Points'}
                    </p>
                    <p className="text-elderly-base text-gray-600">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                  {activity.points_earned > 0 && (
                    <div className="bg-success-green text-white px-3 py-1 rounded-xl text-elderly-base font-semibold">
                      +{activity.points_earned} pts
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-elderly-xl font-bold text-navy mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Account Information
          </h3>
          <div className="space-y-2">
            <p className="text-elderly-lg text-gray-700">
              <span className="font-semibold">Member since:</span> {formatDate(userProfile.created_at)}
            </p>
            <p className="text-elderly-lg text-gray-700">
              <span className="font-semibold">Last updated:</span> {formatDate(userProfile.updated_at)}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-4 rounded-xl text-elderly-xl font-bold hover:bg-red-700 transition-colors duration-200 shadow-warm flex items-center justify-center space-x-3"
        >
          <LogOut className="h-6 w-6" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfile;