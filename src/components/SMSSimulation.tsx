import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, Eye, Target, Award, Smartphone, Lightbulb, Home, Undo2 } from 'lucide-react';
import { UserProgress } from '../App';

interface SMSSimulationProps {
  userProgress: UserProgress;
  onAddPoints: (points: number) => void;
  onUnlockBadge: (badgeName: string) => void;
  onCompleteSimulation: (simulationId: string) => void;
  onReturnToDashboard: () => void;
}

interface RedFlag {
  id: string;
  title: string;
  description: string;
  found: boolean;
  hint: string;
}

interface SMSExample {
  id: string;
  title: string;
  sender: string;
  content: JSX.Element;
  redFlags: RedFlag[];
}

const SMSSimulation: React.FC<SMSSimulationProps> = ({
  userProgress,
  onAddPoints,
  onUnlockBadge,
  onCompleteSimulation,
  onReturnToDashboard
}) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const smsExamples: SMSExample[] = [
    {
      id: 'bank-sms',
      title: 'Fake Bank Text',
      sender: '+1 (555) 123-9876',
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="font-bold text-red-600 text-elderly-xl mb-2">🚨 URGENT ALERT 🚨</p>
            <p className="text-elderly-lg">Your bank account will be SUSPENDED in 2 hours due to suspicious activity.</p>
          </div>
          <p className="text-elderly-lg">Verify your identity immediately to prevent account closure:</p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-elderly-lg font-bold hover:bg-red-600 transition-colors duration-200 w-full">
              🔗 Verify Now: bit.ly/bank-verify-urgent
            </button>
          </div>
          <p className="text-elderly-base text-gray-600">Reply STOP to opt out.</p>
        </div>
      ),
      redFlags: [
        {
          id: 'unknown-sender',
          title: 'Unknown Phone Number',
          description: 'This random phone number is not from your real bank',
          found: false,
          hint: 'Real banks use official short codes or numbers you recognize, not random phone numbers'
        },
        {
          id: 'urgent-threat',
          title: 'Scary Urgent Language',
          description: 'Real banks don\'t threaten to suspend your account with scary messages like this',
          found: false,
          hint: 'Notice how the text tries to scare you with urgent threats - real banks are more polite'
        },
        {
          id: 'suspicious-link',
          title: 'Shortened Link',
          description: 'The shortened link "bit.ly" hides where it really goes - this is suspicious',
          found: false,
          hint: 'Shortened links like "bit.ly" can hide dangerous websites - be very careful!'
        }
      ]
    },
    {
      id: 'delivery-scam',
      title: 'Fake Delivery Text',
      sender: '+1 (888) 555-0123',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-xl">
            <p className="font-bold text-yellow-800 text-elderly-xl mb-2">📦 Package Delivery Alert</p>
            <p className="text-elderly-lg">We attempted to deliver your package but no one was home.</p>
          </div>
          <p className="text-elderly-lg">
            Your package from Amazon is being held at our facility. 
            A delivery fee of $3.95 is required for redelivery.
          </p>
          <div className="bg-green-50 border-2 border-green-400 p-4 rounded-xl">
            <p className="text-elderly-lg font-bold text-green-800 mb-2">Package Details:</p>
            <ul className="text-elderly-base text-green-700 space-y-1">
              <li>• Tracking: AMZ789456123</li>
              <li>• Value: $89.99</li>
              <li>• Delivery Fee: $3.95</li>
            </ul>
          </div>
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-center">
            <button className="bg-red-600 text-white px-6 py-3 rounded-xl text-elderly-lg font-bold hover:bg-red-700 transition-colors duration-200 w-full">
              💳 Pay Delivery Fee: tinyurl.com/package-pay
            </button>
          </div>
          <p className="text-elderly-base text-gray-600">This link expires in 24 hours.</p>
        </div>
      ),
      redFlags: [
        {
          id: 'unexpected-package',
          title: 'Unexpected Package',
          description: 'You didn\'t order anything, so there shouldn\'t be a package for you',
          found: false,
          hint: 'Think about it - did you order anything recently? If not, this text is probably fake'
        },
        {
          id: 'pay-for-delivery',
          title: 'Pay for Delivery',
          description: 'Real delivery companies don\'t ask for small fees via text message links',
          found: false,
          hint: 'Legitimate delivery companies handle fees differently - not through text message links'
        },
        {
          id: 'shortened-url',
          title: 'Another Shortened Link',
          description: 'The "tinyurl.com" link hides the real website address',
          found: false,
          hint: 'Another shortened link that hides where it really goes - this is a red flag!'
        }
      ]
    },
    {
      id: 'tax-refund',
      title: 'Fake Tax Refund',
      sender: 'IRS-REFUND',
      content: (
        <div className="space-y-4">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-r-xl">
            <p className="font-bold text-green-800 text-elderly-xl mb-2">💰 Tax Refund Notice</p>
            <p className="text-elderly-lg">Good news! You have a tax refund of $1,247 waiting for you.</p>
          </div>
          <p className="text-elderly-lg">
            The IRS has processed your tax return and approved your refund. 
            To receive your money quickly, please verify your information.
          </p>
          <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl">
            <p className="text-elderly-lg font-bold text-blue-800 mb-2">Refund Details:</p>
            <ul className="text-elderly-base text-blue-700 space-y-1">
              <li>• Refund Amount: $1,247.00</li>
              <li>• Processing Date: Today</li>
              <li>• Reference: IRS-2024-REF-789</li>
            </ul>
          </div>
          <p className="text-elderly-lg">
            Click the secure link below to verify your bank account information 
            and receive your refund within 24 hours:
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 text-center">
            <button className="bg-yellow-600 text-white px-6 py-3 rounded-xl text-elderly-lg font-bold hover:bg-red-600 transition-colors duration-200 w-full">
              🏛️ Claim Refund: irs-refund-claim.net
            </button>
          </div>
          <p className="text-elderly-base text-gray-600">This offer expires in 48 hours.</p>
        </div>
      ),
      redFlags: [
        {
          id: 'irs-doesnt-text',
          title: 'IRS Doesn\'t Send Texts',
          description: 'The real IRS never sends text messages about refunds or asks for information this way',
          found: false,
          hint: 'The IRS only contacts people by mail - they never send text messages about refunds!'
        },
        {
          id: 'fake-urgency-refund',
          title: 'Fake Time Pressure',
          description: 'Real tax refunds don\'t have expiration dates like this',
          found: false,
          hint: 'Tax refunds don\'t expire in 48 hours - this urgency is fake to make you act quickly'
        },
        {
          id: 'fake-website',
          title: 'Fake IRS Website',
          description: 'The website "irs-refund-claim.net" is not the real IRS website',
          found: false,
          hint: 'The real IRS website is irs.gov - this fake website is trying to steal your information'
        }
      ]
    }
  ];

  const [examples, setExamples] = useState(smsExamples);

  const currentSMSExample = examples[currentExample];
  const flagsFound = currentSMSExample.redFlags.filter(flag => flag.found).length;
  const allFlagsFound = flagsFound === currentSMSExample.redFlags.length;

  const handleRedFlagClick = (flagId: string) => {
    if (simulationComplete) return;

    setLastAction(flagId);
    
    setExamples(prev => prev.map((example, index) => 
      index === currentExample 
        ? {
            ...example,
            redFlags: example.redFlags.map(flag => 
              flag.id === flagId ? { ...flag, found: true } : flag
            )
          }
        : example
    ));

    // Award points for finding a red flag
    onAddPoints(25);

    // Check if all flags are found for current example
    const updatedExample = examples[currentExample];
    const updatedFlags = updatedExample.redFlags.map(flag => 
      flag.id === flagId ? { ...flag, found: true } : flag
    );
    
    if (updatedFlags.every(flag => flag.found)) {
      // Award completion bonus for this example
      onAddPoints(50);
      
      // Check if this is the last example
      if (currentExample === examples.length - 1) {
        setSimulationComplete(true);
        
        // Collect badges to show on results
        const newBadges = [];
        if (!userProgress.badges.includes('sms-guardian')) {
          onUnlockBadge('sms-guardian');
          newBadges.push('sms-guardian');
        }
        if (!userProgress.badges.includes('security-novice')) {
          onUnlockBadge('security-novice');
          newBadges.push('security-novice');
        }
        if (!userProgress.badges.includes('eagle-eye')) {
          onUnlockBadge('eagle-eye');
          newBadges.push('eagle-eye');
        }
        
        // Check if user completed both email and SMS training for special badge
        if (userProgress.completedSimulations.includes('phishing-email-1') && !userProgress.badges.includes('scam-buster')) {
          onUnlockBadge('scam-buster');
          newBadges.push('scam-buster');
        }
        
        setEarnedBadges(newBadges);
        
        // Mark simulation as complete
        onCompleteSimulation('sms-scam-1');

        // Show results page after a brief delay
        setTimeout(() => setShowResults(true), 1000);
      }
    }
  };

  const handleUndo = () => {
    if (!lastAction) return;
    
    setExamples(prev => prev.map((example, index) => 
      index === currentExample 
        ? {
            ...example,
            redFlags: example.redFlags.map(flag => 
              flag.id === lastAction ? { ...flag, found: false } : flag
            )
          }
        : example
    ));
    
    // Remove points
    onAddPoints(-25);
    setLastAction(null);
  };

  const nextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample(currentExample + 1);
      setLastAction(null);
    }
  };

  const prevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(currentExample - 1);
      setLastAction(null);
    }
  };

  // Results page with badges
  if (showResults) {
    const badgeDetails = [
      { id: 'sms-guardian', name: 'Text Message Hero', description: 'You caught all the red flags in scam texts!', icon: MessageSquare },
      { id: 'security-novice', name: 'Safety Student', description: 'You completed your first training lesson!', icon: CheckCircle },
      { id: 'eagle-eye', name: 'Sharp Eyes', description: 'You found suspicious things very quickly!', icon: Target },
      { id: 'scam-buster', name: 'Scam Fighter', description: 'You completed both email and text training!', icon: Award },
    ];

    return (
      <div className="min-h-screen bg-warm-white p-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="bg-success-green text-white rounded-2xl p-8 text-center shadow-warm">
            <Award className="h-20 w-20 mx-auto mb-6" />
            <h2 className="text-elderly-3xl font-bold mb-4">Fantastic Work!</h2>
            <p className="text-elderly-xl mb-6">
              You've completed all the text message safety training examples!
            </p>
            <div className="bg-white text-success-green px-6 py-3 rounded-xl text-elderly-xl font-bold inline-block">
              You earned {(examples.length * 75)} points!
            </div>
          </div>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-warning-amber">
              <h3 className="text-elderly-2xl font-bold mb-6 text-navy text-center flex items-center justify-center">
                <Award className="h-8 w-8 mr-3 text-warning-amber" />
                New Badges Earned!
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {earnedBadges.map((badgeId) => {
                  const badge = badgeDetails.find(b => b.id === badgeId);
                  if (!badge) return null;
                  const Icon = badge.icon;
                  return (
                    <div key={badgeId} className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-4 border-warning-amber rounded-2xl p-6 text-center">
                      <div className="bg-warning-amber p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-elderly-xl font-bold text-navy mb-2">{badge.name}</h4>
                      <p className="text-elderly-base text-gray-700">{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy">
            <h3 className="text-elderly-2xl font-bold mb-6 text-navy text-center">What You Learned</h3>
            <ul className="space-y-4 text-elderly-lg text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                How to identify suspicious phone numbers and senders
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Recognizing urgent language that tries to pressure you
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Understanding why shortened links can be dangerous
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Learning that government agencies don't text about refunds
              </li>
            </ul>
          </div>

          {/* Return Button */}
          <div className="text-center">
            <button
              onClick={onReturnToDashboard}
              className="bg-navy text-warm-white px-8 py-4 rounded-xl text-elderly-2xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm border-4 border-navy"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Minimal Header */}
      <div className="bg-navy text-warm-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onReturnToDashboard}
            className="flex items-center space-x-2 bg-blue-accent px-4 py-2 rounded-xl text-elderly-base font-semibold hover:bg-blue-600 transition-colors duration-200"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-elderly-base font-semibold">
              {currentExample + 1} of {examples.length}
            </div>
            
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center space-x-2 bg-warning-amber px-4 py-2 rounded-xl text-elderly-base font-semibold hover:bg-yellow-600 transition-colors duration-200"
            >
              <Lightbulb className="h-5 w-5" />
              <span>Hints</span>
            </button>
            
            {lastAction && (
              <button
                onClick={handleUndo}
                className="flex items-center space-x-2 bg-gray-600 px-4 py-2 rounded-xl text-elderly-base font-semibold hover:bg-gray-700 transition-colors duration-200"
              >
                <Undo2 className="h-5 w-5" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-warm border-4 border-navy">
          <div className="text-center mb-4">
            <h2 className="text-elderly-2xl font-bold text-navy mb-2">{currentSMSExample.title}</h2>
            <div className="flex items-center justify-center space-x-3 bg-success-green text-white px-4 py-2 rounded-xl text-elderly-lg font-semibold">
              <Target className="h-5 w-5" />
              <span>{flagsFound} of {currentSMSExample.redFlags.length} found</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-navy">
            <div 
              className="bg-success-green h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max((flagsFound / currentSMSExample.redFlags.length) * 100, 5)}%` }}
            />
          </div>
        </div>

        {/* Phone Interface */}
        <div className="max-w-sm mx-auto">
          <div className="bg-navy rounded-3xl p-6 shadow-2xl">
            {/* Phone Header */}
            <div className="bg-gray-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center space-x-3 text-warm-white">
                <Smartphone className="h-6 w-6" />
                <span className="text-elderly-lg font-semibold">Text Messages</span>
              </div>
            </div>

            {/* SMS Interface */}
            <div className="bg-warm-white rounded-2xl p-6 min-h-96">
              {/* Contact Header */}
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b-2 border-gray-200">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <button
                    onClick={() => handleRedFlagClick('unknown-sender')}
                    className={`text-elderly-xl font-bold p-3 rounded-xl transition-colors duration-200 ${
                      currentSMSExample.redFlags.find(f => f.id === 'unknown-sender')?.found ? 'bg-red-200 border-2 border-red-500' : 'hover:bg-red-100'
                    }`}
                  >
                    {currentSMSExample.sender}
                  </button>
                  <p className="text-elderly-base text-gray-600">Unknown Number</p>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-6 max-w-xs">
                  <div 
                    onClick={() => {
                      const urgentFlag = currentSMSExample.redFlags.find(f => 
                        f.id.includes('urgent') || f.id.includes('threat') || f.id.includes('doesnt') ||
                        f.id.includes('package') || f.id.includes('pay') || f.id.includes('refund') ||
                        f.id.includes('irs') || f.id.includes('website')
                      );
                      if (urgentFlag && !urgentFlag.found) {
                        handleRedFlagClick(urgentFlag.id);
                      }
                    }}
                    className="cursor-pointer hover:bg-red-50 p-2 rounded-xl transition-colors duration-200 border-2 border-transparent hover:border-red-300"
                  >
                    {currentSMSExample.content}
                  </div>
                  
                  {/* Clickable link button */}
                  {currentSMSExample.redFlags.some(flag => flag.id.includes('link') || flag.id.includes('url') || flag.id.includes('website')) && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          const linkFlag = currentSMSExample.redFlags.find(f => f.id.includes('link') || f.id.includes('url') || f.id.includes('website'));
                          if (linkFlag && !linkFlag.found) {
                            handleRedFlagClick(linkFlag.id);
                          }
                        }}
                        className={`w-full p-3 rounded-xl border-2 transition-colors duration-200 text-elderly-base ${
                          currentSMSExample.redFlags.find(f => f.id.includes('link') || f.id.includes('url') || f.id.includes('website'))?.found
                            ? 'bg-red-200 border-red-500 text-red-800' 
                            : 'bg-blue-50 border-blue-300 hover:bg-red-100 hover:border-red-300 text-blue-800'
                        }`}
                      >
                        🔗 Tap here if the link looks suspicious
                      </button>
                    </div>
                  )}
                  
                  <div className="text-right mt-4">
                    <span className="text-elderly-base text-gray-500">2:47 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {!simulationComplete && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={prevExample}
              disabled={currentExample === 0}
              className={`px-6 py-3 rounded-xl text-elderly-lg font-semibold transition-colors duration-200 ${
                currentExample === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-300 text-navy hover:bg-gray-400'
              }`}
            >
              ← Previous
            </button>
            
            {allFlagsFound && currentExample < examples.length - 1 && (
              <button
                onClick={nextExample}
                className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm"
              >
                Next Example →
              </button>
            )}
          </div>
        )}

        {/* Hints Panel */}
        {showHints && (
          <div className="bg-yellow-50 border-4 border-warning-amber rounded-2xl p-6 shadow-warm">
            <h3 className="text-elderly-xl font-bold mb-4 text-yellow-800 flex items-center">
              <Lightbulb className="h-6 w-6 mr-2" />
              Helpful Hints
            </h3>
            <div className="space-y-4">
              {currentSMSExample.redFlags.map((flag) => (
                <div key={flag.id} className={`p-4 rounded-xl border-2 ${flag.found ? 'bg-green-100 border-success-green' : 'bg-white border-warning-amber'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {flag.found ? (
                      <CheckCircle className="h-5 w-5 text-success-green" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-warning-amber" />
                    )}
                    <h4 className="text-elderly-lg font-bold text-navy">{flag.title}</h4>
                  </div>
                  <p className="text-elderly-base text-gray-700">
                    {flag.found ? `✓ Found! ${flag.description}` : flag.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SMSSimulation;