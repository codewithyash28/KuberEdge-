import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, DebtItem } from '../types';
import { Plus, Trash2, CreditCard, Calendar, TrendingUp, Info, ArrowLeft } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

interface DebtHealthCheckProps {
  profile: UserProfile;
  onBack: () => void;
  awardXP: (amount: number, missionId?: string) => void;
}

export function DebtHealthCheck({ profile, onBack, awardXP }: DebtHealthCheckProps) {
  const [debts, setDebts] = useState<DebtItem[]>([]);
  const [newDebt, setNewDebt] = useState<Partial<DebtItem>>({ label: '', amount: 0, interestRate: 0, duration: 12 });

  const addDebt = () => {
    if (newDebt.label && newDebt.amount && newDebt.amount > 0) {
      setDebts([...debts, { ...newDebt, id: Date.now().toString() } as DebtItem]);
      setNewDebt({ label: '', amount: 0, interestRate: 0, duration: 12 });
      
      if (debts.length === 0) {
        awardXP(100, '4');
      } else {
        awardXP(20);
      }
    }
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const calculateEMI = (amount: number, rate: number, duration: number) => {
    const monthlyRate = rate / 12 / 100;
    if (monthlyRate === 0) return amount / duration;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    return emi;
  };

  const totalMonthlyEMI = useMemo(() => {
    return debts.reduce((acc, d) => acc + calculateEMI(d.amount, d.interestRate, d.duration), 0);
  }, [debts]);

  const totalInterest = useMemo(() => {
    return debts.reduce((acc, d) => {
      const emi = calculateEMI(d.amount, d.interestRate, d.duration);
      const totalPaid = emi * d.duration;
      return acc + (totalPaid - d.amount);
    }, 0);
  }, [debts]);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">Debt Health Check</h1>
        <p className="text-gray-500 font-medium">Understand your loans, calculate EMIs, and learn strategies to stay debt-free.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-purple-500" /> Add Loan / EMI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Loan Label (e.g. Student Loan, Phone EMI)"
                value={newDebt.label}
                onChange={(e) => setNewDebt({ ...newDebt, label: e.target.value })}
                className="md:col-span-2 p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none transition-all"
              />
              <div className="relative">
                <input
                  type="number"
                  placeholder="Loan Amount"
                  value={newDebt.amount || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{profile.currency}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={newDebt.interestRate || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: parseFloat(e.target.value) || 0 })}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Duration (Months)"
                  value={newDebt.duration || ''}
                  onChange={(e) => setNewDebt({ ...newDebt, duration: parseInt(e.target.value) || 0 })}
                  className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-purple-500 outline-none transition-all pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Mo</span>
              </div>
            </div>
            <button
              onClick={addDebt}
              className="w-full mt-4 p-4 bg-purple-500 text-white rounded-2xl font-bold hover:bg-purple-600 transition-all"
            >
              Add Debt
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {debts.map((debt) => {
                const emi = calculateEMI(debt.amount, debt.interestRate, debt.duration);
                const totalPaid = emi * debt.duration;
                const interest = totalPaid - debt.amount;
                return (
                  <motion.div
                    key={debt.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{debt.label}</h3>
                          <p className="text-sm text-gray-400">{debt.interestRate}% interest for {debt.duration} months</p>
                        </div>
                      </div>
                      <button onClick={() => removeDebt(debt.id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Monthly EMI</p>
                        <p className="text-lg font-bold text-purple-600">{formatCurrency(emi, profile.currency)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Interest</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(interest, profile.currency)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Repayment</p>
                        <p className="text-lg font-bold text-gray-900">{formatCurrency(totalPaid, profile.currency)}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {debts.length > 0 && (
            <div className="bg-gray-900 text-white p-10 rounded-[3rem] relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-orange-400" />
                  What-If Scenario
                </h3>
                <p className="text-gray-400 mb-8 max-w-xl">
                  What if you paid an extra <span className="text-white font-bold">{formatCurrency(1000, profile.currency)}</span> every month?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Interest Saved</p>
                    <p className="text-2xl font-bold text-green-400">~ {formatCurrency(totalInterest * 0.15, profile.currency)}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Time Saved</p>
                    <p className="text-2xl font-bold text-blue-400">~ 3 Months</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-8">Debt Health Summary</h3>
            <div className="space-y-6 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Monthly EMI</span>
                <span className="text-2xl font-bold text-purple-600">{formatCurrency(totalMonthlyEMI, profile.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Interest Payable</span>
                <span className="text-2xl font-bold text-red-500">{formatCurrency(totalInterest, profile.currency)}</span>
              </div>
            </div>

            <div className="p-6 bg-purple-50 rounded-3xl border border-purple-100 mb-6">
              <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Snowball Strategy
              </h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                Pay off your smallest loan first while making minimum payments on others. It builds momentum!
              </p>
            </div>

            <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" /> Avalanche Strategy
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Pay off the loan with the highest interest rate first. This saves you the most money in the long run!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
