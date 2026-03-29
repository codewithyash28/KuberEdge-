import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, Smartphone, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';

interface SafetyCenterProps {
  onBack: () => void;
}

const safetyRules = [
  {
    title: "The Golden Rule",
    description: "If it sounds too good to be true, it probably is. No one gives away free money or high returns without risk.",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    title: "Password Power",
    description: "Use unique, strong passwords for every financial app. Never share your OTP (One-Time Password) with anyone, even if they claim to be from the bank.",
    icon: Lock,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Public Wi-Fi Warning",
    description: "Avoid checking your bank balance or making payments on public Wi-Fi. Hackers can easily intercept your data.",
    icon: EyeOff,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    title: "Two-Factor Auth (2FA)",
    description: "Always enable 2FA on your email and banking apps. It adds an extra layer of security that's hard to break.",
    icon: Smartphone,
    color: "text-green-600",
    bgColor: "bg-green-50"
  }
];

const checklist = [
  "I never share my PIN or OTP.",
  "I use a different password for my bank and my social media.",
  "I check the 'https' and lock icon on payment websites.",
  "I don't click on random links in SMS or WhatsApp.",
  "I have 2FA enabled on my primary email."
];

export function SafetyCenter({ onBack }: SafetyCenterProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-black text-xs uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <header className="mb-12">
        <div className="w-16 h-16 bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600 mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
          Safety Center
        </h1>
        <p className="text-gray-500 text-lg font-medium max-w-2xl mb-8">
          Your money is only as safe as your habits. Follow these golden rules to stay protected in the digital world.
        </p>
        <button 
          onClick={onBack}
          className="bg-green-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center gap-2 w-fit"
        >
          I'm Ready to Stay Safe <ShieldCheck className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {safetyRules.map((rule, index) => (
          <motion.div
            key={rule.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className={`w-12 h-12 ${rule.bgColor} ${rule.color} rounded-2xl flex items-center justify-center mb-6`}>
              <rule.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3">{rule.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {rule.description}
            </p>
          </motion.div>
        ))}
      </div>

      <section className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-green-400" />
            Safety Checklist
          </h2>
          <div className="space-y-4">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <p className="text-gray-300 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 opacity-10 blur-[100px] -mr-32 -mt-32" />
      </section>

      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm font-medium">
          Need help? Report any suspicious activity to your bank immediately.
        </p>
      </div>
    </div>
  );
}
