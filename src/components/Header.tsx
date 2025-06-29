import React from 'react';
import { Shield, Heart } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-navy text-warm-white py-6 px-4 shadow-warm">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-3 sm:flex-row sm:justify-between sm:text-left sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-accent p-3 rounded-full">
              <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-warm-white" />
            </div>
            <div>
              <h1 className="text-elderly-2xl sm:text-elderly-3xl font-bold text-warm-white">Cyber Guardian</h1>
              <p className="text-elderly-base text-blue-100">Your friendly guide to staying safe online</p>
            </div>
          </div>
          <div className="bg-warm-white text-navy px-4 py-3 rounded-xl shadow-gentle">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-error-red" />
              <p className="text-elderly-base font-semibold">Trusted by Families</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;