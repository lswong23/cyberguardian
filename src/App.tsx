import React, { useState } from 'react';
import { Shield, Award, Mail, Home, BarChart3 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EmailSimulation from './components/EmailSimulation';
import SMSSimulation from './components/SMSSimulation';
import Header from './components/Header';
import Navigation from './components/Navigation';

export interface UserProgress {
  points: number;
  badges: string[];
  completedSimulations: string[];
  currentLevel: number;
}

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'email-simulation' | 'sms-simulation'>('dashboard');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    badges: [],
    completedSimulations: [],
    currentLevel: 1
  });

  const addPoints = (points: number) => {
    setUserProgress(prev => ({ ...prev, points: prev.points + points }));
  };

  const unlockBadge = (badgeName: string) => {
    setUserProgress(prev => ({
      ...prev,
      badges: [...prev.badges, badgeName]
    }));
  };

  const completeSimulation = (simulationId: string) => {
    setUserProgress(prev => ({
      ...prev,
      completedSimulations: [...prev.completedSimulations, simulationId]
    }));
  };

  return (
    <div className="min-h-screen bg-warm-white text-navy">
      <Header />
      
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        userProgress={userProgress}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard 
            userProgress={userProgress}
            onStartEmailSimulation={() => setCurrentView('email-simulation')}
            onStartSMSSimulation={() => setCurrentView('sms-simulation')}
          />
        ) : currentView === 'email-simulation' ? (
          <EmailSimulation
            userProgress={userProgress}
            onAddPoints={addPoints}
            onUnlockBadge={unlockBadge}
            onCompleteSimulation={completeSimulation}
            onReturnToDashboard={() => setCurrentView('dashboard')}
          />
        ) : (
          <SMSSimulation
            userProgress={userProgress}
            onAddPoints={addPoints}
            onUnlockBadge={unlockBadge}
            onCompleteSimulation={completeSimulation}
            onReturnToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      {/* Built on Bolt Badge - Elderly Friendly */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-navy text-warm-white px-4 py-2 rounded-xl text-elderly-base font-semibold shadow-warm border-2 border-blue-accent">
          Built on Bolt
        </div>
      </div>
    </div>
  );
}

export default App;