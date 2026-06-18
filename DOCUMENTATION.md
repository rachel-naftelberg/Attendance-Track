# Technical Documentation - Attendance Tracker PWA

## 1. Overview & Architecture
The Attendance Tracker is a Progressive Web Application (PWA) designed to calculate, track, and alert users regarding their workday duration, factoring in commute times based on distance differences between regular and alternate work locations.

The architecture is split into two primary components:
- **Frontend**: A static HTML/JS/CSS application hosted on GitHub Pages. It leverages `localStorage` for state management (following a strict Zero Storage policy on central servers) and runs entirely in the client's browser.
- **Backend (Webhooks & Cron)**: A serverless Google Apps Script (GAS) deployment that acts purely as a time-driven scheduling engine. It stores pending alerts temporarily and dispatches Telegram webhook messages.

## 2. Frontend Application

### Technology Stack
- **Structure & Style**: HTML5, Vanilla JavaScript, and TailwindCSS (loaded via CDN). FontAwesome is used for icons.
- **PWA Capabilities**: `manifest.json` handles home-screen installation properties. `sw.js` (Service Worker) provides offline caching, caching static assets up to a specific version (`v32`).

### Core Modules
1. **State Management (`app.js`)**: 
   All settings (Target Hours, API Tokens, Selected Workplaces) and historical logs are serialized and persisted in `localStorage`. There is absolutely no external database (Zero Storage Principle).
2. **Time Calculation Logic**:
   - Compares the distance (pre-coded matrix or mapped zones) between the user's "Regular Site" and "Current Site".
   - Computes extra commute time allowed.
   - Calculates the exact `warningDate` combining real-world check-in time + working target hours - commuting benefits.
3. **Pipedream / Google Apps Script Integration**:
   When a shift starts, `app.js` dispatches an asynchronous `POST` request (using `mode: 'no-cors'` to avoid browser pre-flight issues across domains) to the Google Apps Script Webhook URL. It transmits a JSON payload disguised as `text/plain` to securely bridge browser restrictions.

## 3. Backend (Google Apps Script)

The backend is built as an independent Google Apps Script Web App. It serves the role of an accurate, highly reliable remote cron-job engine that overrides the limitations of iOS background execution constraints.

### The Problem it Solves
Mobile operating systems (especially iOS) suspend Javascript execution when a browser is put to the background, preventing `setTimeout` or local Service Worker delays from firing reliably after hours of inactivity. To guarantee an alert is sent 11-12 hours into a shift, a remote server is needed.

### Precise Polling Mechanism
Google Apps Script's built-in `timeBased().after()` triggers have a known documentation limitation of being imprecise (delaying execution by up to 15 minutes). To counter this and achieve **exact minute precision**:
- The GAS script utilizes a `timeBased().everyMinutes(1)` recurring trigger.
- When `app.js` posts a `start` action, GAS saves the `chatId` and `endTime` via `PropertiesService`.
- It then spawns the 1-minute trigger (if it doesn't already exist).
- The `pollSnoozes()` function executes every minute, scanning all active properties.
- If `now >= targetTime`, it makes a `UrlFetchApp` call to the Telegram Bot API and automatically reschedules the next `targetTime` based on the user's selected Snooze Interval (e.g., 2 minutes, 10 minutes).
- When a user ends a shift (`action: cancel`), the property is deleted, and the 1-minute trigger destroys itself to save Google's daily quota runtime.

## 4. Privacy & Security (Zero Storage)
- **Local Persistence**: Shift history, location preferences, and start times never leave the user's device.
- **Backend Ephemerality**: The Google Apps Script only stores the Telegram `chatId` and the `endTime` timestamp. Once the shift ends or the timer is canceled, this data is permanently purged via `PropertiesService.deleteProperty()`.
- **Anonymity**: The server possesses no concept of user identities, names, or working hours—only abstract timestamps mapped to an anonymous chat ID.

## 5. Deployment Process
- **Frontend Updates**: Simply push modifications of `index.html` and `app.js` to the `main` branch of the GitHub repository. It takes ~2-3 minutes for GitHub Pages to deploy. Increment the cache version in `sw.js` to force clients to update their cached PWA instances.
- **Backend Updates**: Modifications to the Google Apps Script code must be published by selecting **Deploy -> Manage deployments -> Edit (Pencil icon) -> New Version -> Who has access: Anyone**. The generated Web App URL must then be pasted into `app.js`.
