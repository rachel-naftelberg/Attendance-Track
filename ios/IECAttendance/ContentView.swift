import SwiftUI

struct ContentView: View {
    @StateObject private var shiftManager = ShiftManager()
    @StateObject private var locationManager = LocationManager()
    @StateObject private var notificationManager = NotificationManager()
    
    @State private var showingSetup = false
    @State private var showingSettings = false
    
    // Setup form fields
    @State private var setupArrivalDate = Date()
    @State private var selectedCity = "חיפה"
    @State private var selectedArrivalBuildingId = ""
    @State private var customArrivalTravelTime = ""
    @State private var selectedReturnBuildingId = ""
    @State private var customReturnTravelTime = ""
    
    // Live countdown strings
    @State private var presenceTimeString = "00:00:00"
    @State private var countdownToWarningString = "00:00:00"
    @State private var warningActive = false
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        Group {
            if shiftManager.defaultCity == nil {
                OnboardingView(shiftManager: shiftManager, locationManager: locationManager)
            } else {
                NavigationView {
                    ZStack {
                        BackgroundView()
                        
                        VStack(spacing: 20) {
                            HeaderView(showingSettings: $showingSettings, isIdle: shiftManager.currentState == .idle)
                            
                            Spacer()
                            
                            VStack {
                                switch shiftManager.currentState {
                                case .idle:
                                    IdleView(
                                        locationManager: locationManager,
                                        gpsUsageApproved: shiftManager.gpsUsageApproved,
                                        startAction: {
                                            initializeSetupForm()
                                            showingSetup = true
                                        }
                                    )
                                    
                                case .active:
                                    ActiveView(
                                        shiftManager: shiftManager,
                                        notificationManager: notificationManager,
                                        presenceTimeString: $presenceTimeString,
                                        countdownToWarningString: $countdownToWarningString,
                                        warningActive: $warningActive,
                                        finishAction: {
                                            shiftManager.finishWorkday()
                                            notificationManager.cancelAllNotifications()
                                        }
                                    )
                                    
                                case .resetPending:
                                    ResetView(
                                        shiftManager: shiftManager,
                                        confirmAction: {
                                            shiftManager.confirmExit()
                                            notificationManager.cancelAllNotifications()
                                        }
                                    )
                                }
                            }
                            .padding()
                            .background(
                                RoundedRectangle(cornerRadius: 24)
                                    .fill(Color(.systemBackground).opacity(0.85))
                                    .background(VisualEffectBlur(effect: UIBlurEffect(style: .systemThinMaterial)))
                                    .shadow(color: Color.black.opacity(0.08), radius: 15, x: 0, y: 10)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.white.opacity(0.15), lineWidth: 1)
                            )
                            .padding(.horizontal, 20)
                            
                            Spacer()
                            
                            PrivacyBadgeView()
                        }
                        .padding(.vertical, 20)
                    }
                    .navigationBarHidden(true)
                    .sheet(isPresented: $showingSetup) {
                        SetupView(
                            locationManager: locationManager,
                            setupArrivalDate: $setupArrivalDate,
                            selectedCity: $selectedCity,
                            selectedArrivalBuildingId: $selectedArrivalBuildingId,
                            customArrivalTravelTime: $customArrivalTravelTime,
                            selectedReturnBuildingId: $selectedReturnBuildingId,
                            customReturnTravelTime: $customReturnTravelTime,
                            onConfirm: {
                                startShiftFromSetup()
                            },
                            onCancel: {
                                showingSetup = false
                            }
                        )
                    }
                    .sheet(isPresented: $showingSettings) {
                        SettingsView(
                            shiftManager: shiftManager,
                            locationManager: locationManager,
                            notificationManager: notificationManager,
                            isPresented: $showingSettings
                        )
                    }
                    .onReceive(timer) { _ in
                        updateCounters()
                    }
                    .onAppear {
                        locationManager.requestLocationPermission()
                        notificationManager.requestPermission()
                        updateCounters()
                    }
                }
            }
        }
        .environment(\.layoutDirection, .rightToLeft) // Set RTL layout Hebrew support
    }
    
    // Initialize form defaults based on GPS location
    private func initializeSetupForm() {
        setupArrivalDate = Date()
        setupSnoozeEnabled = shiftManager.defaultSnoozePreference
        setupSnoozeIntervalMinutes = shiftManager.defaultSnoozeIntervalMinutes
        selectedCity = shiftManager.defaultCity ?? "חיפה"
        
        if let matched = locationManager.currentMatchedBuilding {
            selectedArrivalBuildingId = matched.id
            selectedReturnBuildingId = matched.id
            let arrTime = lookupTravelTime(city: selectedCity, siteId: matched.id, type: "arrival")
            let retTime = lookupTravelTime(city: selectedCity, siteId: matched.id, type: "return")
            customArrivalTravelTime = "\(arrTime)"
            customReturnTravelTime = "\(retTime)"
        } else {
            selectedArrivalBuildingId = "other"
            selectedReturnBuildingId = "other"
            customArrivalTravelTime = "30"
            customReturnTravelTime = "30"
        }
    }
    
    private func lookupTravelTime(city: String, siteId: String, type: String) -> Int {
        if let match = locationManager.travelTimes.first(where: { $0.cityName == city && $0.siteId == siteId }) {
            return type == "arrival" ? match.arrivalTimeMinutes : match.returnTimeMinutes
        }
        return 30 // Default fallback
    }
    
    private func startShiftFromSetup() {
        let (arrivalName, arrivalTime) = getSiteDetails(for: selectedArrivalBuildingId, customTime: customArrivalTravelTime)
        let (returnName, returnTime) = getSiteDetails(for: selectedReturnBuildingId, customTime: customReturnTravelTime)
        
        shiftManager.startShift(
            arrivalTime: setupArrivalDate,
            arrivalId: selectedArrivalBuildingId,
            arrivalName: arrivalName,
            travelToSite: arrivalTime,
            returnId: selectedReturnBuildingId,
            returnName: returnName,
            travelBack: returnTime,
            snooze: shiftManager.defaultSnoozePreference,
            snoozeInterval: shiftManager.defaultSnoozeIntervalMinutes
        )
        
        if let warnDate = shiftManager.warningDate {
            notificationManager.scheduleWorkdayNotifications(
                warningDate: warnDate,
                snoozeEnabled: shiftManager.snoozeEnabled,
                snoozeIntervalMinutes: shiftManager.snoozeIntervalMinutes
            )
        }
        
        showingSetup = false
    }
    
    private func getSiteDetails(for buildingId: String, customTime: String) -> (name: String, travelTime: Int) {
        if buildingId == "other" {
            let mins = Int(customTime) ?? 0
            return ("אחר (אתר מרוחק)", mins)
        } else if let b = locationManager.buildings.first(where: { $0.id == buildingId }) {
            return (b.name, Int(customTime) ?? 0)
        }
        return ("עבודה מהבית / שטח", 0)
    }
    
    private func updateCounters() {
        guard shiftManager.currentState == .active,
              let leaveHome = shiftManager.leaveHomeDate,
              let warn = shiftManager.warningDate else { return }
        
        // 1. Update Total Presence Time String
        let totalSecs = shiftManager.totalPresenceTimeSoFar
        let presenceHours = Int(totalSecs) / 3600
        let presenceMins = (Int(totalSecs) % 3600) / 60
        let presenceSecs = Int(totalSecs) % 60
        presenceTimeString = String(format: "%02d:%02d:%02d", presenceHours, presenceMins, presenceSecs)
        
        // 2. Update Countdown to 11:50 Warning
        let diff = warn.timeIntervalSince(Date())
        if diff <= 0 {
            countdownToWarningString = "00:00:00"
            warningActive = true
        } else {
            let warnHours = Int(diff) / 3600
            let warnMins = (Int(diff) % 3600) / 60
            let warnSecs = Int(diff) % 60
            countdownToWarningString = String(format: "%02d:%02d:%02d", warnHours, warnMins, warnSecs)
            warningActive = false
        }
    }
}

// MARK: - Component Views

struct IdleView: View {
    @ObservedObject var locationManager: LocationManager
    var gpsUsageApproved: Bool
    var startAction: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.08))
                    .frame(width: 130, height: 130)
                
                Circle()
                    .fill(Color.blue.opacity(0.12))
                    .frame(width: 100, height: 100)
                
                Image(systemName: "location.magnifyingglass")
                    .font(.system(size: 46))
                    .foregroundColor(.blue)
            }
            .padding(.top, 10)
            
            VStack(spacing: 8) {
                Text("דיווח נוכחות מרחוק")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text("האפליקציה תזהה אוטומטית את האתר שבו אתה נמצא ותחשב את זמני הנסיעה הלוך וחזור.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 10)
            }
            
            HStack(spacing: 8) {
                Circle()
                    .fill(!gpsUsageApproved ? Color.red : (locationManager.currentMatchedBuilding != nil ? Color.green : Color.orange))
                    .frame(width: 8, height: 8)
                
                Text(!gpsUsageApproved ? "שימוש ב-GPS לא מאושר בהגדרות" :
                     (locationManager.currentMatchedBuilding != nil ?
                      "אתר מזוהה: \(locationManager.currentMatchedBuilding!.name)" :
                      "מזהה מיקום GPS..."))
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.secondary)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color.secondary.opacity(0.08))
            .cornerRadius(20)
            
            Button(action: startAction) {
                HStack {
                    Image(systemName: "play.circle.fill")
                    Text("התחלת עבודה מאתר מרוחק")
                        .fontWeight(.bold)
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    LinearGradient(gradient: Gradient(colors: [Color.blue, Color(red: 23/255, green: 162/255, blue: 184/255)]), startPoint: .leading, endPoint: .trailing)
                )
                .cornerRadius(16)
                .shadow(color: Color.blue.opacity(0.3), radius: 10, y: 5)
            }
            .padding(.bottom, 5)
        }
    }
}

struct ActiveView: View {
    @ObservedObject var shiftManager: ShiftManager
    @ObservedObject var notificationManager: NotificationManager
    @Binding var presenceTimeString: String
    @Binding var countdownToWarningString: String
    @Binding var warningActive: Bool
    var finishAction: () -> Void
    
    var body: some View {
        VStack(spacing: 20) {
            // Live Status Banner
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(warningActive ? Color.red : Color.green)
                        .frame(width: 32, height: 32)
                    Image(systemName: warningActive ? "exclamationmark.triangle.fill" : "checkmark.shield.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(warningActive ? "עליך לסיים את היום!" : "יום עבודה פעיל מנוהל")
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(warningActive ? .red : .green)
                    Text("זמן התראה (11:50): \(shiftManager.formatDate(shiftManager.warningDate))")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
            }
            .padding(12)
            .background((warningActive ? Color.red : Color.green).opacity(0.08))
            .cornerRadius(12)
            
            // Total Presence Progress Ring
            ZStack {
                Circle()
                    .stroke(Color.secondary.opacity(0.1), lineWidth: 12)
                    .frame(width: 170, height: 170)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(shiftManager.warningProgress))
                    .stroke(
                        LinearGradient(gradient: Gradient(colors: warningActive ? [Color.red, Color.orange] : [Color.blue, Color(red: 23/255, green: 162/255, blue: 184/255)]), startPoint: .top, endPoint: .bottom),
                        style: StrokeStyle(lineWidth: 12, lineCap: .round)
                    )
                    .frame(width: 170, height: 170)
                    .rotationEffect(Angle(degrees: -90))
                    .animation(.linear(duration: 1.0), value: shiftManager.warningProgress)
                
                VStack(spacing: 4) {
                    Text("זמן נוכחות כולל")
                        .font(.caption2)
                        .fontWeight(.bold)
                        .foregroundColor(.secondary)
                    
                    Text(presenceTimeString)
                        .font(.system(size: 26, weight: .bold, design: .monospaced))
                        .foregroundColor(.primary)
                    
                    Divider().frame(width: 100).padding(.vertical, 4)
                    
                    Text(warningActive ? "חרגת מ-11:50!" : "נותר להתראה")
                        .font(.caption2)
                        .foregroundColor(warningActive ? .red : .secondary)
                    
                    if !warningActive {
                        Text(countdownToWarningString)
                            .font(.system(size: 16, weight: .semibold, design: .monospaced))
                            .foregroundColor(.blue)
                    }
                }
            }
            .padding(.vertical, 8)
            
            // Info Matrix
            VStack(spacing: 10) {
                DetailRowView(icon: "house.fill", title: "יציאה מהבית (מחושב)", value: shiftManager.formatDate(shiftManager.leaveHomeDate))
                DetailRowView(icon: "mappin.circle.fill", title: "אתר עבודה (כניסה: \(shiftManager.formatDate(shiftManager.arrivalDate)))", value: shiftManager.arrivalBuildingName)
                DetailRowView(icon: "car.fill", title: "נסיעה הלוך + חזור", value: "\(shiftManager.travelToSiteMinutes) + \(shiftManager.travelBackMinutes) דק׳")
                DetailRowView(icon: "arrow.turn.down.left", title: "אתר חזרה מתוכנן", value: shiftManager.returnBuildingName)
            }
            .padding(12)
            .background(Color.secondary.opacity(0.05))
            .cornerRadius(16)
            
            // Dynamic Snooze Control Toggle & Stepper
            VStack(alignment: .leading, spacing: 8) {
                Toggle(isOn: Binding(
                    get: { shiftManager.snoozeEnabled },
                    set: { val in
                        shiftManager.updateSnoozeSetting(enabled: val)
                        if let warnDate = shiftManager.warningDate {
                            notificationManager.scheduleWorkdayNotifications(
                                warningDate: warnDate,
                                snoozeEnabled: val,
                                snoozeIntervalMinutes: shiftManager.snoozeIntervalMinutes
                            )
                        }
                    }
                )) {
                    HStack {
                        Image(systemName: "bell.badge.fill")
                            .foregroundColor(.orange)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("התראות נודניק")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                            Text("התראה חוזרת במידה וחרגת מ-11:50")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                if shiftManager.snoozeEnabled {
                    HStack {
                        Text("מרווח נודניק:")
                            .font(.subheadline)
                            .foregroundColor(.primary)
                        Spacer()
                        Picker("מרווח", selection: Binding(
                            get: { shiftManager.snoozeIntervalMinutes },
                            set: { val in
                                shiftManager.updateSnoozeIntervalSetting(minutes: val)
                                if let warnDate = shiftManager.warningDate {
                                    notificationManager.scheduleWorkdayNotifications(
                                        warningDate: warnDate,
                                        snoozeEnabled: shiftManager.snoozeEnabled,
                                        snoozeIntervalMinutes: val
                                    )
                                }
                            }
                        )) {
                            ForEach([2, 5, 10, 15, 30], id: \.self) { mins in
                                Text("\(mins) דק׳").tag(mins)
                            }
                        }
                        .pickerStyle(SegmentedPickerStyle())
                        .frame(maxWidth: 180)
                    }
                    .padding(.top, 4)
                }
            }
            .padding(.horizontal, 8)
            
            // Finish Button
            Button(action: finishAction) {
                HStack {
                    Image(systemName: "checkmark.circle.fill")
                    Text("סיימתי לעבוד")
                        .fontWeight(.bold)
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    LinearGradient(gradient: Gradient(colors: [Color.orange, Color(red: 255/255, green: 110/255, blue: 0/255)]), startPoint: .leading, endPoint: .trailing)
                )
                .cornerRadius(16)
                .shadow(color: Color.orange.opacity(0.2), radius: 8, y: 4)
            }
        }
    }
}

struct ResetView: View {
    @ObservedObject var shiftManager: ShiftManager
    var confirmAction: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(Color.orange.opacity(0.08))
                    .frame(width: 130, height: 130)
                
                Circle()
                    .fill(Color.orange.opacity(0.12))
                    .frame(width: 100, height: 100)
                
                Image(systemName: "archivebox.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.orange)
            }
            .padding(.top, 10)
            
            VStack(spacing: 8) {
                Text("אישור סיום יום עבודה")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.primary)
                
                Text("עם אישור היציאה, כל נתוני המיקום והזמנים של המשמרת יימחקו לצמיתות מהמכשיר.")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 10)
            }
            
            Button(action: confirmAction) {
                HStack {
                    Image(systemName: "trash.fill")
                    Text("אישרתי יציאה (מחיקת נתונים)")
                        .fontWeight(.bold)
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(
                    LinearGradient(gradient: Gradient(colors: [Color.orange, Color.red]), startPoint: .leading, endPoint: .trailing)
                )
                .cornerRadius(16)
                .shadow(color: Color.red.opacity(0.2), radius: 10, y: 5)
            }
            .padding(.bottom, 5)
        }
    }
}

// MARK: - Setup Sheet View

struct SetupView: View {
    @ObservedObject var locationManager: LocationManager
    
    @Binding var setupArrivalDate: Date
    @Binding var selectedCity: String
    @Binding var selectedArrivalBuildingId: String
    @Binding var customArrivalTravelTime: String
    @Binding var selectedReturnBuildingId: String
    @Binding var customReturnTravelTime: String
    
    var onConfirm: () -> Void
    var onCancel: () -> Void
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("זמן הגעה ואתר נוכחי").fontWeight(.bold)) {
                    DatePicker("שעת הגעה בפועל", selection: $setupArrivalDate, displayedComponents: .hourAndMinute)
                    
                    Picker("אתר הגעה", selection: $selectedArrivalBuildingId) {
                        ForEach(locationManager.buildings) { b in
                            Text(b.name).tag(b.id)
                        }
                        Text("אחר (הזנה ידנית)").tag("other")
                    }
                    .onChange(of: selectedArrivalBuildingId) { newSite in
                        updateArrivalTravelTime(for: selectedCity, siteId: newSite)
                        // Auto-align return building to arrival building as default
                        selectedReturnBuildingId = newSite
                        updateReturnTravelTime(for: selectedCity, siteId: newSite)
                    }
                    
                    HStack {
                        Text("זמן נסיעה מהבית (דקות)")
                        Spacer()
                        TextField("דקות", text: $customArrivalTravelTime)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 70)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                }
                
                Section(header: Text("אתר חזרה מתוכנן").fontWeight(.bold)) {
                    Picker("אתר חזרה", selection: $selectedReturnBuildingId) {
                        ForEach(locationManager.buildings) { b in
                            Text(b.name).tag(b.id)
                        }
                        Text("אחר (הזנה ידנית)").tag("other")
                    }
                    .onChange(of: selectedReturnBuildingId) { newSite in
                        updateReturnTravelTime(for: selectedCity, siteId: newSite)
                    }
                    
                    HStack {
                        Text("זמן נסיעה הביתה (דקות)")
                        Spacer()
                        TextField("דקות", text: $customReturnTravelTime)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 70)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                }
            }
            .navigationTitle("התחלת עבודה מרחוק")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("ביטול", action: onCancel),
                trailing: Button("אישור", action: onConfirm).fontWeight(.bold)
            )
            .environment(\.layoutDirection, .rightToLeft)
        }
    }
    
    private func updateArrivalTravelTime(for city: String, siteId: String) {
        if city == "other" || siteId == "other" {
            customArrivalTravelTime = "30"
        } else if let match = locationManager.travelTimes.first(where: { $0.cityName == city && $0.siteId == siteId }) {
            customArrivalTravelTime = "\(match.arrivalTimeMinutes)"
        } else {
            customArrivalTravelTime = "30"
        }
    }
    
    private func updateReturnTravelTime(for city: String, siteId: String) {
        if city == "other" || siteId == "other" {
            customReturnTravelTime = "30"
        } else if let match = locationManager.travelTimes.first(where: { $0.cityName == city && $0.siteId == siteId }) {
            customReturnTravelTime = "\(match.returnTimeMinutes)"
        } else {
            customReturnTravelTime = "30"
        }
    }
}

// MARK: - Helper Views

struct BackgroundView: View {
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        LinearGradient(
            gradient: Gradient(colors: colorScheme == .dark ? 
                [Color(red: 10/255, green: 15/255, blue: 30/255), Color(red: 20/255, green: 30/255, blue: 50/255)] : 
                [Color(red: 240/255, green: 245/255, blue: 255/255), Color(red: 220/255, green: 230/255, blue: 250/255)]
            ),
            startPoint: .top,
            endPoint: .bottom
        )
        .ignoresSafeArea()
    }
}

struct VisualEffectBlur: UIViewRepresentable {
    var effect: UIVisualEffect?
    
    func makeUIView(context: Context) -> UIVisualEffectView {
        UIVisualEffectView(effect: effect)
    }
    
    func updateUIView(_ uiView: UIVisualEffectView, context: Context) {
        uiView.effect = effect
    }
}

struct PrivacyBadgeView: View {
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: "lock.shield.fill")
                .foregroundColor(.green)
            Text("Zero Storage: המידע נשמר על המכשיר בלבד ונמחק בסיום היציאה")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(Color.green.opacity(0.08))
        .cornerRadius(20)
    }
}

struct DetailRowView: View {
    let icon: String
    let title: String
    let value: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 24, height: 24)
            Text(title)
                .font(.subheadline)
                .foregroundColor(.primary)
            Spacer()
            Text(value)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}

struct HeaderView: View {
    @Binding var showingSettings: Bool
    var isIdle: Bool
    
    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.1))
                    .frame(width: 40, height: 40)
                Image(systemName: "bolt.fill")
                    .foregroundColor(.blue)
                    .font(.system(size: 20))
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text("חברת החשמל")
                    .font(.headline)
                    .fontWeight(.bold)
                Text("מערך החדשנות • Zero Storage")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if isIdle {
                Button(action: {
                    showingSettings = true
                }) {
                    Image(systemName: "gearshape.fill")
                        .font(.system(size: 20))
                        .foregroundColor(.secondary)
                        .padding(8)
                        .background(Color.secondary.opacity(0.1))
                        .clipShape(Circle())
                }
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 10)
    }
}

struct OnboardingView: View {
    @ObservedObject var shiftManager: ShiftManager
    @ObservedObject var locationManager: LocationManager
    @State private var selectedCity = "חיפה"
    
    var body: some View {
        ZStack {
            BackgroundView()
            
            VStack(spacing: 30) {
                Spacer()
                
                VStack(spacing: 20) {
                    ZStack {
                        Circle()
                            .fill(Color.blue.opacity(0.1))
                            .frame(width: 100, height: 100)
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.blue)
                    }
                    
                    Text("ברוכים הבאים ל-IEC Attendance")
                        .font(.title2)
                        .fontWeight(.bold)
                        .multilineTextAlignment(.center)
                    
                    Text("לפני שנתחיל, נא הגדר את עיר המגורים הקבועה שלך. הגדרה זו תשמש לחישוב אוטומטי של זמני הנסיעה שלך לאתרי החברה.")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                    
                    VStack(alignment: .leading, spacing: 8) {
                        Text("עיר מגורים:")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        Picker("בחר עיר", selection: $selectedCity) {
                            ForEach(locationManager.cities, id: \.self) { city in
                                Text(city).tag(city)
                            }
                            Text("אחר (הזנה ידנית)").tag("other")
                        }
                        .pickerStyle(MenuPickerStyle())
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(12)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 10)
                    
                    Button(action: {
                        shiftManager.updatePreferences(city: selectedCity, snooze: shiftManager.defaultSnoozePreference, snoozeInterval: shiftManager.defaultSnoozeIntervalMinutes)
                    }) {
                        Text("המשך לאפליקציה")
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color.blue)
                            .cornerRadius(12)
                            .shadow(color: Color.blue.opacity(0.3), radius: 8, y: 4)
                    }
                    .padding(.top, 10)
                }
                .padding(24)
                .background(
                    RoundedRectangle(cornerRadius: 24)
                        .fill(Color(.systemBackground).opacity(0.9))
                        .background(VisualEffectBlur(effect: UIBlurEffect(style: .systemMaterial)))
                        .shadow(color: Color.black.opacity(0.1), radius: 20, x: 0, y: 10)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 24)
                        .stroke(Color.white.opacity(0.2), lineWidth: 1)
                )
                .padding(.horizontal, 24)
                
                Spacer()
            }
        }
        .environment(\.layoutDirection, .rightToLeft)
    }
}

struct SettingsView: View {
    @ObservedObject var shiftManager: ShiftManager
    @ObservedObject var locationManager: LocationManager
    @ObservedObject var notificationManager: NotificationManager
    @Binding var isPresented: Bool
    
    @State private var selectedCity = "חיפה"
    @State private var defaultSnooze = true
    @State private var defaultSnoozeInterval = 5
    @State private var gpsUsageApproved = true
    @State private var clockUsageApproved = true
    @State private var showingTravelTimesEditor = false
    @State private var showingBuildingsEditor = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("הגדרות עיר מגורים").fontWeight(.bold)) {
                    Picker("עיר מגורים קבועה", selection: $selectedCity) {
                        ForEach(locationManager.cities, id: \.self) { city in
                            Text(city).tag(city)
                        }
                        Text("אחר (הזנה ידנית)").tag("other")
                    }
                }
                
                Section(header: Text("הגדרות התראה ברירת מחדל").fontWeight(.bold)) {
                    Toggle("נודניק מופעל כברירת מחדל", isOn: $defaultSnooze)
                    
                    if defaultSnooze {
                        Picker("מרווח נודניק ברירת מחדל", selection: $defaultSnoozeInterval) {
                            ForEach([2, 5, 10, 15, 30], id: \.self) { mins in
                                Text("\(mins) דקות").tag(mins)
                            }
                        }
                    }
                    
                    Text("האם להפעיל התראות חוזרות אוטומטית בכל משמרת חדשה ובאיזה מרווח.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                
                Section(header: Text("אישורי שימוש באפליקציה").fontWeight(.bold)) {
                    Toggle(isOn: $gpsUsageApproved) {
                        HStack {
                            Image(systemName: "location.fill")
                                .foregroundColor(.blue)
                                .frame(width: 20)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("אישור שימוש ב-GPS")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                Text("אישור זיהוי אתרים אוטומטי ומרחקי נסיעה")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                    
                    Toggle(isOn: $clockUsageApproved) {
                        HStack {
                            Image(systemName: "clock.badge.checkmark.fill")
                                .foregroundColor(.orange)
                                .frame(width: 20)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("אישור שימוש בשעון של המכשיר")
                                    .font(.subheadline)
                                    .fontWeight(.semibold)
                                Text("אישור קריאת זמן המכשיר והתראות 11:50")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                    }
                }
                
                Section(header: Text("הרשאות מערכת").fontWeight(.bold)) {
                    HStack {
                        Image(systemName: "location.circle.fill")
                            .foregroundColor(.blue)
                        Text("שירותי מיקום (GPS)")
                        Spacer()
                        Text(locationManager.authorizationStatus == .authorizedWhenInUse || locationManager.authorizationStatus == .authorizedAlways ? "מאושר" : "לא מאושר")
                            .foregroundColor(locationManager.authorizationStatus == .authorizedWhenInUse || locationManager.authorizationStatus == .authorizedAlways ? .green : .red)
                            .fontWeight(.semibold)
                    }
                    
                    HStack {
                        Image(systemName: "clock.fill")
                            .foregroundColor(.orange)
                        Text("התראות מערכת (שעון המכשיר)")
                        Spacer()
                        Text(notificationManager.permissionGranted ? "מאושר" : "לא מאושר")
                            .foregroundColor(notificationManager.permissionGranted ? .green : .red)
                            .fontWeight(.semibold)
                    }
                }
                
                Section(header: Text("ניהול נתונים").fontWeight(.bold)) {
                    Button(action: {
                        showingTravelTimesEditor = true
                    }) {
                        HStack {
                            Image(systemName: "map.fill")
                                .foregroundColor(.blue)
                            Text("ניהול מרחקי נסיעה")
                                .foregroundColor(.primary)
                            Spacer()
                            Image(systemName: "chevron.left")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    Button(action: {
                        showingBuildingsEditor = true
                    }) {
                        HStack {
                            Image(systemName: "building.2.fill")
                                .foregroundColor(.green)
                            Text("ניהול אתרי חברה")
                                .foregroundColor(.primary)
                            Spacer()
                            Image(systemName: "chevron.left")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }
                }
                
                Section(footer: Text("שים לב: כל הנתונים נמחקים בסימון סיום עבודה, או בסוף היום (Zero Storage).")
                    .font(.caption2)
                    .foregroundColor(.secondary)) {
                    EmptyView()
                }
            }
            .navigationTitle("הגדרות אפליקציה")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("ביטול") {
                    isPresented = false
                },
                trailing: Button("שמור") {
                    shiftManager.updatePreferences(city: selectedCity, snooze: defaultSnooze, snoozeInterval: defaultSnoozeInterval, gpsApproved: gpsUsageApproved, clockApproved: clockUsageApproved)
                    locationManager.updateGPSEnabledStatus()
                    notificationManager.updateClockEnabledStatus()
                    isPresented = false
                }
                .fontWeight(.bold)
            )
            .sheet(isPresented: $showingTravelTimesEditor) {
                TravelTimesEditorView(locationManager: locationManager)
            }
            .sheet(isPresented: $showingBuildingsEditor) {
                BuildingsEditorView(locationManager: locationManager)
            }
            .environment(\.layoutDirection, .rightToLeft)
            .onAppear {
                selectedCity = shiftManager.defaultCity ?? "חיפה"
                defaultSnooze = shiftManager.defaultSnoozePreference
                defaultSnoozeInterval = shiftManager.defaultSnoozeIntervalMinutes
                gpsUsageApproved = shiftManager.gpsUsageApproved
                clockUsageApproved = shiftManager.clockUsageApproved
            }
        }
    }
}

struct TravelTimesEditorView: View {
    @ObservedObject var locationManager: LocationManager
    @Environment(\.presentationMode) var presentationMode
    
    @State private var showingAddEdit = false
    @State private var selectedTravelTimeForEdit: TravelTime?
    @State private var searchText = ""
    
    var filteredTravelTimes: [TravelTime] {
        if searchText.isEmpty {
            return locationManager.travelTimes
        } else {
            return locationManager.travelTimes.filter {
                $0.cityName.contains(searchText) || 
                (locationManager.buildings.first(where: { b in b.id == $0.siteId })?.name.contains(searchText) ?? false)
            }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                SearchBar(text: $searchText, placeholder: "חפש לפי עיר או אתר...")
                    .padding(.top, 10)
                
                List {
                    ForEach(filteredTravelTimes) { item in
                        Button(action: {
                            selectedTravelTimeForEdit = item
                            showingAddEdit = true
                        }) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.cityName)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    
                                    let buildingName = locationManager.buildings.first(where: { $0.id == item.siteId })?.name ?? item.siteId
                                    Text("אתר: \(buildingName)")
                                        .font(.subheadline)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                VStack(alignment: .trailing, spacing: 4) {
                                    Text("הלוך: \(item.arrivalTimeMinutes) דק׳")
                                        .font(.caption)
                                        .foregroundColor(.blue)
                                    Text("חזור: \(item.returnTimeMinutes) דק׳")
                                        .font(.caption)
                                        .foregroundColor(.orange)
                                }
                                
                                Image(systemName: "chevron.left")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .padding(.leading, 8)
                            }
                        }
                    }
                    .onDelete { offsets in
                        let itemsToDelete = offsets.map { filteredTravelTimes[$0] }
                        for item in itemsToDelete {
                            if let idx = locationManager.travelTimes.firstIndex(where: { $0.cityName == item.cityName && $0.siteId == item.siteId }) {
                                locationManager.deleteTravelTime(at: IndexSet(integer: idx))
                            }
                        }
                    }
                }
                .listStyle(PlainListStyle())
            }
            .navigationTitle("ניהול זמני נסיעות")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("סגור") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button(action: {
                    selectedTravelTimeForEdit = nil
                    showingAddEdit = true
                }) {
                    Image(systemName: "plus")
                        .font(.title3)
                }
            )
            .sheet(isPresented: $showingAddEdit) {
                AddOrEditTravelTimeView(
                    locationManager: locationManager,
                    travelTime: selectedTravelTimeForEdit
                )
            }
            .environment(\.layoutDirection, .rightToLeft)
        }
    }
}

struct SearchBar: View {
    @Binding var text: String
    var placeholder: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            
            TextField(placeholder, text: $text)
                .textFieldStyle(PlainTextFieldStyle())
                .foregroundColor(.primary)
                .multilineTextAlignment(.leading)
            
            if !text.isEmpty {
                Button(action: {
                    self.text = ""
                }) {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(.secondary)
                }
            }
        }
        .padding(10)
        .background(Color(.secondarySystemBackground))
        .cornerRadius(10)
        .padding(.horizontal)
    }
}

struct AddOrEditTravelTimeView: View {
    @ObservedObject var locationManager: LocationManager
    var travelTime: TravelTime?
    @Environment(\.presentationMode) var presentationMode
    
    @State private var selectedCity = ""
    @State private var selectedSiteId = ""
    @State private var arrivalTimeStr = ""
    @State private var returnTimeStr = ""
    @State private var customCity = ""
    @State private var isCustomCity = false
    
    @State private var showError = false
    @State private var errorMessage = ""
    
    var isEditMode: Bool {
        travelTime != nil
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("פרטי המיקום").fontWeight(.bold)) {
                    if isEditMode {
                        HStack {
                            Text("עיר:")
                            Spacer()
                            Text(selectedCity)
                                .foregroundColor(.secondary)
                        }
                        
                        let buildingName = locationManager.buildings.first(where: { $0.id == selectedSiteId })?.name ?? selectedSiteId
                        HStack {
                            Text("אתר הגעה:")
                            Spacer()
                            Text(buildingName)
                                .foregroundColor(.secondary)
                        }
                    } else {
                        Toggle("עיר מותאמת אישית", isOn: $isCustomCity)
                        
                        if isCustomCity {
                            HStack {
                                Text("שם העיר:")
                                TextField("הכנס שם עיר", text: $customCity)
                                    .multilineTextAlignment(.leading)
                            }
                        } else {
                            Picker("בחר עיר", selection: $selectedCity) {
                                ForEach(locationManager.cities, id: \.self) { city in
                                    Text(city).tag(city)
                                }
                            }
                        }
                        
                        Picker("אתר הגעה", selection: $selectedSiteId) {
                            ForEach(locationManager.buildings) { b in
                                Text(b.name).tag(b.id)
                            }
                        }
                    }
                }
                
                Section(header: Text("זמני נסיעה בדקות").fontWeight(.bold)) {
                    HStack {
                        Text("זמן הגעה (הלוך):")
                        Spacer()
                        TextField("דקות", text: $arrivalTimeStr)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 80)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    HStack {
                        Text("זמן חזרה (חזור):")
                        Spacer()
                        TextField("דקות", text: $returnTimeStr)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 80)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                }
            }
            .navigationTitle(isEditMode ? "עריכת זמני נסיעה" : "הוספת זמני נסיעה")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("ביטול") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("שמור") {
                    saveRecord()
                }
                .fontWeight(.bold)
            )
            .alert(isPresented: $showError) {
                Alert(title: Text("שגיאה"), message: Text(errorMessage), dismissButton: .default(Text("אישור")))
            }
            .environment(\.layoutDirection, .rightToLeft)
            .onAppear {
                if let item = travelTime {
                    selectedCity = item.cityName
                    selectedSiteId = item.siteId
                    arrivalTimeStr = "\(item.arrivalTimeMinutes)"
                    returnTimeStr = "\(item.returnTimeMinutes)"
                } else {
                    selectedCity = locationManager.cities.first ?? "חיפה"
                    selectedSiteId = locationManager.buildings.first?.id ?? ""
                    arrivalTimeStr = "30"
                    returnTimeStr = "30"
                }
            }
        }
    }
    
    private func saveRecord() {
        let city = isCustomCity ? customCity.trimmingCharacters(in: .whitespacesAndNewlines) : selectedCity
        
        if city.isEmpty {
            errorMessage = "נא להזין שם עיר חוקי"
            showError = true
            return
        }
        
        if selectedSiteId.isEmpty {
            errorMessage = "נא לבחור אתר הגעה"
            showError = true
            return
        }
        
        guard let arrivalMinutes = Int(arrivalTimeStr), arrivalMinutes >= 0 else {
            errorMessage = "זמן הגעה חייב להיות מספר חיובי"
            showError = true
            return
        }
        
        guard let returnMinutes = Int(returnTimeStr), returnMinutes >= 0 else {
            errorMessage = "זמן חזרה חייב להיות מספר חיובי"
            showError = true
            return
        }
        
        locationManager.updateTravelTime(city: city, siteId: selectedSiteId, arrivalMinutes: arrivalMinutes, returnMinutes: returnMinutes)
        presentationMode.wrappedValue.dismiss()
    }
}

struct BuildingsEditorView: View {
    @ObservedObject var locationManager: LocationManager
    @Environment(\.presentationMode) var presentationMode
    
    @State private var showingAddEdit = false
    @State private var selectedBuildingForEdit: Building?
    @State private var searchText = ""
    
    var filteredBuildings: [Building] {
        if searchText.isEmpty {
            return locationManager.buildings
        } else {
            return locationManager.buildings.filter {
                $0.name.contains(searchText) || $0.id.contains(searchText)
            }
        }
    }
    
    var body: some View {
        NavigationView {
            VStack {
                SearchBar(text: $searchText, placeholder: "חפש לפי שם אתר...")
                    .padding(.top, 10)
                
                List {
                    ForEach(filteredBuildings) { item in
                        Button(action: {
                            selectedBuildingForEdit = item
                            showingAddEdit = true
                        }) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(item.name)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    Text("קואורדינטות: \(String(format: "%.4f", item.latitude)), \(String(format: "%.4f", item.longitude))")
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Text("רדיוס: \(Int(item.radius)) מ׳")
                                    .font(.subheadline)
                                    .foregroundColor(.blue)
                                
                                Image(systemName: "chevron.left")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                    .padding(.leading, 8)
                            }
                        }
                    }
                    .onDelete { offsets in
                        let itemsToDelete = offsets.map { filteredBuildings[$0] }
                        for item in itemsToDelete {
                            locationManager.deleteBuilding(id: item.id)
                        }
                    }
                }
                .listStyle(PlainListStyle())
            }
            .navigationTitle("ניהול אתרי חברה")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("סגור") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button(action: {
                    selectedBuildingForEdit = nil
                    showingAddEdit = true
                }) {
                    Image(systemName: "plus")
                        .font(.title3)
                }
            )
            .sheet(isPresented: $showingAddEdit) {
                AddOrEditBuildingView(
                    locationManager: locationManager,
                    building: selectedBuildingForEdit
                )
            }
            .environment(\.layoutDirection, .rightToLeft)
        }
    }
}

struct AddOrEditBuildingView: View {
    @ObservedObject var locationManager: LocationManager
    var building: Building?
    @Environment(\.presentationMode) var presentationMode
    
    @State private var name = ""
    @State private var latitudeStr = ""
    @State private var longitudeStr = ""
    @State private var radiusStr = ""
    
    @State private var showError = false
    @State private var errorMessage = ""
    
    var isEditMode: Bool {
        building != nil
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("פרטי האתר").fontWeight(.bold)) {
                    HStack {
                        Text("שם האתר:")
                        TextField("לדוגמה: בניין המה״ר", text: $name)
                            .multilineTextAlignment(.leading)
                    }
                }
                
                Section(header: Text("קואורדינטות ורדיוס זיהוי").fontWeight(.bold)) {
                    HStack {
                        Text("קו רוחב (Lat):")
                        Spacer()
                        TextField("לדוגמה: 32.7937", text: $latitudeStr)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 120)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    HStack {
                        Text("קו אורך (Lng):")
                        Spacer()
                        TextField("לדוגמה: 34.9608", text: $longitudeStr)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 120)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    Button(action: {
                        if let loc = locationManager.lastLocation {
                            latitudeStr = "\(loc.coordinate.latitude)"
                            longitudeStr = "\(loc.coordinate.longitude)"
                        } else {
                            errorMessage = "לא ניתן לקבל מיקום GPS נוכחי. ודא שהרשאות המיקום מאושרות."
                            showError = true
                        }
                    }) {
                        HStack {
                            Image(systemName: "location.fill")
                            Text("עדכן לפי מיקום GPS נוכחי")
                                .fontWeight(.bold)
                        }
                        .foregroundColor(.blue)
                        .padding(.vertical, 4)
                    }
                    
                    HStack {
                        Text("רדיוס זיהוי (מ׳):")
                        Spacer()
                        TextField("לדוגמה: 300", text: $radiusStr)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.leading)
                            .frame(width: 120)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                }
            }
            .navigationTitle(isEditMode ? "עריכת אתר" : "הוספת אתר")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarItems(
                leading: Button("ביטול") {
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: Button("שמור") {
                    saveRecord()
                }
                .fontWeight(.bold)
            )
            .alert(isPresented: $showError) {
                Alert(title: Text("שגיאה"), message: Text(errorMessage), dismissButton: .default(Text("אישור")))
            }
            .environment(\.layoutDirection, .rightToLeft)
            .onAppear {
                if let b = building {
                    name = b.name
                    latitudeStr = "\(b.latitude)"
                    longitudeStr = "\(b.longitude)"
                    radiusStr = "\(Int(b.radius))"
                } else {
                    name = ""
                    latitudeStr = ""
                    longitudeStr = ""
                    radiusStr = "300"
                }
            }
        }
    }
    
    private func saveRecord() {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmedName.isEmpty {
            errorMessage = "נא להזין שם אתר חוקי"
            showError = true
            return
        }
        
        guard let lat = Double(latitudeStr) else {
            errorMessage = "קו רוחב חייב להיות מספר עשרוני חוקי"
            showError = true
            return
        }
        
        guard let lng = Double(longitudeStr) else {
            errorMessage = "קו אורך חייב להיות מספר עשרוני חוקי"
            showError = true
            return
        }
        
        guard let rad = Double(radiusStr), rad > 0 else {
            errorMessage = "רדיוס זיהוי חייב להיות מספר חיובי גדול מ-0"
            showError = true
            return
        }
        
        let id = building?.id ?? UUID().uuidString
        locationManager.updateBuilding(id: id, name: trimmedName, latitude: lat, longitude: lng, radius: rad)
        presentationMode.wrappedValue.dismiss()
    }
}
