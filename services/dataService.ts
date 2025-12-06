
import { supabase } from '../lib/supabaseClient';
import { User, UserRole, Task, TaskStatus, TaskType, TimeTableEntry, Achievement, Habit, Conversation, Message, Announcement, Mood } from '../types';

// --- MOCK DATA FOR FALLBACK (If DB is empty/connection fails) ---
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Johnson', role: UserRole.STUDENT, avatar: 'https://picsum.photos/200/200?random=1', level: 5, xp: 2450, email: 'alex.j@eduverse.com', grade: '10th Grade' },
  { id: 'u2', name: 'Sarah Johnson', role: UserRole.PARENT, avatar: 'https://picsum.photos/200/200?random=2', email: 'sarah.j@gmail.com' },
  { id: 'u3', name: 'Mr. Thompson', role: UserRole.TEACHER, avatar: 'https://picsum.photos/200/200?random=3', email: 'thompson@school.edu' }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Algebra Quiz Prep', subject: 'Mathematics', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), status: TaskStatus.TODO, type: TaskType.EXAM_PREP, description: 'Review Chapter 5 quadratic equations.', estimatedTimeMinutes: 60 },
  { id: 't2', title: 'History Essay Draft', subject: 'History', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)), status: TaskStatus.TODO, type: TaskType.HOMEWORK, description: 'Write first draft about the Industrial Revolution.', estimatedTimeMinutes: 90 },
  { id: 't3', title: 'Physics Lab Report', subject: 'Physics', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)), status: TaskStatus.IN_PROGRESS, type: TaskType.PROJECT, description: 'Complete the lab report on pendulum motion.', estimatedTimeMinutes: 45 },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: 'Homework Hero', description: 'Complete 10 assignments on time', icon: '📝', unlocked: true, progress: 10, maxProgress: 10 },
  { id: 'a2', title: 'Math Whiz', description: 'Score A on 3 consecutive Math quizzes', icon: '➗', unlocked: false, progress: 1, maxProgress: 3 },
  { id: 'a3', title: 'Early Bird', description: 'Submit 5 assignments before the deadline', icon: '⏰', unlocked: true, progress: 5, maxProgress: 5 },
  { id: 'a4', title: 'Bookworm', description: 'Read assigned literature chapters', icon: '📚', unlocked: false, progress: 40, maxProgress: 100 },
];
export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: 'c1', participantId: 'u3', lastMessage: 'Don\'t forget about the project due Friday.', timestamp: new Date(), unreadCount: 1 }
];

// --- SUPABASE DATA SERVICE ---

export const DataService = {
  
  // --- USERS ---
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error || !data || data.length === 0) {
        console.warn("Supabase (Users): Using Mock Data.", error?.message || "No data");
        return MOCK_USERS;
      }
      return data.map((u: any) => ({
        ...u,
        role: u.role as UserRole
      }));
    } catch (e) {
      console.warn("Fetch Error (Users): Using Mock Data.", e);
      return MOCK_USERS;
    }
  },

  // --- TASKS ---
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: true });

      if (error) {
        console.warn('Supabase (Tasks): Using Mock Data.', error.message);
        return MOCK_TASKS;
      }

      if (!data) return MOCK_TASKS;

      return data.map((t: any) => ({
        id: t.id,
        title: t.title,
        subject: t.subject,
        dueDate: new Date(t.due_date),
        status: t.status as TaskStatus,
        type: t.type as TaskType,
        description: t.description,
        estimatedTimeMinutes: t.estimated_time_minutes
      }));
    } catch (e) {
      console.warn("Fetch Error (Tasks): Using Mock Data.", e);
      return MOCK_TASKS;
    }
  },

  async updateTask(updatedTask: Task) {
    // If ID starts with 't' it's likely a mock task, skip DB update
    if (updatedTask.id.startsWith('t')) return;

    const { error } = await supabase
      .from('tasks')
      .update({
        status: updatedTask.status,
        title: updatedTask.title,
        description: updatedTask.description
      })
      .eq('id', updatedTask.id);
      
    if (error) console.error('Error updating task:', error.message);
  },

  async addTask(task: Task, userId: string) {
    const { error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: task.title,
        subject: task.subject,
        due_date: task.dueDate.toISOString(),
        status: task.status,
        type: task.type,
        description: task.description,
        estimated_time_minutes: task.estimatedTimeMinutes
      });

    if (error) console.error('Error adding task:', error.message);
  },

  // --- HABITS ---
  async getHabits(userId: string): Promise<Habit[]> {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: true });

      if (error || !data) {
        // Mock fallback if habits table missing
        return [
          { id: 'h1', name: 'Read for 30 mins', streak: 5, category: 'STUDY', completedDates: [] },
          { id: 'h2', name: 'Drink Water', streak: 12, category: 'HEALTH', completedDates: [] }
        ];
      }
      
      return data.map((h: any) => ({
        id: h.id,
        name: h.name,
        streak: h.streak,
        category: h.category,
        completedDates: h.completed_dates || []
      }));
    } catch (e) {
      return [];
    }
  },

  async updateHabit(updatedHabit: Habit) {
    if (updatedHabit.id.startsWith('h')) return;

    const { error } = await supabase
      .from('habits')
      .update({
        streak: updatedHabit.streak,
        completed_dates: updatedHabit.completedDates
      })
      .eq('id', updatedHabit.id);

    if (error) console.error('Error updating habit', error.message);
  },

  // --- MESSAGES ---
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.warn("Supabase (Messages):", error.message);
        return [];
      }

      return (data || []).map((m: any) => ({
        id: m.id,
        senderId: m.sender_id,
        text: m.text,
        timestamp: new Date(m.timestamp),
        read: m.read
      }));
    } catch (e) {
      return [];
    }
  },

  async addMessage(conversationId: string, message: Message) {
    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: message.senderId,
        text: message.text,
        timestamp: message.timestamp.toISOString(),
        read: message.read
      });
      
    if (error) console.error('Error sending message:', error.message);
  },

  // --- TIMETABLE ---
  async getTimetable(userId: string): Promise<TimeTableEntry[]> {
    try {
      const { data, error } = await supabase
        .from('timetable')
        .select('*')
        .eq('user_id', userId);

      if (error) return [];

      return (data || []).map((t: any) => ({
        id: t.id,
        day: t.day,
        startTime: t.start_time,
        endTime: t.end_time,
        subject: t.subject,
        room: t.room,
        teacher: t.teacher,
        color: t.color
      }));
    } catch (e) {
      return [];
    }
  },

  async addTimetableEntry(entry: TimeTableEntry, userId: string) {
    const { error } = await supabase
      .from('timetable')
      .insert({
        user_id: userId,
        day: entry.day,
        start_time: entry.startTime,
        end_time: entry.endTime,
        subject: entry.subject,
        room: entry.room,
        teacher: entry.teacher,
        color: entry.color
      });

    if (error) console.error('Error adding timetable:', error.message);
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });

      if (error) return [];

      return (data || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        content: a.content,
        author: a.author,
        date: new Date(a.date),
        priority: a.priority,
        tags: a.tags || []
      }));
    } catch (e) {
      return [];
    }
  },

  async addAnnouncement(announcement: Announcement) {
    const { error } = await supabase
      .from('announcements')
      .insert({
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        date: announcement.date.toISOString(),
        priority: announcement.priority,
        tags: announcement.tags
      });
      
    if (error) console.error('Error adding announcement:', error.message);
  },

  // --- MOOD (Local only for now, or could be a table) ---
  saveMood: (mood: Mood) => {
    localStorage.setItem('eduverse_mood', mood);
  },

  getMood: (): Mood | null => {
    return localStorage.getItem('eduverse_mood') as Mood | null;
  }
};
