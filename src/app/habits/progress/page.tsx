// app/habits/progress/page.tsx - Progress analytics with neo-brutalist styling
"use client";

import { useState, useMemo, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useHabits } from '@/contexts/HabitContext';
import { calculateStreak, calculateWeeklyProgress } from '@/lib/habit-utils';
import { clsx } from 'clsx';

interface StreakCardProps {
  habit: any;
  completions: any[];
}

function StreakCard({ habit, completions }: StreakCardProps) {
  const streak = calculateStreak(completions, habit.id);
  
  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div 
          className="w-10 h-10 border-3 border-nb-border flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: habit.color }}
        >
          {habit.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-nb-ink truncate">{habit.name}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-2xl font-black text-nb-ink mb-1">
            🔥 {streak.currentStreak}
          </div>
          <div className="text-xs text-nb-ink/70 font-bold">Current</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-nb-ink mb-1">
            🏆 {streak.longestStreak}
          </div>
          <div className="text-xs text-nb-ink/70 font-bold">Best</div>
        </div>
      </div>
    </div>
  );
}

interface HeatmapProps {
  habits: any[];
  completions: any[];
  days: number;
}

function Heatmap({ habits, completions, days }: HeatmapProps) {
  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) {
    return <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4 animate-pulse h-48"></div>;
  }

  const startDate = subDays(today, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: today });

  const getCompletionRate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayCompletions = completions.filter(c => c.date === dateKey && c.completed);
    const activeHabitsCount = habits.filter(h => h.isActive).length;
    
    if (activeHabitsCount === 0) return 0;
    return (dayCompletions.length / activeHabitsCount) * 100;
  };

  const getIntensityClass = (rate: number) => {
    if (rate === 0) return 'bg-nb-bg';
    if (rate < 25) return 'bg-nb-pink';
    if (rate < 50) return 'bg-nb-yellow';
    if (rate < 75) return 'bg-nb-teal';
    return 'bg-nb-green';
  };

  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <h3 className="text-lg font-black text-nb-ink mb-4">Activity Heatmap</h3>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs font-bold text-nb-ink py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dateRange.map((date) => {
          const completionRate = getCompletionRate(date);
          const isToday = isSameDay(date, today);
          
          return (
            <div
              key={date.toISOString()}
              className={clsx(
                "aspect-square border-2 border-nb-border flex items-center justify-center relative",
                getIntensityClass(completionRate),
                isToday && "ring-2 ring-nb-ink"
              )}
              title={`${format(date, 'MMM d')}: ${Math.round(completionRate)}% completion`}
            >
              <span className="text-xs font-bold text-nb-ink">
                {format(date, 'd')}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className="font-bold text-nb-ink/70">Less</span>
        <div className="flex items-center space-x-1">
          {[0, 25, 50, 75, 100].map((rate) => (
            <div
              key={rate}
              className={clsx(
                "w-3 h-3 border border-nb-border",
                getIntensityClass(rate)
              )}
            />
          ))}
        </div>
        <span className="font-bold text-nb-ink/70">More</span>
      </div>
    </div>
  );
}

interface WeeklyTrendProps {
  habits: any[];
  completions: any[];
  weeksBack: number;
}

function WeeklyTrend({ habits, completions, weeksBack }: WeeklyTrendProps) {
  const [today, setToday] = useState<Date | null>(null);
  
  useEffect(() => {
    setToday(new Date());
  }, []);

  const weeks = useMemo(() => {
    if (!today) return [];
    
    const result = [];
    
    for (let i = weeksBack - 1; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekProgress = calculateWeeklyProgress(weekStart, habits, completions);
      
      result.push({
        start: weekStart,
        end: weekEnd,
        progress: weekProgress,
        label: i === 0 ? 'This week' : i === 1 ? 'Last week' : `${i} weeks ago`
      });
    }
    
    return result;
  }, [today, habits, completions, weeksBack]);

  if (!today) {
    return <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4 animate-pulse h-32"></div>;
  }

  const maxCompletion = Math.max(...weeks.map(w => w.progress.completedHabits));

  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <h3 className="text-lg font-black text-nb-ink mb-4">Weekly Trends</h3>
      
      <div className="space-y-3">
        {weeks.map((week, index) => (
          <div key={week.start.toISOString()} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-nb-ink">
                {week.label}
              </span>
              <span className="text-sm font-black text-nb-ink">
                {Math.round(week.progress.completionRate)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-nb-ink/20 border-2 border-nb-border h-4">
                <div 
                  className="h-full border-r-2 border-nb-border bg-nb-teal transition-all duration-300"
                  style={{ width: `${week.progress.completionRate}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-nb-ink/60 font-bold mt-1">
                <span>{week.progress.completedHabits} completed</span>
                <span>{week.progress.totalHabits * 7} total</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HabitStatsProps {
  habit: any;
  completions: any[];
  totalDays: number;
}

function HabitStats({ habit, completions, totalDays }: HabitStatsProps) {
  const habitCompletions = completions.filter(c => c.habitId === habit.id && c.completed);
  const completionRate = totalDays > 0 ? (habitCompletions.length / totalDays) * 100 : 0;
  const streak = calculateStreak(completions, habit.id);
  
  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 border-3 border-nb-border flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: habit.color }}
        >
          {habit.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-nb-ink truncate">{habit.name}</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-nb-ink/70">Completion Rate</span>
          <span className="text-lg font-black text-nb-ink">{Math.round(completionRate)}%</span>
        </div>
        
        <div className="w-full bg-nb-ink/20 border-2 border-nb-border h-3">
          <div 
            className="h-full border-r-2 border-nb-border transition-all duration-300"
            style={{ 
              width: `${completionRate}%`,
              backgroundColor: habit.color 
            }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-black text-nb-ink">{habitCompletions.length}</div>
            <div className="text-xs text-nb-ink/70 font-bold">Done</div>
          </div>
          <div>
            <div className="text-sm font-black text-nb-ink">{streak.currentStreak}</div>
            <div className="text-xs text-nb-ink/70 font-bold">Streak</div>
          </div>
          <div>
            <div className="text-sm font-black text-nb-ink">{streak.longestStreak}</div>
            <div className="text-xs text-nb-ink/70 font-bold">Best</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { state } = useHabits();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | '3months'>('month');
  const [today, setToday] = useState<Date | null>(null);

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
  const totalDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const heatmapDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 28 : 84; // 4 weeks, 12 weeks
  
  // Calculate overall stats
  const startDate = subDays(today, totalDays - 1);
  const recentCompletions = state.completions.filter(c => {
    const completionDate = new Date(c.date);
    return completionDate >= startDate;
  });
  
  const totalPossibleCompletions = activeHabits.length * totalDays;
  const actualCompletions = recentCompletions.filter(c => c.completed).length;
  const overallCompletionRate = totalPossibleCompletions > 0 ? (actualCompletions / totalPossibleCompletions) * 100 : 0;

  return (
    <div className="min-h-screen bg-nb-lilac/40">
      {/* Header */}
      <div className="bg-nb-bg border-b-3 border-nb-border">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-nb-ink">Progress</h1>
              <p className="text-nb-ink/70 mt-1 font-bold">
                Track your habit analytics and trends
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {[
              { key: 'week', label: '7 Days' },
              { key: 'month', label: '30 Days' },
              { key: '3months', label: '90 Days' }
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key as any)}
                className={clsx(
                  "px-4 py-2 border-3 border-nb-border font-black transition-all",
                  timeRange === range.key
                    ? "bg-nb-yellow shadow-nb-md text-nb-ink"
                    : "bg-nb-bg shadow-nb-sm text-nb-ink/70 hover:text-nb-ink hover:shadow-none"
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Overall Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center bg-nb-teal border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {Math.round(overallCompletionRate)}%
              </div>
              <div className="text-sm text-nb-ink font-bold">Overall</div>
            </div>
            <div className="text-center bg-nb-green border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {actualCompletions}
              </div>
              <div className="text-sm text-nb-ink font-bold">Completed</div>
            </div>
            <div className="text-center bg-nb-yellow border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {activeHabits.length}
              </div>
              <div className="text-sm text-nb-ink font-bold">Active Habits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {activeHabits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-black text-nb-ink mb-2">No data to analyze</h3>
            <p className="text-nb-ink/70 font-bold">Add some habits and start tracking to see your progress!</p>
          </div>
        ) : (
          <>
            {/* Heatmap */}
            <div>
              <h2 className="text-xl font-black text-nb-ink mb-4">Activity Overview</h2>
              <Heatmap 
                habits={activeHabits} 
                completions={state.completions} 
                days={heatmapDays}
              />
            </div>

            {/* Weekly Trends */}
            <div>
              <h2 className="text-xl font-black text-nb-ink mb-4">Weekly Trends</h2>
              <WeeklyTrend 
                habits={activeHabits} 
                completions={state.completions} 
                weeksBack={timeRange === 'week' ? 4 : timeRange === 'month' ? 8 : 12}
              />
            </div>

            {/* Streaks */}
            <div>
              <h2 className="text-xl font-black text-nb-ink mb-4">Current Streaks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeHabits.map((habit) => (
                  <StreakCard
                    key={habit.id}
                    habit={habit}
                    completions={state.completions}
                  />
                ))}
              </div>
            </div>

            {/* Individual Habit Stats */}
            <div>
              <h2 className="text-xl font-black text-nb-ink mb-4">Habit Performance</h2>
              <div className="space-y-4">
                {activeHabits.map((habit) => (
                  <HabitStats
                    key={habit.id}
                    habit={habit}
                    completions={recentCompletions}
                    totalDays={totalDays}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}