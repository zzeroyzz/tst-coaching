// app/habits/profile/page.tsx - Profile page with neo-brutalist styling
// Force client-side rendering to avoid hydration issues
"use client";

import { useState } from 'react';
import { 
  PencilIcon, 
  CalendarIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  ClockIcon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function ProfileSection({ title, children, icon }: ProfileSectionProps) {
  return (
    <div className="bg-nb-bg border-3 border-nb-border shadow-nb-md p-6">
      <div className="flex items-center space-x-3 mb-4">
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-black text-nb-ink">{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    name: string;
    email: string;
    preferredName: string;
    timezone: string;
  };
  onSave: (data: any) => void;
}

function EditProfileModal({ isOpen, onClose, profileData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState(profileData);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-nb-ink/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-nb-bg border-3 border-nb-border shadow-nb-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-nb-ink">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-nb-lilac/30 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-nb-ink" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Preferred Name
              </label>
              <input
                type="text"
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
                placeholder="How should we address you?"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-nb-ink mb-2">
                Timezone
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border-3 border-nb-border shadow-nb-sm font-bold text-nb-ink bg-nb-bg focus:outline-none focus:shadow-nb-md transition-all"
              >
                <option value="America/New_York">Eastern Time (EST/EDT)</option>
                <option value="America/Chicago">Central Time (CST/CDT)</option>
                <option value="America/Denver">Mountain Time (MST/MDT)</option>
                <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                <option value="Europe/London">London (GMT/BST)</option>
                <option value="Europe/Paris">Paris (CET/CEST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-nb-bg border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-nb-teal border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sessions: true,
    habits: true
  });

  // Mock user data - replace with actual user context/API
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    preferredName: "Alex",
    timezone: "America/New_York",
    avatar: null
  });

  // Mock upcoming sessions - replace with actual data
  const upcomingSessions = [
    {
      id: 1,
      date: "2025-01-25",
      time: "10:00 AM",
      type: "Weekly Check-in",
      status: "confirmed"
    },
    {
      id: 2,
      date: "2025-02-01",
      time: "10:00 AM", 
      type: "Goal Setting",
      status: "pending"
    }
  ];

  const handleSaveProfile = (newData: any) => {
    setProfileData(newData);
    // Here you would typically save to API/context
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out?')) {
      // Handle sign out logic
      console.log('Signing out...');
    }
  };

  return (
    <div className="min-h-screen bg-nb-lilac/40">
      {/* Header */}
      <div className="bg-nb-bg border-b-3 border-nb-border">
        <div className="px-4 py-6">
          <h1 className="text-3xl font-black text-nb-ink">Profile</h1>
          <p className="text-nb-ink/70 mt-1 font-bold">
            Manage your account and preferences
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Profile Info */}
        <ProfileSection
          title="Profile Information"
          icon={<UserCircleIcon className="w-6 h-6 text-nb-ink" />}
        >
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-nb-lilac border-3 border-nb-border shadow-nb-md flex items-center justify-center">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-nb-ink/40" />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-lg font-black text-nb-ink">{profileData.name}</h3>
                <p className="text-sm text-nb-ink/70 font-bold">{profileData.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-nb-ink/70 font-bold">Preferred Name:</span>
                  <p className="font-black text-nb-ink">{profileData.preferredName || "Not set"}</p>
                </div>
                <div>
                  <span className="text-nb-ink/70 font-bold">Timezone:</span>
                  <p className="font-black text-nb-ink">{profileData.timezone}</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-3 px-4 bg-nb-teal border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
          >
            <PencilIcon className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        </ProfileSection>

        {/* Schedule */}
        <ProfileSection
          title="Upcoming Sessions"
          icon={<CalendarIcon className="w-6 h-6 text-nb-ink" />}
        >
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3 mb-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-nb-lilac/30 border-2 border-nb-border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-nb-ink">{session.type}</h4>
                      <p className="text-sm text-nb-ink/70 font-bold">
                        {session.date} at {session.time}
                      </p>
                    </div>
                    <span className={clsx(
                      "px-2 py-1 text-xs font-bold border-2 border-nb-border",
                      session.status === 'confirmed' ? "bg-nb-green" : "bg-nb-yellow"
                    )}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <ClockIcon className="w-12 h-12 text-nb-ink/30 mx-auto mb-2" />
              <p className="text-nb-ink/70 font-bold">No upcoming sessions</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-nb-green border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all">
              <PlusIcon className="w-5 h-5" />
              <span>Schedule New Session</span>
            </button>
            
            {upcomingSessions.length > 0 && (
              <>
                <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-nb-yellow border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all">
                  <ClockIcon className="w-5 h-5" />
                  <span>Reschedule Session</span>
                </button>
                
                <button className="flex items-center justify-center space-x-2 py-3 px-4 bg-nb-pink border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all">
                  <XMarkIcon className="w-5 h-5" />
                  <span>Cancel Session</span>
                </button>
              </>
            )}
          </div>
        </ProfileSection>

        {/* Billing */}
        <ProfileSection
          title="Billing Information"
          icon={<CreditCardIcon className="w-6 h-6 text-nb-ink" />}
        >
          <div className="space-y-4">
            <div className="bg-nb-lilac/30 border-2 border-nb-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-nb-ink">Payment Method</span>
                <span className="text-sm bg-nb-green border-2 border-nb-border px-2 py-1 font-bold text-nb-ink">
                  ACTIVE
                </span>
              </div>
              <p className="text-sm text-nb-ink/70 font-bold">•••• •••• •••• 4242</p>
              <p className="text-sm text-nb-ink/70 font-bold">Expires 12/25</p>
            </div>
            
            <div className="bg-nb-yellow/30 border-2 border-nb-border p-4">
              <h4 className="font-black text-nb-ink mb-2">Current Plan</h4>
              <p className="text-sm text-nb-ink/70 font-bold">Monthly Coaching - $150/month</p>
              <p className="text-xs text-nb-ink/60 font-bold mt-1">Next billing: February 15, 2025</p>
            </div>
            
            <button className="w-full py-3 px-4 bg-nb-teal border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all">
              Manage Billing
            </button>
          </div>
        </ProfileSection>

        {/* Settings */}
        <ProfileSection
          title="Settings"
          icon={<Cog6ToothIcon className="w-6 h-6 text-nb-ink" />}
        >
          <div className="space-y-6">
            {/* Theme */}
            <div>
              <h4 className="font-black text-nb-ink mb-3">Theme</h4>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setTheme(themeOption)}
                    className={clsx(
                      "flex items-center justify-center space-x-2 py-3 px-2 border-3 border-nb-border font-black transition-all",
                      theme === themeOption
                        ? "bg-nb-yellow shadow-nb-md"
                        : "bg-nb-bg shadow-nb-sm hover:shadow-none"
                    )}
                  >
                    {themeOption === 'light' && <SunIcon className="w-4 h-4" />}
                    {themeOption === 'dark' && <MoonIcon className="w-4 h-4" />}
                    {themeOption === 'system' && <ComputerDesktopIcon className="w-4 h-4" />}
                    <span className="text-sm capitalize">{themeOption}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <h4 className="font-black text-nb-ink mb-3">Notifications</h4>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications' },
                  { key: 'push', label: 'Mobile Push Notifications' },
                  { key: 'sessions', label: 'Session Reminders' },
                  { key: 'habits', label: 'Habit Reminders' }
                ].map((notif) => (
                  <label key={notif.key} className="flex items-center justify-between cursor-pointer">
                    <span className="font-bold text-nb-ink">{notif.label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[notif.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [notif.key]: e.target.checked
                      })}
                      className="sr-only"
                    />
                    <div className={clsx(
                      "w-6 h-6 border-3 border-nb-border shadow-nb-sm flex items-center justify-center transition-all",
                      notifications[notif.key as keyof typeof notifications] ? "bg-nb-green" : "bg-nb-bg"
                    )}>
                      {notifications[notif.key as keyof typeof notifications] && (
                        <svg className="w-4 h-4 text-nb-ink" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-nb-pink border-3 border-nb-border shadow-nb-sm font-black text-nb-ink hover:shadow-none transition-all"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </ProfileSection>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        profileData={profileData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}