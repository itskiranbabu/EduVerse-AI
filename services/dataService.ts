
import { User, UserRole, Task, TaskStatus, TaskType, TimeTableEntry, Achievement, Habit, Conversation, Message, Announcement, Mood } from '../types';

// Initial Mock Data (Used only on first load)
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Johnson',
    role: UserRole.STUDENT,
    avatar: 'https://picsum.photos/200/200?random=1',
    level: 5,
    xp: 2450,
    email: 'alex.j@eduverse.com',
    grade: '10th Grade'
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    role: UserRole.PARENT,
    avatar: 'https://picsum.photos/200/200?random=2',
    email: 'sarah.j@gmail.com'
  },
  {
    id: 'u3',
    name: 'Mr. Thompson',
    role: UserRole.TEACHER,
    avatar: 'https://picsum.photos/200/200?random=3',
    email: 'thompson@school.edu'
  },
  {
    id: 'u4',
    name: 'Mrs. Davis',
    role: UserRole.TEACHER,
    avatar: 'https://picsum.photos/200/200?random=4',
    email: 'davis@school.edu'
  }
];

export const MOCK_TASKS_INIT: Task[] = [
  {
    id: 't1',
    title: 'Algebra II Quiz Prep',
    subject: 'Mathematics',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    status: TaskStatus.TODO,
    type: TaskType.EXAM_PREP,
    description: 'Review Chapter 4: Quadratic Equations. Practice problems 1-20.',
    estimatedTimeMinutes: 60
  },
  {
    id: 't2',
    title: 'History Essay: Industrial Revolution',
    subject: 'History',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: TaskStatus.IN_PROGRESS,
    type: TaskType.HOMEWORK,
    description: 'Write a 500-word essay on the impact of steam power.',
    estimatedTimeMinutes: 120
  },
  {
    id: 't3',
    title: 'Science Lab Report',
    subject: 'Physics',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
    status: TaskStatus.COMPLETED,
    type: TaskType.PROJECT,
    description: 'Submit final report for the pendulum experiment.',
    estimatedTimeMinutes: 45
  }
];

export const MOCK_TIMETABLE: TimeTableEntry[] = [
  { id: 'tt1', day: 'Monday', startTime: '09:00', endTime: '10:00', subject: 'Mathematics', room: '101', teacher: 'Mr. Smith', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'tt2', day: 'Monday', startTime: '10:15', endTime: '11:15', subject: 'Physics', room: 'Lab A', teacher: 'Mrs. Davis', color: 'bg-purple-100 border-purple-300 text-purple-800' },
  { id: 'tt3', day: 'Monday', startTime: '11:30', endTime: '12:30', subject: 'History', room: '204', teacher: 'Mr. Thompson', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'tt4', day: 'Tuesday', startTime: '09:00', endTime: '10:00', subject: 'English', room: '105', teacher: 'Ms. Clark', color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
  { id: 'tt5', day: 'Tuesday', startTime: '10:15', endTime: '11:15', subject: 'Chemistry', room: 'Lab B', teacher: 'Mr. White', color: 'bg-rose-100 border-rose-300 text-rose-800' },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Homework Hero', description: 'Complete 10 assignments on time', icon: '📝', unlocked: true, progress: 10, maxProgress: 10 },
  { id: 'a2', title: 'Math Whiz', description: 'Score A on 3 consecutive Math quizzes', icon: '➗', unlocked: false, progress: 1, maxProgress: 3 },
  { id: 'a3', title: 'Early Bird', description: 'Submit 5 assignments before the deadline', icon: '⏰', unlocked: true, progress: 5, maxProgress: 5 },
  { id: 'a4', title: 'Bookworm', description: 'Read assigned literature chapters', icon: '📚', unlocked: false, progress: 40, maxProgress: 100 },
];

export const MOCK_HABITS_INIT: Habit[] = [
  { id: 'h1', name: 'Read for 30 mins', streak: 12, completedDates: [], category: 'STUDY' },
  { id: 'h2', name: 'Drink 2L Water', streak: 5, completedDates: [], category: 'HEALTH' },
  { id: 'h3', name: 'No Social Media', streak: 3, completedDates: [], category: 'MINDFULNESS' },
  { id: 'h4', name: 'Review Class Notes', streak: 8, completedDates: [], category: 'STUDY' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'c1', participantId: 'u3', lastMessage: 'Don\'t forget about the project due Friday.', timestamp: new Date(), unreadCount: 1 },
  { id: 'c2', participantId: 'u4', lastMessage: 'Great job in class today!', timestamp: new Date(Date.now() - 86400000), unreadCount: 0 },
];

export const MOCK_MESSAGES_INIT: Record<string, Message[]> = {
  'c1': [
    { id: 'm1', senderId: 'u3', text: 'Hi Alex, just a reminder about the history project.', timestamp: new Date(Date.now() - 100000), read: true },
    { id: 'm2', senderId: 'u1', text: 'Yes Mr. Thompson, I am almost done.', timestamp: new Date(Date.now() - 50000), read: true },
    { id: 'm3', senderId: 'u3', text: 'Don\'t forget about the project due Friday.', timestamp: new Date(), read: false },
  ],
  'c2': [
    { id: 'm4', senderId: 'u4', text: 'Great job in class today!', timestamp: new Date(Date.now() - 86400000), read: true },
  ]
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', title: 'Science Fair Registration', content: 'Sign up for the annual Science Fair by next Monday. Teams of 2 permitted.', author: 'Principal Skinner', date: new Date(), priority: 'HIGH', tags: ['Events', 'Science'] },
  { id: 'an2', title: 'Library Renovation', content: 'The school library will be closed for renovations this week. Please use the study hall.', author: 'Admin', date: new Date(Date.now() - 172800000), priority: 'NORMAL', tags: ['Facility'] },
];

// --- STORAGE SERVICE ---

const KEYS = {
  TASKS: 'eduverse_tasks',
  HABITS: 'eduverse_habits',
  MESSAGES: 'eduverse_messages',
  MOOD: 'eduverse_mood'
};

// Helper to handle Date serialization
const reviveDates = (key: any, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
};

export const DataService = {
  init: () => {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(KEYS.TASKS)) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(MOCK_TASKS_INIT));
    }
    if (!localStorage.getItem(KEYS.HABITS)) {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(MOCK_HABITS_INIT));
    }
    if (!localStorage.getItem(KEYS.MESSAGES)) {
      localStorage.setItem(KEYS.MESSAGES, JSON.stringify(MOCK_MESSAGES_INIT));
    }
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data, reviveDates) : [];
  },

  updateTask: (updatedTask: Task) => {
    const tasks = DataService.getTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    }
  },

  addTask: (task: Task) => {
    const tasks = DataService.getTasks();
    tasks.push(task);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getHabits: (): Habit[] => {
    const data = localStorage.getItem(KEYS.HABITS);
    return data ? JSON.parse(data, reviveDates) : [];
  },

  updateHabit: (updatedHabit: Habit) => {
    const habits = DataService.getHabits();
    const index = habits.findIndex(h => h.id === updatedHabit.id);
    if (index !== -1) {
      habits[index] = updatedHabit;
      localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    }
  },

  getMessages: (conversationId: string): Message[] => {
    const data = localStorage.getItem(KEYS.MESSAGES);
    const allMessages = data ? JSON.parse(data, reviveDates) : {};
    return allMessages[conversationId] || [];
  },

  addMessage: (conversationId: string, message: Message) => {
    const data = localStorage.getItem(KEYS.MESSAGES);
    const allMessages = data ? JSON.parse(data, reviveDates) : {};
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(message);
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(allMessages));
  },

  saveMood: (mood: Mood) => {
    localStorage.setItem(KEYS.MOOD, mood);
  },

  getMood: (): Mood | null => {
    return localStorage.getItem(KEYS.MOOD) as Mood | null;
  }
};

// Export raw mocks for components that haven't been refactored yet or need static data
export const MOCK_TASKS = MOCK_TASKS_INIT; 
