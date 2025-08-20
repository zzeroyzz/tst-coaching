// types/habits.ts
export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count: number;
  timestamp: Date;
  notes?: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface HabitStats {
  habitId: string;
  totalCompletions: number;
  completionRate: number; // percentage
  averagePerWeek: number;
  streaks: HabitStreak;
}

export interface DailyProgress {
  date: string;
  habits: Array<{
    habitId: string;
    completed: boolean;
    count: number;
  }>;
  completionRate: number;
}

export interface WeeklyProgress {
  weekStartDate: string;
  days: DailyProgress[];
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
}

// Default habit templates
export const DEFAULT_HABITS: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Drink Water",
    description: "Stay hydrated throughout the day",
    color: "#3B82F6", // blue
    icon: "💧",
    frequency: "daily",
    targetCount: 8,
    isActive: true,
  },
  {
    name: "Exercise",
    description: "Get moving with any physical activity",
    color: "#EF4444", // red
    icon: "🏃‍♂️",
    frequency: "daily",
    targetCount: 1,
    isActive: true,
  },
  {
    name: "Read",
    description: "Read for personal growth",
    color: "#10B981", // green
    icon: "📚",
    frequency: "daily",
    targetCount: 1,
    isActive: true,
  },
  {
    name: "Meditate",
    description: "Practice mindfulness",
    color: "#8B5CF6", // purple
    icon: "🧘‍♀️",
    frequency: "daily",
    targetCount: 1,
    isActive: true,
  },
  {
    name: "Sleep 8+ Hours",
    description: "Get quality rest",
    color: "#F59E0B", // yellow
    icon: "😴",
    frequency: "daily",
    targetCount: 1,
    isActive: true,
  },
  {
    name: "Journal",
    description: "Reflect on your day",
    color: "#EC4899", // pink
    icon: "✍️",
    frequency: "daily",
    targetCount: 1,
    isActive: true,
  },
];

// Habit colors
export const HABIT_COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#10B981", // green
  "#8B5CF6", // purple
  "#F59E0B", // yellow
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
  "#6366F1", // indigo
];

// Habit icons (emoji)
export const HABIT_ICONS = [
  "💧", "🏃‍♂️", "📚", "🧘‍♀️", "😴", "✍️", "🍎", "💻", 
  "🎵", "🎨", "🧹", "☕", "🌱", "💪", "🚶‍♀️", "🧠",
  "❤️", "🌟", "⚡", "🔥", "🎯", "🏆", "✨", "🌈"
];