import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ScamScenario } from '../types';
import { ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft, Info, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScamSimulatorProps {
  profile: UserProfile;
  onBack: () => void;
  awardXP: (amount: number, missionId?: string) => void;
}

const scenarios: ScamScenario[] = [
  {
    id: '1',
    title: 'Suspicious Refund Message',
    message: 'URGENT: Your income tax refund of ₹15,000 is pending. Click here to claim now: http://tax-refund-gov.xyz/claim',
    isScam: true,
    difficulty: 'Easy',
    explanation: 'Government websites always use official domains (like .gov.in or .gov). Urgency and suspicious links are major red flags.',
    redFlags: ['Urgent tone', 'Suspicious URL (.xyz)', 'Unsolicited message'],
  },
  {
    id: '2',
    title: 'Fake Job Offer',
    message: 'Congratulations! You have been selected for a Part-Time job. Earn $500 daily. Contact us on WhatsApp: +1-234-567-890',
    isScam: true,
    difficulty: 'Easy',
    explanation: 'Legitimate companies don\'t hire through WhatsApp without a formal application process. High pay for little work is almost always a scam.',
    redFlags: ['Unrealistic pay', 'WhatsApp contact', 'No formal process'],
  },
  {
    id: '3',
    title: 'Bank Security Alert',
    message: 'Your account has been locked due to suspicious activity. Please verify your identity at: https://secure-bank-login.com',
    isScam: true,
    difficulty: 'Medium',
    explanation: 'Banks will never ask you to click a link to "verify" your identity. Always use the official bank app or website directly.',
    redFlags: ['Fear-based urgency', 'Suspicious link', 'Asking for login'],
  },
  {
    id: '4',
    title: 'Official Bank OTP',
    message: 'Your OTP for transaction of ₹500 is 123456. Do not share this with anyone.',
    isScam: false,
    difficulty: 'Easy',
    explanation: 'This is a standard OTP message. It clearly states the purpose and warns you not to share it. It doesn\'t ask you to click any links.',
    redFlags: [],
  },
];

const quizQuestions = [
  {
    question: "Which of these is a common sign of a phishing scam?",
    options: ["Personalized greeting", "Urgent request for action", "Official company email address", "Secure website (https)"],
    correct: 1,
    explanation: "Scammers often create a sense of urgency to pressure you into making a mistake without thinking."
  },
  {
    question: "What should you do if you receive an unexpected text asking for an OTP?",
    options: ["Share it immediately", "Reply asking who they are", "Ignore and delete it", "Click the link in the text"],
    correct: 2,
    explanation: "Never share your OTP with anyone. Legitimate companies will never ask for it over a call or text."
  },
  {
    question: "A website URL looks like 'secure-bank-login.net' instead of 'bank.com'. Is it safe?",
    options: ["Yes, it says secure", "No, it's a suspicious domain", "Yes, if it has a lock icon", "Maybe, if the design looks real"],
    correct: 1,
    explanation: "Always check the domain name. Scammers use slightly altered URLs to trick you into thinking it's the real site."
  }
];

export function ScamSimulator({ profile, onBack, awardXP }: ScamSimulatorProps) {
  const [mode, setMode] = useState<'scenarios' | 'quiz'>('scenarios');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userChoice, setUserChoice] = useState<boolean | number | null>(null);
  const [score, setScore] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);

  const scenario = scenarios[currentIndex];
  const quiz = quizQuestions[currentIndex];

  const handleChoice = (choice: boolean | number) => {
    setUserChoice(choice);
    setShowResult(true);
    let isCorrect = false;
    if (mode === 'scenarios') {
      isCorrect = choice === scenario.isScam;
    } else {
      isCorrect = choice === quiz.correct;
    }

    if (isCorrect) {
      setScore(score + 1);
      awardXP(20);
    }
  };

  const nextItem = () => {
    setShowResult(false);
    setUserChoice(null);
    const list = mode === 'scenarios' ? scenarios : quizQuestions;
    if (currentIndex < list.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFinalResult(true);
    }
  };

  const resetSimulator = () => {
    setShowFinalResult(false);
    setCurrentIndex(0);
    setShowResult(false);
    setUserChoice(null);
    if (mode === 'quiz') {
      awardXP(150, '2');
    } else {
      if (score >= 3) {
        awardXP(120, '6');
      } else {
        awardXP(100);
      }
    }
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-2xl flex">
          <button
            onClick={() => { setMode('scenarios'); setCurrentIndex(0); setScore(0); setShowResult(false); }}
            className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-all", mode === 'scenarios' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500')}
          >
            Scenarios
          </button>
          <button
            onClick={() => { setMode('quiz'); setCurrentIndex(0); setScore(0); setShowResult(false); }}
            className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-all", mode === 'quiz' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500')}
          >
            Red Flag Quiz
          </button>
        </div>
      </div>

      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === 'scenarios' ? 'Scam Simulator' : 'Red Flag Quiz'}
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto mb-6">
          {mode === 'scenarios' 
            ? 'Can you spot the red flags? Test your knowledge and stay safe online. Look for urgency, unknown senders, and suspicious links.' 
            : 'Test your knowledge of common scam patterns and red flags. A quick quiz to build your "Scam Warrior" skills!'}
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setMode('quiz'); setCurrentIndex(0); setScore(0); setShowResult(false); }}
            className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200"
          >
            Start Red Flag Quiz
          </button>
          <button 
            onClick={() => { setMode('scenarios'); setCurrentIndex(0); setScore(0); setShowResult(false); }}
            className="bg-white text-red-600 border-2 border-red-100 px-8 py-3 rounded-2xl font-black hover:bg-red-50 transition-all"
          >
            Practice Scenarios
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="p-8 md:p-12">
          {showFinalResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                <ShieldCheck className="w-12 h-12 text-red-500 -rotate-12" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                {score === (mode === 'scenarios' ? scenarios.length : quizQuestions.length) 
                  ? 'Scam Warrior!' 
                  : score >= (mode === 'scenarios' ? scenarios.length : quizQuestions.length) / 2 
                    ? 'Safe & Smart' 
                    : 'Needs Practice'}
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                You scored <span className="text-red-600 font-black">{score}</span> out of {mode === 'scenarios' ? scenarios.length : quizQuestions.length}!
              </p>
              
              <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-left mb-10">
                <h4 className="font-black text-red-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" /> 
                  {score === (mode === 'scenarios' ? scenarios.length : quizQuestions.length) 
                    ? 'Expert Advice:' 
                    : 'Practical Tips for You:'}
                </h4>
                <ul className="space-y-3 text-red-800 text-sm font-medium">
                  {score === (mode === 'scenarios' ? scenarios.length : quizQuestions.length) ? (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        You're a pro! Help your friends and family spot these red flags too.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        Stay updated on the latest scam trends as they evolve constantly.
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        Always check the sender's email or domain name carefully.
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 shrink-0" />
                        Urgency is a common tactic to make you act without thinking.
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetSimulator}
                  className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-black transition-all shadow-xl"
                >
                  Continue & Earn XP
                </button>
                <button
                  onClick={() => {
                    const text = `I just scored ${score}/${mode === 'scenarios' ? scenarios.length : quizQuestions.length} on the KuberEdge Scam Simulator! 🛡️ Stay safe online!`;
                    if (navigator.share) {
                      navigator.share({ title: 'KuberEdge Scam Score', text }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(text);
                      alert("Score copied to clipboard!");
                    }
                  }}
                  className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-5 rounded-2xl font-black hover:bg-gray-50 transition-all"
                >
                  Share Score
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {mode === 'scenarios' ? `Scenario ${currentIndex + 1} of ${scenarios.length}` : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-red-500">Score: {score}</span>
                  <div className="flex gap-1">
                    {(mode === 'scenarios' ? scenarios : quizQuestions).map((_, i) => (
                      <div key={i} className={cn("h-1 w-6 rounded-full", i === currentIndex ? 'bg-red-500' : 'bg-gray-100')} />
                    ))}
                  </div>
                </div>
              </div>

              {mode === 'scenarios' ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">{scenario.title}</h2>
                  <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200 mb-10 relative">
                    <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-gray-300 bg-gray-50 p-1" />
                    <p className="text-xl text-gray-700 italic leading-relaxed">"{scenario.message}"</p>
                  </div>
                </>
              ) : (
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-8">{quiz.question}</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {quiz.options.map((option, i) => (
                      <button
                        key={i}
                        disabled={showResult}
                        onClick={() => handleChoice(i)}
                        className={cn(
                          "p-5 rounded-2xl border-2 text-left transition-all font-medium",
                          showResult 
                            ? i === quiz.correct 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : userChoice === i ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-50 opacity-50'
                            : 'border-gray-100 hover:border-red-200 hover:bg-red-50'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {!showResult ? (
                  mode === 'scenarios' && (
                    <motion.div
                      key="choices"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <button
                        onClick={() => handleChoice(true)}
                        className="p-6 bg-red-50 text-red-700 border-2 border-red-100 rounded-3xl font-bold hover:bg-red-100 transition-all flex flex-col items-center gap-2"
                      >
                        <ShieldAlert className="w-8 h-8" />
                        This is a Scam
                      </button>
                      <button
                        onClick={() => handleChoice(false)}
                        className="p-6 bg-green-50 text-green-700 border-2 border-green-100 rounded-3xl font-bold hover:bg-green-100 transition-all flex flex-col items-center gap-2"
                      >
                        <ShieldCheck className="w-8 h-8" />
                        This is Safe
                      </button>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-8 rounded-3xl border-2",
                      (mode === 'scenarios' ? userChoice === scenario.isScam : userChoice === quiz.correct)
                        ? 'bg-green-50 border-green-100' 
                        : 'bg-red-50 border-red-100'
                    )}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      {(mode === 'scenarios' ? userChoice === scenario.isScam : userChoice === quiz.correct) ? (
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      ) : (
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {(mode === 'scenarios' ? userChoice === scenario.isScam : userChoice === quiz.correct) ? 'Correct!' : 'Not quite!'}
                        </h3>
                        <p className="text-sm opacity-70">
                          {mode === 'scenarios' 
                            ? (scenario.isScam ? 'This was indeed a scam.' : 'This was a legitimate message.')
                            : `The correct answer was: ${quiz.options[quiz.correct]}`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Explanation
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {mode === 'scenarios' ? scenario.explanation : quiz.explanation}
                        </p>
                      </div>

                      {mode === 'scenarios' && scenario.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-bold mb-2">Red Flags to Watch For:</h4>
                          <div className="flex flex-wrap gap-2">
                            {scenario.redFlags.map((flag) => (
                              <span key={flag} className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={nextItem}
                        className="w-full p-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all"
                      >
                        {currentIndex === (mode === 'scenarios' ? scenarios.length - 1 : quizQuestions.length - 1) 
                          ? mode === 'scenarios' ? 'Start Quiz' : 'Finish Quiz' 
                          : 'Next Item'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      <div className="mt-12 p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100">
        <h3 className="text-xl font-bold text-orange-900 mb-4">Coach's Safety Rules</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Never share your OTP or PIN with anyone.",
            "Double-check URLs before clicking.",
            "If it sounds too good to be true, it is.",
            "Official apps are safer than links.",
            "Don't feel pressured by 'urgent' messages.",
            "Verify with the official source directly."
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-orange-800 text-sm">
              <div className="w-5 h-5 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0 text-orange-700 font-bold text-[10px]">
                {i + 1}
              </div>
              {rule}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
