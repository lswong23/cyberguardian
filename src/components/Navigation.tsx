import React from 'react';
import { Home, Mail, MessageSquare, Award, BarChart3, ArrowRight } from 'lucide-react';
import { UserProgress } from '../App';

interface NavigationProps {
  currentView: 'dashboard' | 'email-simulation' | 'sms-simulation';
  setCurrentView: (view: 'dashboard' | 'email-simulation' | 'sms-simulation') => void;
  userProgress: UserProgress;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, userProgress }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, description: 'Your learning dashboard' },
    { id: 'email-simulation', label: 'Email Safety', icon: Mail, description: 'Learn about email scams' },
    { id: 'sms-simulation', label: 'Text Safety', icon: MessageSquare, description: 'Learn about text scams' },
  ];

  return (
    <nav className="bg-warm-white border-b-4 border-navy py-4 px-4 shadow-gentle">
      <div className="max-w-4xl mx-auto">
        {/* Mobile Navigation */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          {/* Navigation Items */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as 'dashboard' | 'email-simulation' | 'sms-simulation')}
                  className={`group flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-200 text-elderly-base ${
                    isActive
                      ? 'bg-navy text-warm-white shadow-warm'
                      : 'bg-white text-navy border-2 border-navy hover:bg-blue-50'
                  }`}
                  title={item.description}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    <div className="text-left">
                      <div className="text-elderly-lg font-bold">{item.label}</div>
                      <div className={`text-elderly-base ${isActive ? 'text-blue-100' : 'text-gray-600'} sm:hidden`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-transform ${isActive ? 'text-blue-100' : 'text-gray-400'} group-hover:translate-x-1`} />
                </button>
              );
            })}
          </div>
          
          {/* Stats - Larger and more accessible */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="flex items-center justify-center space-x-2 bg-success-green text-white px-4 py-3 rounded-xl font-bold shadow-gentle">
              <BarChart3 className="h-6 w-6" />
              <div className="text-center">
                <div className="text-elderly-lg">{userProgress.points}</div>
                <div className="text-sm">Points</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 bg-warning-amber text-white px-4 py-3 rounded-xl font-bold shadow-gentle">
              <Award className="h-6 w-6" />
              <div className="text-center">
                <div className="text-elderly-lg">{userProgress.badges.length}</div>
                <div className="text-sm">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;