// components/habits/HabitProgress.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Target } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  color: string;
  progress?: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
  };
  recentLogs: Array<{
    date: string;
    completed: boolean;
  }>;
}

interface HabitProgressProps {
  habits: Habit[];
}

export function HabitProgress({ habits }: HabitProgressProps) {
  // Calculate weekly progress
  const generateWeekData = () => {
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayCompletions = habits.reduce((count, habit) => {
        const dayLog = habit.recentLogs.find(log => log.date === dateString);
        return count + (dayLog?.completed ? 1 : 0);
      }, 0);
      
      weekData.push({
        date: dateString,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completions: dayCompletions,
        total: habits.length,
        percentage: habits.length > 0 ? (dayCompletions / habits.length) * 100 : 0
      });
    }
    return weekData;
  };

  const weekData = generateWeekData();
  const topHabits = habits
    .filter(h => h.progress?.currentStreak && h.progress.currentStreak > 0)
    .sort((a, b) => (b.progress?.currentStreak || 0) - (a.progress?.currentStreak || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Weekly Progress Chart */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Progress</CardTitle>
          <CardDescription>Your habit completion this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart */}
            <div className="flex items-end justify-between h-24 space-x-1">
              {weekData.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-nb-teal/20 border-2 border-nb-border relative"
                    style={{ 
                      height: `${Math.max(day.percentage, 5)}%`,
                      backgroundColor: day.percentage > 0 ? '#0D9488' : '#E5E7EB'
                    }}
                  >
                    {day.percentage === 100 && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-2 h-2 bg-nb-green rounded-full border border-nb-border" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-nb-ink/60 mt-1">{day.day}</span>
                </div>
              ))}
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-nb-teal border border-nb-border" />
                  <span className="text-nb-ink/60">Completed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-nb-green rounded-full border border-nb-border" />
                  <span className="text-nb-ink/60">Perfect Day</span>
                </div>
              </div>
              <div className="text-nb-ink/60">
                {weekData.reduce((sum, day) => sum + day.completions, 0)} total completions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Habits */}
      {topHabits.length > 0 && (
        <Card variant="flat">
          <CardHeader>
            <CardTitle className="text-lg">Top Streaks</CardTitle>
            <CardDescription>Your most consistent habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topHabits.map((habit, index) => (
                <div key={habit.id} className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 text-xs font-bold text-nb-ink">
                    {index + 1}
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full border-2 border-nb-border"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-nb-ink truncate">
                      {habit.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-nb-ink/60">
                    <TrendingUp size={12} />
                    <span>{habit.progress?.currentStreak} days</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Calendar Preview */}
      <Card variant="outline">
        <CardHeader>
          <CardTitle className="text-lg">This Month</CardTitle>
          <CardDescription>Habit completion calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Calendar className="mx-auto text-nb-ink/40" size={32} />
            <p className="text-sm text-nb-ink/60 mt-2">
              Calendar view coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}