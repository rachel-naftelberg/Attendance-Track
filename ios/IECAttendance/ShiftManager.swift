import Foundation
import Combine

enum ShiftState: String, Codable {
    case idle
    case active
    case resetPending
}

class ShiftManager: ObservableObject {
    @Published var currentState: ShiftState = .idle
    
    // Shift Data
    @Published var arrivalDate: Date?
    @Published var leaveHomeDate: Date?
    @Published var warningDate: Date?
    @Published var maxEndDate: Date?
    
    @Published var arrivalBuildingId: String = ""
    @Published var arrivalBuildingName: String = ""
    @Published var travelToSiteMinutes: Int = 0
    
    @Published var returnBuildingId: String = ""
    @Published var returnBuildingName: String = ""
    @Published var travelBackMinutes: Int = 0
    
    @Published var snoozeEnabled: Bool = true
    @Published var snoozeIntervalMinutes: Int = 5
    
    // App-wide Preferences (Persistent, not wiped on shift reset)
    @Published var defaultCity: String?
    @Published var defaultSnoozePreference: Bool = true
    @Published var defaultSnoozeIntervalMinutes: Int = 5
    @Published var gpsUsageApproved: Bool = true
    @Published var clockUsageApproved: Bool = true
    
    // UserDefaults Keys (Zero Storage for shift data)
    private let stateKey = "iec_new_shift_state"
    private let arrivalDateKey = "iec_new_arrival_date"
    private let leaveHomeDateKey = "iec_new_leave_home_date"
    private let warningDateKey = "iec_new_warning_date"
    private let maxEndDateKey = "iec_new_max_end_date"
    
    private let arrivalBuildingIdKey = "iec_new_arrival_building_id"
    private let arrivalBuildingNameKey = "iec_new_arrival_building_name"
    private let travelToSiteKey = "iec_new_travel_to_site"
    
    private let returnBuildingIdKey = "iec_new_return_building_id"
    private let returnBuildingNameKey = "iec_new_return_building_name"
    private let travelBackKey = "iec_new_travel_back"
    
    private let snoozeEnabledKey = "iec_new_snooze_enabled"
    private let snoozeIntervalKey = "iec_new_snooze_interval"
    
    // Persistent Preferences Keys
    private let defaultCityKey = "iec_pref_default_city"
    private let defaultSnoozePrefKey = "iec_pref_default_snooze_pref"
    private let defaultSnoozeIntervalKey = "iec_pref_default_snooze_interval"
    private let gpsApprovedKey = "iec_pref_gps_approved"
    private let clockApprovedKey = "iec_pref_clock_approved"
    
    init() {
        loadPreferences()
        loadState()
        checkTimer()
    }
    
    private func loadPreferences() {
        self.defaultCity = UserDefaults.standard.string(forKey: defaultCityKey)
        self.defaultSnoozePreference = UserDefaults.standard.object(forKey: defaultSnoozePrefKey) as? Bool ?? true
        
        let interval = UserDefaults.standard.integer(forKey: defaultSnoozeIntervalKey)
        self.defaultSnoozeIntervalMinutes = interval == 0 ? 5 : interval
        
        self.gpsUsageApproved = UserDefaults.standard.object(forKey: gpsApprovedKey) as? Bool ?? true
        self.clockUsageApproved = UserDefaults.standard.object(forKey: clockApprovedKey) as? Bool ?? true
    }
    
    func updatePreferences(city: String, snooze: Bool, snoozeInterval: Int, gpsApproved: Bool = true, clockApproved: Bool = true) {
        self.defaultCity = city
        self.defaultSnoozePreference = snooze
        self.defaultSnoozeIntervalMinutes = snoozeInterval
        self.gpsUsageApproved = gpsApproved
        self.clockUsageApproved = clockApproved
        
        UserDefaults.standard.set(city, forKey: defaultCityKey)
        UserDefaults.standard.set(snooze, forKey: defaultSnoozePrefKey)
        UserDefaults.standard.set(snoozeInterval, forKey: defaultSnoozeIntervalKey)
        UserDefaults.standard.set(gpsApproved, forKey: gpsApprovedKey)
        UserDefaults.standard.set(clockApproved, forKey: clockApprovedKey)
        UserDefaults.standard.synchronize()
        
        // If not currently in a shift, align active shift snooze setting to default
        if currentState == .idle {
            self.snoozeEnabled = snooze
            self.snoozeIntervalMinutes = snoozeInterval
        }
    }
    
    private func loadState() {
        if let savedStateString = UserDefaults.standard.string(forKey: stateKey),
           let savedState = ShiftState(rawValue: savedStateString) {
            self.currentState = savedState
            self.arrivalDate = UserDefaults.standard.object(forKey: arrivalDateKey) as? Date
            self.leaveHomeDate = UserDefaults.standard.object(forKey: leaveHomeDateKey) as? Date
            self.warningDate = UserDefaults.standard.object(forKey: warningDateKey) as? Date
            self.maxEndDate = UserDefaults.standard.object(forKey: maxEndDateKey) as? Date
            
            self.arrivalBuildingId = UserDefaults.standard.string(forKey: arrivalBuildingIdKey) ?? ""
            self.arrivalBuildingName = UserDefaults.standard.string(forKey: arrivalBuildingNameKey) ?? ""
            self.travelToSiteMinutes = UserDefaults.standard.integer(forKey: travelToSiteKey)
            
            self.returnBuildingId = UserDefaults.standard.string(forKey: returnBuildingIdKey) ?? ""
            self.returnBuildingName = UserDefaults.standard.string(forKey: returnBuildingNameKey) ?? ""
            self.travelBackMinutes = UserDefaults.standard.integer(forKey: travelBackKey)
            
            self.snoozeEnabled = UserDefaults.standard.object(forKey: snoozeEnabledKey) as? Bool ?? defaultSnoozePreference
            
            let interval = UserDefaults.standard.integer(forKey: snoozeIntervalKey)
            self.snoozeIntervalMinutes = interval == 0 ? defaultSnoozeIntervalMinutes : interval
        } else {
            self.currentState = .idle
            self.snoozeEnabled = defaultSnoozePreference
            self.snoozeIntervalMinutes = defaultSnoozeIntervalMinutes
        }
    }
    
    func checkTimer() {
        // Active checking
    }
    
    func startShift(
        arrivalTime: Date,
        arrivalId: String,
        arrivalName: String,
        travelToSite: Int,
        returnId: String,
        returnName: String,
        travelBack: Int,
        snooze: Bool,
        snoozeInterval: Int
    ) {
        self.arrivalDate = arrivalTime
        self.arrivalBuildingId = arrivalId
        self.arrivalBuildingName = arrivalName
        self.travelToSiteMinutes = travelToSite
        
        self.returnBuildingId = returnId
        self.returnBuildingName = returnName
        self.travelBackMinutes = travelBack
        
        self.snoozeEnabled = snooze
        self.snoozeIntervalMinutes = snoozeInterval
        
        // 1. Calculate leave home time = arrivalTime - travelToSiteMinutes
        let calculatedLeaveHome = arrivalTime.addingTimeInterval(-Double(travelToSite * 60))
        self.leaveHomeDate = calculatedLeaveHome
        
        // 2. Calculate warning time = leaveHomeDate + 11 hours 50 minutes - travelBackMinutes
        let warningDuration = (11 * 3600) + (50 * 60) // 11h 50m
        let warningOffset = warningDuration - (travelBack * 60)
        self.warningDate = calculatedLeaveHome.addingTimeInterval(Double(warningOffset))
        
        // 3. Calculate max end time = leaveHomeDate + 12 hours - travelBackMinutes
        let maxDuration = 12 * 3600 // 12h
        let maxOffset = maxDuration - (travelBack * 60)
        self.maxEndDate = calculatedLeaveHome.addingTimeInterval(Double(maxOffset))
        
        self.currentState = .active
        saveStateToDisk()
    }
    
    func updateSnoozeSetting(enabled: Bool) {
        self.snoozeEnabled = enabled
        UserDefaults.standard.set(enabled, forKey: snoozeEnabledKey)
        UserDefaults.standard.synchronize()
    }
    
    func updateSnoozeIntervalSetting(minutes: Int) {
        self.snoozeIntervalMinutes = minutes
        UserDefaults.standard.set(minutes, forKey: snoozeIntervalKey)
        UserDefaults.standard.synchronize()
    }
    
    func finishWorkday() {
        self.currentState = .resetPending
        saveStateToDisk()
    }
    
    func confirmExit() {
        // Zero Storage Principle: Delete all shift session data completely!
        clearStateFromDisk()
        
        self.currentState = .idle
        self.arrivalDate = nil
        self.leaveHomeDate = nil
        self.warningDate = nil
        self.maxEndDate = nil
        self.arrivalBuildingId = ""
        self.arrivalBuildingName = ""
        self.travelToSiteMinutes = 0
        self.returnBuildingId = ""
        self.returnBuildingName = ""
        self.travelBackMinutes = 0
        self.snoozeEnabled = defaultSnoozePreference
        self.snoozeIntervalMinutes = defaultSnoozeIntervalMinutes
    }
    
    private func saveStateToDisk() {
        UserDefaults.standard.set(currentState.rawValue, forKey: stateKey)
        UserDefaults.standard.set(arrivalDate, forKey: arrivalDateKey)
        UserDefaults.standard.set(leaveHomeDate, forKey: leaveHomeDateKey)
        UserDefaults.standard.set(warningDate, forKey: warningDateKey)
        UserDefaults.standard.set(maxEndDate, forKey: maxEndDateKey)
        
        UserDefaults.standard.set(arrivalBuildingId, forKey: arrivalBuildingIdKey)
        UserDefaults.standard.set(arrivalBuildingName, forKey: arrivalBuildingNameKey)
        UserDefaults.standard.set(travelToSiteMinutes, forKey: travelToSiteKey)
        
        UserDefaults.standard.set(returnBuildingId, forKey: returnBuildingIdKey)
        UserDefaults.standard.set(returnBuildingName, forKey: returnBuildingNameKey)
        UserDefaults.standard.set(travelBackMinutes, forKey: travelBackKey)
        
        UserDefaults.standard.set(snoozeEnabled, forKey: snoozeEnabledKey)
        UserDefaults.standard.set(snoozeIntervalMinutes, forKey: snoozeIntervalKey)
        UserDefaults.standard.synchronize()
    }
    
    private func clearStateFromDisk() {
        UserDefaults.standard.removeObject(forKey: stateKey)
        UserDefaults.standard.removeObject(forKey: arrivalDateKey)
        UserDefaults.standard.removeObject(forKey: leaveHomeDateKey)
        UserDefaults.standard.removeObject(forKey: warningDateKey)
        UserDefaults.standard.removeObject(forKey: maxEndDateKey)
        UserDefaults.standard.removeObject(forKey: arrivalBuildingIdKey)
        UserDefaults.standard.removeObject(forKey: arrivalBuildingNameKey)
        UserDefaults.standard.removeObject(forKey: travelToSiteKey)
        UserDefaults.standard.removeObject(forKey: returnBuildingIdKey)
        UserDefaults.standard.removeObject(forKey: returnBuildingNameKey)
        UserDefaults.standard.removeObject(forKey: travelBackKey)
        UserDefaults.standard.removeObject(forKey: snoozeEnabledKey)
        UserDefaults.standard.removeObject(forKey: snoozeIntervalKey)
        UserDefaults.standard.synchronize()
    }
    
    // Formatting Helpers
    func formatDate(_ date: Date?) -> String {
        guard let d = date else { return "--:--" }
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: d)
    }
    
    // Time remaining to warning (in seconds)
    var timeRemainingToWarning: TimeInterval {
        guard let warn = warningDate else { return 0 }
        return max(0, warn.timeIntervalSince(Date()))
    }
    
    // Total presence time so far (in seconds)
    var totalPresenceTimeSoFar: TimeInterval {
        guard let leaveHome = leaveHomeDate else { return 0 }
        let elapsedAtSite = Date().timeIntervalSince(leaveHome)
        let travelBackDuration = Double(travelBackMinutes * 60)
        return max(0, elapsedAtSite + travelBackDuration)
    }
    
    // Progress of total presence toward 11:50 limit (0.0 to 1.0)
    var warningProgress: Double {
        guard let leaveHome = leaveHomeDate, let warn = warningDate else { return 0.0 }
        let total = warn.timeIntervalSince(leaveHome)
        if total <= 0 { return 1.0 }
        let elapsed = Date().timeIntervalSince(leaveHome)
        return min(1.0, max(0.0, elapsed / total))
    }
}
