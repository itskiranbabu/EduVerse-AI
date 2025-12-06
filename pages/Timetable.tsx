import React from 'react';
import { MOCK_TIMETABLE } from '../services/dataService';
import { Clock, MapPin, User as UserIcon } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

const Timetable = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Weekly Schedule</h1>
           <p className="text-slate-500">Manage your classes, tuition, and extra-curriculars.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
             Add Event
           </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
         {/* Desktop View */}
         <div className="overflow-x-auto">
            <div className="min-w-[800px]">
               {/* Header */}
               <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50">
                  <div className="p-4 text-center text-sm font-semibold text-slate-500">Time</div>
                  {DAYS.map(day => (
                    <div key={day} className="p-4 text-center text-sm font-semibold text-slate-700">{day}</div>
                  ))}
               </div>
               
               {/* Rows */}
               {TIMES.map((time) => (
                 <div key={time} className="grid grid-cols-6 border-b border-slate-100 last:border-0 min-h-[100px]">
                    <div className="p-4 text-xs font-medium text-slate-400 text-center border-r border-slate-50">
                       {time}
                    </div>
                    {DAYS.map((day) => {
                      // Find classes starting around this time (simplified logic for demo)
                      const entry = MOCK_TIMETABLE.find(t => t.day === day && t.startTime.startsWith(time.split(':')[0]));
                      return (
                        <div key={`${day}-${time}`} className="p-2 border-r border-slate-50 last:border-0 relative group">
                           {entry && (
                              <div className={`h-full w-full rounded-lg p-3 ${entry.color} transition-all hover:scale-[1.02] cursor-pointer shadow-sm`}>
                                 <p className="font-bold text-sm mb-1">{entry.subject}</p>
                                 <div className="flex flex-col gap-1 text-xs opacity-80">
                                   <span className="flex items-center gap-1"><Clock size={10} /> {entry.startTime} - {entry.endTime}</span>
                                   <span className="flex items-center gap-1"><MapPin size={10} /> {entry.room}</span>
                                   <span className="flex items-center gap-1"><UserIcon size={10} /> {entry.teacher}</span>
                                 </div>
                              </div>
                           )}
                           {!entry && (
                              <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center">
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
    </div>
  );
};

export default Timetable;
