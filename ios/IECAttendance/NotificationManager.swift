import Foundation
import UserNotifications

class NotificationManager: ObservableObject {
    @Published var permissionGranted = false
    
    init() {
        checkPermission()
    }
    
    func checkPermission() {
        UNUserNotificationCenter.current().getNotificationSettings { settings in
            DispatchQueue.main.async {
                self.permissionGranted = settings.authorizationStatus == .authorized
            }
        }
    }
    
    func requestPermission() {
        guard UserDefaults.standard.object(forKey: "iec_pref_clock_approved") as? Bool ?? true else { return }
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            DispatchQueue.main.async {
                self.permissionGranted = granted
                if let error = error {
                    print("Error requesting notification auth: \(error.localizedDescription)")
                }
            }
        }
    }
    
    func updateClockEnabledStatus() {
        let approved = UserDefaults.standard.object(forKey: "iec_pref_clock_approved") as? Bool ?? true
        if !approved {
            cancelAllNotifications()
        }
    }
    
    func scheduleWorkdayNotifications(warningDate: Date, snoozeEnabled: Bool, snoozeIntervalMinutes: Int) {
        // Cancel existing ones first
        cancelAllNotifications()
        
        guard UserDefaults.standard.object(forKey: "iec_pref_clock_approved") as? Bool ?? true else { return }
        
        // 1. Schedule main warning alert (at 11:50 of presence time)
        let mainContent = UNMutableNotificationContent()
        mainContent.title = "חברת החשמל - סיום יום עבודה"
        mainContent.body = "זמן הנוכחות הכולל שלך הגיע ל-11:50. עליך לסיים את היום!"
        mainContent.sound = .default
        mainContent.badge = 1
        
        let secondsFromNow = warningDate.timeIntervalSince(Date())
        guard secondsFromNow > 0 else {
            // If testing or already past warning time, schedule in 1 second
            scheduleNotification(content: mainContent, secondsFromNow: 1, identifier: "shift_warning_main")
            if snoozeEnabled {
                scheduleSnoozes(startingAt: Date().addingTimeInterval(1), intervalMinutes: snoozeIntervalMinutes)
            }
            return
        }
        
        scheduleNotification(content: mainContent, secondsFromNow: secondsFromNow, identifier: "shift_warning_main")
        
        // 2. Schedule snooze alerts if enabled
        if snoozeEnabled {
            scheduleSnoozes(startingAt: warningDate, intervalMinutes: snoozeIntervalMinutes)
        }
    }
    
    private func scheduleSnoozes(startingAt baseDate: Date, intervalMinutes: Int) {
        // Schedule 12 snoozes
        for i in 1...12 {
            let snoozeContent = UNMutableNotificationContent()
            snoozeContent.title = "חברת החשמל - תזכורת יציאה"
            snoozeContent.body = "עברו \(i * intervalMinutes) דקות משעת היעד! נא אשר סיום יום עבודה."
            snoozeContent.sound = .default
            snoozeContent.badge = NSNumber(value: i + 1)
            
            let snoozeInterval = baseDate.timeIntervalSince(Date()) + Double(i * intervalMinutes * 60)
            if snoozeInterval > 0 {
                scheduleNotification(
                    content: snoozeContent,
                    secondsFromNow: snoozeInterval,
                    identifier: "shift_warning_snooze_\(i)"
                )
            }
        }
    }
    
    private func scheduleNotification(content: UNNotificationContent, secondsFromNow seconds: TimeInterval, identifier: String) {
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: seconds, repeats: false)
        let request = UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
        
        UNUserNotificationCenter.current().add(request) { error in
            if let error = error {
                print("Failed to schedule notification [\(identifier)]: \(error.localizedDescription)")
            } else {
                print("Scheduled notification [\(identifier)] in \(seconds) seconds")
            }
        }
    }
    
    func cancelAllNotifications() {
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        UNUserNotificationCenter.current().removeAllDeliveredNotifications()
        UNUserNotificationCenter.current().setBadgeCount(0) { error in
            if let error = error {
                print("Failed to clear badge: \(error)")
            }
        }
        print("Cancelled all workday notifications")
    }
}
