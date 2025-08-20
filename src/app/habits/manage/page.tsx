// app/habits/manage/page.tsx - Habits management with neo-brutalist styling
"use client";

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useHabits } from '@/contexts/HabitContext';
import { Habit, HABIT_COLORS, HABIT_ICONS } from '@/types/habits';
import { clsx } from 'clsx';

interface HabitFormProps {
  habit?: Habit;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    description: habit?.description || '',
    color: habit?.color || HABIT_COLORS[0],
    icon: habit?.icon || HABIT_ICONS[0],
    frequency: habit?.frequency || 'daily' as const,
    targetCount: habit?.targetCount || 1,
    isActive: habit?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-nb-ink/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-nb-bg border-3 border-nb-border shadow-nb-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-nb-ink">
              {habit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-nb-lilac/30 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-nb-ink" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Habit Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink placeholder-nb-ink/50 bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
                placeholder="e.g., Drink Water"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink placeholder-nb-ink/50 bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all resize-none"
                placeholder="Brief description of your habit"
                rows={3}
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {HABIT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={clsx(
                      "aspect-square border-3 border-nb-border flex items-center justify-center text-lg transition-all",
                      formData.icon === icon
                        ? "bg-nb-yellow shadow-nb-md"
                        : "bg-nb-bg hover:bg-nb-lilac/30 shadow-nb-sm"
                    )}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={clsx(
                      "aspect-square border-3 border-nb-border transition-all",
                      formData.color === color
                        ? "shadow-nb-md scale-110"
                        : "shadow-nb-sm hover:shadow-nb-md"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Target Count */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Target Count per Day
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.targetCount}
                onChange={(e) => setFormData({ ...formData, targetCount: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
              />
              <p className="text-xs text-nb-ink/60 mt-1 font-bold">
                For simple habits, use 1. For countable habits like "drink 8 glasses of water", use the target number.
              </p>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'custom' })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only"
                />
                <div className={clsx(
                  "w-6 h-6 border-3 border-nb-border shadow-nb-sm flex items-center justify-center transition-all",
                  formData.isActive ? "bg-nb-green" : "bg-nb-bg"
                )}>
                  {formData.isActive && (
                    <svg className="w-4 h-4 text-nb-ink" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="ml-3 font-black text-nb-ink">Active</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 bg-nb-bg border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-nb-teal border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
              >
                {habit ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

interface HabitItemProps {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

function HabitItem({ habit, onEdit, onDelete, onToggleActive }: HabitItemProps) {
  return (
    <div className={clsx(
      "bg-nb-bg border-3 border-nb-border shadow-nb-md p-4 transition-opacity",
      !habit.isActive && "opacity-60"
    )}>
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div 
          className="w-12 h-12 border-3 border-nb-border flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ backgroundColor: habit.color }}
        >
          {habit.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-black text-nb-ink truncate">{habit.name}</h3>
            {!habit.isActive && (
              <span className="text-xs bg-nb-pink border-2 border-nb-border px-2 py-1 font-bold text-nb-ink">
                INACTIVE
              </span>
            )}
          </div>
          {habit.description && (
            <p className="text-sm text-nb-ink/70 font-bold mt-1 truncate">
              {habit.description}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-xs font-bold text-nb-ink/60">
            <span>Target: {habit.targetCount}/day</span>
            <span>Frequency: {habit.frequency}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onToggleActive}
            className={clsx(
              "w-8 h-8 border-3 border-nb-border shadow-nb-sm flex items-center justify-center transition-all hover:shadow-none",
              habit.isActive ? "bg-nb-green" : "bg-nb-yellow"
            )}
            title={habit.isActive ? "Deactivate" : "Activate"}
          >
            {habit.isActive ? (
              <svg className="w-4 h-4 text-nb-ink" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-nb-ink" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <button
            onClick={onEdit}
            className="w-8 h-8 bg-nb-yellow border-3 border-nb-border shadow-nb-sm flex items-center justify-center hover:shadow-none transition-all"
            title="Edit"
          >
            <PencilIcon className="w-4 h-4 text-nb-ink" />
          </button>
          
          <button
            onClick={onDelete}
            className="w-8 h-8 bg-nb-pink border-3 border-nb-border shadow-nb-sm flex items-center justify-center hover:shadow-none transition-all"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4 text-nb-ink" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePage() {
  const { state, addHabit, updateHabit, deleteHabit } = useHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const handleAddHabit = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleSaveHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingHabit) {
      updateHabit({ ...editingHabit, ...habitData });
    } else {
      addHabit(habitData);
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit? This will remove all related progress.')) {
      deleteHabit(habitId);
    }
  };

  const handleToggleActive = (habit: Habit) => {
    updateHabit({ ...habit, isActive: !habit.isActive });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-3 border-nb-border bg-nb-teal animate-pulse"></div>
      </div>
    );
  }

  const activeHabits = state.habits.filter(h => h.isActive);
  const inactiveHabits = state.habits.filter(h => !h.isActive);

  return (
    <div className="min-h-screen bg-nb-lilac/40">
      {/* Header */}
      <div className="bg-nb-bg border-b-3 border-nb-border">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-nb-ink">Manage Habits</h1>
              <p className="text-nb-ink/70 mt-1 font-bold">
                Add, edit, and organize your habits
              </p>
            </div>
            
            <button
              onClick={handleAddHabit}
              className="flex items-center space-x-2 px-4 py-2 bg-nb-teal border-3 border-nb-border shadow-nb-md font-black text-nb-ink hover:shadow-none transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Habit</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center bg-nb-green border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {activeHabits.length}
              </div>
              <div className="text-sm text-nb-ink font-bold">Active</div>
            </div>
            <div className="text-center bg-nb-pink border-3 border-nb-border shadow-nb-sm p-3">
              <div className="text-2xl font-black text-nb-ink">
                {inactiveHabits.length}
              </div>
              <div className="text-sm text-nb-ink font-bold">Inactive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Active Habits */}
        {activeHabits.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-nb-ink mb-4">Active Habits</h3>
            <div className="space-y-4">
              {activeHabits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onEdit={() => handleEditHabit(habit)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                  onToggleActive={() => handleToggleActive(habit)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inactive Habits */}
        {inactiveHabits.length > 0 && (
          <div>
            <h3 className="text-xl font-black text-nb-ink mb-4">Inactive Habits</h3>
            <div className="space-y-4">
              {inactiveHabits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onEdit={() => handleEditHabit(habit)}
                  onDelete={() => handleDeleteHabit(habit.id)}
                  onToggleActive={() => handleToggleActive(habit)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {state.habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-black text-nb-ink mb-2">No habits yet</h3>
            <p className="text-nb-ink/70 font-bold mb-6">Create your first habit to get started!</p>
            <button
              onClick={handleAddHabit}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-nb-teal border-3 border-nb-border shadow-nb-md font-black text-nb-ink hover:shadow-none transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Your First Habit</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <HabitForm
          habit={editingHabit || undefined}
          onSave={handleSaveHabit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}