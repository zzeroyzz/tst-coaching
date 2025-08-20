// app/habits/weekly/page.tsx - Weekly view with neo-brutalist styling
"use client";

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useHabits } from '@/contexts/HabitContext';
import { calculateWeeklyProgress, formatDateKey } from '@/lib/habit-utils';
import { clsx } from 'clsx';

interface WeeklyCalendarProps {
  habits: any[];
  completions: any[];
  currentWeek: Date;
}

function WeeklyCalendar({ habits, completions, currentWeek }: WeeklyCalendarProps) {
  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    setToday(new Date());
  }, []);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const weeklyProgress = calculateWeeklyProgress(weekStart, habits, completions);

  if (!today) {
    return <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4 animate-pulse h-32"></div>;
  }

  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-center text-xs font-black text-nb-ink py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, dayIndex) => {
          const dayProgress = weeklyProgress.days[dayIndex];
          const completionRate = dayProgress.completionRate;
          const isToday = isSameDay(day, today);
          
          return (
            <div key={day.toISOString()} className="aspect-square">
              <div 
                className={clsx(
                  "w-full h-full border-3 border-nb-border flex flex-col items-center justify-center transition-all relative overflow-hidden",
                  isToday 
                    ? "bg-nb-yellow shadow-nb-sm" 
                    : "bg-nb-bg",
                  completionRate === 100 && "bg-nb-green"
                )}
              >
                <span className={clsx(
                  "text-sm font-black relative z-10",
                  isToday ? "text-nb-ink" : "text-nb-ink"
                )}>
                  {format(day, 'd')}
                </span>
                
                {habits.length > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-nb-ink/20">
                    <div 
                      className="h-full bg-nb-teal transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface HabitWeekRowProps {
  habit: any;
  completions: any[];
  currentWeek: Date;
  onToggle: (habitId: string, date: string) => void;
}

function HabitWeekRow({ habit, completions, currentWeek, onToggle }: HabitWeekRowProps) {
  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    setToday(new Date());
  }, []);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  if (!today) {
    return <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4 animate-pulse h-24"></div>;
  }

  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-8 h-8 border-3 border-nb-border flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: habit.color }}
        >
          {habit.icon}
        </div>
        <span className="font-black text-nb-ink flex-1">{habit.name}</span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day);
          const completion = completions.find(c => 
            c.habitId === habit.id && c.date === dateKey
          );
          const isCompleted = completion?.completed || false;
          const isToday = isSameDay(day, today);

          return (
            <button
              key={dateKey}
              onClick={() => onToggle(habit.id, dateKey)}
              className={clsx(
                "aspect-square border-3 border-nb-border transition-all flex items-center justify-center hover:shadow-nb-sm",
                isCompleted 
                  ? "shadow-nb-sm"
                  : "bg-nb-bg hover:bg-nb-lilac/30",
                isToday && !isCompleted && "bg-nb-yellow"
              )}
              style={isCompleted ? { backgroundColor: habit.color } : {}}
            >
              {isCompleted && (
                <svg className="w-4 h-4 text-nb-ink" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WeeklyPage() {
  const [currentWeek, setCurrentWeek] = useState<Date | null>(null);
  const { state, toggleHabit } = useHabits();

  // Set current week on client side to avoid hydration mismatch
  useEffect(() => {
    setCurrentWeek(new Date());
  }, []);

  const goToPreviousWeek = () => currentWeek && setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => currentWeek && setCurrentWeek(addWeeks(currentWeek, 1));
  const goToCurrentWeek = () => setCurrentWeek(new Date());

  if (state.isLoading || !currentWeek) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-3 border-nb-border bg-nb-teal animate-pulse"></div>
      </div>
    );
  }

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const activeHabits = state.habits.filter(h => h.isActive);
  const weeklyProgress = calculateWeeklyProgress(weekStart, activeHabits, state.completions);

  return (
    <div className="min-h-screen bg-nb-lilac/40">
      {/* Header */}
      <div className="bg-nb-bg border-b-3 border-nb-border">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-nb-ink">Weekly</h1>
            
            <button
              onClick={goToCurrentWeek}
              className="px-3 py-1 text-sm bg-nb-teal text-nb-ink font-black border-3 border-nb-border shadow-nb-sm hover:shadow-none transition-all"
            >
              Today
            </button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousWeek}
              className="p-2 bg-nb-bg border-3 border-nb-border shadow-nb-sm hover:shadow-none transition-all"
            >
              <ChevronLeftIcon className="w-5 h-5 text-nb-ink" />
            </button>
            
            <div className="text-center">
              <h2 className="text-lg font-black text-nb-ink">
                {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
              </h2>
            </div>
            
            <button
              onClick={goToNextWeek}
              className="p-2 bg-nb-bg border-3 border-nb-border shadow-nb-sm hover:shadow-none transition-all"
            >
              <ChevronRightIcon className="w-5 h-5 text-nb-ink" />
            </button>
          </div>

          {/* Week Summary */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center bg-nb-pink border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {Math.round(weeklyProgress.completionRate)}%
              </div>
              <div className="text-sm text-nb-ink font-bold">Completion</div>
            </div>
            <div className="text-center bg-nb-green border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {weeklyProgress.completedHabits}
              </div>
              <div className="text-sm text-nb-ink font-bold">Completed</div>
            </div>
            <div className="text-center bg-nb-yellow border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {weeklyProgress.totalHabits * 7}
              </div>
              <div className="text-sm text-nb-ink font-bold">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Weekly Calendar Overview */}
        <div>
          <h3 className="text-xl font-black text-nb-ink mb-4">Week Overview</h3>
          <WeeklyCalendar 
            habits={activeHabits}
            completions={state.completions}
            currentWeek={currentWeek}
          />
        </div>

        {/* Individual Habits */}
        <div>
          <h3 className="text-xl font-black text-nb-ink mb-4">Habits</h3>
          <div className="space-y-4">
            {activeHabits.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-black text-nb-ink mb-2">No habits to track</h3>
                <p className="text-nb-ink/70 font-bold">Add some habits to see your weekly progress!</p>
              </div>
            ) : (
              activeHabits.map((habit) => (
                <HabitWeekRow
                  key={habit.id}
                  habit={habit}
                  completions={state.completions}
                  currentWeek={currentWeek}
                  onToggle={toggleHabit}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}