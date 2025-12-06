
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  User as UserIcon, 
  Settings, 
  GraduationCap, 
  BrainCircuit,
  LogOut,
  Bell,
  Menu,
  X,
  Mail,
  Compass
} from 'lucide-react';
import { User, UserRole } from './types';
import { MOCK_USERS, DataService } from './services/dataService';

// Pages
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Homework from './pages/Homework';
import AICoach from './pages/AICoach';
import Planner from './pages/Planner';
import Achievements from './pages/Achievements';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Career from './pages/Career';

// --- Context ---
interface AppContextType {
  currentUser: User;
  switchUser: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- Layout Components ---

const SidebarItem: React.FC<{ to: string, icon: any, label: string, active: boolean }> = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, switchUser } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/timetable', icon: Calendar, label: 'Timetable' },
    { to: '/homework', icon: BookOpen, label: 'Homework' },
    { to: '/planner', icon: BrainCircuit, label: 'AI Planner' },
    { to: '/coach', icon: MessageSquare, label: 'AI Coach' },
    { to: '/achievements', icon: GraduationCap, label: 'Achievements' },
    { to: '/career', icon: Compass, label: 'Career Path' },
    { to: '/messages', icon: Mail, label: 'Messages' },
    { to: '/profile', icon: UserIcon, label: 'My Portfolio' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">EduVerse AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate capitalize">{currentUser.role.toLowerCase()}</p>
                </div>
              </div>
              <div className="space-y-1">
                 <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Switch Role Demo</p>
                 <select 
                    className="w-full text-xs p-2 rounded bg-white border border-slate-200 text-slate-700 outline-none focus:border-indigo-500"
                    value={currentUser.role}
                    onChange={(e) => switchUser(e.target.value as UserRole)}
                 >
                    {MOCK_USERS.map(u => (
                      <option key={u.id} value={u.role}>{u.name} ({u.role})</option>
                    ))}
                 </select>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <button 
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
               <Bell size={20} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
             <Link to="/profile" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
               <Settings size={20} />
             </Link>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- App Component ---

const App: React.FC = () => {
  // Simple state management for demo
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);

  // Init Data Layer on Mount
  useEffect(() => {
    DataService.init();
  }, []);

  const switchUser = (role: UserRole) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) setCurrentUser(user);
  };

  return (
    <AppContext.Provider value={{ currentUser, switchUser }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/homework" element={<Homework />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/coach" element={<AICoach />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/career" element={<Career />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
