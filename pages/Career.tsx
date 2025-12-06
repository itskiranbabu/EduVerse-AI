
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { RoadmapStep } from '../types';
import { Compass, Briefcase, GraduationCap, Award, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const Career = () => {
  const [dreamJob, setDreamJob] = useState('');
  const [roadmap, setRoadmap] = useState<RoadmapStep[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!dreamJob.trim()) return;
    setLoading(true);
    const result = await GeminiService.generateCareerRoadmap(dreamJob);
    if (result && result.roadmap) {
      setRoadmap(result.roadmap);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
               <Compass className="text-indigo-400" size={32} /> Future Roadmap
            </h1>
            <p className="text-slate-300 mb-8 text-lg">
               Visualize your path from high school to your dream career. 
               Tell me what you want to be, and I'll map out the education, skills, and experience you need.
            </p>
            
            <div className="flex gap-2">
               <input 
                 type="text" 
                 value={dreamJob}
                 onChange={(e) => setDreamJob(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                 placeholder="e.g. Software Engineer, Marine Biologist, Architect..." 
                 className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               />
               <button 
                 onClick={generateRoadmap}
                 disabled={loading || !dreamJob}
                 className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
               >
                 {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
               </button>
            </div>
         </div>
      </div>

      {roadmap && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Your Path to becoming a {dreamJob}</h2>
              <button className="text-indigo-600 text-sm font-medium hover:underline">Save to Profile</button>
           </div>

           <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              <div className="space-y-8">
                 {roadmap.map((step, idx) => (
                    <div key={idx} className="relative flex gap-6 group">
                       <div className={`w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 shadow-sm transition-colors ${
                         step.type === 'EDUCATION' ? 'bg-blue-100 text-blue-600' :
                         step.type === 'SKILL' ? 'bg-emerald-100 text-emerald-600' :
                         'bg-amber-100 text-amber-600'
                       }`}>
                          {step.type === 'EDUCATION' && <GraduationCap size={24} />}
                          {step.type === 'SKILL' && <Award size={24} />}
                          {step.type === 'EXPERIENCE' && <Briefcase size={24} />}
                       </div>
                       
                       <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="font-bold text-lg text-slate-800">{step.title}</h3>
                             <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">{step.timeframe}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed mb-4">{step.description}</p>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                             <span className={`px-2 py-1 rounded-full ${
                                step.type === 'EDUCATION' ? 'bg-blue-50 text-blue-600' :
                                step.type === 'SKILL' ? 'bg-emerald-50 text-emerald-600' :
                                'bg-amber-50 text-amber-600'
                             }`}>
                                {step.type}
                             </span>
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 <div className="relative flex gap-6">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center z-10 shadow-lg border-4 border-indigo-100">
                       <CheckCircle2 size={28} />
                    </div>
                    <div className="py-4">
                       <h3 className="font-bold text-lg text-indigo-900">Goal Achieved!</h3>
                       <p className="text-slate-500">You become a {dreamJob}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {!roadmap && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                 <GraduationCap />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Education Planning</h3>
              <p className="text-sm text-slate-500">Find the right degrees and courses to take.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                 <Award />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Skill Building</h3>
              <p className="text-sm text-slate-500">Identify technical and soft skills to master.</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                 <Briefcase />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Experience Gap</h3>
              <p className="text-sm text-slate-500">Learn what internships or projects you need.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default Career;
