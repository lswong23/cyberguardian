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
  const [showResults, setShowResults] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

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
        
        // Collect badges to show on results
        const newBadges = [];
        if (!userProgress.badges.includes('phishing-detector')) {
          onUnlockBadge('phishing-detector');
          newBadges.push('phishing-detector');
        }
        if (!userProgress.badges.includes('security-novice')) {
          onUnlockBadge('security-novice');
          newBadges.push('security-novice');
        }
        if (!userProgress.badges.includes('eagle-eye')) {
          onUnlockBadge('eagle-eye');
          newBadges.push('eagle-eye');
        }
        
        setEarnedBadges(newBadges);
        
        // Mark simulation as complete
        onCompleteSimulation('phishing-email-1');

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
      { id: 'phishing-detector', name: 'Email Detective', description: 'You spotted all the tricks in fake emails!', icon: Mail },
      { id: 'security-novice', name: 'Safety Student', description: 'You completed your first training lesson!', icon: CheckCircle },
      { id: 'eagle-eye', name: 'Sharp Eyes', description: 'You found suspicious things very quickly!', icon: Target },
    ];

    return (
      <div className="min-h-screen bg-warm-white p-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="bg-success-green text-white rounded-2xl p-8 text-center shadow-warm">
            <Award className="h-20 w-20 mx-auto mb-6" />
            <h2 className="text-elderly-3xl font-bold mb-4">Fantastic Work!</h2>
            <p className="text-elderly-xl mb-6">
              You've completed all the email safety training examples!
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
                How to check if an email sender is legitimate
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Recognizing urgent language that tries to scare you
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Identifying suspicious links and fake websites
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-green mr-3 mt-1 flex-shrink-0" />
                Understanding common scam tactics
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
            <h2 className="text-elderly-2xl font-bold text-navy mb-2">{currentEmailExample.title}</h2>
            <div className="flex items-center justify-center space-x-3 bg-success-green text-white px-4 py-2 rounded-xl text-elderly-lg font-semibold">
              <Target className="h-5 w-5" />
              <span>{flagsFound} of {currentEmailExample.redFlags.length} found</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-navy">
            <div 
              className="bg-success-green h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max((flagsFound / currentEmailExample.redFlags.length) * 100, 5)}%` }}
            />
          </div>
        </div>

        {/* Email Interface */}
        <div className="bg-white rounded-2xl shadow-warm border-4 border-navy overflow-hidden">
          {/* Email Header */}
          <div className="bg-gray-100 border-b-4 border-navy p-4">
            <div className="space-y-3 text-elderly-base">
              <div className="flex flex-col">
                <span className="font-bold text-navy mb-1">From:</span>
                <button
                  onClick={() => handleRedFlagClick('suspicious-sender')}
                  className={`text-left p-3 rounded-xl transition-colors duration-200 border-2 ${
                    currentEmailExample.redFlags.find(f => f.id === 'suspicious-sender')?.found 
                      ? 'bg-red-200 border-red-500' 
                      : 'border-transparent hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  {currentEmailExample.sender}
                </button>
              </div>
              <div>
                <span className="font-bold text-navy">Subject: </span>
                <span className="font-bold text-red-600">{currentEmailExample.subject}</span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="p-6">
            <div 
              onClick={() => {
                const urgentFlag = currentEmailExample.redFlags.find(f => 
                  f.id.includes('urgent') || f.id.includes('language') || f.id.includes('scare') || 
                  f.id.includes('prize') || f.id.includes('pay') || f.id.includes('microsoft') ||
                  f.id.includes('phone') || f.id.includes('tactics')
                );
                if (urgentFlag && !urgentFlag.found) {
                  handleRedFlagClick(urgentFlag.id);
                }
              }}
              className="cursor-pointer hover:bg-red-50 p-4 rounded-xl transition-colors duration-200 border-2 border-transparent hover:border-red-300"
            >
              {currentEmailExample.content}
            </div>
            
            {/* Clickable link button */}
            {currentEmailExample.redFlags.some(flag => flag.id.includes('link') || flag.id.includes('website')) && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    const linkFlag = currentEmailExample.redFlags.find(f => f.id.includes('link') || f.id.includes('website'));
                    if (linkFlag && !linkFlag.found) {
                      handleRedFlagClick(linkFlag.id);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-colors duration-200 text-elderly-lg font-semibold ${
                    currentEmailExample.redFlags.find(f => f.id.includes('link') || f.id.includes('website'))?.found
                      ? 'bg-red-200 border-red-500 text-red-800' 
                      : 'bg-blue-50 border-blue-300 hover:bg-red-100 hover:border-red-300 text-blue-800'
                  }`}
                >
                  🔗 Tap here if the website link looks suspicious
                </button>
              </div>
            )}
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
              {currentEmailExample.redFlags.map((flag) => (
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

export default EmailSimulation;