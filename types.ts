
export enum UserRole {
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  level?: number; // Gamification
  xp?: number; // Gamification
  email?: string;
  grade?: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskType {
  HOMEWORK = 'HOMEWORK',
  PROJECT = 'PROJECT',
  EXAM_PREP = 'EXAM_PREP',
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  status: TaskStatus;
  type: TaskType;
  description: string;
  estimatedTimeMinutes: number;
}

export interface TimeTableEntry {
  id: string;
  day: string; // 'Monday', etc.
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  subject: string;
  room?: string;
  teacher?: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  completedDates: string[]; // ISO strings
  category: 'STUDY' | 'HEALTH' | 'MINDFULNESS';
}

export enum Mood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  STRESSED = 'STRESSED',
  TIRED = 'TIRED',
}

// --- Messaging & Announcements ---

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string; // The ID of the other user
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  priority: 'HIGH' | 'NORMAL' | 'LOW';
  tags: string[];
}

// --- Career ---

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  type: 'EDUCATION' | 'SKILL' | 'EXPERIENCE';
  completed: boolean;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  roadmap: RoadmapStep[];
}
