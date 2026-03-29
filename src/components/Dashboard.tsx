import React from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { Wallet, CreditCard, ShieldAlert, MessageCircle, TrendingUp, ArrowRight, Zap, Target, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (view: string) => void;
  onShare: () => void;
}

const features = [
  {
    id: 'budget',
    title: 'Budget Canvas',
    description: 'Track income, expenses, and savings goals.',
    icon: Wallet,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  {
    id: 'debt',
    title: 'Debt Health Check',
    description: 'Manage loans and understand interest.',
    icon: CreditCard,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  {
    id: 'scam',
    title: 'Scam Simulator',
    description: 'Learn to spot and avoid online fraud.',
    icon: ShieldAlert,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
  },
  {
    id: 'safety',
    title: 'Safety Center',
    description: 'Golden rules for online money safety.',
    icon: ShieldCheck,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  {
    id: 'coach',
    title: 'AI Coach',
    description: 'Ask KuberEdge any money questions.',
    icon: MessageCircle,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50',
    textColor: 'text-orange-700',
  },
];

export function Dashboard({ profile, onNavigate, onShare }: DashboardProps) {
  const nextLevelXP = (profile.level || 1) * 500;
  const xpProgress = Math.min((profile.xp / nextLevelXP) * 100, 100);

  const firstMissions = (profile.missions || []).filter(m => ['1', '2', '3'].includes(m.id));
  const allFirstMissionsDone = firstMissions.every(m => m.completed);

  const checklist = [
    { id: 'budget', label: 'Create your first budget', completed: firstMissions.find(m => m.id === '1')?.completed },
    { id: 'scam', label: 'Take the Scam Quiz', completed: firstMissions.find(m => m.id === '2')?.completed },
    { id: 'coach', label: 'Ask the Coach one question', completed: firstMissions.find(m => m.id === '3')?.completed },
  ];

  const todayMission = {
    title: "Daily Check-in",
    description: "Review your budget for 2 minutes today.",
    xp: 10,
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <header className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-3"
          >
            Hello, {profile.name}! 👋
          </motion.h1>
          <p className="text-gray-500 text-lg font-medium">
            Welcome back to KuberEdge. You're on a <span className="text-orange-600 font-bold">{profile.streak} day streak!</span> 🔥
          </p>
          <div className="flex items-center gap-2 mt-3 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 w-fit">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Context:</span>
            <span className="text-xs font-bold text-gray-700">{profile.age} Year Old from {profile.country}</span>
            <div className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
            <span className="text-xs font-bold text-orange-600 italic">Focusing on {profile.age <= 19 ? 'Student' : 'Early Career'} Topics</span>
          </div>
          <p className="text-gray-400 text-[10px] mt-4 font-black uppercase tracking-[0.2em]">
            Designed for students and first-time earners worldwide (Ages 11–25).
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-start">
          <button
            onClick={onShare}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2 text-gray-500 hover:text-gray-900"
            title="Share Progress"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Brag</span>
          </button>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 min-w-[240px]">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Level {profile.level}</p>
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{profile.levelTitle}</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  className="h-full bg-orange-500" 
                />
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">
                {Math.max(0, nextLevelXP - profile.xp)} XP to next level
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 min-w-[160px]">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total XP</p>
              <p className="text-xl font-black text-gray-900">{profile.xp}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.button
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onNavigate(feature.id)}
            className="group relative bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all text-left overflow-hidden"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.lightColor)}>
              <feature.icon className={cn("w-6 h-6", feature.textColor)} />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight">{feature.title}</h3>
            <p className="text-gray-500 text-xs mb-6 leading-relaxed line-clamp-2">{feature.description}</p>
            <div className={cn("flex items-center gap-2 font-black text-[10px] uppercase tracking-widest", feature.textColor)}>
              {feature.id === 'budget' ? 'Plan Budget' : 
               feature.id === 'scam' ? 'Spot Scams' : 
               feature.id === 'coach' ? 'Ask Coach' : 'Explore'} <ArrowRight className="w-3 h-3" />
            </div>
            <div className={cn("absolute top-0 right-0 w-20 h-20 -mr-8 -mt-8 rounded-full opacity-10 blur-2xl", feature.color)} />
          </motion.button>
        ))}
      </div>

      {!allFirstMissionsDone && (
        <section className="mb-12">
          <div className="bg-orange-50 p-8 rounded-[3rem] border border-orange-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                First 15 Minutes Checklist
              </h3>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-orange-200">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                  {checklist.filter(c => c.completed).length}/3 Done
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {checklist.map((item, idx) => (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "p-6 rounded-3xl border-2 transition-all text-left shadow-sm group relative overflow-hidden",
                    item.completed 
                      ? "bg-green-50 border-green-200 opacity-80" 
                      : "bg-white border-orange-200 hover:border-orange-500"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                    item.completed ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  )}>
                    {item.completed ? <ShieldCheck className="w-5 h-5" /> : idx + 1}
                  </div>
                  <h4 className={cn("font-black mb-2", item.completed ? "text-green-800" : "text-gray-900")}>
                    {item.label}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {item.id === 'budget' ? 'Map out your income and expenses.' : 
                     item.id === 'scam' ? 'Learn to spot red flags.' : 'Get personalized advice.'}
                  </p>
                  {item.completed && (
                    <div className="absolute top-2 right-2">
                      <Zap className="w-4 h-4 text-green-500 fill-green-500" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-widest mb-4">
                <TrendingUp className="w-4 h-4" />
                Daily Tip
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight tracking-tight">
                The 50/30/20 Rule: A simple way to manage your {profile.currency}.
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl font-medium">
                Spend 50% on Needs, 30% on Wants, and save 20%. It's a great starting point for anyone!
              </p>
              <button
                onClick={() => onNavigate('budget')}
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-orange-900/50"
              >
                Try it now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500 opacity-20 blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 opacity-20 blur-[120px] -ml-40 -mb-40" />
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Target className="w-7 h-7 text-orange-500" />
                Active Missions
              </h3>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {(profile.missions || []).filter(m => m.completed).length}/{(profile.missions || []).length} Completed
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(!profile.missions || profile.missions.length === 0) ? (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Target className="w-8 h-8 text-gray-300" />
                  </div>
                  <h4 className="font-black text-gray-900 mb-2">No missions yet!</h4>
                  <p className="text-sm text-gray-500 mb-6 font-medium">Start your journey by exploring the features below.</p>
                  <button 
                    onClick={() => onNavigate('budget')}
                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-black transition-all shadow-lg"
                  >
                    Start your first mission
                  </button>
                </div>
              ) : (
                profile.missions.map((mission) => (
                  <motion.div 
                    key={mission.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-6 rounded-[2rem] border-2 transition-all relative overflow-hidden group",
                      mission.completed 
                        ? "bg-green-50 border-green-100 opacity-60" 
                        : "bg-white border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-md"
                    )}
                  >
                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <h4 className="font-black text-gray-900">{mission.title}</h4>
                      <span className="text-[10px] font-black bg-orange-100 px-2 py-1 rounded-lg text-orange-600 border border-orange-200">
                        +{mission.xp} XP
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 relative z-10">{mission.description}</p>
                    {mission.completed ? (
                      <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest relative z-10">
                        <ShieldCheck className="w-4 h-4" /> Completed
                      </div>
                    ) : (
                      <button 
                        onClick={() => onNavigate(mission.type)}
                        className="flex items-center gap-1 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:gap-2 transition-all relative z-10"
                      >
                        Go to Task <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                    {!mission.completed && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500 opacity-0 group-hover:opacity-5 blur-xl transition-opacity" />
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Zap className="w-7 h-7 text-orange-500" />
                Today's Mission
              </h3>
              <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                +{todayMission.xp} XP
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-orange-500 transition-all" onClick={() => onNavigate('budget')}>
              <div>
                <h4 className="font-black text-gray-900 mb-1">{todayMission.title}</h4>
                <p className="text-xs text-gray-500 font-medium">{todayMission.description}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-black tracking-tight mb-8">Your Progress</h3>
            <div className="space-y-8">
              {(profile.topics || []).map((topic) => {
                const typeMap: Record<string, string> = {
                  'Budgeting & Saving': 'budget',
                  'Debt & EMIs': 'debt',
                  'Online Scams & Fraud Safety': 'scam',
                  'Basic Investing': 'coach'
                };
                const type = typeMap[topic];
                const missionsOfType = (profile.missions || []).filter(m => m.type === type);
                const completedCount = missionsOfType.filter(m => m.completed).length;
                const progress = missionsOfType.length > 0 
                  ? Math.round((completedCount / missionsOfType.length) * 100) 
                  : 0;

                return (
                  <div key={topic}>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3">
                      <span className="text-gray-700">{topic}</span>
                      <span className="text-orange-500">{progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-orange-500" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 p-6 bg-orange-50 rounded-[2rem] border border-orange-100 relative overflow-hidden">
              <p className="text-sm text-orange-800 font-bold leading-relaxed relative z-10">
                "The best time to start saving was yesterday. The second best time is today!"
              </p>
              <Sparkles className="absolute -right-2 -bottom-2 w-12 h-12 text-orange-200 opacity-50" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
