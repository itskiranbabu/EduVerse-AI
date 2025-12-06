
import React from 'react';
import { useApp } from '../App';
import { MOCK_TASKS, MOCK_ACHIEVEMENTS } from '../services/dataService';
import { User, TaskStatus } from '../types';
import { Download, Mail, MapPin, School, Book, Trophy, Star, TrendingUp, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Profile = () => {
  const { currentUser } = useApp();

  // Mock Stats
  const completedTasks = MOCK_TASKS.filter(t => t.status === TaskStatus.COMPLETED).length;
  const totalTasks = MOCK_TASKS.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100) || 0;
  
  const gradeData = [
    { subject: 'Math', grade: 88, fullMark: 100 },
    { subject: 'Science', grade: 92, fullMark: 100 },
    { subject: 'English', grade: 85, fullMark: 100 },
    { subject: 'History', grade: 78, fullMark: 100 },
    { subject: 'Art', grade: 95, fullMark: 100 },
  ];

  const skillData = [
    { subject: 'Logic', A: 120, fullMark: 150 },
    { subject: 'Creativity', A: 98, fullMark: 150 },
    { subject: 'Focus', A: 86, fullMark: 150 },
    { subject: 'Memory', A: 99, fullMark: 150 },
    { subject: 'Speed', A: 85, fullMark: 150 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
         
         <div className="relative flex flex-col md:flex-row items-end gap-6 pt-12 px-4">
            <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden">
               <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 mb-2">
               <h1 className="text-3xl font-bold text-slate-800">{currentUser.name}</h1>
               <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm mt-1">
                  <span className="flex items-center gap-1"><School size={16} /> EduVerse Academy</span>
                  <span className="flex items-center gap-1"><Book size={16} /> {currentUser.grade || '10th Grade'}</span>
                  <span className="flex items-center gap-1"><Mail size={16} /> {currentUser.email}</span>
               </div>
            </div>
            <div className="mb-2 flex gap-3">
               <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                  Edit Profile
               </button>
               <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200">
                  <Download size={18} /> Download Report
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Academic Performance */}
         <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <TrendingUp className="text-indigo-500" /> Academic Performance
               </h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={gradeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip 
                          cursor={{fill: '#f8fafc'}}
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                        />
                        <Bar dataKey="grade" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Trophy className="text-amber-500" /> Achievements Highlight
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_ACHIEVEMENTS.slice(0, 4).map(ach => (
                    <div key={ach.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
                       <div className="text-2xl">{ach.icon}</div>
                       <div>
                          <h4 className="font-bold text-slate-800 text-sm">{ach.title}</h4>
                          <p className="text-xs text-slate-500">{ach.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Skill Radar</h3>
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar name="Skills" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                     </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-medium text-slate-600">Task Completion</span>
                     <span className="text-sm font-bold text-emerald-600">{completionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-medium text-slate-600">Attendance</span>
                     <span className="text-sm font-bold text-indigo-600">96%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                     <span className="text-sm font-medium text-slate-600">Current XP</span>
                     <span className="text-sm font-bold text-amber-600">{currentUser.xp}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
