import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, AlertTriangle, CheckCircle, Target, Award, Smartphone, Lightbulb, Home, Undo2, Clock, Phone } from 'lucide-react';
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
  element: 'sender' | 'content' | 'link' | 'urgency';
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const smsExamples: SMSExample[] = [
    {
      id: 'bank-sms',
      title: 'Fake Bank Text',
      sender: '+1 (555) 123-9876',
      content: (
        <div className="space-y-4 text-elderly-lg">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
            <p className="font-bold text-red-600 text-elderly-xl mb-2">🚨 URGENT ALERT 🚨</p>
            <p>Your bank account will be SUSPENDED in 2 hours due to suspicious activity.</p>
          </div>
          <p>Verify your identity immediately to prevent account closure:</p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 w-full border-2 border-transparent hover:border-red-500 min-h-[44px]"
              title="This is a suspicious link - click to identify it"
            >
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
          hint: 'Real banks use official short codes or numbers you recognize, not random phone numbers',
          element: 'sender'
        },
        {
          id: 'urgent-threat',
          title: 'Scary Urgent Language',
          description: 'Real banks don\'t threaten to suspend your account with scary messages like this',
          found: false,
          hint: 'Notice how the text tries to scare you with urgent threats - real banks are more polite',
          element: 'urgency'
        },
        {
          id: 'suspicious-link',
          title: 'Shortened Link',
          description: 'The shortened link "bit.ly" hides where it really goes - this is suspicious',
          found: false,
          hint: 'Shortened links like "bit.ly" can hide dangerous websites - be very careful!',
          element: 'link'
        }
      ]
    },
    {
      id: 'delivery-scam',
      title: 'Fake Delivery Text',
      sender: '+1 (888) 555-0123',
      content: (
        <div className="space-y-4 text-elderly-lg">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-xl">
            <p className="font-bold text-yellow-800 text-elderly-xl mb-2">📦 Package Delivery Alert</p>
            <p>We attempted to deliver your package but no one was home.</p>
          </div>
          <p>
            Your package from Amazon is being held at our facility. 
            A delivery fee of $3.95 is required for redelivery.
          </p>
          <div className="bg-green-50 border-2 border-green-400 p-4 rounded-xl">
            <p className="font-bold text-green-800 mb-2">Package Details:</p>
            <ul className="text-elderly-base text-green-700 space-y-1">
              <li>• Tracking: AMZ789456123</li>
              <li>• Value: $89.99</li>
              <li>• Delivery Fee: $3.95</li>
            </ul>
          </div>
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-center">
            <button 
              className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 w-full border-2 border-transparent hover:border-red-500 min-h-[44px]"
              title="This payment request is suspicious - click to identify it"
            >
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
          hint: 'Think about it - did you order anything recently? If not, this text is probably fake',
          element: 'content'
        },
        {
          id: 'pay-for-delivery',
          title: 'Pay for Delivery',
          description: 'Real delivery companies don\'t ask for small fees via text message links',
          found: false,
          hint: 'Legitimate delivery companies handle fees differently - not through text message links',
          element: 'link'
        },
        {
          id: 'shortened-url',
          title: 'Another Shortened Link',
          description: 'The "tinyurl.com" link hides the real website address',
          found: false,
          hint: 'Another shortened link that hides where it really goes - this is a red flag!',
          element: 'link'
        }
      ]
    },
    {
      id: 'tax-refund',
      title: 'Fake Tax Refund',
      sender: 'IRS-REFUND',
      content: (
        <div className="space-y-4 text-elderly-lg">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-r-xl">
            <p className="font-bold text-green-800 text-elderly-xl mb-2">💰 Tax Refund Notice</p>
            <p>Good news! You have a tax refund of $1,247 waiting for you.</p>
          </div>
          <p>
            The IRS has processed your tax return and approved your refund. 
            To receive your money quickly, please verify your information.
          </p>
          <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-xl">
            <p className="font-bold text-blue-800 mb-2">Refund Details:</p>
            <ul className="text-elderly-base text-blue-700 space-y-1">
              <li>• Refund Amount: $1,247.00</li>
              <li>• Processing Date: Today</li>
              <li>• Reference: IRS-2024-REF-789</li>
            </ul>
          </div>
          <p>
            Click the secure link below to verify your bank account information 
            and receive your refund within 24 hours:
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 text-center">
            <button 
              className="bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 w-full border-2 border-transparent hover:border-red-500 min-h-[44px]"
              title="This IRS website is fake - click to identify it"
            >
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
          hint: 'The IRS only contacts people by mail - they never send text messages about refunds!',
          element: 'sender'
        },
        {
          id: 'fake-urgency-refund',
          title: 'Fake Time Pressure',
          description: 'Real tax refunds don\'t have expiration dates like this',
          found: false,
          hint: 'Tax refunds don\'t expire in 48 hours - this urgency is fake to make you act quickly',
          element: 'urgency'
        },
        {
          id: 'fake-website',
          title: 'Fake IRS Website',
          description: 'The website "irs-refund-claim.net" is not the real IRS website',
          found: false,
          hint: 'The real IRS website is irs.gov - this fake website is trying to steal your information',
          element: 'link'
        }
      ]
    }
  ];

  const [examples, setExamples] = useState(smsExamples);

  const currentSMSExample = examples[currentExample];
  const flagsFound = currentSMSExample.redFlags.filter(flag => flag.found).length;
  const allFlagsFound = flagsFound === currentSMSExample.redFlags.length;

  const handleRedFlagClick = (flagId: string) => {
    if (simulationComplete || showResults) return;

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
      
      // Show results page
      setTimeout(() => {
        setShowResults(true);
      }, 1000);
    }
  };

  const handleUndo = () => {
    if (!lastAction || showResults) return;
    
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
      setShowResults(false);
    } else {
      // Complete simulation
      setSimulationComplete(true);
      setShowCelebration(true);
      
      // Unlock badges
      if (!userProgress.badges.includes('sms-guardian')) {
        onUnlockBadge('sms-guardian');
      }
      if (!userProgress.badges.includes('security-novice')) {
        onUnlockBadge('security-novice');
      }
      if (!userProgress.badges.includes('eagle-eye')) {
        onUnlockBadge('eagle-eye');
      }
      
      // Check if user completed both email and SMS training for special badge
      if (userProgress.completedSimulations.includes('phishing-email-1') && !userProgress.badges.includes('scam-buster')) {
        onUnlockBadge('scam-buster');
      }
      
      // Mark simulation as complete
      onCompleteSimulation('sms-scam-1');

      // Hide celebration after 4 seconds
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const prevExample = () => {
    if (currentExample > 0) {
      setCurrentExample(currentExample - 1);
      setLastAction(null);
      setShowResults(false);
    }
  };

  // Results Page
  if (showResults && allFlagsFound) {
    return (
      <div className="space-y-8 bg-warm-white min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          {/* Celebration */}
          <div className="bg-success-green text-white rounded-2xl p-8 shadow-warm border-4 border-success-green mb-8">
            <Award className="h-20 w-20 mx-auto mb-6" />
            <h2 className="text-elderly-3xl font-bold mb-4">Excellent Work!</h2>
            <p className="text-elderly-xl mb-6">
              You found all {currentSMSExample.redFlags.length} suspicious things in this text message!
            </p>
            <div className="bg-white text-success-green px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm inline-block">
              +{75} Points Earned!
            </div>
          </div>

          {/* What You Found */}
          <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy mb-8">
            <h3 className="text-elderly-2xl font-bold mb-6 text-navy">What You Spotted:</h3>
            <div className="space-y-4">
              {currentSMSExample.redFlags.map((flag) => (
                <div key={flag.id} className="bg-green-100 border-2 border-success-green rounded-xl p-6 text-left">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="h-7 w-7 text-success-green" />
                    <h4 className="text-elderly-xl font-bold text-navy">{flag.title}</h4>
                  </div>
                  <p className="text-elderly-lg text-gray-700">{flag.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentExample < examples.length - 1 ? (
              <button
                onClick={nextExample}
                className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm flex items-center space-x-3 justify-center min-h-[44px]"
              >
                <span>Next Text Example</span>
                <ArrowLeft className="h-6 w-6 rotate-180" />
              </button>
            ) : (
              <button
                onClick={nextExample}
                className="bg-warning-amber text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-yellow-600 transition-colors duration-200 shadow-warm flex items-center space-x-3 justify-center min-h-[44px]"
              >
                <Award className="h-6 w-6" />
                <span>Complete Training</span>
              </button>
            )}
            <button
              onClick={onReturnToDashboard}
              className="bg-gray-200 text-navy px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-gray-300 transition-colors duration-200 min-h-[44px]"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-warm border-4 border-navy">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <button
            onClick={onReturnToDashboard}
            className="flex items-center justify-center space-x-3 bg-gray-200 text-navy px-6 py-4 rounded-xl text-elderly-lg font-semibold border-2 border-navy hover:bg-gray-300 transition-colors duration-200 min-h-[44px]"
            title="Go back to the main page"
          >
            <Home className="h-6 w-6" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center justify-center space-x-3 bg-blue-accent text-warm-white px-6 py-4 rounded-xl text-elderly-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-warm min-h-[44px]"
              title={showHints ? "Hide the helpful hints" : "Show helpful hints"}
            >
              <Lightbulb className="h-6 w-6" />
              <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
            </button>
            
            {lastAction && !showResults && (
              <button
                onClick={handleUndo}
                className="flex items-center justify-center space-x-3 bg-warning-amber text-white px-6 py-4 rounded-xl text-elderly-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 shadow-warm min-h-[44px]"
                title="Undo your last action"
              >
                <Undo2 className="h-6 w-6" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy">
        <div className="text-center mb-6">
          <h2 className="text-elderly-3xl font-bold text-navy mb-4">Text Message Safety Training</h2>
          <p className="text-elderly-xl text-gray-700 mb-4">
            Example {currentExample + 1} of {examples.length}: {currentSMSExample.title}
          </p>
          <div className="flex items-center justify-center space-x-3 bg-success-green text-white px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm">
            <Target className="h-6 w-6" />
            <span>{flagsFound} out of {currentSMSExample.redFlags.length} problems found</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-6 border-4 border-navy mb-4">
          <div 
            className="bg-success-green h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4"
            style={{ width: `${Math.max((flagsFound / currentSMSExample.redFlags.length) * 100, 5)}%` }}
          >
            {flagsFound > 0 && (
              <span className="text-white font-bold text-elderly-base">
                {Math.round((flagsFound / currentSMSExample.redFlags.length) * 100)}%
              </span>
            )}
          </div>
        </div>
        <p className="text-elderly-lg text-center text-gray-700">
          Click on anything that looks suspicious or wrong in the text message below
        </p>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-navy rounded-2xl p-8 text-center max-w-md mx-4 shadow-warm">
            <Award className="h-20 w-20 text-warning-amber mx-auto mb-6" />
            <h3 className="text-elderly-3xl font-bold mb-4 text-navy">Fantastic Work!</h3>
            <p className="text-elderly-xl mb-6 text-gray-700">You've completed all the text message training examples!</p>
            <div className="bg-success-green text-white px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm">
              Great job! You earned lots of points!
            </div>
          </div>
        </div>
      )}

      {/* Realistic Phone Interface */}
      <div className="max-w-sm mx-auto sm:max-w-md">
        <div className="bg-navy rounded-3xl p-6 shadow-2xl">
          {/* Phone Header */}
          <div className="bg-gray-800 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between text-warm-white">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-6 w-6" />
                <span className="text-elderly-lg font-semibold">Messages</span>
              </div>
              <div className="flex items-center space-x-2 text-elderly-base">
                <Clock className="h-4 w-4" />
                <span>2:47 PM</span>
              </div>
            </div>
          </div>

          {/* SMS Interface */}
          <div className="bg-warm-white rounded-2xl p-6 min-h-96">
            {/* Contact Header */}
            <div className="flex items-center space-x-4 mb-6 pb-4 border-b-2 border-gray-200">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <Phone className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <button
                  onClick={() => {
                    const senderFlag = currentSMSExample.redFlags.find(f => f.element === 'sender');
                    if (senderFlag && !senderFlag.found) {
                      handleRedFlagClick(senderFlag.id);
                    }
                  }}
                  className={`text-elderly-xl font-bold hover:bg-red-100 px-3 py-2 rounded-xl transition-colors duration-200 border-2 min-h-[44px] w-full text-left ${
                    currentSMSExample.redFlags.find(f => f.element === 'sender')?.found ? 'bg-red-200 border-red-500' : 'border-transparent hover:border-red-300'
                  }`}
                  title="Click if this sender looks suspicious"
                >
                  {currentSMSExample.sender}
                </button>
                <p className="text-elderly-base text-gray-600 px-3">Unknown Number</p>
              </div>
            </div>

            {/* Message Bubble */}
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-6 max-w-xs">
                <div 
                  onClick={() => {
                    const contentFlag = currentSMSExample.redFlags.find(f => f.element === 'content' && !f.found);
                    const urgencyFlag = currentSMSExample.redFlags.find(f => f.element === 'urgency' && !f.found);
                    if (contentFlag) {
                      handleRedFlagClick(contentFlag.id);
                    } else if (urgencyFlag) {
                      handleRedFlagClick(urgencyFlag.id);
                    }
                  }}
                  className="cursor-pointer hover:bg-red-50 p-2 rounded-xl transition-colors duration-200 min-h-[44px]"
                  title="Click if anything in this message looks suspicious"
                >
                  {React.cloneElement(currentSMSExample.content, {
                    children: React.Children.map(currentSMSExample.content.props.children, (child) => {
                      if (React.isValidElement(child) && child.props && child.props.className && (child.props.className.includes('bg-blue-50') || child.props.className.includes('bg-red-50') || child.props.className.includes('bg-yellow-50'))) {
                        // Check if child.props.children is a single valid React element
                        if (React.Children.count(child.props.children) === 1 && React.isValidElement(React.Children.only(child.props.children))) {
                          const singleChild = React.Children.only(child.props.children);
                          return React.cloneElement(child, {
                            children: React.cloneElement(singleChild, {
                              onClick: (e: React.MouseEvent) => {
                                e.stopPropagation();
                                const linkFlag = currentSMSExample.redFlags.find(f => f.element === 'link' && !f.found);
                                if (linkFlag) {
                                  handleRedFlagClick(linkFlag.id);
                                }
                              },
                              className: `${singleChild.props.className || ''} ${
                                currentSMSExample.redFlags.find(f => f.element === 'link')?.found 
                                  ? 'bg-red-200 border-red-500' 
                                  : ''
                              }`
                            })
                          });
                        }
                      }
                      return child;
                    })
                  })}
                </div>
                
                <div className="text-right mt-4">
                  <span className="text-elderly-base text-gray-500">2:47 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation between examples */}
      {!simulationComplete && !showResults && (
        <div className="flex justify-center space-x-4">
          <button
            onClick={prevExample}
            disabled={currentExample === 0}
            className={`px-6 py-3 rounded-xl text-elderly-lg font-semibold transition-colors duration-200 min-h-[44px] ${
              currentExample === 0 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-300 text-navy hover:bg-gray-400'
            }`}
          >
            ← Previous Example
          </button>
        </div>
      )}

      {/* Hints Panel */}
      {showHints && (
        <div className="bg-yellow-50 border-4 border-warning-amber rounded-2xl p-8 shadow-warm">
          <h3 className="text-elderly-2xl font-bold mb-6 text-yellow-800 flex items-center">
            <Lightbulb className="h-8 w-8 mr-3" />
            Helpful Hints
          </h3>
          <div className="space-y-6">
            {currentSMSExample.redFlags.map((flag) => (
              <div key={flag.id} className={`p-6 rounded-xl border-2 ${flag.found ? 'bg-green-100 border-success-green' : 'bg-white border-warning-amber'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  {flag.found ? (
                    <CheckCircle className="h-7 w-7 text-success-green" />
                  ) : (
                    <AlertTriangle className="h-7 w-7 text-warning-amber" />
                  )}
                  <h4 className="text-elderly-xl font-bold text-navy">{flag.title}</h4>
                </div>
                <p className="text-elderly-lg text-gray-700">
                  {flag.found ? `✓ Found! ${flag.description}` : flag.hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SMS Safety Tips */}
      <div className="bg-blue-50 border-4 border-blue-accent rounded-2xl p-8 shadow-warm">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-8 w-8 text-blue-accent mr-4" />
          <h3 className="text-elderly-2xl font-bold text-navy">Text Message Safety Tips</h3>
        </div>
        <ul className="space-y-4 text-elderly-lg text-gray-700">
          <li className="flex items-start">
            <span className="text-success-green mr-3 text-elderly-xl">✓</span>
            Real companies rarely send urgent threats via text
          </li>
          <li className="flex items-start">
            <span className="text-success-green mr-3 text-elderly-xl">✓</span>
            Be suspicious of shortened links (bit.ly, tinyurl, etc.)
          </li>
          <li className="flex items-start">
            <span className="text-success-green mr-3 text-elderly-xl">✓</span>
            Banks and government agencies use official numbers
          </li>
          <li className="flex items-start">
            <span className="text-success-green mr-3 text-elderly-xl">✓</span>
            When in doubt, contact the company directly using official numbers
          </li>
          <li className="flex items-start">
            <span className="text-success-green mr-3 text-elderly-xl">✓</span>
            Never provide personal information via text message
          </li>
        </ul>
      </div>

      {/* Completion Message */}
      {simulationComplete && (
        <div className="bg-success-green text-white rounded-2xl p-8 text-center shadow-warm border-4 border-success-green">
          <Award className="h-20 w-20 mx-auto mb-6" />
          <h3 className="text-elderly-3xl font-bold mb-6">Excellent Work!</h3>
          <p className="text-elderly-xl mb-8 max-w-2xl mx-auto">
            You've successfully completed all the text message safety training! You now know how to spot 
            suspicious text messages and protect yourself from scams. Great job!
          </p>
          <button
            onClick={onReturnToDashboard}
            className="bg-white text-success-green px-8 py-4 rounded-xl text-elderly-2xl font-bold hover:bg-gray-100 transition-colors duration-200 shadow-warm border-4 border-white min-h-[44px]"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SMSSimulation;