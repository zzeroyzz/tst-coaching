import { builder } from '../builder';

export const Habit = builder.objectRef<{
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  frequency: string;
  target_count: number;
  is_custom: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}>('Habit');

export const HabitLog = builder.objectRef<{
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: boolean;
  count: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}>('HabitLog');

export const HabitProgress = builder.objectRef<{
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  total_completions: number;
}>('HabitProgress');

builder.objectType(Habit, {
  fields: (t) => ({
    id: t.exposeID('id'),
    userId: t.exposeString('user_id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    color: t.exposeString('color'),
    frequency: t.exposeString('frequency'),
    targetCount: t.exposeInt('target_count'),
    isCustom: t.exposeBoolean('is_custom'),
    isActive: t.exposeBoolean('is_active'),
    createdAt: t.exposeString('created_at'),
    updatedAt: t.exposeString('updated_at'),
    
    // Get recent logs for this habit
    recentLogs: t.field({
      type: [HabitLog],
      args: {
        days: t.arg.int({ defaultValue: 7 })
      },
      resolve: async (habit, { days }) => {
        // Mock data for now - replace with actual database query
        return [];
      }
    }),

    // Get progress stats
    progress: t.field({
      type: HabitProgress,
      resolve: async (habit) => {
        // Mock data for now - replace with actual calculation
        return {
          habit_id: habit.id,
          current_streak: 0,
          longest_streak: 0,
          completion_rate: 0,
          total_completions: 0
        };
      }
    })
  })
});

builder.objectType(HabitLog, {
  fields: (t) => ({
    id: t.exposeID('id'),
    habitId: t.exposeString('habit_id'),
    userId: t.exposeString('user_id'),
    date: t.exposeString('date'),
    completed: t.exposeBoolean('completed'),
    count: t.exposeInt('count'),
    notes: t.exposeString('notes', { nullable: true }),
    createdAt: t.exposeString('created_at'),
    updatedAt: t.exposeString('updated_at')
  })
});

builder.objectType(HabitProgress, {
  fields: (t) => ({
    habitId: t.exposeString('habit_id'),
    currentStreak: t.exposeInt('current_streak'),
    longestStreak: t.exposeInt('longest_streak'),
    completionRate: t.exposeFloat('completion_rate'),
    totalCompletions: t.exposeInt('total_completions')
  })
});

// Queries
builder.queryField('habits', (t) =>
  t.field({
    type: [Habit],
    args: {
      activeOnly: t.arg.boolean({ defaultValue: true })
    },
    resolve: async (_, { activeOnly }, { user }) => {
      if (!user) return [];
      
      // Mock data for now - replace with actual database query
      return [
        {
          id: '1',
          user_id: user.id,
          name: 'Drink Water',
          description: 'Drink 8 glasses of water daily',
          color: '#3B82F6',
          frequency: 'daily',
          target_count: 8,
          is_custom: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  })
);

builder.queryField('habit', (t) =>
  t.field({
    type: Habit,
    nullable: true,
    args: {
      id: t.arg.id({ required: true })
    },
    resolve: async (_, { id }, { user }) => {
      if (!user) return null;
      
      // Mock data for now - replace with actual database query
      return null;
    }
  })
);

// Get predefined habits that users can add
builder.queryField('predefinedHabits', (t) =>
  t.field({
    type: [Habit],
    resolve: async () => {
      // Return common predefined habits
      return [
        {
          id: 'predefined-1',
          user_id: '',
          name: 'Drink Water',
          description: 'Stay hydrated throughout the day',
          color: '#3B82F6',
          frequency: 'daily',
          target_count: 8,
          is_custom: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'predefined-2',
          user_id: '',
          name: 'Exercise',
          description: 'Get moving with any physical activity',
          color: '#EF4444',
          frequency: 'daily',
          target_count: 1,
          is_custom: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'predefined-3',
          user_id: '',
          name: 'Read',
          description: 'Read for personal growth',
          color: '#10B981',
          frequency: 'daily',
          target_count: 1,
          is_custom: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'predefined-4',
          user_id: '',
          name: 'Meditate',
          description: 'Practice mindfulness and meditation',
          color: '#8B5CF6',
          frequency: 'daily',
          target_count: 1,
          is_custom: false,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  })
);