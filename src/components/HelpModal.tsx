import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, BookOpen, Target, ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const faqs = [
    {
      icon: <Target className="w-5 h-5 text-orange-500" />,
      q: "What is XP and how do I level up?",
      a: "XP (Experience Points) are earned by completing missions like creating a budget or taking a scam quiz. As you earn XP, you'll level up from Beginner to Expert!"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      q: "How do I use the Budget Canvas?",
      a: "Start by adding your Income. Then add Fixed Expenses (like rent or subscriptions) and Variable Expenses (like food or fun). The canvas helps you see exactly where your money goes."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-red-500" />,
      q: "Is KuberEdge giving financial advice?",
      a: "No. KuberEdge is an educational tool designed to teach financial literacy. All information is for general education purposes. Always consult a professional for specific financial decisions."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-green-500" />,
      q: "Who is the AI Coach?",
      a: "The AI Coach is powered by Gemini. It's trained to help young people understand money concepts in simple, friendly language. Ask it anything about saving, debt, or scams!"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      q: "How often should I use the app?",
      a: "We recommend checking in at least once a week to update your budget and complete a new mission. Daily check-ins help you build a strong money-saving streak!"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">How KuberEdge Works</h2>
                    <p className="text-sm text-gray-500 font-medium">Your 5-minute guide to financial mastery.</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                  <h3 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-3">The KuberEdge Loop</h3>
                  <div className="flex flex-wrap gap-4 items-center text-sm font-bold text-orange-700">
                    <span>1. Budget</span>
                    <span className="text-orange-300">→</span>
                    <span>2. Quiz</span>
                    <span className="text-orange-300">→</span>
                    <span>3. Coach</span>
                    <span className="text-orange-300">→</span>
                    <span>4. Level Up!</span>
                  </div>
                </div>

                <div className="grid gap-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="shrink-0 mt-1">{faq.icon}</div>
                      <div>
                        <h4 className="font-black text-gray-900 mb-1">{faq.q}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-gray-800 transition-all"
                >
                  Got it, let's go!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
