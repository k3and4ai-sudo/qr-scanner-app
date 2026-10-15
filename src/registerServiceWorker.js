// Service Worker Registration Helper with Update Notification Support

let refreshing = false;

// Reload page when new service worker takes control
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

export function registerServiceWorker({ onUpdate } = {}) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = './sw.js';
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[PWA] Service Worker registered scope:', registration.scope);

        // Check if there is already a waiting worker
        if (registration.waiting) {
          console.log('[PWA] A new worker is already waiting to activate');
          if (onUpdate) {
            onUpdate(registration.waiting);
          }
          return;
        }

        // Listen for new worker installs
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available!
                console.log('[PWA] New version installed and waiting for activation');
                if (onUpdate) {
                  onUpdate(installingWorker);
                }
              } else {
                console.log('[PWA] App is cached for offline use for the first time.');
              }
            }
          };
        };

        // Periodically check for updates (every 30 minutes, or when window regains focus)
        window.addEventListener('focus', () => {
          registration.update().catch(() => {});
        });
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
      });
  });
}

// Function to activate the waiting worker
export function applyUpdate(waitingWorker) {
  if (waitingWorker) {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  } else if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg && reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  } else {
    window.location.reload();
  }
}
