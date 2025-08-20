import { builder } from '../builder';
import { Habit, HabitLog } from '../types/habit';

// Input types
const CreateHabitInput = builder.inputType('CreateHabitInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    description: t.string(),
    color: t.string(),
    frequency: t.string(),
    targetCount: t.int()
  })
});

const UpdateHabitInput = builder.inputType('UpdateHabitInput', {
  fields: (t) => ({
    name: t.string(),
    description: t.string(),
    color: t.string(),
    frequency: t.string(),
    targetCount: t.int(),
    isActive: t.boolean()
  })
});

const LogHabitInput = builder.inputType('LogHabitInput', {
  fields: (t) => ({
    habitId: t.id({ required: true }),
    date: t.string({ required: true }), // ISO date string
    completed: t.boolean(),
    count: t.int(),
    notes: t.string()
  })
});

// Add mutationType to builder if not already defined
if (!builder.toSchema().getMutationType()) {
  builder.mutationType({});
}

// Create a new habit
builder.mutationField('createHabit', (t) =>
  t.field({
    type: Habit,
    args: {
      input: t.arg({ type: CreateHabitInput, required: true })
    },
    resolve: async (_, { input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Mock implementation - replace with actual database insert
      const newHabit = {
        id: `habit-${Date.now()}`,
        user_id: user.id,
        name: input.name,
        description: input.description || null,
        color: input.color || '#3B82F6',
        frequency: input.frequency || 'daily',
        target_count: input.targetCount || 1,
        is_custom: true,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return newHabit;
    }
  })
);

// Add a predefined habit to user's habits
builder.mutationField('addPredefinedHabit', (t) =>
  t.field({
    type: Habit,
    args: {
      predefinedHabitId: t.arg.id({ required: true })
    },
    resolve: async (_, { predefinedHabitId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Mock implementation - replace with actual logic
      // This would copy a predefined habit to the user's habits
      const newHabit = {
        id: `habit-${Date.now()}`,
        user_id: user.id,
        name: 'Drink Water', // Would get from predefined habit
        description: 'Stay hydrated throughout the day',
        color: '#3B82F6',
        frequency: 'daily',
        target_count: 8,
        is_custom: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return newHabit;
    }
  })
);

// Update an existing habit
builder.mutationField('updateHabit', (t) =>
  t.field({
    type: Habit,
    args: {
      id: t.arg.id({ required: true }),
      input: t.arg({ type: UpdateHabitInput, required: true })
    },
    resolve: async (_, { id, input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Mock implementation - replace with actual database update
      const updatedHabit = {
        id: id.toString(),
        user_id: user.id,
        name: input.name || 'Updated Habit',
        description: input.description || null,
        color: input.color || '#3B82F6',
        frequency: input.frequency || 'daily',
        target_count: input.targetCount || 1,
        is_custom: true,
        is_active: input.isActive ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return updatedHabit;
    }
  })
);

// Delete a habit
builder.mutationField('deleteHabit', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      id: t.arg.id({ required: true })
    },
    resolve: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Mock implementation - replace with actual database delete
      return true;
    }
  })
);

// Log habit completion
builder.mutationField('logHabit', (t) =>
  t.field({
    type: HabitLog,
    args: {
      input: t.arg({ type: LogHabitInput, required: true })
    },
    resolve: async (_, { input }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Mock implementation - replace with actual database upsert
      const habitLog = {
        id: `log-${Date.now()}`,
        habit_id: input.habitId.toString(),
        user_id: user.id,
        date: input.date,
        completed: input.completed ?? true,
        count: input.count || 1,
        notes: input.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return habitLog;
    }
  })
);