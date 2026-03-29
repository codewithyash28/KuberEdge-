import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, BudgetItem } from '../types';
import { Plus, Trash2, PieChart, Wallet, ShoppingBag, Target, ArrowLeft, BarChart3, MessageSquare, LayoutTemplate, Info, Sparkles } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';

interface BudgetCanvasProps {
  profile: UserProfile;
  initialItems: BudgetItem[];
  onUpdate: (items: BudgetItem[]) => void;
  onBack: () => void;
  awardXP: (amount: number, missionId?: string) => void;
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'];

const variableSubCategories = [
  'Groceries',
  'Dining Out',
  'Transport',
  'Entertainment',
  'Health',
  'Shopping',
  'Other'
];

const quickAddItems = [
  { label: 'Pocket Money', amount: 1000, type: 'income' as const },
  { label: 'Rent/Tuition', amount: 5000, type: 'fixed' as const },
  { label: 'Phone Bill', amount: 500, type: 'fixed' as const },
  { label: 'Groceries', amount: 2000, type: 'variable' as const, subCategory: 'Groceries' },
  { label: 'Dining Out', amount: 1000, type: 'variable' as const, subCategory: 'Dining Out' },
  { label: 'Transport', amount: 800, type: 'variable' as const, subCategory: 'Transport' },
  { label: 'Emergency Fund', amount: 500, type: 'goal' as const },
];

const budgetTemplates = [
  {
    name: "Student Starter",
    description: "Perfect for students managing pocket money or part-time earnings.",
    items: [
      { id: 't1', type: 'income' as const, label: 'Pocket Money / Allowance', amount: 2000 },
      { id: 't2', type: 'fixed' as const, label: 'Phone & Internet', amount: 400 },
      { id: 't3', type: 'variable' as const, label: 'Canteen & Snacks', subCategory: 'Dining Out', amount: 600 },
      { id: 't4', type: 'variable' as const, label: 'Bus / Metro Pass', subCategory: 'Transport', amount: 300 },
      { id: 't5', type: 'variable' as const, label: 'Movie / Gaming', subCategory: 'Entertainment', amount: 400 },
      { id: 't6', type: 'goal' as const, label: 'New Laptop Fund', amount: 300 },
    ]
  },
  {
    name: "First Salary (India)",
    description: "A balanced 50/30/20 approach for new earners.",
    items: [
      { id: 't1', type: 'income' as const, label: 'Monthly Salary', amount: 40000 },
      { id: 't2', type: 'fixed' as const, label: 'Rent/PG', amount: 12000 },
      { id: 't3', type: 'fixed' as const, label: 'Electricity/Water', amount: 1500 },
      { id: 't4', type: 'variable' as const, label: 'Groceries (BigBasket)', subCategory: 'Groceries', amount: 6000 },
      { id: 't5', type: 'variable' as const, label: 'Zomato/Swiggy', subCategory: 'Dining Out', amount: 4000 },
      { id: 't6', type: 'variable' as const, label: 'Uber/Auto', subCategory: 'Transport', amount: 3000 },
      { id: 't7', type: 'goal' as const, label: 'Emergency Fund', amount: 8000 },
    ]
  }
];

const explainers = {
  'fixed': "Fixed Expenses are bills that stay the same every month, like rent or a phone plan. You MUST pay these first!",
  'variable': "Variable Expenses change based on your choices, like eating out or shopping. This is where you can save the most!",
  'goal': "Goals are for your future self. Saving even a small amount every month builds a massive habit!",
  '503020': "The 50/30/20 rule: 50% for Needs (Fixed), 30% for Wants (Variable), and 20% for Savings (Goals)."
};

export function BudgetCanvas({ profile, initialItems, onUpdate, onBack, awardXP }: BudgetCanvasProps) {
  const [items, setItems] = useState<BudgetItem[]>(initialItems.length > 0 ? initialItems : [
    { id: '1', type: 'income', label: 'Pocket Money / Salary', amount: 0 },
  ]);
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({ type: 'variable', label: '', amount: 0, subCategory: 'Groceries' });
  const [showCoachIntro, setShowCoachIntro] = useState(initialItems.length === 0);
  const [activeExplainer, setActiveExplainer] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [previousTotals, setPreviousTotals] = useState<{ income: number, totalExpenses: number } | null>(() => {
    const saved = localStorage.getItem('kuber_budget_history');
    return saved ? JSON.parse(saved) : null;
  });

  const totals = useMemo(() => {
    const income = items.filter((i) => i.type === 'income').reduce((acc, i) => acc + i.amount, 0);
    const fixed = items.filter((i) => i.type === 'fixed').reduce((acc, i) => acc + i.amount, 0);
    const variable = items.filter((i) => i.type === 'variable').reduce((acc, i) => acc + i.amount, 0);
    const goals = items.filter((i) => i.type === 'goal').reduce((acc, i) => acc + i.amount, 0);
    const totalExpenses = fixed + variable + goals;
    const remaining = income - totalExpenses;
    
    const needsPercent = income > 0 ? Math.round((fixed / income) * 100) : 0;
    const wantsPercent = income > 0 ? Math.round((variable / income) * 100) : 0;
    const savingsPercent = income > 0 ? Math.round((goals / income) * 100) : 0;
    const remainingPercent = income > 0 ? Math.round((remaining / income) * 100) : 0;

    return { income, fixed, variable, goals, totalExpenses, remaining, needsPercent, wantsPercent, savingsPercent, remainingPercent };
  }, [items]);

  const saveSnapshot = () => {
    const snapshot = { income: totals.income, totalExpenses: totals.totalExpenses };
    localStorage.setItem('kuber_budget_history', JSON.stringify(snapshot));
    setPreviousTotals(snapshot);
    awardXP(20);
  };

  const barData = useMemo(() => [
    { name: 'Income', amount: totals.income, fill: '#10b981' },
    { name: 'Fixed', amount: totals.fixed, fill: '#3b82f6' },
    { name: 'Variable', amount: totals.variable, fill: '#f59e0b' },
    { name: 'Goals', amount: totals.goals, fill: '#8b5cf6' },
  ], [totals]);

  const addItem = (item?: Partial<BudgetItem>) => {
    const itemToAdd = item || newItem;
    if (itemToAdd.label && itemToAdd.amount && itemToAdd.amount > 0) {
      const updatedItems = [...items, { ...itemToAdd, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) } as BudgetItem];
      setItems(updatedItems);
      onUpdate(updatedItems);
      
      // Award XP
      if (items.length === 1) {
        awardXP(100, 'first-budget');
      } else {
        awardXP(10);
      }

      if (!item) setNewItem({ type: 'variable', label: '', amount: 0, subCategory: 'Groceries' });
    }
  };

  const applyTemplate = (templateItems: BudgetItem[]) => {
    const newItems = templateItems.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
    }));
    setItems(newItems);
    onUpdate(newItems);
    awardXP(50);
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((i) => i.id !== id);
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const updateAmount = (id: string, amount: number) => {
    const updatedItems = items.map((i) => (i.id === id ? { ...i, amount } : i));
    setItems(updatedItems);
    onUpdate(updatedItems);
  };

  const resetBudget = () => {
    const defaultItems = [
      { id: '1', type: 'income' as const, label: 'Pocket Money / Salary', amount: 0 },
    ];
    setItems(defaultItems);
    onUpdate(defaultItems);
  };

  const pieData = useMemo(() => [
    { name: 'Fixed', value: totals.fixed },
    { name: 'Variable', value: totals.variable },
    { name: 'Goals', value: totals.goals },
    { name: 'Remaining', value: Math.max(0, totals.remaining) },
  ].filter(d => d.value > 0), [totals]);

  const ageContext = useMemo(() => {
    if (profile.age <= 15) return "Focus on pocket money, small savings, and basic needs.";
    if (profile.age <= 19) return "Focus on part-time jobs, student expenses, and saving for college/gadgets.";
    return "Focus on salary, rent, EMIs, and long-term financial goals.";
  }, [profile.age]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="text-right">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Personalized for {profile.age} Year Old</p>
          <p className="text-xs text-gray-400 font-medium italic">{ageContext}</p>
        </div>
      </div>

      <AnimatePresence>
        {showCoachIntro && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 text-white p-10 rounded-[3rem] mb-12 relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                <Sparkles className="w-5 h-5" />
                Budgeting 101
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                Map your money, <br />own your future.
              </h2>
              <p className="text-gray-400 text-xl mb-10 max-w-2xl font-medium leading-relaxed">
                {profile.age <= 19 
                  ? "Learn to manage your allowance or part-time pay. Track every penny, set goals, and see exactly where your money goes."
                  : "Master your salary and expenses. Track every penny, set goals, and see exactly where your money goes."}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const studentTemplate = budgetTemplates.find(t => t.name === "Student Starter");
                    if (studentTemplate) applyTemplate(studentTemplate.items);
                    setShowCoachIntro(false);
                  }}
                  className="bg-orange-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl shadow-orange-900/40"
                >
                  Use Student Starter <LayoutTemplate className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowCoachIntro(false)}
                  className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black hover:bg-white/20 transition-all border border-white/10"
                >
                  Start from Scratch
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500 opacity-20 blur-[150px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-10 blur-[150px] -ml-48 -mb-48" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="mb-8 p-6 bg-orange-50 rounded-[2rem] border border-orange-100">
              <div className="flex items-center gap-2 mb-4">
                <LayoutTemplate className="w-5 h-5 text-orange-600" />
                <h3 className="font-black text-orange-900 uppercase text-xs tracking-widest">Budget Templates</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template.items)}
                    className="p-4 bg-white hover:bg-orange-100 border border-orange-200 rounded-2xl text-left transition-all group"
                  >
                    <p className="font-black text-gray-900 group-hover:text-orange-700">{template.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-orange-500" /> Add to Budget
            </h2>
            
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Add Common Items</p>
              <div className="flex flex-wrap gap-2">
                {quickAddItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => addItem(item)}
                    className="px-4 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-xl text-xs font-bold text-gray-600 hover:text-orange-700 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                className="p-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all"
              >
                <option value="income">Income</option>
                <option value="fixed">Fixed Expense</option>
                <option value="variable">Variable Expense</option>
                <option value="goal">Goal</option>
              </select>
              {newItem.type === 'variable' && (
                <select
                  value={newItem.subCategory}
                  onChange={(e) => setNewItem({ ...newItem, subCategory: e.target.value })}
                  className="p-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all"
                >
                  {variableSubCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}
              <input
                type="text"
                placeholder="Label (e.g. Salary, Rent, Food)"
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                className={cn("p-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all", newItem.type !== 'variable' ? 'md:col-span-2' : '')}
              />
              <div className="relative">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newItem.amount || ''}
                  onChange={(e) => setNewItem({ ...newItem, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-none transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{profile.currency}</span>
              </div>
            </div>
            <button
              onClick={() => addItem()}
              className="w-full p-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      item.type === 'income' ? 'bg-green-100 text-green-600' :
                      item.type === 'fixed' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'variable' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-purple-100 text-purple-600'
                    )}>
                      {item.type === 'income' ? <Wallet className="w-6 h-6" /> :
                       item.type === 'fixed' ? <PieChart className="w-6 h-6" /> :
                       item.type === 'variable' ? <ShoppingBag className="w-6 h-6" /> :
                       <Target className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                        {item.type} {item.subCategory ? `• ${item.subCategory}` : ''}
                      </p>
                      <p className="font-bold text-gray-800">{item.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateAmount(item.id, parseFloat(e.target.value) || 0)}
                        className="w-32 p-3 rounded-xl border-2 border-gray-50 focus:border-orange-500 outline-none text-right font-bold pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">{profile.currency}</span>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-8">Budget Summary</h3>
            
            <div className="space-y-6 mb-10">
              {previousTotals && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Trend vs Last Save</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold">
                      Income: <span className={cn(totals.income >= previousTotals.income ? 'text-green-600' : 'text-red-600')}>
                        {totals.income >= previousTotals.income ? '+' : ''}{formatCurrency(totals.income - previousTotals.income, profile.currency)}
                      </span>
                    </div>
                    <div className="text-xs font-bold">
                      Spending: <span className={cn(totals.totalExpenses <= previousTotals.totalExpenses ? 'text-green-600' : 'text-red-600')}>
                        {totals.totalExpenses > previousTotals.totalExpenses ? '+' : ''}{formatCurrency(totals.totalExpenses - previousTotals.totalExpenses, profile.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center group relative">
                <span className="text-gray-500 flex items-center gap-1">
                  Total Income
                  <Info className="w-3 h-3 text-gray-300 cursor-help" onMouseEnter={() => setActiveExplainer('income')} onMouseLeave={() => setActiveExplainer(null)} />
                </span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(totals.income, profile.currency)}</span>
                {activeExplainer === 'income' && (
                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[10px] rounded-xl z-50 w-48 shadow-xl">
                    Your total earnings before any spending.
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center group relative">
                <span className="text-gray-500 flex items-center gap-1">
                  Fixed Expenses
                  <Info className="w-3 h-3 text-gray-300 cursor-help" onMouseEnter={() => setActiveExplainer('fixed')} onMouseLeave={() => setActiveExplainer(null)} />
                </span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(totals.fixed, profile.currency)}</span>
                {activeExplainer === 'fixed' && (
                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[10px] rounded-xl z-50 w-48 shadow-xl">
                    {explainers.fixed}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center group relative">
                <span className="text-gray-500 flex items-center gap-1">
                  Variable Expenses
                  <Info className="w-3 h-3 text-gray-300 cursor-help" onMouseEnter={() => setActiveExplainer('variable')} onMouseLeave={() => setActiveExplainer(null)} />
                </span>
                <span className="text-2xl font-bold text-orange-500">{formatCurrency(totals.variable, profile.currency)}</span>
                {activeExplainer === 'variable' && (
                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[10px] rounded-xl z-50 w-48 shadow-xl">
                    {explainers.variable}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center group relative">
                <span className="text-gray-500 flex items-center gap-1">
                  Savings Goals
                  <Info className="w-3 h-3 text-gray-300 cursor-help" onMouseEnter={() => setActiveExplainer('goal')} onMouseLeave={() => setActiveExplainer(null)} />
                </span>
                <span className="text-2xl font-bold text-purple-600">{formatCurrency(totals.goals, profile.currency)}</span>
                {activeExplainer === 'goal' && (
                  <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[10px] rounded-xl z-50 w-48 shadow-xl">
                    {explainers.goal}
                  </div>
                )}
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">Remaining</span>
                <span className={cn("text-3xl font-bold", totals.remaining >= 0 ? 'text-blue-600' : 'text-red-600')}>
                  {formatCurrency(totals.remaining, profile.currency)}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={saveSnapshot}
                className="w-full py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-orange-400" /> Save Snapshot
              </button>
            </div>

            <div className="space-y-10">
              {pieData.length > 0 && (
                <div className="h-64 w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Expense Distribution</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {totals.income > 0 && (
                <div className="h-64 w-full">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Budget Comparison</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: 'transparent' }} />
                      <ReferenceLine y={totals.income} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Income Limit', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" /> Reset Budget
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { resetBudget(); setShowResetConfirm(false); }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Coach Tip</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                {totals.remaining < 0 
                  ? "Your expenses are higher than your income. Try to reduce your variable expenses or set smaller goals for now!"
                  : "Great job! You have some money left over. Consider putting it into your 'Emergency Fund' goal!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
