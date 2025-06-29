import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertTriangle, CheckCircle, Target, Award, Lightbulb, Home, Undo2, Paperclip, Star, Clock } from 'lucide-react';
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
  element: 'sender' | 'subject' | 'content' | 'link' | 'attachment';
}

interface EmailExample {
  id: string;
  title: string;
  sender: string;
  subject: string;
  content: JSX.Element;
  redFlags: RedFlag[];
  hasAttachment?: boolean;
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
  const [showResults, setShowResults] = useState(false);

  const emailExamples: EmailExample[] = [
    {
      id: 'bank-phishing',
      title: 'Fake Bank Email',
      sender: 'Security Department <security@bank-alerts.net>',
      subject: 'URGENT: Account Security Alert - Action Required',
      content: (
        <div className="space-y-6 text-elderly-lg">
          <p>Dear Valued Customer,</p>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl">
            <p className="font-bold text-red-600 text-elderly-xl mb-3">⚠️ IMMEDIATE ACTION REQUIRED ⚠️</p>
            <p>
              We have detected suspicious activity on your account. Your account will be 
              <span className="font-bold text-red-600"> PERMANENTLY CLOSED </span>
              within 24 hours unless you verify your identity immediately.
            </p>
          </div>
          <p>For your security, we need you to confirm your account details by clicking the secure link below:</p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
            <button 
              className="bg-blue-600 text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 shadow-warm border-2 border-transparent hover:border-red-500"
              title="This is a suspicious link - click to identify it"
            >
              🔒 Verify Account Now - secure-bank-verification.net
            </button>
          </div>
          <p>Please note that this link will expire in 2 hours for security purposes.</p>
          <p>
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
          hint: 'Look carefully at the sender\'s email address - does it look like your bank\'s real website?',
          element: 'sender'
        },
        {
          id: 'urgent-language',
          title: 'Scary Urgent Language',
          description: 'Real banks don\'t threaten to close your account with scary language like this',
          found: false,
          hint: 'Notice how the email tries to scare you with urgent threats - real banks are more polite',
          element: 'content'
        },
        {
          id: 'suspicious-link',
          title: 'Fake Website Link',
          description: 'The link "secure-bank-verification.net" is not your bank\'s real website',
          found: false,
          hint: 'The website link doesn\'t match your bank\'s real website address',
          element: 'link'
        }
      ]
    },
    {
      id: 'prize-scam',
      title: 'Fake Prize Email',
      sender: 'Winner Notification <prizes@mega-lottery-winner.com>',
      subject: 'CONGRATULATIONS! You\'ve Won $50,000!!!',
      content: (
        <div className="space-y-6 text-elderly-lg">
          <div className="bg-yellow-100 border-4 border-yellow-500 p-6 rounded-xl text-center">
            <p className="font-bold text-yellow-800 text-elderly-2xl mb-3">🎉 CONGRATULATIONS! 🎉</p>
            <p className="text-elderly-xl text-yellow-800">You have won $50,000 in our monthly lottery!</p>
          </div>
          <p>Dear Lucky Winner,</p>
          <p>
            You have been selected as one of our grand prize winners! Your email was randomly chosen 
            from millions of entries worldwide.
          </p>
          <div className="bg-green-50 border-2 border-green-400 p-6 rounded-xl">
            <p className="font-bold text-green-800 mb-3">Your Prize Details:</p>
            <ul className="text-green-700 space-y-2">
              <li>• Prize Amount: $50,000 USD</li>
              <li>• Reference Number: WIN-2024-789456</li>
              <li>• Claim Deadline: 48 hours</li>
            </ul>
          </div>
          <p>
            To claim your prize, you must pay a small processing fee of $299 to cover international 
            transfer costs. Click below to pay securely:
          </p>
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 text-center">
            <button 
              className="bg-red-600 text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-red-200 hover:text-red-800 transition-colors duration-200 shadow-warm border-2 border-transparent hover:border-red-500"
              title="This is a suspicious payment request - click to identify it"
            >
              💳 Pay Processing Fee - claim-your-prize-now.net
            </button>
          </div>
          <p>
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
          hint: 'Think about it - did you ever enter this lottery? You can\'t win something you never entered!',
          element: 'content'
        },
        {
          id: 'pay-to-win',
          title: 'Pay Money to Get Money',
          description: 'Real prizes never require you to pay money upfront to claim them',
          found: false,
          hint: 'If you won money, why would you need to pay money to get it? That doesn\'t make sense!',
          element: 'link'
        },
        {
          id: 'fake-urgency',
          title: 'Fake Time Pressure',
          description: 'Scammers create fake deadlines to make you act quickly without thinking',
          found: false,
          hint: 'Notice the "48 hours" deadline - scammers want you to rush and not think carefully',
          element: 'content'
        }
      ]
    },
    {
      id: 'tech-support',
      title: 'Fake Tech Support',
      sender: 'Microsoft Security <security@microsoft-support-team.org>',
      subject: 'Your Computer Has Been Infected - Immediate Action Required',
      hasAttachment: true,
      content: (
        <div className="space-y-6 text-elderly-lg">
          <div className="bg-red-100 border-4 border-red-500 p-6 rounded-xl">
            <p className="font-bold text-red-600 text-elderly-2xl mb-3">🚨 SECURITY ALERT 🚨</p>
            <p className="text-elderly-xl text-red-700">Your computer has been infected with dangerous viruses!</p>
          </div>
          <p>Dear Microsoft User,</p>
          <p>
            Our security systems have detected that your computer (IP Address: 192.168.1.1) 
            has been infected with multiple viruses and malware.
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-xl">
            <p className="font-bold text-yellow-800 mb-3">Threats Detected:</p>
            <ul className="text-yellow-700 space-y-2">
              <li>• Trojan.Win32.Malware (High Risk)</li>
              <li>• Spyware.DataTheft (Critical)</li>
              <li>• Ransomware.FileLocker (Severe)</li>
            </ul>
          </div>
          <p>
            Your personal information, banking details, and files are at immediate risk. 
            You must call our emergency support line RIGHT NOW:
          </p>
          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 text-center">
            <button 
              className="text-elderly-2xl font-bold text-blue-800 mb-4 hover:bg-red-200 hover:text-red-800 transition-colors duration-200 px-4 py-2 rounded-xl border-2 border-transparent hover:border-red-500"
              title="This phone number is suspicious - click to identify it"
            >
              📞 CALL NOW: 1-800-FAKE-HELP
            </button>
            <p className="text-blue-700">Our technicians are standing by 24/7</p>
          </div>
          <p>
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
          hint: 'Microsoft doesn\'t monitor your computer or send emails about viruses - this is fake!',
          element: 'sender'
        },
        {
          id: 'fake-phone-number',
          title: 'Suspicious Phone Number',
          description: 'The phone number is not Microsoft\'s real support number',
          found: false,
          hint: 'Real Microsoft support numbers are different and they don\'t use catchy phrases like this',
          element: 'link'
        },
        {
          id: 'suspicious-attachment',
          title: 'Suspicious Attachment',
          description: 'Unexpected attachments from unknown senders can contain viruses',
          found: false,
          hint: 'Be very careful with attachments, especially from suspicious emails like this one',
          element: 'attachment'
        }
      ]
    }
  ];

  const [examples, setExamples] = useState(emailExamples);

  const currentEmailExample = examples[currentExample];
  const flagsFound = currentEmailExample.redFlags.filter(flag => flag.found).length;
  const allFlagsFound = flagsFound === currentEmailExample.redFlags.length;

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
              You found all {currentEmailExample.redFlags.length} suspicious things in this email!
            </p>
            <div className="bg-white text-success-green px-6 py-3 rounded-xl text-elderly-xl font-semibold shadow-warm inline-block">
              +{75} Points Earned!
            </div>
          </div>

          {/* What You Found */}
          <div className="bg-white rounded-2xl p-8 shadow-warm border-4 border-navy mb-8">
            <h3 className="text-elderly-2xl font-bold mb-6 text-navy">What You Spotted:</h3>
            <div className="space-y-4">
              {currentEmailExample.redFlags.map((flag) => (
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
                className="bg-blue-accent text-warm-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-blue-600 transition-colors duration-200 shadow-warm flex items-center space-x-3 justify-center"
              >
                <span>Next Email Example</span>
                <ArrowLeft className="h-6 w-6 rotate-180" />
              </button>
            ) : (
              <button
                onClick={nextExample}
                className="bg-warning-amber text-white px-8 py-4 rounded-xl text-elderly-xl font-bold hover:bg-yellow-600 transition-colors duration-200 shadow-warm flex items-center space-x-3 justify-center"
              >
                <Award className="h-6 w-6" />
                <span>Complete Training</span>
              </button>
            )}
            <button
              onClick={onReturnToDashboard}
              className="bg-gray-200 text-navy px-6 py-3 rounded-xl text-elderly-lg font-semibold hover:bg-gray-300 transition-colors duration-200"
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
            
            {lastAction && !showResults && (
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

      {/* Realistic Email Interface */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-warm border-4 border-navy overflow-hidden">
          {/* Email Client Header */}
          <div className="bg-gray-50 border-b-2 border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-accent p-2 rounded-full">
                <Mail className="h-6 w-6 text-warm-white" />
              </div>
              <h3 className="text-elderly-xl font-bold text-navy">Email Inbox</h3>
              <div className="flex items-center space-x-2 text-elderly-base text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Today, 2:14 PM</span>
              </div>
            </div>
          </div>

          {/* Email Header */}
          <div className="bg-gray-100 border-b-2 border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-bold text-navy text-elderly-lg sm:w-20 mb-2 sm:mb-0">From:</span>
                <button
                  onClick={() => {
                    const senderFlag = currentEmailExample.redFlags.find(f => f.element === 'sender');
                    if (senderFlag && !senderFlag.found) {
                      handleRedFlagClick(senderFlag.id);
                    }
                  }}
                  className={`text-left hover:bg-red-100 px-4 py-3 rounded-xl transition-colors duration-200 border-2 text-elderly-lg min-h-[44px] ${
                    currentEmailExample.redFlags.find(f => f.element === 'sender')?.found 
                      ? 'bg-red-200 border-red-500' 
                      : 'border-transparent hover:border-red-300'
                  }`}
                  title="Click if this sender looks suspicious"
                >
                  {currentEmailExample.sender}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-bold text-navy text-elderly-lg sm:w-20 mb-2 sm:mb-0">To:</span>
                <span className="text-gray-700 text-elderly-lg px-4 py-3">you@email.com</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-bold text-navy text-elderly-lg sm:w-20 mb-2 sm:mb-0">Subject:</span>
                <button
                  onClick={() => {
                    const subjectFlag = currentEmailExample.redFlags.find(f => f.element === 'subject');
                    if (subjectFlag && !subjectFlag.found) {
                      handleRedFlagClick(subjectFlag.id);
                    }
                  }}
                  className={`text-left font-bold text-red-600 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors duration-200 border-2 text-elderly-lg min-h-[44px] ${
                    currentEmailExample.redFlags.find(f => f.element === 'subject')?.found 
                      ? 'bg-red-200 border-red-500' 
                      : 'border-transparent hover:border-red-300'
                  }`}
                  title="Click if this subject looks suspicious"
                >
                  {currentEmailExample.subject}
                </button>
              </div>

              {currentEmailExample.hasAttachment && (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="font-bold text-navy text-elderly-lg sm:w-20 mb-2 sm:mb-0">Attachment:</span>
                  <button
                    onClick={() => {
                      const attachmentFlag = currentEmailExample.redFlags.find(f => f.element === 'attachment');
                      if (attachmentFlag && !attachmentFlag.found) {
                        handleRedFlagClick(attachmentFlag.id);
                      }
                    }}
                    className={`flex items-center space-x-2 hover:bg-red-100 px-4 py-3 rounded-xl transition-colors duration-200 border-2 text-elderly-lg min-h-[44px] ${
                      currentEmailExample.redFlags.find(f => f.element === 'attachment')?.found 
                        ? 'bg-red-200 border-red-500' 
                        : 'border-transparent hover:border-red-300'
                    }`}
                    title="Click if this attachment looks suspicious"
                  >
                    <Paperclip className="h-5 w-5" />
                    <span>security_scan.exe</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Email Body */}
          <div className="p-8">
            <div 
              onClick={() => {
                const contentFlag = currentEmailExample.redFlags.find(f => f.element === 'content' && !f.found);
                if (contentFlag) {
                  handleRedFlagClick(contentFlag.id);
                }
              }}
              className="cursor-pointer hover:bg-red-50 p-4 rounded-xl transition-colors duration-200 min-h-[44px]"
              title="Click if anything in this email content looks suspicious"
            >
              {React.cloneElement(currentEmailExample.content, {
                children: React.Children.map(currentEmailExample.content.props.children, (child) => {
                  if (React.isValidElement(child) && child.props.className?.includes('bg-blue-50')) {
                    return React.cloneElement(child, {
                      children: React.cloneElement(child.props.children, {
                        onClick: (e: React.MouseEvent) => {
                          e.stopPropagation();
                          const linkFlag = currentEmailExample.redFlags.find(f => f.element === 'link' && !f.found);
                          if (linkFlag) {
                            handleRedFlagClick(linkFlag.id);
                          }
                        },
                        className: `${child.props.children.props.className || ''} ${
                          currentEmailExample.redFlags.find(f => f.element === 'link')?.found 
                            ? 'bg-red-200 border-red-500' 
                            : ''
                        }`
                      })
                    });
                  }
                  return child;
                })
              })}
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
            className="bg-white text-success-green px-8 py-4 rounded-xl text-elderly-2xl font-bold hover:bg-gray-100 transition-colors duration-200 shadow-warm border-4 border-white min-h-[44px]"
          >
            Return to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailSimulation;