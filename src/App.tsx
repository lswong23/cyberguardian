import React, { useState } from 'react';
import { Shield, Award, Mail, Home, BarChart3, User as UserIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EmailSimulation from './components/EmailSimulation';
import SMSSimulation from './components/SMSSimulation';
import Header from './components/Header';
import Navigation from './components/Navigation';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import { useAuth } from './hooks/useAuth';
import { useUserProgress } from './hooks/useUserProgress';

export interface UserProgress {
  points: number;
  badges: string[];
  completedSimulations: string[];
  currentLevel: number;
}

function App() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { 
    badges, 
    completedSimulations, 
    addPoints, 
    completeSimulation, 
    isSimulationCompleted, 
    getBadgeNames,
    loading: progressLoading 
  } = useUserProgress();

  const [currentView, setCurrentView] = useState<'dashboard' | 'email-simulation' | 'sms-simulation'>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Convert backend data to legacy format for existing components
  const legacyUserProgress: UserProgress = {
    points: userProfile?.total_points || 0,
    badges: getBadgeNames(),
    completedSimulations: completedSimulations.map(sim => sim.simulation.name),
    currentLevel: userProfile?.current_level || 1
  };

  const handleAddPoints = async (points: number) => {
    await addPoints(points);
  };

  const handleUnlockBadge = async (badgeName: string) => {
    // Badges are now automatically awarded by the backend
    // This function is kept for compatibility but doesn't need to do anything
  };

  const handleCompleteSimulation = async (simulationId: string) => {
    // For now, we'll use default values for the simulation completion
    // In a real implementation, you'd track these values during the simulation
    await completeSimulation(simulationId, 100, 300, 3, 3);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-accent p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-pulse">
            <Shield className="h-12 w-12 text-warm-white" />
          </div>
          <p className="text-elderly-xl text-navy">Loading Cyber Guardian...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-white text-navy">
        <Header />
        
        {/* Welcome Screen for Non-Authenticated Users */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy">
              <div className="bg-blue-accent p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Shield className="h-12 w-12 text-warm-white" />
              </div>
              <h2 className="text-elderly-3xl font-bold mb-4 text-navy">Welcome to Cyber Guardian!</h2>
              <p className="text-elderly-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Learn to stay safe online with our friendly, easy-to-understand cybersecurity training. 
                Create an account to track your progress and earn badges!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm"
                >
                  Get Started - Create Account
                </button>
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="bg-gray-200 text-navy px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-gray-300 transition-colors duration-200 border-2 border-navy"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-warm border-2 border-red-300">
                <Mail className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-elderly-xl font-bold text-navy mb-3">Email Safety Training</h3>
                <p className="text-elderly-lg text-gray-700">
                  Learn to spot fake emails and protect yourself from phishing scams.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-warm border-2 border-blue-300">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-elderly-xl font-bold text-navy mb-3">Text Message Safety</h3>
                <p className="text-elderly-lg text-gray-700">
                  Identify suspicious text messages and avoid SMS scams.
                </p>
              </div>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />

        {/* Built with Bolt.new Badge */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-navy text-warm-white px-4 py-2 rounded-xl text-elderly-base font-semibold shadow-warm border-2 border-blue-accent">
            Built with Bolt.new
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white text-navy">
      <Header />
      
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userProgress={legacyUserProgress}
        onShowProfile={() => setShowUserProfile(true)}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard 
            userProgress={legacyUserProgress}
            onStartEmailSimulation={() => setCurrentView('email-simulation')}
            onStartSMSSimulation={() => setCurrentView('sms-simulation')}
          />
        ) : currentView === 'email-simulation' ? (
          <EmailSimulation
            userProgress={legacyUserProgress}
            onAddPoints={handleAddPoints}
            onUnlockBadge={handleUnlockBadge}
            onCompleteSimulation={handleCompleteSimulation}
            onReturnToDashboard={() => setCurrentView('dashboard')}
          />
        ) : (
          <SMSSimulation
            userProgress={legacyUserProgress}
            onAddPoints={handleAddPoints}
            onUnlockBadge={handleUnlockBadge}
            onCompleteSimulation={handleCompleteSimulation}
            onReturnToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      {/* Built with Bolt.new Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-navy text-warm-white px-4 py-2 rounded-xl text-elderly-base font-semibold shadow-warm border-2 border-blue-accent">
          Built with Bolt.new
        </div>
      </div>
    </div>
  );
}

export default App;