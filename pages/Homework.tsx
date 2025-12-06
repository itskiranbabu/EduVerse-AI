
import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Task, TaskStatus } from '../types';
import { GeminiService } from '../services/geminiService';
import { CheckCircle2, Circle, Clock, Bot, ChevronRight, Loader2, BookOpen } from 'lucide-react';

const Homework = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    setTasks(DataService.getTasks());
  }, []);

  const handleGetHint = async (task: Task) => {
    if (loadingHint) return;
    setLoadingHint(true);
    setHint(null);
    const result = await GeminiService.getHomeworkHint(task.description, task.subject);
    setHint(result);
    setLoadingHint(false);
  };

  const toggleStatus = (id: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const newStatus = t.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED;
        const newTask = { ...t, status: newStatus };
        DataService.updateTask(newTask); // Save to storage
        return newTask;
      }
      return t;
    });
    setTasks(updatedTasks);
    
    // Update selected task if needed
    if (selectedTask && selectedTask.id === id) {
      setSelectedTask(prev => prev ? { ...prev, status: prev.status === TaskStatus.COMPLETED ? TaskStatus.TODO : TaskStatus.COMPLETED } : null);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
      {/* Task List */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Assignments</h2>
          <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
            {tasks.filter(t => t.status !== TaskStatus.COMPLETED).length} Pending
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
           {tasks.map(task => (
             <div 
               key={task.id} 
               onClick={() => { setSelectedTask(task); setHint(null); }}
               className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-4 ${
                 selectedTask?.id === task.id 
                   ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                   : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
               }`}
             >
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleStatus(task.id); }}
                  className={`flex-shrink-0 transition-colors ${task.status === TaskStatus.COMPLETED ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                >
                  {task.status === TaskStatus.COMPLETED ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="flex-1 min-w-0">
                   <h3 className={`font-medium truncate ${task.status === TaskStatus.COMPLETED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                     {task.title}
                   </h3>
                   <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-medium">{task.subject}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> Due {new Date(task.dueDate).toLocaleDateString()}</span>
                   </div>
                </div>
                <ChevronRight size={16} className={`text-slate-300 ${selectedTask?.id === task.id ? 'opacity-100' : 'opacity-0'}`} />
             </div>
           ))}
        </div>
      </div>

      {/* Task Detail / AI Panel */}
      <div className="w-full md:w-[400px] flex flex-col">
         {selectedTask ? (
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-full flex flex-col">
              <div className="p-6 border-b border-slate-100">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-md">{selectedTask.subject}</span>
                    {selectedTask.type === 'EXAM_PREP' && <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-md">Exam Prep</span>}
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedTask.title}</h2>
                 <p className="text-slate-600 text-sm leading-relaxed">{selectedTask.description}</p>
              </div>
              
              <div className="p-6 bg-slate-50 flex-1 flex flex-col overflow-y-auto">
                 <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">AI Assistant</h4>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex items-start gap-3">
                          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                             <Bot size={20} />
                          </div>
                          <div className="flex-1">
                             <p className="text-sm text-slate-700 font-medium mb-2">Stuck? I can give you a hint without revealing the answer.</p>
                             {!hint && (
                               <button 
                                 onClick={() => handleGetHint(selectedTask)}
                                 disabled={loadingHint}
                                 className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                               >
                                 {loadingHint ? <Loader2 size={12} className="animate-spin" /> : null}
                                 Get a Hint
                               </button>
                             )}
                          </div>
                       </div>
                       {hint && (
                         <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-800 animate-in fade-in slide-in-from-top-2">
                            <p>{hint}</p>
                         </div>
                       )}
                    </div>
                 </div>

                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                       <button className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                          Upload Work
                       </button>
                       <button className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                          Mark Complete
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ) : (
           <div className="h-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center text-slate-400 p-8 text-center">
              <div>
                 <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Select an assignment to view details and get AI help.</p>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default Homework;
