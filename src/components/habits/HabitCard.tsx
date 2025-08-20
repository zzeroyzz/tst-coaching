// components/habits/HabitCard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Target, Flame, MoreHorizontal } from "lucide-react";
import { useLogHabit } from "@/lib/graphql/queries/habits";

interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  frequency: string;
  targetCount: number;
  progress?: {
    currentStreak: number;
    completionRate: number;
  };
  recentLogs: Array<{
    date: string;
    completed: boolean;
    count: number;
  }>;
}

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [logHabitMutation] = useLogHabit();
  
  const today = new Date().toISOString().split('T')[0];
  const todayLog = habit.recentLogs.find(log => log.date === today);
  const isCompletedToday = todayLog?.completed || false;
  const todayCount = todayLog?.count || 0;

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await logHabitMutation({
        variables: {
          input: {
            habitId: habit.id,
            date: today,
            completed: !isCompletedToday,
            count: isCompletedToday ? 0 : Math.max(todayCount + 1, 1)
          }
        }
      });
    } catch (error) {
      console.error('Error logging habit:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleIncrement = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    try {
      await logHabitMutation({
        variables: {
          input: {
            habitId: habit.id,
            date: today,
            completed: true,
            count: todayCount + 1
          }
        }
      });
    } catch (error) {
      console.error('Error incrementing habit:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  // Calculate streak display
  const streak = habit.progress?.currentStreak || 0;
  const completionRate = habit.progress?.completionRate || 0;

  return (
    <Card variant="default" className="relative overflow-hidden">
      {/* Color indicator */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: habit.color }}
      />
      
      <CardContent className="p-4 pl-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleToggleComplete}
                disabled={isCompleting}
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent"
              >
                {isCompletedToday ? (
                  <CheckCircle2 
                    className="text-nb-green" 
                    size={24}
                    style={{ color: habit.color }}
                  />
                ) : (
                  <Circle 
                    className="text-nb-ink/40 hover:text-nb-ink/60" 
                    size={24}
                  />
                )}
              </Button>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-nb-ink truncate">
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="text-sm text-nb-ink/60 truncate">
                    {habit.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress indicators */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-nb-ink/60">
              {streak > 0 && (
                <div className="flex items-center space-x-1">
                  <Flame size={12} className="text-nb-amber" />
                  <span>{streak} day streak</span>
                </div>
              )}
              
              {habit.targetCount > 1 && (
                <div className="flex items-center space-x-1">
                  <Target size={12} />
                  <span>{todayCount}/{habit.targetCount} today</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <span>{Math.round(completionRate)}% this week</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Count controls for habits with target > 1 */}
            {habit.targetCount > 1 && (
              <div className="flex items-center space-x-1">
                <Button
                  onClick={handleIncrement}
                  disabled={isCompleting}
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0 text-xs"
                >
                  +
                </Button>
                <span className="text-sm font-medium text-nb-ink min-w-[2rem] text-center">
                  {todayCount}
                </span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
            >
              <MoreHorizontal size={16} className="text-nb-ink/40" />
            </Button>
          </div>
        </div>
        
        {/* Weekly progress dots */}
        <div className="flex items-center justify-center space-x-1 mt-3">
          {[-6, -5, -4, -3, -2, -1, 0].map(dayOffset => {
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            const dateString = date.toISOString().split('T')[0];
            const dayLog = habit.recentLogs.find(log => log.date === dateString);
            const completed = dayLog?.completed || false;
            
            return (
              <div
                key={dayOffset}
                className={`w-2 h-2 rounded-full border border-nb-border ${
                  completed 
                    ? 'bg-current' 
                    : 'bg-nb-bg'
                }`}
                style={{ 
                  color: completed ? habit.color : undefined 
                }}
                title={date.toLocaleDateString()}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}