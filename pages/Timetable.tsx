
import React, { useState, useEffect } from 'react';
import { useApp } from '../App';
import { DataService } from '../services/dataService';
import { TimeTableEntry } from '../types';
import { Clock, MapPin, User as UserIcon, Plus, X, Loader2 } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

const Timetable = () => {
  const { currentUser } = useApp();
  const [entries, setEntries] = useState<TimeTableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    room: '',
    teacher: ''
  });

  useEffect(() => {
    const loadTimetable = async () => {
      setLoading(true);
      const data = await DataService.getTimetable(currentUser.id);
      setEntries(data);
      setLoading(false);
    };
    loadTimetable();
  }, [currentUser.id]);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.subject) return;

    const entry: TimeTableEntry = {
      id: '', // DB sets ID
      ...newEvent,
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    };

    // Optimistic Update
    setEntries(prev => [...prev, { ...entry, id: 'temp-' + Date.now() }]);
    
    await DataService.addTimetableEntry(entry, currentUser.id);
    
    // In a real app we would refetch or update ID, but valid for demo
    setShowModal(false);
    setNewEvent({
       day: 'Monday',
       startTime: '09:00',
       endTime: '10:00',
       subject: '',
       room: '',
       teacher: ''
    });
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Weekly Schedule</h1>
           <p className="text-slate-500">Manage your classes, tuition, and extra-curriculars.</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowModal(true)}
             className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
           >
             <Plus size={16} /> Add Event
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <div className="min-w-[800px]">
               <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50">
                  <div className="p-4 text-center text-sm font-semibold text-slate-500">Time</div>
                  {DAYS.map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-slate-700">{day}</div>
                  ))}
               </div>
               
               {TIMES.map((time) => (
                 <div key={time} className="grid grid-cols-6 border-b border-slate-100 last:border-0 min-h-[100px]">
                    <div className="p-4 text-xs font-medium text-slate-400 text-center border-r border-slate-50">
                       {time}
                    </div>
                    {DAYS.map((day) => {
                      const entry = entries.find(t => t.day === day && t.startTime.startsWith(time.split(':')[0]));
                      return (
                        <div key={`${day}-${time}`} className="p-2 border-r border-slate-50 last:border-0 relative group">
                           {entry && (
                              <div className={`h-full w-full rounded-lg p-3 ${entry.color} transition-all hover:scale-[1.02] cursor-pointer shadow-sm`}>
                                 <p className="font-bold text-sm mb-1">{entry.subject}</p>
                                 <div className="flex flex-col gap-1 text-xs opacity-80">
                                   <span className="flex items-center gap-1"><Clock size={10} /> {entry.startTime} - {entry.endTime}</span>
                                   {entry.room && <span className="flex items-center gap-1"><MapPin size={10} /> {entry.room}</span>}
                                   {entry.teacher && <span className="flex items-center gap-1"><UserIcon size={10} /> {entry.teacher}</span>}
                                 </div>
                              </div>
                           )}
                           {!entry && (
                              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                      setNewEvent(prev => ({...prev, day, startTime: time, endTime: `${parseInt(time)+1}:00`}));
                                      setShowModal(true);
                                  }}
                                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                           )}
                        </div>
                      );
                    })}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-slate-800">Add New Event</h2>
                 <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
              </div>
              <form onSubmit={handleAddEvent} className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject / Activity</label>
                    <input 
                      type="text" 
                      required
                      value={newEvent.subject}
                      onChange={(e) => setNewEvent({...newEvent, subject: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="e.g. Math Class, Football Practice"
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Day</label>
                       <select 
                         value={newEvent.day}
                         onChange={(e) => setNewEvent({...newEvent, day: e.target.value})}
                         className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                       >
                         {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Start Time</label>
                       <select 
                         value={newEvent.startTime}
                         onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                         className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                       >
                         {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Room (Optional)</label>
                       <input 
                         type="text" 
                         value={newEvent.room}
                         onChange={(e) => setNewEvent({...newEvent, room: e.target.value})}
                         className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                         placeholder="101, Gym..."
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teacher/Coach</label>
                       <input 
                         type="text" 
                         value={newEvent.teacher}
                         onChange={(e) => setNewEvent({...newEvent, teacher: e.target.value})}
                         className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none"
                         placeholder="Mr. Smith"
                       />
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                    Add to Schedule
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
