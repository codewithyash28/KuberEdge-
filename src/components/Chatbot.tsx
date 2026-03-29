import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, BudgetItem } from '../types';
import { MessageCircle, Send, ArrowLeft, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { getCoachResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface ChatbotProps {
  profile: UserProfile;
  budgetItems: BudgetItem[];
  onBack: () => void;
  awardXP: (amount: number, missionId?: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: Date;
}

export function Chatbot({ profile, budgetItems, onBack, awardXP }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'coach',
      text: `Hi ${profile.name}! I'm KuberEdge, your financial literacy chatbot. How can I help you today? You can ask me about budgeting, saving, debt, or how to spot scams!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Award XP for first question
    if (messages.length === 1) {
      awardXP(50, '3');
    } else {
      awardXP(5);
    }

    const response = await getCoachResponse(input, profile, budgetItems);

    const coachMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'coach',
      text: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, coachMessage]);
    setIsLoading(false);
  };

  const suggestedQuestions = useMemo(() => {
    const base = [
      "How should I start budgeting?",
      "What is the 50/30/20 rule?",
    ];
    const topicBased: Record<string, string[]> = {
      'Budgeting & Saving': ["How do I build an emergency fund?", "How can I save for a big goal?"],
      'Debt & EMIs': ["What is an EMI?", "How can I avoid high-interest debt?"],
      'Online Scams & Fraud Safety': ["How can I spot a phishing scam?", "Is it safe to share my OTP?"],
      'Basic Investing': ["What are mutual funds?", "How does the stock market work?"],
    };

    const added: string[] = [];
    (profile.topics || []).forEach(topic => {
      if (topicBased[topic]) added.push(...topicBased[topic]);
    });

    return [...base, ...added].slice(0, 4);
  }, [profile.topics]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">KuberEdge Chatbot</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col">
        <div className="p-8 bg-orange-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2">Financial Guidance, Simplified.</h2>
            <p className="text-orange-200 text-xs font-medium mb-4">Ask me about budgeting, saving, debt, or how to spot scams! I'm here to help you build smart money habits.</p>
            <button 
              onClick={() => setInput("Give me a personalized saving tip based on my budget.")}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 w-fit"
            >
              <Sparkles className="w-3 h-3" /> Get Personalized Tip
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 opacity-20 blur-2xl -mr-16 -mt-16" />
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth">
          {messages.length === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-2xl text-left text-xs font-bold text-orange-700 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  message.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0",
                  message.role === 'user' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
                )}>
                  {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-5 rounded-[2rem] text-sm leading-relaxed",
                  message.role === 'user' 
                    ? 'bg-gray-900 text-white rounded-tr-none' 
                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                )}>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <p className={cn(
                    "text-[10px] mt-2 opacity-40 font-bold uppercase tracking-widest",
                    message.role === 'user' ? 'text-right' : 'text-left'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mr-auto"
              >
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-gray-50 p-5 rounded-[2rem] rounded-tl-none border border-gray-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                  <span className="text-sm text-gray-400 font-medium">KuberEdge Chatbot is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about money..."
              className="flex-1 p-5 rounded-3xl border-2 border-white bg-white shadow-sm focus:border-orange-500 outline-none transition-all pr-16"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-4 uppercase font-bold tracking-widest">
            This is general education, not personal financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}
