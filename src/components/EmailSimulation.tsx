import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertTriangle, CheckCircle, Eye, Target, Award, Lightbulb, Home, Undo2 } from 'lucide-react';
import { UserProgress } from '../App';

interface EmailSimulationProps {
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

interface EmailExample {
  id: string;
  title: string;
  sender: string;
  subject: string;
  content: JSX.Element;
  redFlags: RedFlag[];
}

const EmailSimulation: React.FC<EmailSimulationProps> = ({
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

  const emailExamples: EmailExample[] = [
    {
      id: 'bank-phishing',
      title: 'Fake Bank Email',
      sender: 'Security Department <security@bank-alerts.net>',
      subject: 'URGENT: Account Security Alert - Action Required',
      content: (
        <div className="space-y-6">
          <p className="text-elderly-lg">Dear Valued Customer,</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
            <p className="font-bold text-red-600 text-elderly-xl mb-3">⚠️ IMMEDIATE ACTION REQUIRED ⚠️</p>
            <p className="text-elderly-lg">
              We have detected suspicious activity on your account. Your account will be 
              <span className="font-bold text-red-600"> PERMANENTLY CLOSED </span>
              within 24 hours unless you verify your identity immediately.
            </p>
          </div>
          <p className="text-elderly-lg">For your security, we need you to confirm your account details by clicking the secure link below:</p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-red-600 transition-colors duration-200 shadow-warm">
              🔒 Verify Account Now - secure-bank-verification.net
            </button>
          </div>
          <p className="text-elderly-lg">Please note that this link will expire in 2 hours for security purposes.</p>
          <p className="text-elderly-lg">
            Thank you for your immediate attention to this matter.<br /><br />
            Sincerely,<br />
            Security Department<br />
            Customer Protection Team
          </p>
        </div>
      ),
      redFlags: [
        {
          id: 'suspicious-sender',
          title: 'Suspicious Email Address',
          description: 'The email address "security@bank-alerts.net" is not from your real bank',
          found: false,
          hint: 'Look carefully at the sender\'s email address - does it look like your bank\'s real website?'
        },
        {
          id: 'urgent-language',
          title: 'Scary Urgent Language',
          description: 'Real banks don\'t threaten to close your account with scary language like this',
          found: false,
          hint: 'Notice how the email tries to scare you with urgent threats - real banks are more polite'
        },
        {
          id: 'suspicious-link',
          title: 'Fake Website Link',
          description: 'The link "secure-bank-verification.net" is not your bank\'s real website',
          found: false,
          hint: 'The website link doesn\'t match your bank\'s real website address'
        }
      ]
    },
    {
      id: 'prize-scam',
      title: 'Fake Prize Email',
      sender: 'Winner Notification <prizes@mega-lottery-winner.com>',
      subject: 'CONGRATULATIONS! You\'ve Won $50,000!!!',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-100 border-4 border-yellow-500 p-6 rounded-xl text-center">
            <p className="font-bold text-yellow-800 text-elderly-2xl mb-3">🎉 CONGRATULATIONS! 🎉</p>
            <p className="text-elderly-xl text-yellow-800">You have won $50,000 in our monthly lottery!</p>
          </div>
          <p className="text-elderly-lg">Dear Lucky Winner,</p>
          <p className="text-elderly-lg">
            You have been selected as one of our grand prize winners! Your email was randomly chosen 
            from millions of entries worldwide.
          </p>
          <div className="bg-green-50 border-2 border-green-400 p-6 rounded-xl">
            <p className="text-elderly-lg font-bold text-green-800 mb-3">Your Prize Details:</p>
            <ul className="text-elderly-lg text-green-700 space-y-2">
              <li>• Prize Amount: $50,000 USD</li>
              <li>• Reference Number: WIN-2024-789456</li>
              <li>• Claim Deadline: 48 hours</li>
            </ul>
          </div>
          <p className="text-elderly-lg">
            To claim your prize, you must pay a small processing fee of $299 to cover international 
            transfer costs. Click below to pay securely:
          </p>
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 text-center">
            <button className="bg-red-600 text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-red-700 transition-colors duration-200 shadow-warm">
              💳 Pay Processing Fee - claim-your-prize-now.net
            </button>
          </div>
          <p className="text-elderly-lg">
            Congratulations again!<br />
            Prize Distribution Team
          </p>
        </div>
      ),
      redFlags: [
        {
          id: 'unexpected-prize',
          title: 'Unexpected Prize',
          description: 'You never entered any lottery, so you can\'t win a prize from one',
          found: false,
          hint: 'Think about it - did you ever enter this lottery? You can\'t win something you never entered!'
        },
        {
          id: 'pay-to-win',
          title: 'Pay Money to Get Money',
          description: 'Real prizes never require you to pay money upfront to claim them',
          found: false,
          hint: 'If you won money, why would you need to pay money to get it? That doesn\'t make sense!'
        },
        {
          id: 'fake-urgency',
          title: 'Fake Time Pressure',
          description: 'Scammers create fake deadlines to make you act quickly without thinking',
          found: false,
          hint: 'Notice the "48 hours" deadline - scammers want you to rush and not think carefully'
        }
      ]
    },
    {
      id: 'tech-support',
      title: 'Fake Tech Support',
      sender: 'Microsoft Security <security@microsoft-support-team.org>',
      subject: 'Your Computer Has Been Infected - Immediate Action Required',
      content: (
        <div className="space-y-6">
          <div className="bg-red-100 border-4 border-red-500 p-6 rounded-xl">
            <p className="font-bold text-red-600 text-elderly-2xl mb-3">🚨 SECURITY ALERT 🚨</p>
            <p className="text-elderly-xl text-red-700">Your computer has been infected with dangerous viruses!</p>
          </div>
          <p className="text-elderly-lg">Dear Microsoft User,</p>
          <p className="text-elderly-lg">
            Our security systems have detected that your computer (IP Address: 192.168.1.1) 
            has been infected with multiple viruses and malware.
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
            <p className="text-elderly-lg font-bold text-yellow-800 mb-3">Threats Detected:</p>
            <ul className="text-elderly-lg text-yellow-700 space-y-2">
              <li>• Trojan.Win32.Malware (High Risk)</li>
              <li>• Spyware.DataTheft (Critical)</li>
              <li>• Ransomware.FileLocker (Severe)</li>
            </ul>
          </div>
          <p className="text-elderly-lg">
            Your personal information, banking details, and files are at immediate risk. 
            You must call our emergency support line RIGHT NOW:
          </p>
          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 text-center">
            <p className="text-elderly-2xl font-bold text-blue-800 mb-4">📞 CALL NOW: 1-800-FAKE-HELP</p>
            <p className="text-elderly-lg text-blue-700">Our technicians are standing by 24/7</p>
          </div>
          <p className="text-elderly-lg">
            Do NOT turn off your computer or use it until you call us!<br /><br />
            Microsoft Security Team<br />
            Emergency Response Division
          </p>
        </div>
      ),
      redFlags: [
        {
          id: 'microsoft-doesnt-email',
          title: 'Microsoft Doesn\'t Send These Emails',
          description: 'Microsoft doesn\'t send emails about viruses on your computer or ask you to call them',
          found: false,
          hint: 'Microsoft doesn\'t monitor your computer or send emails about viruses - this is fake!'
        },
        {
          id: 'fake-phone-number',
          title: 'Suspicious Phone Number',
          description: 'The phone number is not Microsoft\'s real support number',
          found: false,
          hint: 'Real Microsoft support numbers are different and they don\'t use catchy phrases like this'
        },
        {
          id: 'scare-tactics',
          title: 'Scare Tactics',
          description: 'The email uses scary language to make you panic and call immediately',
          found: false,
          hint: 'Notice how the email tries to scare you with urgent threats about your computer being infected'
        }
      ]
    }
  ];

  const [examples, setExamples] = useState(emailExamples);

  const currentEmailExample = examples[currentExample];
  const flagsFound = currentEmailExample.redFlags.filter(flag => flag.found).length;
  const allFlagsFound = flagsFound === currentEmailExample.redFlags.length;

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
        setShowCelebration(true);
        
        // Unlock badges
        if (!userProgress.badges.includes('phishing-detector')) {
          onUnlockBadge('phishing-detector');
        }
        if (!userProgress.badges.includes('security-novice')) {
          onUnlockBadge('security-novice');
        }
        if (!userProgress.badges.includes('eagle-eye')) {
          onUnlockBadge('eagle-eye');
        }
        
        // Mark simulation as complete
        onCompleteSimulation('phishing-email-1');

        // Hide celebration after 4 seconds
        setTimeout(() => setShowCelebration(false), 4000);
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

  return (
    <div className="space-y-8 bg-warm-white min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-warm border-4 border-navy">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <button
            onClick={onReturnToDashboard}
            className="flex items-center justify-center space-x-3 bg-gray-200 text-navy px-6 py-4 rounded-xl text-elderly-lg font-semibold border-2 border-navy hover:bg-gray-300 transition-colors duration-200"
            title="Go back to the main page"
          >
            <Home className="h-6 w-6" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center justify-center space-x-3 bg-blue-accent text-warm-white px-6 py-4 rounded-xl text-elderly-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-warm"
              title={showHints ? "Hide the helpful hints" : "Show helpful hints"}
            >
              <Lightbulb className="h-6 w-6" />
              <span>{showHints ? 'Hide Hints' : 'Show Hints'}</span>
            </button>
            
            {lastAction && (
              <button
                onClick={handleUndo}
                className="flex items-center justify-center space-x-3 bg-warning-amber text-white px-6 py-4 rounded-xl text-elderly-lg font-semibold hover:bg-yellow-600 transition-colors duration-200 shadow-warm"
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
          <h2 className="text-elderly-3xl font-bold text-navy mb-4">Email Safety Training</h2>
          <p className="text-elderly-xl text-gray-700 mb-4">
            Example {currentExample + 1} of {examples.length}: {currentEmailExample.title}
          </p>
          <div className="flex items-center justify-center space-x-3 bg-success-green text-white px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm">
            <Target className="h-6 w-6" />
            <span>{flagsFound} out of {currentEmailExample.redFlags.length} problems found</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-6 border-4 border-navy mb-4">
          <div 
            className="bg-success-green h-full rounded-full transition-all duration-500 flex items-center justify-end pr-4"
            style={{ width: `${Math.max((flagsFound / currentEmailExample.redFlags.length) * 100, 5)}%` }}
          >
            {flagsFound > 0 && (
              <span className="text-white font-bold text-elderly-base">
                {Math.round((flagsFound / currentEmailExample.redFlags.length) * 100)}%
              </span>
            )}
          </div>
        </div>
        <p className="text-elderly-lg text-center text-gray-700">
          Click on anything that looks suspicious or wrong in the email below
        </p>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-4 border-navy rounded-2xl p-8 text-center max-w-md mx-4 shadow-warm">
            <Award className="h-20 w-20 text-warning-amber mx-auto mb-6" />
            <h3 className="text-elderly-3xl font-bold mb-4 text-navy">Fantastic Work!</h3>
            <p className="text-elderly-xl mb-6 text-gray-700">You've completed all the email training examples!</p>
            <div className="bg-success-green text-white px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm">
              Great job! You earned lots of points!
            </div>
          </div>
        </div>
      )}

      {/* Email Interface */}
      <div className="bg-white rounded-2xl shadow-warm border-4 border-navy overflow-hidden">
        {/* Email Header */}
        <div className="bg-gray-100 border-b-4 border-navy p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-accent p-3 rounded-full">
              <Mail className="h-8 w-8 text-warm-white" />
            </div>
            <h3 className="text-elderly-2xl font-bold text-navy">Email Message</h3>
          </div>
          
          <div className="space-y-4 text-elderly-lg">
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-navy sm:w-24 mb-2 sm:mb-0">From:</span>
              <button
                onClick={() => handleRedFlagClick('suspicious-sender')}
                className={`text-left hover:bg-red-100 px-4 py-2 rounded-xl transition-colors duration-200 border-2 ${
                  currentEmailExample.redFlags.find(f => f.id === 'suspicious-sender')?.found 
                    ? 'bg-red-200 border-red-500' 
                    : 'border-transparent hover:border-red-300'
                }`}
                title="Click if this sender looks suspicious"
              >
                {currentEmailExample.sender}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-navy sm:w-24 mb-2 sm:mb-0">To:</span>
              <span className="text-gray-700">you@email.com</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-navy sm:w-24 mb-2 sm:mb-0">Subject:</span>
              <span className="font-bold text-red-600">{currentEmailExample.subject}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-bold text-navy sm:w-24 mb-2 sm:mb-0">Date:</span>
              <span className="text-gray-700">Today, 2:14 PM</span>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="p-8">
          <div 
            onClick={() => {
              // Handle clicks on different parts of the email content
              const urgentFlag = currentEmailExample.redFlags.find(f => f.id.includes('urgent') || f.id.includes('language') || f.id.includes('scare'));
              if (urgentFlag && !urgentFlag.found) {
                handleRedFlagClick(urgentFlag.id);
              }
            }}
            className="cursor-pointer hover:bg-red-50 p-4 rounded-xl transition-colors duration-200"
          >
            {currentEmailExample.content}
          </div>
          
          {/* Clickable elements for other red flags */}
          <div className="mt-8 space-y-4">
            {currentEmailExample.redFlags.filter(flag => flag.id.includes('link')).map(flag => (
              <button
                key={flag.id}
                onClick={() => handleRedFlagClick(flag.id)}
                className={`w-full p-4 rounded-xl border-2 transition-colors duration-200 ${
                  flag.found 
                    ? 'bg-red-200 border-red-500' 
                    : 'bg-blue-50 border-blue-300 hover:bg-red-100 hover:border-red-300'
                }`}
                title="Click if this link looks suspicious"
              >
                <span className="text-elderly-lg font-semibold">
                  {flag.id.includes('link') ? '🔗 Click here if this link looks suspicious' : ''}
                </span>
              </button>
            ))}
            
            {currentEmailExample.redFlags.filter(flag => flag.id.includes('pay') || flag.id.includes('prize') || flag.id.includes('phone')).map(flag => (
              <button
                key={flag.id}
                onClick={() => handleRedFlagClick(flag.id)}
                className={`w-full p-4 rounded-xl border-2 transition-colors duration-200 ${
                  flag.found 
                    ? 'bg-red-200 border-red-500' 
                    : 'bg-yellow-50 border-yellow-300 hover:bg-red-100 hover:border-red-300'
                }`}
                title="Click if this seems suspicious"
              >
                <span className="text-elderly-lg font-semibold">
                  {flag.id.includes('pay') && '💳 Click here if paying money to get money seems wrong'}
                  {flag.id.includes('prize') && '🎁 Click here if winning a prize you never entered seems suspicious'}
                  {flag.id.includes('phone') && '📞 Click here if this phone number seems suspicious'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation between examples */}
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
            ← Previous Example
          </button>
          
          {allFlagsFound && currentExample < examples.length - 1 && (
            <button
              onClick={nextExample}
              className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm flex items-center space-x-3"
            >
              <span>Next Example</span>
              <ArrowLeft className="h-6 w-6 rotate-180" />
            </button>
          )}
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
            {currentEmailExample.redFlags.map((flag) => (
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

      {/* Red Flags Summary */}
      <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy">
        <h3 className="text-elderly-2xl font-bold mb-6 text-navy text-center">Problems to Find in This Email</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {currentEmailExample.redFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-6 rounded-xl border-4 transition-all duration-200 text-center ${
                flag.found
                  ? 'bg-success-green text-white border-success-green'
                  : 'bg-gray-100 border-gray-400'
              }`}
            >
              {flag.found ? (
                <CheckCircle className="h-12 w-12 mx-auto mb-4" />
              ) : (
                <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              )}
              <h4 className="text-elderly-lg font-bold mb-3">{flag.title}</h4>
              {flag.found && (
                <div className="bg-white text-success-green px-4 py-2 rounded-xl text-elderly-base font-bold">
                  Found! +25 Points
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {simulationComplete && (
        <div className="bg-success-green text-white rounded-2xl p-8 text-center shadow-warm border-4 border-success-green">
          <Award className="h-20 w-20 mx-auto mb-6" />
          <h3 className="text-elderly-3xl font-bold mb-6">Excellent Work!</h3>
          <p className="text-elderly-xl mb-8 max-w-2xl mx-auto">
            You've successfully completed all the email safety training! You now know how to spot 
            fake emails and protect yourself from scams. Great job!
          </p>
          <button
            onClick={onReturnToDashboard}
            className="bg-white text-success-green px-8 py-4 rounded-xl text-elderly-2xl font-bold hover:bg-gray-100 transition-colors duration-200 shadow-warm border-4 border-white"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailSimulation;