
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { DataService, MOCK_ACHIEVEMENTS } from '../services/dataService';
import { Trophy, Star, Target, Zap, Lock, Check, Flame, Award } from 'lucide-react';
import { Habit } from '../types';

const Achievements = () => {
  const { currentUser } = useApp();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    DataService.getHabits(currentUser.id).then(setHabits);
  }, [currentUser.id]);

  const toggleHabit = async (id: string) => {
    const habitToUpdate = habits.find(h => h.id === id);
    if (!habitToUpdate) return;

    // Optimistic Update
    const updatedHabit = { ...habitToUpdate, streak: habitToUpdate.streak + 1 };
    setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));

    await DataService.updateHabit(updatedHabit);
  };

  const nextLevelXp = 3000;
  const currentXp = currentUser.xp || 2450;
  const progressPercent = (currentXp / nextLevelXp) * 100;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
            <Trophy size={200} />
         </div>
         <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold border border-white/30">
                  {currentUser.level}
               </div>
               <div>
                  <h1 className="text-3xl font-bold">Level {currentUser.level} Scholar</h1>
                  <p className="text-indigo-200">Keep going! You are doing great.</p>
               </div>
            </div>
            
            <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
               <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>{currentXp} XP</span>
                  <span className="opacity-70">{nextLevelXp} XP</span>
               </div>
               <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${progressPercent}%` }}></div>
               </div>
               <p className="text-xs mt-2 text-indigo-200 text-center">
                 {nextLevelXp - currentXp} XP needed for Level {currentUser.level! + 1}
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <Target className="text-indigo-600" /> Daily Habits
               </h2>
               <span className="text-sm text-slate-500">Today, {new Date().toLocaleDateString()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {habits.length === 0 && <p className="text-slate-400 text-sm">No habits tracked yet.</p>}
               {habits.map(habit => (
                 <div key={habit.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                    <button 
                      onClick={() => toggleHabit(habit.id)}
                      className="w-12 h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-300 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-all active:scale-95"
                    >
                      <Check size={24} />
                    </button>
                    <div className="flex-1">
                       <h3 className="font-bold text-slate-800">{habit.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            habit.category === 'STUDY' ? 'bg-blue-100 text-blue-700' :
                            habit.category === 'HEALTH' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {habit.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-orange-500">
                             <Flame size={12} fill="currentColor" /> {habit.streak} Day Streak
                          </span>
                       </div>
                    </div>
                 </div>
               ))}
               
               <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer h-[88px]">
                  <span className="font-bold">+ Add New Habit</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
               <h3 className="font-bold text-slate-800 mb-4">Weekly Stats</h3>
               <div className="grid grid-cols-7 gap-2 h-32 items-end">
                  {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
                    <div key={i} className="w-full bg-slate-100 rounded-t-lg relative group overflow-hidden">
                       <div 
                         className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t-lg transition-all duration-1000 group-hover:bg-indigo-600" 
                         style={{ height: `${h}%` }}
                       ></div>
                       <div className="absolute bottom-[-24px] left-0 right-0 text-center text-xs text-slate-400">
                          {['M','T','W','T','F','S','S'][i]}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <Award className="text-amber-500" /> Badges
            </h2>
            
            <div className="space-y-4">
               {MOCK_ACHIEVEMENTS.map(ach => (
                 <div key={ach.id} className={`p-4 rounded-xl border ${ach.unlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    <div className="flex items-start gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm ${ach.unlocked ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-slate-200 grayscale'}`}>
                          {ach.icon}
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-slate-800">{ach.title}</h3>
                            {!ach.unlocked && <Lock size={14} className="text-slate-400" />}
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{ach.description}</p>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full ${ach.unlocked ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                               style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                             ></div>
                          </div>
                          <p className="text-[10px] text-right mt-1 text-slate-400 font-medium">
                            {ach.progress} / {ach.maxProgress}
                          </p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Achievements;
