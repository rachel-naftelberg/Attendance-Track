const CACHE_NAME = 'iec-attendance-v20';
const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'travel_db.json',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).catch(() => {
        // Offline fallback can be defined here if necessary
      });
    })
  );
});

// Fix 6: Handle scheduled notification requests from the app
// When the app sends SCHEDULE_NOTIFICATION, the SW sets a setTimeout to fire
// a push notification at the specified delay. This works even when the app tab
// is in background (as long as the Service Worker stays alive).
// NOTE: On iOS, the SW may be suspended after ~30 seconds in background,
// so for very long delays on iOS, the notification may not fire if the device
// is completely closed. On Android PWAs and desktop, this works reliably.
let scheduledNotificationTimer = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delayMs, tgToken, tgChatId } = event.data;
    
    // Cancel any previously scheduled notification
    if (scheduledNotificationTimer !== null) {
      clearTimeout(scheduledNotificationTimer);
      scheduledNotificationTimer = null;
    }
    
    console.log(`[SW] Scheduling telegram notification in ${Math.round(delayMs / 60000)} minutes`);
    
    scheduledNotificationTimer = setTimeout(() => {
      if (tgToken && tgChatId) {
        fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: tgChatId, text: title + '\n\n' + body })
        }).catch(err => console.error('[SW] Telegram fetch error:', err));
      }
      scheduledNotificationTimer = null;
    }, delayMs);
    
    // Confirm back to the page that we received it
    if (event.source) {
      event.source.postMessage({ type: 'NOTIFICATION_SCHEDULED', delayMs });
    }
  }
  
  // Handle cancel message (when shift is reset)
  if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    if (scheduledNotificationTimer !== null) {
      clearTimeout(scheduledNotificationTimer);
      scheduledNotificationTimer = null;
      console.log('[SW] Cancelled scheduled notification');
    }
  }
});
