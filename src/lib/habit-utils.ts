// lib/habit-utils.ts
import { format, parseISO, isToday, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Habit, HabitCompletion, HabitStreak, HabitStats, DailyProgress, WeeklyProgress } from '@/types/habits';

// Date utilities
export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getWeekDates(date: Date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  return eachDayOfInterval({ start, end });
}

// Streak calculations
export function calculateStreak(completions: HabitCompletion[], habitId: string): HabitStreak {
  const habitCompletions = completions
    .filter(c => c.habitId === habitId && c.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (habitCompletions.length === 0) {
    return {
      habitId,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let expectedDate = new Date();

  // Calculate current streak (from today backwards)
  for (const completion of habitCompletions) {
    const completionDate = parseISO(completion.date);
    const expectedDateKey = formatDateKey(expectedDate);
    
    if (completion.date === expectedDateKey) {
      if (currentStreak === 0) {
        currentStreak = 1;
      } else {
        currentStreak++;
      }
      expectedDate = subDays(expectedDate, 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  const sortedByDate = [...habitCompletions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let lastDate: Date | null = null;
  for (const completion of sortedByDate) {
    const completionDate = parseISO(completion.date);
    
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const daysDiff = Math.round(
        (completionDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    
    lastDate = completionDate;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    habitId,
    currentStreak,
    longestStreak,
    lastCompletedDate: habitCompletions[0]?.date,
  };
}

// Stats calculations
export function calculateHabitStats(
  habit: Habit,
  completions: HabitCompletion[]
): HabitStats {
  const habitCompletions = completions.filter(c => c.habitId === habit.id);
  const totalCompletions = habitCompletions.reduce((sum, c) => sum + c.count, 0);
  
  // Calculate completion rate for last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30);
  const recentCompletions = habitCompletions.filter(c => 
    parseISO(c.date) >= thirtyDaysAgo && c.completed
  );
  const completionRate = (recentCompletions.length / 30) * 100;

  // Calculate average per week for last 12 weeks
  const twelveWeeksAgo = subDays(new Date(), 84);
  const weeklyCompletions = habitCompletions.filter(c => 
    parseISO(c.date) >= twelveWeeksAgo
  );
  const averagePerWeek = (weeklyCompletions.length / 12);

  const streaks = calculateStreak(completions, habit.id);

  return {
    habitId: habit.id,
    totalCompletions,
    completionRate,
    averagePerWeek,
    streaks,
  };
}

// Daily progress
export function calculateDailyProgress(
  date: Date,
  habits: Habit[],
  completions: HabitCompletion[]
): DailyProgress {
  const dateKey = formatDateKey(date);
  const dayCompletions = completions.filter(c => c.date === dateKey);

  const habitProgress = habits.map(habit => {
    const completion = dayCompletions.find(c => c.habitId === habit.id);
    return {
      habitId: habit.id,
      completed: completion?.completed || false,
      count: completion?.count || 0,
    };
  });

  const completedHabits = habitProgress.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? (completedHabits / habits.length) * 100 : 0;

  return {
    date: dateKey,
    habits: habitProgress,
    completionRate,
  };
}

// Weekly progress
export function calculateWeeklyProgress(
  weekStartDate: Date,
  habits: Habit[],
  completions: HabitCompletion[]
): WeeklyProgress {
  const weekDates = getWeekDates(weekStartDate);
  const days = weekDates.map(date => 
    calculateDailyProgress(date, habits, completions)
  );

  const totalCompletions = days.reduce((sum, day) => 
    sum + day.habits.filter(h => h.completed).length, 0
  );
  const totalPossible = habits.length * 7;
  const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;

  return {
    weekStartDate: formatDateKey(weekStartDate),
    days,
    totalHabits: habits.length,
    completedHabits: totalCompletions,
    completionRate,
  };
}

// Local storage utilities
const HABITS_KEY = 'habit-tracker-habits';
const COMPLETIONS_KEY = 'habit-tracker-completions';

export function saveHabitsToStorage(habits: Habit[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }
}

export function loadHabitsFromStorage(): Habit[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HABITS_KEY);
    if (stored) {
      const habits = JSON.parse(stored);
      return habits.map((h: any) => ({
        ...h,
        createdAt: new Date(h.createdAt),
        updatedAt: new Date(h.updatedAt),
      }));
    }
  } catch (error) {
    console.error('Error loading habits from storage:', error);
  }
  return [];
}

export function saveCompletionsToStorage(completions: HabitCompletion[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  }
}

export function loadCompletionsFromStorage(): HabitCompletion[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(COMPLETIONS_KEY);
    if (stored) {
      const completions = JSON.parse(stored);
      return completions.map((c: any) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      }));
    }
  } catch (error) {
    console.error('Error loading completions from storage:', error);
  }
  return [];
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Color utilities
export function getContrastColor(backgroundColor: string): string {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}