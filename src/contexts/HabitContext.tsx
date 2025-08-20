// contexts/HabitContext.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Habit, HabitCompletion, DEFAULT_HABITS } from '@/types/habits';
import {
  generateId,
  saveHabitsToStorage,
  loadHabitsFromStorage,
  saveCompletionsToStorage,
  loadCompletionsFromStorage,
  getTodayKey,
} from '@/lib/habit-utils';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  isLoading: boolean;
}

type HabitAction =
  | { type: 'LOAD_DATA'; habits: Habit[]; completions: HabitCompletion[] }
  | { type: 'ADD_HABIT'; habit: Habit }
  | { type: 'UPDATE_HABIT'; habit: Habit }
  | { type: 'DELETE_HABIT'; habitId: string }
  | { type: 'TOGGLE_HABIT'; habitId: string; date: string }
  | { type: 'UPDATE_HABIT_COUNT'; habitId: string; date: string; count: number }
  | { type: 'ADD_COMPLETION'; completion: HabitCompletion }
  | { type: 'SET_LOADING'; isLoading: boolean };

const initialState: HabitState = {
  habits: [],
  completions: [],
  isLoading: true,
};

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        habits: action.habits,
        completions: action.completions,
        isLoading: false,
      };

    case 'ADD_HABIT':
      const newHabits = [...state.habits, action.habit];
      saveHabitsToStorage(newHabits);
      return {
        ...state,
        habits: newHabits,
      };

    case 'UPDATE_HABIT':
      const updatedHabits = state.habits.map(h =>
        h.id === action.habit.id ? action.habit : h
      );
      saveHabitsToStorage(updatedHabits);
      return {
        ...state,
        habits: updatedHabits,
      };

    case 'DELETE_HABIT':
      const filteredHabits = state.habits.filter(h => h.id !== action.habitId);
      const filteredCompletions = state.completions.filter(c => c.habitId !== action.habitId);
      saveHabitsToStorage(filteredHabits);
      saveCompletionsToStorage(filteredCompletions);
      return {
        ...state,
        habits: filteredHabits,
        completions: filteredCompletions,
      };

    case 'TOGGLE_HABIT': {
      const existingCompletion = state.completions.find(
        c => c.habitId === action.habitId && c.date === action.date
      );

      let newCompletions: HabitCompletion[];

      if (existingCompletion) {
        // Toggle existing completion
        newCompletions = state.completions.map(c =>
          c.id === existingCompletion.id
            ? { ...c, completed: !c.completed, timestamp: new Date() }
            : c
        );
      } else {
        // Create new completion
        const newCompletion: HabitCompletion = {
          id: generateId(),
          habitId: action.habitId,
          date: action.date,
          completed: true,
          count: 1,
          timestamp: new Date(),
        };
        newCompletions = [...state.completions, newCompletion];
      }

      saveCompletionsToStorage(newCompletions);
      return {
        ...state,
        completions: newCompletions,
      };
    }

    case 'UPDATE_HABIT_COUNT': {
      const existingCompletion = state.completions.find(
        c => c.habitId === action.habitId && c.date === action.date
      );

      let newCompletions: HabitCompletion[];

      if (existingCompletion) {
        // Update existing completion
        newCompletions = state.completions.map(c =>
          c.id === existingCompletion.id
            ? { 
                ...c, 
                count: action.count, 
                completed: action.count > 0,
                timestamp: new Date() 
              }
            : c
        );
      } else if (action.count > 0) {
        // Create new completion
        const newCompletion: HabitCompletion = {
          id: generateId(),
          habitId: action.habitId,
          date: action.date,
          completed: true,
          count: action.count,
          timestamp: new Date(),
        };
        newCompletions = [...state.completions, newCompletion];
      } else {
        newCompletions = state.completions;
      }

      saveCompletionsToStorage(newCompletions);
      return {
        ...state,
        completions: newCompletions,
      };
    }

    case 'ADD_COMPLETION':
      const newCompletions = [...state.completions, action.completion];
      saveCompletionsToStorage(newCompletions);
      return {
        ...state,
        completions: newCompletions,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}

const HabitContext = createContext<{
  state: HabitState;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  toggleHabit: (habitId: string, date?: string) => void;
  updateHabitCount: (habitId: string, count: number, date?: string) => void;
  initializeDefaultHabits: () => void;
} | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load data on mount
  useEffect(() => {
    const habits = loadHabitsFromStorage();
    const completions = loadCompletionsFromStorage();
    dispatch({ type: 'LOAD_DATA', habits, completions });
  }, []);

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_HABIT', habit: newHabit });
  };

  const updateHabit = (habit: Habit) => {
    const updatedHabit = {
      ...habit,
      updatedAt: new Date(),
    };
    dispatch({ type: 'UPDATE_HABIT', habit: updatedHabit });
  };

  const deleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', habitId });
  };

  const toggleHabit = (habitId: string, date = getTodayKey()) => {
    dispatch({ type: 'TOGGLE_HABIT', habitId, date });
  };

  const updateHabitCount = (habitId: string, count: number, date = getTodayKey()) => {
    dispatch({ type: 'UPDATE_HABIT_COUNT', habitId, date, count });
  };

  const initializeDefaultHabits = () => {
    DEFAULT_HABITS.forEach(habitData => {
      addHabit(habitData);
    });
  };

  return (
    <HabitContext.Provider
      value={{
        state,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabit,
        updateHabitCount,
        initializeDefaultHabits,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}