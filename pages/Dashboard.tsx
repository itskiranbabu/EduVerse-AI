
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { DataService } from '../services/dataService';
import { TaskStatus, UserRole, Mood, Task } from '../types';
import { ArrowUpRight, CheckCircle2, Clock, AlertTriangle, TrendingUp, Sparkles, Smile, Meh, Frown, Battery, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 78 },
  { name: 'Thu', score: 75 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 82 },
  { name: 'Sun', score: 88 },
];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    {sub && <p className="text-xs text-slate-400 flex items-center gap-1"><TrendingUp size={12} className="text-emerald-500" /> {sub}</p>}
  </div>
);

const MoodWidget = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  useEffect(() => {
    const saved = DataService.getMood();
    if (saved) setSelectedMood(saved);
  }, []);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    DataService.saveMood(mood);
  };

  const moods = [
    { type: Mood.HAPPY, icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Great' },
    { type: Mood.NEUTRAL, icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Okay' },
    { type: Mood.TIRED, icon: Battery, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Tired' },
    { type: Mood.STRESSED, icon: Frown, color: 'text-rose-500', bg: 'bg-rose-50', label: 'Stressed' },
  ];

  if (selectedMood) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center h-full animate-in fade-in">
         <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 size={24} />
         </div>
         <p className="font-bold text-slate-800">Check-in Saved!</p>
         <p className="text-xs text-slate-500 mt-1">Thanks for sharing. We'll adjust your workload tips.</p>
         <button onClick={() => setSelectedMood(null)} className="text-xs text-indigo-500 font-medium mt-3 hover:underline">Edit</button>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-4">How are you feeling?</h3>
      <div className="grid grid-cols-4 gap-2">
         {moods.map((m) => (
           <button 
             key={m.type}
             onClick={() => handleMoodSelect(m.type)}
             className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
           >
              <div className={`p-2 rounded-full ${m.bg} ${m.color} group-hover:scale-110 transition-transform`}>
                 <m.icon size={20} />
              </div>
              <span className="text-[10px] font-medium text-slate-500">{m.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await DataService.getTasks(currentUser.id);
      setTasks(data);
      setLoading(false);
    };
    loadData();
  }, [currentUser.id]);

  const pendingTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED).length;
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Scholar';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{getGreeting()}, {firstName}!</h1>
           <p className="text-slate-500 mt-1">Here is what's happening in your universe today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
             Student Level {currentUser?.level || 1}
           </span>
           <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-3/4"></div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tasks" value={loading ? "..." : pendingTasks} sub="+2 from yesterday" icon={Clock} color="bg-amber-500" />
        <StatCard title="Attendance" value="96%" sub="Excellent" icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Avg. Grade" value="B+" sub="Math needs focus" icon={ArrowUpRight} color="bg-blue-500" />
        <StatCard title="Focus Time" value="4h 12m" sub="This week" icon={Sparkles} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={120} />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-indigo-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">AI Insight</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Math Concept Alert</h3>
                <p className="text-indigo-100 text-sm max-w-lg mb-4">
                  I've noticed you struggled with Quadratic Equations in the last quiz. 
                  I've prepared a 5-minute interactive review to help you master it before the final.
                </p>
                <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors">
                  Start Review Session
                </button>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Focus Score</h3>
             <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <MoodWidget />

           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-3">Due Soon</h3>
              <div className="space-y-3">
                 {loading && <div className="flex justify-center p-4"><Loader2 className="animate-spin text-indigo-600" /></div>}
                 {!loading && tasks.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No pending tasks.</p>}
                 {tasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                       <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.COMPLETED ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{task.title}</p>
                          <p className="text-xs text-slate-500">{task.subject}</p>
                       </div>
                       {task.status !== TaskStatus.COMPLETED && <AlertTriangle size={14} className="text-amber-400" />}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
