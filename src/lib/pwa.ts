// lib/pwa.ts
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered successfully:', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                showUpdateNotification();
              }
            });
          }
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SKIP_WAITING') {
            window.location.reload();
          }
        });
        
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    });
  }
}

export function showUpdateNotification() {
  // Show a subtle notification that an update is available
  if (confirm('A new version is available. Reload to update?')) {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}

export function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    return Notification.requestPermission();
  }
  return Promise.resolve('denied');
}

export function scheduleHabitReminder(time: string) {
  // This would integrate with the service worker to schedule push notifications
  console.log('Scheduling habit reminder for:', time);
}

// Check if app is running as PWA
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

// Install prompt handling
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    hideInstallButton();
    deferredPrompt = null;
  });
}

function showInstallButton() {
  // This would show an install button in your UI
  console.log('App can be installed');
}

function hideInstallButton() {
  // This would hide the install button
  console.log('Install button hidden');
}

export async function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('Install prompt outcome:', outcome);
    deferredPrompt = null;
  }
}

// Offline habit logging
export function logHabitOffline(habitData: any) {
  // Store habit log in IndexedDB for syncing when online
  if ('indexedDB' in window) {
    const request = indexedDB.open('TST_Coaching', 1);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as any).result;
      if (!db.objectStoreNames.contains('pendingHabits')) {
        const store = db.createObjectStore('pendingHabits', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp');
      }
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as any).result;
      const transaction = db.transaction(['pendingHabits'], 'readwrite');
      const store = transaction.objectStore('pendingHabits');
      
      store.add({
        ...habitData,
        timestamp: Date.now(),
        synced: false
      });
      
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then((registration) => {
          return registration.sync.register('habit-log-sync');
        });
      }
    };
  }
}