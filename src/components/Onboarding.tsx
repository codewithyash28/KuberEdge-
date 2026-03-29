import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Currency, Mission } from '../types';
import { ChevronRight, Globe, User, BookOpen, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const countries: { name: string; currency: Currency }[] = [
  { name: 'India', currency: 'INR' },
  { name: 'United States', currency: 'USD' },
  { name: 'United Kingdom', currency: 'GBP' },
  { name: 'Europe', currency: 'EUR' },
  { name: 'Canada', currency: 'CAD' },
  { name: 'Australia', currency: 'AUD' },
];

const topics = [
  { id: 'Budgeting & Saving', title: 'Budgeting & Saving', explanation: 'Learn to track every penny, build an emergency fund, and reach your goals faster.' },
  { id: 'Debt & EMIs', title: 'Debt & EMIs', explanation: 'Understand how interest works and learn strategies to stay debt-free or pay off loans efficiently.' },
  { id: 'Online Scams & Fraud Safety', title: 'Online Scams & Fraud Safety', explanation: 'Protect your hard-earned money from phishing, fake links, and social engineering.' },
  { id: 'Basic Investing', title: 'Basic Investing', explanation: 'Discover how to make your money work for you through stocks, mutual funds, and more (educational only).' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    age: 18,
    country: 'India',
    currency: 'INR',
    topics: [],
    xp: 0,
    level: 1,
    levelTitle: 'Beginner',
    streak: 1,
    missions: [
      { id: '1', title: 'First Budget', description: 'Add your first income and expense in the Budget Canvas.', xp: 50, completed: false, type: 'budget' },
      { id: '2', title: 'Scam Spotter', description: 'Complete your first scam detection quiz.', xp: 30, completed: false, type: 'scam' },
      { id: '3', title: 'Chatbot Intro', description: 'Ask KuberEdge one financial question.', xp: 20, completed: false, type: 'coach' }
    ] as Mission[]
  });

  const steps = [
    { id: 1, title: 'About You', icon: <Globe className="w-6 h-6" /> },
    { id: 2, title: 'Identity', icon: <User className="w-6 h-6" /> },
    { id: 3, title: 'Goals', icon: <BookOpen className="w-6 h-6" /> },
    { id: 4, title: 'Ready', icon: <ChevronRight className="w-6 h-6" /> }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete({ ...profile, onboarded: true } as UserProfile);
  };

  const toggleTopic = (topicId: string) => {
    const currentTopics = profile.topics || [];
    if (currentTopics.includes(topicId)) {
      setProfile({ ...profile, topics: currentTopics.filter((t) => t !== topicId) });
    } else {
      setProfile({ ...profile, topics: [...currentTopics, topicId] });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">K</div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900">KuberEdge</h1>
            </div>
            <div className="flex gap-1.5">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                    s.id <= step ? 'bg-orange-500 w-10' : 'bg-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                {steps[step - 1].icon}
              </div>
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Step {step} of 4</span>
                <h2 className="text-xl font-bold text-gray-900">{steps[step - 1].title}</h2>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-500 text-sm mb-6">We'll set your default currency based on your country.</p>
                <div className="grid grid-cols-2 gap-3">
                  {countries.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setProfile({ ...profile, country: c.name, currency: c.currency })}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        profile.country === c.name
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-100 hover:border-orange-200'
                      }`}
                    >
                      <span className="font-bold block">{c.name}</span>
                      <span className="text-[10px] uppercase font-bold opacity-50">{c.currency}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-500 text-sm mb-6">Help us personalize your financial journey.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all font-medium"
                      placeholder="e.g. Yash"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Age ({profile.age})</label>
                    <input
                      type="range"
                      min="11"
                      max="30"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                      className="w-full accent-orange-500 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2">
                      <span>11</span>
                      <span>30+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p className="text-gray-500 text-sm mb-6">Select any topics that interest you.</p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {topics.map((topic) => (
                    <div key={topic.id} className="space-y-2">
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                          profile.topics?.includes(topic.id)
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-100 hover:border-orange-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{topic.title}</span>
                          {profile.topics?.includes(topic.id) && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {profile.topics?.includes(topic.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-2"
                          >
                            <p className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                              {topic.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-4"
              >
                <div className="w-24 h-24 bg-orange-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-12">
                  <Sparkles className="w-12 h-12 text-orange-500 -rotate-12" />
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-2">Ready to go, {profile.name}!</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  You're all set to start your financial journey with KuberEdge. Let's build some smart money habits!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleNext}
            disabled={(step === 2 && !profile.name) || (step === 3 && profile.topics?.length === 0)}
            className="w-full mt-10 p-5 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {step === 4 ? "Let's Start" : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
