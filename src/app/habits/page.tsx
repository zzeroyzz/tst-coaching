// app/habits/page.tsx - Today view with neo-brutalist styling
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutline } from '@heroicons/react/24/outline';
import { useHabits } from '@/contexts/HabitContext';
import { calculateStreak, getTodayKey } from '@/lib/habit-utils';
import { clsx } from 'clsx';

interface HabitCardProps {
  habit: {
    id: string;
    name: string;
    icon: string;
    color: string;
    targetCount: number;
  };
  completed: boolean;
  count: number;
  streak: number;
  onToggle: () => void;
  onUpdateCount: (count: number) => void;
}

function HabitCard({ habit, completed, count, streak, onToggle, onUpdateCount }: HabitCardProps) {
  const progress = habit.targetCount > 1 ? Math.min(count / habit.targetCount, 1) : (completed ? 1 : 0);
  const isMultiCount = habit.targetCount > 1;

  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Icon */}
          <div
            className="w-12 h-12 border-3 border-nb-border flex items-center justify-center text-xl font-bold"
            style={{ backgroundColor: habit.color }}
          >
            {habit.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-nb-ink truncate">{habit.name}</h3>
            <div className="flex items-center space-x-3 mt-1">
              {streak > 0 && (
                <span className="text-sm text-nb-amber font-black">
                  🔥 {streak} day{streak !== 1 ? 's' : ''}
                </span>
              )}
              {isMultiCount && (
                <span className="text-sm text-nb-ink/70 font-bold">
                  {count}/{habit.targetCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {isMultiCount ? (
            <>
              <button
                onClick={() => onUpdateCount(Math.max(0, count - 1))}
                className="w-8 h-8 bg-nb-pink border-3 border-nb-border shadow-nb-sm flex items-center justify-center hover:shadow-none transition-all font-bold"
                disabled={count <= 0}
              >
                <MinusIcon className="w-4 h-4 text-nb-ink" />
              </button>

              <span className="w-8 text-center font-black text-nb-ink text-lg">
                {count}
              </span>

              <button
                onClick={() => onUpdateCount(count + 1)}
                className="w-8 h-8 bg-nb-green border-3 border-nb-border shadow-nb-sm flex items-center justify-center hover:shadow-none transition-all"
              >
                <PlusIcon className="w-4 h-4 text-nb-ink" />
              </button>
            </>
          ) : (
            <button
              onClick={onToggle}
              className="w-8 h-8 flex items-center justify-center"
            >
              {completed ? (
                <CheckCircleIcon
                  className="w-8 h-8 text-nb-green"
                />
              ) : (
                <CheckCircleOutline className="w-8 h-8 text-nb-ink/30" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for multi-count habits */}
      {isMultiCount && (
        <div className="mt-3">
          <div className="w-full bg-nb-ink/20 border-2 border-nb-border h-3">
            <div
              className="h-full border-r-2 border-nb-border transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: habit.color
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function TodayPage() {
  const { state, toggleHabit, updateHabitCount, initializeDefaultHabits } = useHabits();
  const [todayKey] = useState(getTodayKey());
  const [today, setToday] = useState<Date | null>(null);

  // Initialize default habits if none exist
  useEffect(() => {
    if (!state.isLoading && state.habits.length === 0) {
      initializeDefaultHabits();
    }
  }, [state.isLoading, state.habits.length, initializeDefaultHabits]);

  // Set today date on client side to avoid hydration mismatch
  useEffect(() => {
    setToday(new Date());
  }, []);

  if (state.isLoading || !today) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-3 border-nb-border bg-nb-teal animate-pulse"></div>
      </div>
    );
  }
  const activeHabits = state.habits.filter(h => h.isActive);

  // Get today's completions
  const todayCompletions = state.completions.filter(c => c.date === todayKey);
  const completedCount = todayCompletions.filter(c => c.completed).length;
  const totalCount = activeHabits.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-nb-lilac/40">
      {/* Header */}
      <div className="bg-nb-bg border-b-3 border-nb-border">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-nb-ink">Today</h1>
              <p className="text-nb-ink/70 mt-1 font-bold">
                {format(today, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>

            {/* Progress Circle - Neo-brutalist style */}
            <div className="relative w-16 h-16 bg-nb-bg border-3 border-nb-border shadow-nb-md">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-nb-ink">
                  {completionPercentage}%
                </span>
              </div>
              <div
                className="absolute bottom-0 left-0 bg-nb-teal transition-all duration-300"
                style={{
                  height: `${completionPercentage}%`,
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-4 p-3 bg-nb-yellow border-3 border-nb-border shadow-nb-sm">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-nb-ink">
                {completedCount} of {totalCount} habits completed
              </span>
              {completionPercentage === 100 && (
                <span className="text-nb-ink">🎉 Perfect day!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="px-4 py-6 space-y-4">
        {activeHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-black text-nb-ink mb-2">No habits yet</h3>
            <p className="text-nb-ink/70 font-bold">Add some habits to get started!</p>
          </div>
        ) : (
          activeHabits.map((habit) => {
            const completion = todayCompletions.find(c => c.habitId === habit.id);
            const completed = completion?.completed || false;
            const count = completion?.count || 0;
            const streak = calculateStreak(state.completions, habit.id).currentStreak;

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={completed}
                count={count}
                streak={streak}
                onToggle={() => toggleHabit(habit.id)}
                onUpdateCount={(newCount) => updateHabitCount(habit.id, newCount)}
              />
            );
          })
        )}
      </div>

      {/* Motivational Message */}
      {completedCount > 0 && completedCount < totalCount && (
        <div className="px-4 pb-6">
          <div className="bg-nb-pink border-3 border-nb-border shadow-nb-md p-4">
            <p className="text-nb-ink font-black text-center">
              {completedCount === totalCount - 1
                ? "Almost there! One more to go! 💪"
                : `Great progress! ${totalCount - completedCount} more to go! 🌟`
              }
            </p>
          </div>
        </div>
      )}

      {completionPercentage === 100 && (
        <div className="px-4 pb-6">
          <div className="bg-nb-green border-3 border-nb-border shadow-nb-lg p-4">
            <p className="text-nb-ink font-black text-center">
              🎉 Amazing! You've completed all your habits today! 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
