/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { BudgetCanvas } from './components/BudgetCanvas';
import { DebtHealthCheck } from './components/DebtHealthCheck';
import { ScamSimulator } from './components/ScamSimulator';
import { AICoach } from './components/AICoach';
import { SafetyCenter } from './components/SafetyCenter';
import { UserProfile, BudgetItem, Mission } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';

import confetti from 'canvas-confetti';
import { HelpModal } from './components/HelpModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [view, setView] = useState<string>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [completedMission, setCompletedMission] = useState<{ title: string; xp: number } | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('kuberedge_profile');
    const savedBudget = localStorage.getItem('kuberedge_budget');
    if (savedProfile) {
      let profile = JSON.parse(savedProfile);
      // Migration: Ensure numeric level and levelTitle
      if (typeof profile.level === 'string' || profile.level === undefined || isNaN(profile.level)) {
        profile.levelTitle = profile.levelTitle || 'Beginner';
        profile.level = 1;
      }
      if (profile.xp === undefined || isNaN(profile.xp)) {
        profile.xp = 0;
      }
      // Migration: Ensure missions exist
      if (!profile.missions || profile.missions.length === 0) {
        const initialMissions: Mission[] = [
          { id: '1', title: 'First Budget', description: 'Add your first income and expense in the Budget Canvas.', xp: 50, completed: false, type: 'budget' },
          { id: '2', title: 'Scam Spotter', description: 'Complete your first scam detection quiz.', xp: 30, completed: false, type: 'scam' },
          { id: '3', title: 'Ask the Coach', description: 'Ask KuberEdge one financial question.', xp: 20, completed: false, type: 'coach' }
        ];
        profile.missions = initialMissions;
      }
      setProfile(profile);
    }
    if (savedBudget) {
      setBudgetItems(JSON.parse(savedBudget));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (completedMission) {
      const timer = setTimeout(() => setCompletedMission(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [completedMission]);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('kuberedge_profile', JSON.stringify(newProfile));
  };

  const handleUpdateBudget = (items: BudgetItem[]) => {
    setBudgetItems(items);
    localStorage.setItem('kuberedge_budget', JSON.stringify(items));
  };

  const awardXP = (amount: number, missionId?: string) => {
    if (!profile) return;
    
    let newXP = profile.xp + amount;
    let newLevel = profile.level || 1;
    let newLevelTitle = profile.levelTitle || 'Beginner';
    
    // Level up logic: Level 1 -> 500, Level 2 -> 1000, etc.
    let levelThreshold = newLevel * 500;
    while (newXP >= levelThreshold) {
      newLevel += 1;
      levelThreshold = newLevel * 500;
    }

    // Dynamic Level Titles
    if (newLevel >= 10) newLevelTitle = 'Financial Guru';
    else if (newLevel >= 7) newLevelTitle = 'Money Master';
    else if (newLevel >= 5) newLevelTitle = 'Expert Saver';
    else if (newLevel >= 3) newLevelTitle = 'Pro Learner';
    else if (newLevel >= 2) newLevelTitle = 'Rising Star';
    else newLevelTitle = 'Beginner';

    const currentMissions = profile.missions || [];
    let newMissions = [...currentMissions];
    if (missionId) {
      const missionIndex = newMissions.findIndex(m => m.id === missionId);
      if (missionIndex !== -1 && !newMissions[missionIndex].completed) {
        newMissions[missionIndex] = { ...newMissions[missionIndex], completed: true };
        // Bonus XP for mission completion
        newXP += 100;
        setCompletedMission({ title: newMissions[missionIndex].title, xp: newMissions[missionIndex].xp + 100 });
        
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#3b82f6', '#10b981']
        });

        // Check if all missions are completed to unlock next tier
        if (newMissions.every(m => m.completed) && !newMissions.some(m => m.id === '4')) {
          const nextTierMissions: Mission[] = [
            { id: '4', title: 'Debt Buster', description: 'Calculate your first EMI in the Debt Health Check.', xp: 100, completed: false, type: 'debt' },
            { id: '5', title: 'Savings Goal', description: 'Add a savings goal item to your budget.', xp: 80, completed: false, type: 'budget' },
            { id: '6', title: 'Scam Expert', description: 'Complete 3 scam scenarios without a mistake.', xp: 120, completed: false, type: 'scam' }
          ];
          newMissions = [...newMissions, ...nextTierMissions];
        }
      }
    }

    const updatedProfile = {
      ...profile,
      xp: newXP,
      level: newLevel,
      levelTitle: newLevelTitle,
      nextLevelXP: newLevel * 500,
      missions: newMissions,
      lastActiveDate: new Date().toISOString()
    };

    setProfile(updatedProfile);
    localStorage.setItem('kuberedge_profile', JSON.stringify(updatedProfile));
  };

  const shareProgress = () => {
    if (!profile) return;
    const text = `I'm leveling up my money game on KuberEdge! I'm a Level ${profile.level} ${profile.levelTitle} with a ${profile.streak} day streak. Check it out!`;
    if (navigator.share) {
      navigator.share({
        title: 'KuberEdge Progress',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert('Progress copied to clipboard!');
    }
  };

  if (!isLoaded) return null;

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setView('dashboard')}
            className="text-2xl font-black tracking-tighter text-gray-900 hover:text-orange-500 transition-colors flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white text-lg">K</div>
            KuberEdge
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors flex items-center gap-1"
            >
              How it works?
            </button>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">{profile.streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-2xl border border-gray-200">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">User:</span>
                <span className="text-sm font-bold text-gray-700">{profile.name}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('kuberedge_profile');
                localStorage.removeItem('kuberedge_budget');
                setProfile(null);
                setBudgetItems([]);
                setView('dashboard');
              }}
              className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-20">
        <AnimatePresence>
          {completedMission && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-8 py-6 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-6 min-w-[320px]"
            >
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Trophy className="w-8 h-8" />
                </motion.div>
              </div>
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">Mission Completed!</p>
                <h4 className="text-lg font-black leading-tight mb-1">{completedMission.title}</h4>
                <p className="text-xs text-gray-400 font-bold">+{completedMission.xp} XP Earned</p>
              </div>
              <button 
                onClick={() => setCompletedMission(null)}
                className="ml-auto w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                &times;
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {view === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard profile={profile} onNavigate={setView} onShare={shareProgress} />
            </motion.div>
          )}
          {view === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <BudgetCanvas profile={profile} initialItems={budgetItems} onUpdate={handleUpdateBudget} onBack={() => setView('dashboard')} awardXP={awardXP} />
            </motion.div>
          )}
          {view === 'debt' && (
            <motion.div
              key="debt"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DebtHealthCheck profile={profile} onBack={() => setView('dashboard')} awardXP={awardXP} />
            </motion.div>
          )}
          {view === 'scam' && (
            <motion.div
              key="scam"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ScamSimulator profile={profile} onBack={() => setView('dashboard')} awardXP={awardXP} />
            </motion.div>
          )}
          {view === 'safety' && (
            <motion.div
              key="safety"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SafetyCenter onBack={() => setView('dashboard')} />
            </motion.div>
          )}
          {view === 'coach' && (
            <motion.div
              key="coach"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AICoach profile={profile} budgetItems={budgetItems} onBack={() => setView('dashboard')} awardXP={awardXP} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm font-medium">
          &copy; 2025 KuberEdge. Empowering the next generation of financial leaders.
        </p>
        <p className="text-gray-300 text-[10px] uppercase font-bold tracking-[0.2em] mt-2">
          General Education &bull; Not Financial Advice &bull; Safe & Smart
        </p>
      </footer>
    </div>
  );
}

