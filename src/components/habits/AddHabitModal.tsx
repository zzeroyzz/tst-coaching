// components/habits/AddHabitModal.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Sparkles } from "lucide-react";
import { useCreateHabit, useAddPredefinedHabit } from "@/lib/graphql/queries/habits";

interface PredefinedHabit {
  id: string;
  name: string;
  description?: string;
  color: string;
  frequency: string;
  targetCount: number;
}

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  predefinedHabits: PredefinedHabit[];
}

export function AddHabitModal({ isOpen, onClose, predefinedHabits }: AddHabitModalProps) {
  const [activeTab, setActiveTab] = useState<'predefined' | 'custom'>('predefined');
  const [customHabit, setCustomHabit] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    frequency: 'daily',
    targetCount: 1
  });
  
  const [createHabitMutation, { loading: creating }] = useCreateHabit();
  const [addPredefinedMutation, { loading: adding }] = useAddPredefinedHabit();

  const colors = [
    '#3B82F6', // Blue
    '#EF4444', // Red  
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
    '#EF4444', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const handleAddPredefined = async (habitId: string) => {
    try {
      await addPredefinedMutation({
        variables: { predefinedHabitId: habitId }
      });
      onClose();
    } catch (error) {
      console.error('Error adding predefined habit:', error);
    }
  };

  const handleCreateCustom = async () => {
    if (!customHabit.name.trim()) return;
    
    try {
      await createHabitMutation({
        variables: {
          input: {
            name: customHabit.name.trim(),
            description: customHabit.description.trim() || undefined,
            color: customHabit.color,
            frequency: customHabit.frequency,
            targetCount: customHabit.targetCount
          }
        }
      });
      
      // Reset form
      setCustomHabit({
        name: '',
        description: '',
        color: '#3B82F6',
        frequency: 'daily',
        targetCount: 1
      });
      onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b-3 border-nb-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Add New Habit</CardTitle>
              <CardDescription>
                Choose from popular habits or create your own
              </CardDescription>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            <Button
              onClick={() => setActiveTab('predefined')}
              variant={activeTab === 'predefined' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              <Sparkles size={16} />
              <span className="ml-2">Popular Habits</span>
            </Button>
            <Button
              onClick={() => setActiveTab('custom')}
              variant={activeTab === 'custom' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
            >
              <Plus size={16} />
              <span className="ml-2">Create Custom</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'predefined' ? (
            <div className="space-y-3">
              {predefinedHabits.map(habit => (
                <Card key={habit.id} variant="outline" className="relative">
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: habit.color }}
                  />
                  <CardContent className="p-4 pl-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-nb-ink">{habit.name}</h3>
                        {habit.description && (
                          <p className="text-sm text-nb-ink/60 mt-1">
                            {habit.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-nb-ink/60">
                          <span className="capitalize">{habit.frequency}</span>
                          {habit.targetCount > 1 && (
                            <span>{habit.targetCount}x per day</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddPredefined(habit.id)}
                        disabled={adding}
                        size="sm"
                      >
                        {adding ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Habit Name */}
              <div>
                <label className="block text-sm font-bold mb-2">Habit Name</label>
                <input
                  type="text"
                  value={customHabit.name}
                  onChange={(e) => setCustomHabit(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Drink 8 glasses of water"
                  className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-sm"
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2">Description (optional)</label>
                <textarea
                  value={customHabit.description}
                  onChange={(e) => setCustomHabit(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Why is this habit important to you?"
                  rows={3}
                  className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-sm resize-none"
                />
              </div>
              
              {/* Color */}
              <div>
                <label className="block text-sm font-bold mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setCustomHabit(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded border-3 ${
                        customHabit.color === color ? 'border-nb-ink' : 'border-nb-border'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Frequency & Target */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Frequency</label>
                  <select
                    value={customHabit.frequency}
                    onChange={(e) => setCustomHabit(prev => ({ ...prev, frequency: e.target.value }))}
                    className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2">Target Count</label>
                  <input
                    type="number"
                    min="1"
                    value={customHabit.targetCount}
                    onChange={(e) => setCustomHabit(prev => ({ 
                      ...prev, 
                      targetCount: Math.max(1, parseInt(e.target.value) || 1) 
                    }))}
                    className="w-full border-3 border-nb-border px-3 py-2 bg-nb-bg shadow-nb-sm"
                  />
                </div>
              </div>
              
              {/* Create Button */}
              <Button
                onClick={handleCreateCustom}
                disabled={!customHabit.name.trim() || creating}
                className="w-full bg-nb-teal text-nb-bg"
              >
                {creating ? 'Creating...' : 'Create Habit'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}