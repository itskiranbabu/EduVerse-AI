import React, { useState } from 'react';
import { MOCK_TASKS } from '../services/dataService';
import { GeminiService } from '../services/geminiService';
import { Calendar, BrainCircuit, PlayCircle, Coffee, Loader2 } from 'lucide-react';

interface PlanItem {
  time: string;
  activity: string;
  type: 'study' | 'break';
}

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [tip, setTip] = useState<string>('');
  const [hours, setHours] = useState(3);

  const generatePlan = async () => {
    setLoading(true);
    const result = await GeminiService.generateStudyPlan(MOCK_TASKS, hours);
    if (result) {
      setPlan(result.plan);
      setTip(result.tip);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        
        <div className="relative z-10 max-w-2xl">
           <h1 className="text-3xl font-bold mb-4">AI Smart Planner</h1>
           <p className="text-indigo-200 mb-8 text-lg">
             I'll analyze your {MOCK_TASKS.length} pending assignments and create an optimized schedule for you.
           </p>
           
           <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-3 flex-1 w-full">
                 <Calendar className="text-indigo-300" />
                 <div className="flex-1">
                   <label className="text-xs text-indigo-300 block mb-1 font-semibold uppercase">Available Time Today</label>
                   <input 
                     type="range" 
                     min="1" 
                     max="8" 
                     step="0.5" 
                     value={hours} 
                     onChange={(e) => setHours(parseFloat(e.target.value))}
                     className="w-full accent-indigo-400" 
                   />
                   <div className="flex justify-between text-xs text-indigo-200 mt-1">
                     <span>1 hr</span>
                     <span className="font-bold text-white">{hours} Hours</span>
                     <span>8 hrs</span>
                   </div>
                 </div>
              </div>
              <button 
                onClick={generatePlan}
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
                Generate Plan
              </button>
           </div>
        </div>
      </div>

      {plan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
           {/* Timeline */}
           <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-800">Your Schedule</h2>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 relative">
                 <div className="absolute left-9 top-6 bottom-6 w-0.5 bg-slate-100"></div>
                 <div className="space-y-8 relative z-10">
                   {plan.map((item, idx) => (
                     <div key={idx} className="flex gap-6 group">
                        <div className="w-16 pt-1 text-right text-xs font-bold text-slate-400 font-mono">
                          {item.time ? item.time.split('-')[0] : '00:00'}
                        </div>
                        <div className="flex-1">
                           <div className={`p-4 rounded-xl border transition-all ${
                             item.type === 'break' 
                               ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                               : 'bg-indigo-50 border-indigo-100 text-indigo-900 group-hover:shadow-md'
                           }`}>
                              <div className="flex items-center gap-2 mb-1">
                                {item.type === 'break' ? <Coffee size={16} /> : <PlayCircle size={16} />}
                                <span className="text-xs font-bold uppercase opacity-70">{item.type}</span>
                              </div>
                              <p className="font-medium">{item.activity}</p>
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-6">
              {tip && (
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                   <h3 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                     <span className="text-xl">💡</span> AI Pro Tip
                   </h3>
                   <p className="text-amber-700 text-sm leading-relaxed italic">"{tip}"</p>
                </div>
              )}
              
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Why this plan?</h3>
                 <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex gap-2">
                      <span className="text-indigo-500">•</span>
                      Prioritizes tasks due tomorrow
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500">•</span>
                      Interleaves different subjects to improve retention
                    </li>
                    <li className="flex gap-2">
                      <span className="text-indigo-500">•</span>
                      Includes breaks based on the Pomodoro technique
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Planner;