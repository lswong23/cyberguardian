import React, { useState } from 'react';
import { Shield, Award, Target, TrendingUp, Mail, AlertTriangle, MessageSquare, ArrowRight, Star, CheckCircle, Info } from 'lucide-react';
import { UserProgress } from '../App';

interface DashboardProps {
  userProgress: UserProgress;
  onStartEmailSimulation: () => void;
  onStartSMSSimulation: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProgress, onStartEmailSimulation, onStartSMSSimulation }) => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'progress' | 'training' | 'badges'>('welcome');

  const badges = [
    { id: 'phishing-detector', name: 'Email Detective', description: 'You spotted all the tricks in a fake email!', icon: Mail, unlocked: userProgress.badges.includes('phishing-detector') },
    { id: 'sms-guardian', name: 'Text Message Hero', description: 'You caught all the red flags in a scam text!', icon: MessageSquare, unlocked: userProgress.badges.includes('sms-guardian') },
    { id: 'security-novice', name: 'Safety Student', description: 'You completed your first training lesson!', icon: Shield, unlocked: userProgress.badges.includes('security-novice') },
    { id: 'eagle-eye', name: 'Sharp Eyes', description: 'You found suspicious things very quickly!', icon: Target, unlocked: userProgress.badges.includes('eagle-eye') },
    { id: 'scam-buster', name: 'Scam Fighter', description: 'You completed both email and text training!', icon: Award, unlocked: userProgress.badges.includes('scam-buster') },
  ];

  const nextLevelPoints = userProgress.currentLevel * 100;
  const progressPercentage = (userProgress.points % 100) / 100 * 100;

  const WelcomeScreen = () => (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy text-center">
        <div className="bg-blue-accent p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Shield className="h-12 w-12 text-warm-white" />
        </div>
        <h2 className="text-elderly-3xl font-bold mb-4 text-navy">Welcome to Cyber Guardian!</h2>
        <p className="text-elderly-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          We're here to help you stay safe from online scams. Learn at your own pace with friendly, easy lessons.
        </p>
        
        {/* Trust Message */}
        <div className="bg-blue-50 border-2 border-blue-accent rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Star className="h-8 w-8 text-warning-amber" />
            <h3 className="text-elderly-xl font-bold text-navy">Why Trust Us?</h3>
          </div>
          <p className="text-elderly-base text-gray-700">
            We use simple, clear examples to help you recognize and avoid scams. 
            Our lessons are designed to be easy to understand and follow.
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('progress')}
          className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-all duration-200 shadow-warm flex items-center space-x-3 mx-auto"
        >
          <span>Let's Get Started</span>
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  const ProgressScreen = () => (
    <div className="space-y-8">
      {/* Progress Header */}
      <div className="text-center mb-8">
        <h2 className="text-elderly-3xl font-bold mb-4 text-navy">Your Learning Progress</h2>
        <p className="text-elderly-xl text-gray-700">See how well you're doing!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-success-green text-white p-8 rounded-2xl shadow-warm text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-4" />
          <p className="text-elderly-3xl font-bold mb-2">{userProgress.points}</p>
          <p className="text-elderly-xl">Points Earned</p>
          <p className="text-elderly-base mt-2 opacity-90">Great job learning!</p>
        </div>
        
        <div className="bg-warning-amber text-white p-8 rounded-2xl shadow-warm text-center">
          <Award className="h-16 w-16 mx-auto mb-4" />
          <p className="text-elderly-3xl font-bold mb-2">{userProgress.badges.length}</p>
          <p className="text-elderly-xl">Badges Earned</p>
          <p className="text-elderly-base mt-2 opacity-90">You're doing amazing!</p>
        </div>
        
        <div className="bg-blue-accent text-white p-8 rounded-2xl shadow-warm text-center">
          <Shield className="h-16 w-16 mx-auto mb-4" />
          <p className="text-elderly-3xl font-bold mb-2">Level {userProgress.currentLevel}</p>
          <p className="text-elderly-xl">Current Level</p>
          <p className="text-elderly-base mt-2 opacity-90">Keep it up!</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy">
        <h3 className="text-elderly-2xl font-bold mb-6 text-navy text-center">Progress to Next Level</h3>
        <div className="w-full bg-gray-200 rounded-full h-8 border-4 border-navy mb-4">
          <div 
            className="bg-success-green h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-4"
            style={{ width: `${Math.max(progressPercentage, 10)}%` }}
          >
            {progressPercentage > 20 && (
              <span className="text-white font-bold text-elderly-base">
                {Math.round(progressPercentage)}%
              </span>
            )}
          </div>
        </div>
        <p className="text-elderly-xl text-center text-gray-700">
          {userProgress.points % 100} out of 100 points to reach Level {userProgress.currentLevel + 1}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="bg-gray-200 text-navy px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          ← Back
        </button>
        <button
          onClick={() => setCurrentScreen('training')}
          className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-all duration-200 shadow-warm flex items-center space-x-3 justify-center"
        >
          <span>Start Training</span>
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  const TrainingScreen = () => (
    <div className="space-y-8">
      {/* Training Header */}
      <div className="text-center mb-8">
        <h2 className="text-elderly-3xl font-bold mb-4 text-navy">Choose Your Training</h2>
        <p className="text-elderly-xl text-gray-700">Pick a lesson to start learning!</p>
      </div>

      {/* Training Cards - Large and Touch-Friendly */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-red-300 hover:border-red-500 transition-all duration-200">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-red-100 p-6 rounded-full">
              <Mail className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <h3 className="text-elderly-2xl font-bold text-navy mb-3">Email Safety Training</h3>
              <p className="text-elderly-lg text-gray-700 mb-4">
                Learn to spot fake emails that try to trick you. We'll show you what to look for!
              </p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-elderly-base text-gray-700">
                  <strong>What you'll learn:</strong> How to check if an email is real, 
                  what suspicious links look like, and how scammers try to rush you.
                </p>
              </div>
            </div>
            <button
              onClick={onStartEmailSimulation}
              className="w-full bg-red-600 text-white px-8 py-6 rounded-xl text-elderly-2xl font-bold hover:bg-red-700 transition-all duration-200 shadow-warm flex items-center justify-center space-x-4"
            >
              <Mail className="h-8 w-8" />
              <span>Start Email Training</span>
              <ArrowRight className="h-8 w-8" />
            </button>
            {userProgress.completedSimulations.includes('phishing-email-1') && (
              <div className="flex items-center space-x-2 bg-success-green text-white px-4 py-2 rounded-xl text-elderly-lg font-semibold">
                <CheckCircle className="h-6 w-6" />
                <span>Completed! Great job!</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-blue-300 hover:border-blue-500 transition-all duration-200">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="bg-blue-100 p-6 rounded-full">
              <MessageSquare className="h-16 w-16 text-blue-600" />
            </div>
            <div>
              <h3 className="text-elderly-2xl font-bold text-navy mb-3">Text Message Safety Training</h3>
              <p className="text-elderly-lg text-gray-700 mb-4">
                Learn to identify suspicious text messages that might be scams. Stay safe from text tricks!
              </p>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-elderly-base text-gray-700">
                  <strong>What you'll learn:</strong> How to spot fake text messages, 
                  why you shouldn't click suspicious links, and how to verify real messages.
                </p>
              </div>
            </div>
            <button
              onClick={onStartSMSSimulation}
              className="w-full bg-blue-600 text-white px-8 py-6 rounded-xl text-elderly-2xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-warm flex items-center justify-center space-x-4"
            >
              <MessageSquare className="h-8 w-8" />
              <span>Start Text Training</span>
              <ArrowRight className="h-8 w-8" />
            </button>
            {userProgress.completedSimulations.includes('sms-scam-1') && (
              <div className="flex items-center space-x-2 bg-success-green text-white px-4 py-2 rounded-xl text-elderly-lg font-semibold">
                <CheckCircle className="h-6 w-6" />
                <span>Completed! Great job!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setCurrentScreen('progress')}
          className="bg-gray-200 text-navy px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          ← Back to Progress
        </button>
        <button
          onClick={() => setCurrentScreen('badges')}
          className="bg-warning-amber text-white px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <Award className="h-5 w-5" />
          <span>View My Badges</span>
        </button>
      </div>
    </div>
  );

  const BadgesScreen = () => (
    <div className="space-y-8">
      {/* Badges Header */}
      <div className="text-center mb-8">
        <h2 className="text-elderly-3xl font-bold mb-4 text-navy">Your Achievement Badges</h2>
        <p className="text-elderly-xl text-gray-700">Look at all the great work you've done!</p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`p-8 rounded-2xl border-4 transition-all duration-200 shadow-warm ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-warning-amber'
                  : 'bg-gray-100 border-gray-400'
              }`}
            >
              <div className="text-center">
                <div className={`p-6 rounded-full mx-auto mb-6 w-24 h-24 flex items-center justify-center ${
                  badge.unlocked ? 'bg-warning-amber' : 'bg-gray-300'
                }`}>
                  <Icon className={`h-12 w-12 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                <h3 className="text-elderly-xl font-bold mb-3 text-navy">{badge.name}</h3>
                <p className="text-elderly-base text-gray-700 mb-4">{badge.description}</p>
                {badge.unlocked ? (
                  <div className="bg-success-green text-white px-4 py-2 rounded-xl text-elderly-base font-semibold flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Earned!</span>
                  </div>
                ) : (
                  <div className="bg-gray-300 text-gray-600 px-4 py-2 rounded-xl text-elderly-base font-semibold">
                    Not yet earned
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Tips */}
      <div className="bg-blue-50 border-4 border-blue-accent rounded-2xl p-8">
        <div className="flex items-center mb-6">
          <Info className="h-8 w-8 text-blue-accent mr-4" />
          <h3 className="text-elderly-2xl font-bold text-navy">Quick Safety Reminders</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-elderly-xl font-bold text-navy mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              Email Safety
            </h4>
            <ul className="space-y-3 text-elderly-base text-gray-700">
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Always check who sent the email
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Be careful with urgent messages
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Don't click suspicious links
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-elderly-xl font-bold text-navy mb-4 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Text Safety
            </h4>
            <ul className="space-y-3 text-elderly-base text-gray-700">
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Check if you know the sender
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Be suspicious of urgent requests
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">✓</span>
                Call companies directly to verify
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <button
          onClick={() => setCurrentScreen('training')}
          className="bg-gray-200 text-navy px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
        >
          ← Back to Training
        </button>
      </div>
    </div>
  );

  const screens = {
    welcome: WelcomeScreen,
    progress: ProgressScreen,
    training: TrainingScreen,
    badges: BadgesScreen,
  };

  const CurrentScreen = screens[currentScreen];

  return (
    <div className="min-h-screen bg-warm-white">
      <CurrentScreen />
    </div>
  );
};

export default Dashboard;