// Predefined Default Databases
const DEFAULT_BUILDINGS = [
  {
    "id": "haifa_headquarters",
    "name": "מטה חברת החשמל (חיפה)",
    "latitude": 32.7937,
    "longitude": 34.9608,
    "radius": 300,
    "travelTimeMinutes": 30
  },
  {
    "id": "orot_rabin",
    "name": "תחנת הכוח אורות רבין (חדרה)",
    "latitude": 32.4697,
    "longitude": 34.8878,
    "radius": 500,
    "travelTimeMinutes": 45
  },
  {
    "id": "rotenberg",
    "name": "תחנת הכוח רוטנברג (אשקלון)",
    "latitude": 31.6293,
    "longitude": 34.5098,
    "radius": 500,
    "travelTimeMinutes": 60
  },
  {
    "id": "eshkol",
    "name": "תחנת הכוח אשכול (אשדוד)",
    "latitude": 31.8317,
    "longitude": 34.6547,
    "radius": 400,
    "travelTimeMinutes": 45
  },
  {
    "id": "gezer",
    "name": "תחנת הכוח גזר (רמלה)",
    "latitude": 31.8906,
    "longitude": 34.8814,
    "radius": 400,
    "travelTimeMinutes": 35
  },
  {
    "id": "dan_district",
    "name": "מחוז דן (תל אביב)",
    "latitude": 32.0725,
    "longitude": 34.7865,
    "radius": 200,
    "travelTimeMinutes": 40
  }
];

const DEFAULT_TRAVEL_TIMES = [
  { "cityName": "חיפה", "siteId": "haifa_headquarters", "arrivalTimeMinutes": 15, "returnTimeMinutes": 15 },
  { "cityName": "חיפה", "siteId": "orot_rabin", "arrivalTimeMinutes": 40, "returnTimeMinutes": 45 },
  { "cityName": "חיפה", "siteId": "rotenberg", "arrivalTimeMinutes": 120, "returnTimeMinutes": 130 },
  { "cityName": "חיפה", "siteId": "eshkol", "arrivalTimeMinutes": 95, "returnTimeMinutes": 105 },
  { "cityName": "חיפה", "siteId": "gezer", "arrivalTimeMinutes": 80, "returnTimeMinutes": 90 },
  { "cityName": "חיפה", "siteId": "dan_district", "arrivalTimeMinutes": 70, "returnTimeMinutes": 80 },
  
  { "cityName": "תל אביב", "siteId": "haifa_headquarters", "arrivalTimeMinutes": 70, "returnTimeMinutes": 80 },
  { "cityName": "תל אביב", "siteId": "orot_rabin", "arrivalTimeMinutes": 45, "returnTimeMinutes": 50 },
  { "cityName": "תל אביב", "siteId": "rotenberg", "arrivalTimeMinutes": 65, "returnTimeMinutes": 75 },
  { "cityName": "תל אביב", "siteId": "eshkol", "arrivalTimeMinutes": 40, "returnTimeMinutes": 45 },
  { "cityName": "תל אביב", "siteId": "gezer", "arrivalTimeMinutes": 30, "returnTimeMinutes": 35 },
  { "cityName": "תל אביב", "siteId": "dan_district", "arrivalTimeMinutes": 15, "returnTimeMinutes": 15 },

  { "cityName": "חדרה", "siteId": "haifa_headquarters", "arrivalTimeMinutes": 40, "returnTimeMinutes": 45 },
  { "cityName": "חדרה", "siteId": "orot_rabin", "arrivalTimeMinutes": 15, "returnTimeMinutes": 15 },
  { "cityName": "חדרה", "siteId": "rotenberg", "arrivalTimeMinutes": 95, "returnTimeMinutes": 105 },
  { "cityName": "חדרה", "siteId": "eshkol", "arrivalTimeMinutes": 75, "returnTimeMinutes": 80 },
  { "cityName": "חדרה", "siteId": "gezer", "arrivalTimeMinutes": 60, "returnTimeMinutes": 65 },
  { "cityName": "חדרה", "siteId": "dan_district", "arrivalTimeMinutes": 45, "returnTimeMinutes": 50 },

  { "cityName": "אשדוד", "siteId": "haifa_headquarters", "arrivalTimeMinutes": 95, "returnTimeMinutes": 105 },
  { "cityName": "אשדוד", "siteId": "orot_rabin", "arrivalTimeMinutes": 75, "returnTimeMinutes": 80 },
  { "cityName": "אשדוד", "siteId": "rotenberg", "arrivalTimeMinutes": 30, "returnTimeMinutes": 35 },
  { "cityName": "אשדוד", "siteId": "eshkol", "arrivalTimeMinutes": 15, "returnTimeMinutes": 15 },
  { "cityName": "אשדוד", "siteId": "gezer", "arrivalTimeMinutes": 35, "returnTimeMinutes": 40 },
  { "cityName": "אשדוד", "siteId": "dan_district", "arrivalTimeMinutes": 40, "returnTimeMinutes": 45 },

  { "cityName": "אשקלון", "siteId": "haifa_headquarters", "arrivalTimeMinutes": 120, "returnTimeMinutes": 130 },
  { "cityName": "אשקלון", "siteId": "orot_rabin", "arrivalTimeMinutes": 95, "returnTimeMinutes": 105 },
  { "cityName": "אשקלון", "siteId": "rotenberg", "arrivalTimeMinutes": 15, "returnTimeMinutes": 15 },
  { "cityName": "אשקלון", "siteId": "eshkol", "arrivalTimeMinutes": 30, "returnTimeMinutes": 35 },
  { "cityName": "אשקלון", "siteId": "gezer", "arrivalTimeMinutes": 50, "returnTimeMinutes": 55 },
  { "cityName": "אשקלון", "siteId": "dan_district", "arrivalTimeMinutes": 65, "returnTimeMinutes": 75 }
];

let buildingsDatabase = [];
let travelTimesDatabase = [];

function initDatabases() {
    const savedBuildings = localStorage.getItem("iec_db_buildings");
    if (savedBuildings) {
        buildingsDatabase = JSON.parse(savedBuildings);
    } else {
        buildingsDatabase = DEFAULT_BUILDINGS;
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    }

    const savedTravelTimes = localStorage.getItem("iec_db_travel_times");
    if (savedTravelTimes) {
        travelTimesDatabase = JSON.parse(savedTravelTimes);
    } else {
        travelTimesDatabase = DEFAULT_TRAVEL_TIMES;
        localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
    }
}

// App-wide Preferences (Persistent settings, not wiped on shift reset)
let appPreferences = {
    defaultCity: "",
    defaultSnooze: true,
    defaultSnoozeInterval: 5,
    gpsUsageApproved: true,
    clockUsageApproved: true
};

// Real GPS Variables
let gpsWatcherId = null;
let currentLat = null;
let currentLng = null;
let detectedBuilding = null;

// Active Shift State Variables (Wiped on shift reset)
let shiftState = "idle"; // idle, active, resetPending
let shiftData = {
    arrivalDate: null,
    leaveHomeDate: null,
    warningDate: null,
    maxEndDate: null,
    arrivalBuildingId: "",
    arrivalBuildingName: "",
    travelToSiteMinutes: 0,
    returnBuildingId: "",
    returnBuildingName: "",
    travelBackMinutes: 0,
    snoozeEnabled: true,
    snoozeIntervalMinutes: 5
};

// Snooze Loop Parameters
let lastSnoozeAlertTime = null;

// ==========================================================================
// INITIALIZATION AND EVENT BINDINGS
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // Initialize databases from localStorage
    initDatabases();

    // Load saved state (Zero Storage validation)
    loadShiftState();
    
    // Load preferences (Persistent onboarding/snooze settings)
    loadAppPreferences();
    
    // Start GPS tracking based on approval
    if (appPreferences.gpsUsageApproved) {
        startRealGPS();
    } else {
        stopRealGPS();
    }
    
    // Start clock ticks (every 1 second)
    setInterval(appTick, 1000);
    
    // Bind UI elements
    bindUIEvents();
    
    // Initialize select dropdown options
    populateSiteSelectors();
    
    // Register PWA notification permission request if allowed
    if (appPreferences.clockUsageApproved) {
        requestNotificationPermission();
    }
});

// Populate dropdown selectors in the shift setup sheet
function populateSiteSelectors() {
    const arrivalSelect = document.getElementById("setup-arrival-site");
    const returnSelect = document.getElementById("setup-return-site");
    
    let htmlContent = "";
    buildingsDatabase.forEach(b => {
        htmlContent += `<option value="${b.id}">${b.name}</option>`;
    });
    htmlContent += `<option value="other">אחר (הזנה ידנית)</option>`;
    
    arrivalSelect.innerHTML = htmlContent;
    returnSelect.innerHTML = htmlContent;
}

function bindUIEvents() {
    // Start Setup Button
    document.getElementById("btn-start-setup").addEventListener("click", () => {
        openSetupSheet();
    });
    
    // Setup Cancel
    document.getElementById("btn-setup-cancel").addEventListener("click", () => {
        closeSetupSheet();
    });
    
    // Setup Confirm
    document.getElementById("btn-setup-confirm").addEventListener("click", () => {
        confirmStartShift();
    });
    
    document.getElementById("setup-arrival-site").addEventListener("change", (e) => {
        const val = e.target.value;
        const city = appPreferences.defaultCity || "חיפה";
        
        document.getElementById("setup-arrival-travel").value = lookupArrivalTravelTime(city, val);
        
        // Align return building selection by default
        const returnSelect = document.getElementById("setup-return-site");
        returnSelect.value = val;
        
        document.getElementById("setup-return-travel").value = lookupReturnTravelTime(city, val);
    });
    
    document.getElementById("setup-return-site").addEventListener("change", (e) => {
        const val = e.target.value;
        const city = appPreferences.defaultCity || "חיפה";
        
        document.getElementById("setup-return-travel").value = lookupReturnTravelTime(city, val);
    });
    
    // Live Snooze Toggle
    document.getElementById("chk-active-snooze").addEventListener("change", (e) => {
        shiftData.snoozeEnabled = e.target.checked;
        document.getElementById("row-active-snooze-interval").style.display = e.target.checked ? "flex" : "none";
        saveShiftStateToDisk();
    });
    
    // Live Snooze Interval Change
    document.getElementById("active-snooze-interval").addEventListener("change", (e) => {
        shiftData.snoozeIntervalMinutes = parseInt(e.target.value) || 5;
        saveShiftStateToDisk();
    });
    
    // Finish Workday Button
    document.getElementById("btn-finish-workday").addEventListener("click", () => {
        transitionToResetPending();
    });
    
    // Confirm Exit Button (Wipes storage - Zero Storage)
    document.getElementById("btn-confirm-exit").addEventListener("click", () => {
        confirmExitAndWipeData();
    });
    
    // Theme Toggle
    document.getElementById("btn-theme-toggle").addEventListener("click", () => {
        const viewport = document.getElementById("app-viewport");
        const icon = document.querySelector("#btn-theme-toggle i");
        if (viewport.classList.contains("light-mode")) {
            viewport.classList.remove("light-mode");
            viewport.classList.add("dark-mode");
            icon.className = "fa-solid fa-sun";
        } else {
            viewport.classList.remove("dark-mode");
            viewport.classList.add("light-mode");
            icon.className = "fa-solid fa-moon";
        }
    });
    
    // Onboarding Submit
    document.getElementById("btn-onboarding-submit").addEventListener("click", () => {
        const city = document.getElementById("onboarding-city").value;
        appPreferences.defaultCity = city;
        saveAppPreferences();
        document.getElementById("onboarding-screen").classList.remove("active");
        
        // Request notifications permission on onboarding complete
        requestNotificationPermission();
    });
    
    // Settings Button Open
    document.getElementById("btn-settings-toggle").addEventListener("click", () => {
        if (shiftState !== "idle") {
            alert("לא ניתן לשנות הגדרות כלליות במהלך משמרת פעילה!");
            return;
        }
        document.getElementById("settings-default-city").value = appPreferences.defaultCity;
        document.getElementById("settings-default-snooze").checked = appPreferences.defaultSnooze;
        document.getElementById("settings-default-snooze-interval").value = appPreferences.defaultSnoozeInterval || 5;
        document.getElementById("row-settings-snooze-interval").style.display = appPreferences.defaultSnooze ? "flex" : "none";
        
        document.getElementById("settings-gps-approved").checked = appPreferences.gpsUsageApproved;
        document.getElementById("settings-clock-approved").checked = appPreferences.clockUsageApproved;
        
        document.getElementById("settings-sheet").classList.add("active");
    });
    
    // settings default snooze toggle vis control
    document.getElementById("settings-default-snooze").addEventListener("change", (e) => {
        document.getElementById("row-settings-snooze-interval").style.display = e.target.checked ? "flex" : "none";
    });
    
    // Settings Cancel
    document.getElementById("btn-settings-cancel").addEventListener("click", () => {
        document.getElementById("settings-sheet").classList.remove("active");
    });
    
    // Settings Save
    document.getElementById("btn-settings-save").addEventListener("click", () => {
        appPreferences.defaultCity = document.getElementById("settings-default-city").value;
        appPreferences.defaultSnooze = document.getElementById("settings-default-snooze").checked;
        appPreferences.defaultSnoozeInterval = parseInt(document.getElementById("settings-default-snooze-interval").value) || 5;
        
        // Save approvals
        const prevGpsApproved = appPreferences.gpsUsageApproved;
        appPreferences.gpsUsageApproved = document.getElementById("settings-gps-approved").checked;
        appPreferences.clockUsageApproved = document.getElementById("settings-clock-approved").checked;
        
        saveAppPreferences();
        
        // Restart or stop GPS based on preferences
        if (appPreferences.gpsUsageApproved) {
            if (!prevGpsApproved || gpsWatcherId === null) {
                startRealGPS();
            }
        } else {
            stopRealGPS();
        }
        
        // Request notifications if enabled
        if (appPreferences.clockUsageApproved) {
            requestNotificationPermission();
        }
        
        document.getElementById("settings-sheet").classList.remove("active");
    });

    // Travel Times Modal close buttons
    document.getElementById("btn-sim-modal-close").addEventListener("click", () => {
        document.getElementById("sim-travel-time-modal").classList.remove("active");
    });
    document.getElementById("btn-sim-modal-cancel").addEventListener("click", () => {
        document.getElementById("sim-travel-time-modal").classList.remove("active");
    });
    
    // Travel Times Modal save button
    document.getElementById("btn-sim-modal-save").addEventListener("click", () => {
        saveSimTravelTime();
    });
    
    // Toggle custom city in modal
    document.getElementById("chk-sim-custom-city").addEventListener("change", (e) => {
        const isCustom = e.target.checked;
        document.getElementById("sim-group-city-custom").style.display = isCustom ? "flex" : "none";
        document.getElementById("sim-input-city").disabled = isCustom;
    });

    // Open Travel Times List inside app settings
    document.getElementById("btn-settings-open-travel-times").addEventListener("click", () => {
        document.getElementById("travel-times-list-sheet").classList.add("active");
        renderAppTravelTimesList();
    });

    // Close Travel Times List
    document.getElementById("btn-travel-times-list-close").addEventListener("click", () => {
        document.getElementById("travel-times-list-sheet").classList.remove("active");
    });

    // Add Travel Time from app list
    document.getElementById("btn-travel-times-list-add").addEventListener("click", () => {
        openSimTravelTimeModal();
    });

    // Search Travel Times inside app list
    document.getElementById("sim-app-search-travel-times").addEventListener("input", () => {
        renderAppTravelTimesList();
    });

    // Open Buildings List inside app settings
    document.getElementById("btn-settings-open-buildings").addEventListener("click", () => {
        document.getElementById("buildings-list-sheet").classList.add("active");
        renderAppBuildingsList();
    });

    // Close Buildings List
    document.getElementById("btn-buildings-list-close").addEventListener("click", () => {
        document.getElementById("buildings-list-sheet").classList.remove("active");
    });

    // Add Building from app list
    document.getElementById("btn-buildings-list-add").addEventListener("click", () => {
        openSimBuildingModal();
    });

    // Search Buildings inside app list
    document.getElementById("sim-app-search-buildings").addEventListener("input", () => {
        renderAppBuildingsList();
    });

    // Building Modal Close buttons
    document.getElementById("btn-sim-building-modal-close").addEventListener("click", () => {
        document.getElementById("sim-building-modal").classList.remove("active");
    });
    document.getElementById("btn-sim-building-modal-cancel").addEventListener("click", () => {
        document.getElementById("sim-building-modal").classList.remove("active");
    });

    // Building Modal Save button
    document.getElementById("btn-sim-building-modal-save").addEventListener("click", () => {
        saveSimBuilding();
    });

    // Building Modal Prefill GPS button
    document.getElementById("btn-sim-building-prefill-gps").addEventListener("click", () => {
        if (currentLat !== null && currentLng !== null) {
            document.getElementById("sim-input-building-lat").value = currentLat;
            document.getElementById("sim-input-building-lng").value = currentLng;
        } else {
            alert("לא ניתן לקבל מיקום GPS נוכחי. ודא שהרשאות המיקום מאושרות.");
        }
    });

    // Close push notification banner on click
    document.getElementById("ios-push-banner").addEventListener("click", () => {
        document.getElementById("ios-push-banner").classList.remove("active");
    });
}

// ==========================================================================
// SYSTEM TICK
// ==========================================================================

function appTick() {
    const now = new Date();
    
    // Check workday alerts if active
    if (shiftState === "active") {
        updateActiveCounters();
        checkWorkdayAlertThresholds(now);
    }
}

// ==========================================================================
// REAL GPS & LOCATION MAPPING LOGIC
// ==========================================================================

function startRealGPS() {
    if (!appPreferences.gpsUsageApproved) {
        stopRealGPS();
        return;
    }
    
    const dot = document.querySelector("#gps-status-badge .badge-dot");
    const text = document.getElementById("gps-status-text");
    
    if (navigator.geolocation) {
        dot.className = "badge-dot orange";
        text.innerText = "מזהה מיקום GPS...";
        
        // Fetch current position immediately
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                updateGPSStatus();
            },
            (error) => {
                console.error("GPS initial fetch failed:", error);
                detectedBuilding = null;
                updateGPSStatus();
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
        
        // Watch for position updates
        gpsWatcherId = navigator.geolocation.watchPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                updateGPSStatus();
            },
            (error) => {
                console.error("GPS Watcher error:", error);
                detectedBuilding = null;
                updateGPSStatus();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        detectedBuilding = null;
        updateGPSStatus();
    }
}

function stopRealGPS() {
    if (gpsWatcherId !== null) {
        navigator.geolocation.clearWatch(gpsWatcherId);
        gpsWatcherId = null;
    }
    currentLat = null;
    currentLng = null;
    detectedBuilding = null;
    updateGPSStatus();
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const phi1 = lat1 * Math.PI/180;
    const phi2 = lat2 * Math.PI/180;
    const deltaPhi = (lat2-lat1) * Math.PI/180;
    const deltaLambda = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in meters
}

function findMatchingBuilding(lat, lng) {
    if (lat === null || lng === null) return null;
    for (const b of buildingsDatabase) {
        const dist = calculateDistance(lat, lng, b.latitude, b.longitude);
        if (dist <= b.radius) {
            return b;
        }
    }
    return null;
}

function updateGPSStatus() {
    const dot = document.querySelector("#gps-status-badge .badge-dot");
    const text = document.getElementById("gps-status-text");
    
    if (!appPreferences.gpsUsageApproved) {
        detectedBuilding = null;
        dot.className = "badge-dot red";
        text.innerText = "שימוש ב-GPS לא מאושר בהגדרות";
        return;
    }
    
    if (currentLat === null || currentLng === null) {
        detectedBuilding = null;
        dot.className = "badge-dot orange";
        text.innerText = "מחפש לווייני GPS...";
        return;
    }
    
    detectedBuilding = findMatchingBuilding(currentLat, currentLng);
    
    if (detectedBuilding) {
        dot.className = "badge-dot green";
        text.innerText = `אתר מזוהה: ${detectedBuilding.name}`;
    } else {
        dot.className = "badge-dot orange";
        text.innerText = "עבודה מהבית / שטח כללי";
    }
}

// ==========================================================================
// SETUP SHEET / MODAL LOGIC
// ==========================================================================

function openSetupSheet() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    
    document.getElementById("setup-arrival-time").value = `${hh}:${mm}`;
    
    // Set picker selections based on auto detected building
    const arrivalSelect = document.getElementById("setup-arrival-site");
    const returnSelect = document.getElementById("setup-return-site");
    
    const defCity = appPreferences.defaultCity || "חיפה";
    
    if (detectedBuilding) {
        arrivalSelect.value = detectedBuilding.id;
        returnSelect.value = detectedBuilding.id;
        
        document.getElementById("setup-arrival-travel").value = lookupArrivalTravelTime(defCity, detectedBuilding.id);
        document.getElementById("setup-return-travel").value = lookupReturnTravelTime(defCity, detectedBuilding.id);
    } else {
        arrivalSelect.value = "other";
        returnSelect.value = "other";
        
        document.getElementById("setup-arrival-travel").value = 30;
        document.getElementById("setup-return-travel").value = 30;
    }
    
    document.getElementById("setup-sheet").classList.add("active");
}

function closeSetupSheet() {
    document.getElementById("setup-sheet").classList.remove("active");
}

function confirmStartShift() {
    const timeVal = document.getElementById("setup-arrival-time").value;
    if (!timeVal) {
        alert("נא להזין שעת הגעה תקינה.");
        return;
    }
    
    // Construct Date from arrival time input
    const parts = timeVal.split(":");
    const arrivalDateObj = new Date();
    arrivalDateObj.setHours(parseInt(parts[0]));
    arrivalDateObj.setMinutes(parseInt(parts[1]));
    arrivalDateObj.setSeconds(0);
    arrivalDateObj.setMilliseconds(0);
    
    const arrivalSiteId = document.getElementById("setup-arrival-site").value;
    const returnSiteId = document.getElementById("setup-return-site").value;
    
    const travelToVal = parseInt(document.getElementById("setup-arrival-travel").value) || 0;
    const travelBackVal = parseInt(document.getElementById("setup-return-travel").value) || 0;
    
    const snoozeVal = appPreferences.defaultSnooze;
    const snoozeIntervalVal = appPreferences.defaultSnoozeInterval || 5;
    
    // Calculate leave home date = arrival date - travel to minutes
    const leaveHomeDateObj = new Date(arrivalDateObj.getTime() - (travelToVal * 60 * 1000));
    
    // Calculate warning date = leave home date + 11 hours 50 minutes - travel back minutes
    const warningDurationOffset = ((11 * 60) + 50 - travelBackVal) * 60 * 1000;
    const warningDateObj = new Date(leaveHomeDateObj.getTime() + warningDurationOffset);
    
    // Calculate max end date = leave home date + 12 hours - travel back minutes
    const maxDurationOffset = ((12 * 60) - travelBackVal) * 60 * 1000;
    const maxEndDateObj = new Date(leaveHomeDateObj.getTime() + maxDurationOffset);
    
    // Save to local model
    shiftData = {
        arrivalDate: arrivalDateObj.toISOString(),
        leaveHomeDate: leaveHomeDateObj.toISOString(),
        warningDate: warningDateObj.toISOString(),
        maxEndDate: maxEndDateObj.toISOString(),
        arrivalBuildingId: arrivalSiteId,
        arrivalBuildingName: getBuildingName(arrivalSiteId),
        travelToSiteMinutes: travelToVal,
        returnBuildingId: returnSiteId,
        returnBuildingName: getBuildingName(returnSiteId),
        travelBackMinutes: travelBackVal,
        snoozeEnabled: snoozeVal,
        snoozeIntervalMinutes: snoozeIntervalVal
    };
    
    shiftState = "active";
    
    // Clear previous alarm tracker
    lastSnoozeAlertTime = null;
    
    // Zero Storage tracking - save to localStorage for duration of shift
    saveShiftStateToDisk();
    
    // Close sheet and render view
    closeSetupSheet();
    renderViewState();
}

function getBuildingName(id) {
    if (id === "other") return "אחר (אתר מרוחק)";
    const b = buildingsDatabase.find(x => x.id === id);
    return b ? b.name : "עבודה מהבית / שטח";
}

function lookupArrivalTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 30;
    const match = travelTimesDatabase.find(x => x.cityName === city && x.siteId === siteId);
    return match ? match.arrivalTimeMinutes : 30;
}

function lookupReturnTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 30;
    const match = travelTimesDatabase.find(x => x.cityName === city && x.siteId === siteId);
    return match ? match.returnTimeMinutes : 30;
}

// ==========================================================================
// ACTIVE SHIFT VIEWS AND MONITORING
// ==========================================================================

function updateActiveCounters() {
    if (!shiftData.leaveHomeDate || !shiftData.warningDate) return;
    
    const now = new Date();
    const leaveHome = new Date(shiftData.leaveHomeDate);
    const warn = new Date(shiftData.warningDate);
    
    // 1. Calculate Presence Time So Far: (Now - Leave Home) + Travel Back
    const elapsedAtSite = now.getTime() - leaveHome.getTime();
    const travelBackMs = shiftData.travelBackMinutes * 60 * 1000;
    const totalPresenceMs = Math.max(0, elapsedAtSite + travelBackMs);
    
    const presHours = String(Math.floor(totalPresenceMs / 3600000)).padStart(2, '0');
    const presMins = String(Math.floor((totalPresenceMs % 3600000) / 60000)).padStart(2, '0');
    const presSecs = String(Math.floor((totalPresenceMs % 60000) / 1000)).padStart(2, '0');
    
    document.getElementById("active-presence-time").innerText = `${presHours}:${presMins}:${presSecs}`;
    
    // 2. Countdown to Warning Alert (11:50 limit)
    const warnDiff = warn.getTime() - now.getTime();
    const label = document.getElementById("active-countdown-label");
    const countVal = document.getElementById("active-countdown-time");
    
    if (warnDiff <= 0) {
        label.innerText = "חרגת מזמן הנוכחות!";
        label.style.color = "var(--danger-red)";
        countVal.innerText = "00:00:00";
        countVal.style.color = "var(--danger-red)";
    } else {
        label.innerText = "נותר להתראה";
        label.style.color = "var(--text-muted)";
        countVal.style.color = "var(--secondary-color)";
        
        const countHours = String(Math.floor(warnDiff / 3600000)).padStart(2, '0');
        const countMins = String(Math.floor((warnDiff % 3600000) / 60000)).padStart(2, '0');
        const countSecs = String(Math.floor((warnDiff % 60000) / 1000)).padStart(2, '0');
        
        countVal.innerText = `${countHours}:${countMins}:${countSecs}`;
    }
    
    // 3. Progress Ring trim value
    const totalDuration = warn.getTime() - leaveHome.getTime();
    const currentProgress = totalDuration > 0 ? (now.getTime() - leaveHome.getTime()) / totalDuration : 1.0;
    const clampedProgress = Math.min(1.0, Math.max(0.0, currentProgress));
    
    // SVG Dashoffset calculations
    const circle = document.getElementById("progress-bar");
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedProgress * circumference);
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    if (warnDiff <= 0) {
        circle.style.stroke = "var(--danger-red)";
    } else {
        circle.style.stroke = "var(--secondary-color)";
    }
}

// Watch clock ticks against shift limits
function checkWorkdayAlertThresholds(now) {
    if (!shiftData.warningDate) return;
    if (!appPreferences.clockUsageApproved) return;
    
    const warn = new Date(shiftData.warningDate);
    
    if (now.getTime() >= warn.getTime()) {
        // Alert threshold met! Update Banner
        const banner = document.getElementById("active-warning-banner");
        banner.className = "warning-banner alert-active";
        
        document.getElementById("banner-status-title").innerText = "עליך לסיים את יום העבודה!";
        document.getElementById("banner-status-desc").innerText = "חרגת מתקרת ה-11:50 כולל נסיעות.";
        
        // Push notification logic
        if (lastSnoozeAlertTime === null) {
            triggerPushNotification("עליך לסיים את היום!", "הגעת ל-11:50 שעות נוכחות כולל נסיעות. נא סמן סיום.");
            lastSnoozeAlertTime = now.getTime();
        } else if (shiftData.snoozeEnabled) {
            const snoozeIntervalMs = shiftData.snoozeIntervalMinutes * 60 * 1000;
            if (now.getTime() - lastSnoozeAlertTime >= snoozeIntervalMs) {
                triggerPushNotification("תזכורת נודניק נוכחות", `חלפו ${shiftData.snoozeIntervalMinutes} דקות נוספות משעת היעד! נא אשר סיום משמרת.`);
                lastSnoozeAlertTime = now.getTime();
            }
        }
    }
}

function requestNotificationPermission() {
    if (!appPreferences.clockUsageApproved) return;
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            console.log("Notification permission status:", permission);
        });
    }
}

function triggerPushNotification(title, text) {
    // 1. Show internal app banner
    const banner = document.getElementById("ios-push-banner");
    document.getElementById("push-title").innerText = title;
    document.getElementById("push-body").innerText = text;
    
    // Play alert sound
    const audio = document.getElementById("alert-sound");
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Sound play interaction blocked by browser:", e));
    
    // Show banner
    banner.classList.add("active");
    
    // Auto hide after 6 seconds
    setTimeout(() => {
        banner.classList.remove("active");
    }, 6000);
    
    // 2. Trigger real OS notification (Works on PWA added to Home Screen)
    if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
                body: text,
                icon: 'icon-192.png',
                badge: 'icon-192.png',
                vibrate: [200, 100, 200]
            });
        });
    }
}

// Transition from Active to ResetPending screen
function transitionToResetPending() {
    shiftState = "resetPending";
    saveShiftStateToDisk();
    renderViewState();
}

// Confirm Exit and wipe all local storage (Zero Storage compliance)
function confirmExitAndWipeData() {
    shiftState = "idle";
    shiftData = {
        arrivalDate: null,
        leaveHomeDate: null,
        warningDate: null,
        maxEndDate: null,
        arrivalBuildingId: "",
        arrivalBuildingName: "",
        travelToSiteMinutes: 0,
        returnBuildingId: "",
        returnBuildingName: "",
        travelBackMinutes: 0,
        snoozeEnabled: true,
        snoozeIntervalMinutes: 5
    };
    
    clearShiftStateFromDisk();
    renderViewState();
}

// ==========================================================================
// VIEW SWITCHER STATE MANAGER
// ==========================================================================

function renderViewState() {
    // Hide all states
    document.getElementById("view-idle").classList.remove("active");
    document.getElementById("view-active").classList.remove("active");
    document.getElementById("view-reset").classList.remove("active");
    
    if (shiftState === "idle") {
        document.getElementById("view-idle").classList.add("active");
    } 
    else if (shiftState === "active") {
        document.getElementById("view-active").classList.add("active");
        
        // Reset warning banner classes to default
        const banner = document.getElementById("active-warning-banner");
        banner.className = "warning-banner";
        document.getElementById("banner-status-title").innerText = "יום עבודה פעיל מנוהל";
        
        // Set info values
        document.getElementById("banner-status-desc").innerText = `זמן התראה (11:50): ${formatIsoDateToHHMM(shiftData.warningDate)}`;
        document.getElementById("active-val-leave-home").innerText = formatIsoDateToHHMM(shiftData.leaveHomeDate);
        document.getElementById("active-label-arrival-site").innerText = `אתר עבודה (כניסה: ${formatIsoDateToHHMM(shiftData.arrivalDate)})`;
        document.getElementById("active-val-arrival-site").innerText = shiftData.arrivalBuildingName;
        document.getElementById("active-val-travel-times").innerText = `${shiftData.travelToSiteMinutes} + ${shiftData.travelBackMinutes} דק׳`;
        document.getElementById("active-val-return-site").innerText = shiftData.returnBuildingName;
        
        document.getElementById("chk-active-snooze").checked = shiftData.snoozeEnabled;
        document.getElementById("active-snooze-interval").value = shiftData.snoozeIntervalMinutes || 5;
        document.getElementById("row-active-snooze-interval").style.display = shiftData.snoozeEnabled ? "flex" : "none";
    } 
    else if (shiftState === "resetPending") {
        document.getElementById("view-reset").classList.add("active");
    }
}

function formatIsoDateToHHMM(isoString) {
    if (!isoString) return "--:--";
    const d = new Date(isoString);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

// ==========================================================================
// DISK UTILITIES (ZERO STORAGE VALIDATION)
// ==========================================================================

function saveShiftStateToDisk() {
    localStorage.setItem("iec_pwa_shift_state", shiftState);
    localStorage.setItem("iec_pwa_shift_data", JSON.stringify(shiftData));
}

function loadShiftState() {
    const savedState = localStorage.getItem("iec_pwa_shift_state");
    const savedData = localStorage.getItem("iec_pwa_shift_data");
    
    if (savedState && savedData) {
        shiftState = savedState;
        shiftData = JSON.parse(savedData);
        renderViewState();
    } else {
        shiftState = "idle";
        renderViewState();
    }
}

function clearShiftStateFromDisk() {
    localStorage.removeItem("iec_pwa_shift_state");
    localStorage.removeItem("iec_pwa_shift_data");
}

function loadAppPreferences() {
    const city = localStorage.getItem("iec_pref_default_city");
    const snooze = localStorage.getItem("iec_pref_default_snooze");
    const snoozeInterval = localStorage.getItem("iec_pref_default_snooze_interval");
    const gpsApproved = localStorage.getItem("iec_pref_gps_approved");
    const clockApproved = localStorage.getItem("iec_pref_clock_approved");
    
    if (city) {
        appPreferences.defaultCity = city;
        appPreferences.defaultSnooze = snooze === null ? true : (snooze === "true");
        appPreferences.defaultSnoozeInterval = snoozeInterval === null ? 5 : parseInt(snoozeInterval);
        appPreferences.gpsUsageApproved = gpsApproved === null ? true : (gpsApproved === "true");
        appPreferences.clockUsageApproved = clockApproved === null ? true : (clockApproved === "true");
        document.getElementById("onboarding-screen").classList.remove("active");
    } else {
        // Show onboarding
        document.getElementById("onboarding-screen").classList.add("active");
    }
}

function saveAppPreferences() {
    localStorage.setItem("iec_pref_default_city", appPreferences.defaultCity);
    localStorage.setItem("iec_pref_default_snooze", appPreferences.defaultSnooze.toString());
    localStorage.setItem("iec_pref_default_snooze_interval", appPreferences.defaultSnoozeInterval.toString());
    localStorage.setItem("iec_pref_gps_approved", appPreferences.gpsUsageApproved.toString());
    localStorage.setItem("iec_pref_clock_approved", appPreferences.clockUsageApproved.toString());
}

// ==========================================================================
// DATABASE EDITORS LOGIC
// ==========================================================================

function renderAppTravelTimesList() {
    const searchVal = document.getElementById("sim-app-search-travel-times").value.trim().toLowerCase();
    const listContainer = document.getElementById("sim-app-travel-times-list");
    listContainer.innerHTML = "";
    
    let filtered = travelTimesDatabase;
    if (searchVal) {
        filtered = travelTimesDatabase.filter(x => {
            const bName = getBuildingName(x.siteId).toLowerCase();
            return x.cityName.toLowerCase().includes(searchVal) || bName.includes(searchVal);
        });
    }
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">לא נמצאו רשומות</div>`;
        return;
    }
    
    filtered.forEach(item => {
        const row = document.createElement("div");
        row.className = "travel-time-item-row";
        row.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: bold; font-size: 13px;">${item.cityName}</span>
                <span style="color: var(--text-muted); font-size: 11px;">אתר: ${getBuildingName(item.siteId)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="text-align: left; font-size: 11px;">
                    <div style="color: var(--primary-color); font-weight: bold;">הלוך: ${item.arrivalTimeMinutes} דק'</div>
                    <div style="color: var(--accent-orange); font-weight: bold;">חזור: ${item.returnTimeMinutes} דק'</div>
                </div>
                <div class="table-actions">
                    <button class="action-icon-btn edit" onclick="event.stopPropagation(); openSimTravelTimeModal('${item.cityName}', '${item.siteId}')"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteSimTravelTime('${item.cityName}', '${item.siteId}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function openSimTravelTimeModal(city = null, siteId = null) {
    const isEdit = city !== null && siteId !== null;
    document.getElementById("sim-modal-title").innerText = isEdit ? "עריכת זמני נסיעה" : "הוספת זמני נסיעה";
    
    const citySelect = document.getElementById("sim-input-city");
    const siteSelect = document.getElementById("sim-input-site");
    
    // Populate city dropdown options
    const citiesSet = new Set(["חיפה", "תל אביב", "חדרה", "אשדוד", "אשקלון"]);
    travelTimesDatabase.forEach(x => citiesSet.add(x.cityName));
    let cityHtml = "";
    Array.from(citiesSet).sort().forEach(c => {
        cityHtml += `<option value="${c}">${c}</option>`;
    });
    citySelect.innerHTML = cityHtml;
    
    // Populate sites dropdown options
    let sitesHtml = "";
    buildingsDatabase.forEach(b => {
        sitesHtml += `<option value="${b.id}">${b.name}</option>`;
    });
    siteSelect.innerHTML = sitesHtml;
    
    if (isEdit) {
        document.getElementById("sim-edit-original-city").value = city;
        document.getElementById("sim-edit-original-site").value = siteId;
        
        citySelect.value = city;
        citySelect.disabled = true;
        siteSelect.value = siteId;
        siteSelect.disabled = true;
        
        const record = travelTimesDatabase.find(x => x.cityName === city && x.siteId === siteId);
        document.getElementById("sim-input-arrival").value = record ? record.arrivalTimeMinutes : 30;
        document.getElementById("sim-input-return").value = record ? record.returnTimeMinutes : 30;
        
        document.getElementById("chk-sim-custom-city").checked = false;
        document.getElementById("chk-sim-custom-city").disabled = true;
        document.getElementById("sim-group-city-custom").style.display = "none";
    } else {
        document.getElementById("sim-edit-original-city").value = "";
        document.getElementById("sim-edit-original-site").value = "";
        
        citySelect.disabled = false;
        siteSelect.disabled = false;
        
        document.getElementById("sim-input-arrival").value = 30;
        document.getElementById("sim-input-return").value = 30;
        
        document.getElementById("chk-sim-custom-city").checked = false;
        document.getElementById("chk-sim-custom-city").disabled = false;
        document.getElementById("sim-group-city-custom").style.display = "none";
        document.getElementById("sim-input-custom-city").value = "";
    }
    
    document.getElementById("sim-travel-time-modal").classList.add("active");
}

function saveSimTravelTime() {
    const isEdit = document.getElementById("sim-edit-original-city").value !== "";
    const isCustomCity = document.getElementById("chk-sim-custom-city").checked;
    
    let city = "";
    if (isEdit) {
        city = document.getElementById("sim-edit-original-city").value;
    } else if (isCustomCity) {
        city = document.getElementById("sim-input-custom-city").value.trim();
    } else {
        city = document.getElementById("sim-input-city").value;
    }
    
    const siteId = isEdit ? document.getElementById("sim-edit-original-site").value : document.getElementById("sim-input-site").value;
    const arrivalVal = parseInt(document.getElementById("sim-input-arrival").value) || 0;
    const returnVal = parseInt(document.getElementById("sim-input-return").value) || 0;
    
    if (!city) {
        alert("נא להזין שם עיר תקין");
        return;
    }
    
    if (isEdit) {
        const idx = travelTimesDatabase.findIndex(x => x.cityName === city && x.siteId === siteId);
        if (idx !== -1) {
            travelTimesDatabase[idx].arrivalTimeMinutes = arrivalVal;
            travelTimesDatabase[idx].returnTimeMinutes = returnVal;
        }
    } else {
        // Check duplicate
        const exists = travelTimesDatabase.some(x => x.cityName === city && x.siteId === siteId);
        if (exists) {
            alert("כבר קיימים זמני נסיעה עבור עיר ואתר אלו. נא בחר לערוך אותם.");
            return;
        }
        travelTimesDatabase.push({
            cityName: city,
            siteId: siteId,
            arrivalTimeMinutes: arrivalVal,
            returnTimeMinutes: returnVal
        });
    }
    
    localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
    document.getElementById("sim-travel-time-modal").classList.remove("active");
    
    renderAppTravelTimesList();
}

function deleteSimTravelTime(city, siteId) {
    if (confirm(`האם אתה בטוח שברצונך למחוק את זמני הנסיעה בין ${city} ל-${getBuildingName(siteId)}?`)) {
        travelTimesDatabase = travelTimesDatabase.filter(x => !(x.cityName === city && x.siteId === siteId));
        localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
        renderAppTravelTimesList();
    }
}

// --------------------------------------------------------------------------
// Buildings List & Modals
// --------------------------------------------------------------------------

function renderAppBuildingsList() {
    const searchVal = document.getElementById("sim-app-search-buildings").value.trim().toLowerCase();
    const listContainer = document.getElementById("sim-app-buildings-list");
    listContainer.innerHTML = "";
    
    let filtered = buildingsDatabase;
    if (searchVal) {
        filtered = buildingsDatabase.filter(x => x.name.toLowerCase().includes(searchVal) || x.id.toLowerCase().includes(searchVal));
    }
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">לא נמצאו אתרים</div>`;
        return;
    }
    
    filtered.forEach(item => {
        const row = document.createElement("div");
        row.className = "building-item-row";
        row.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-weight: bold; font-size: 13px;">${item.name}</span>
                <span style="color: var(--text-muted); font-size: 11px;">קואורדינטות: ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="color: var(--secondary-color); font-weight: bold; font-size: 11px;">רדיוס: ${item.radius} מ'</span>
                <div class="table-actions">
                    <button class="action-icon-btn edit" onclick="event.stopPropagation(); openSimBuildingModal('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteSimBuilding('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

function openSimBuildingModal(buildingId = null) {
    const isEdit = buildingId !== null;
    document.getElementById("sim-building-modal-title").innerText = isEdit ? "עריכת אתר חברה" : "הוספת אתר חברה";
    
    if (isEdit) {
        document.getElementById("sim-edit-original-building-id").value = buildingId;
        const b = buildingsDatabase.find(x => x.id === buildingId);
        if (b) {
            document.getElementById("sim-input-building-name").value = b.name;
            document.getElementById("sim-input-building-lat").value = b.latitude;
            document.getElementById("sim-input-building-lng").value = b.longitude;
            document.getElementById("sim-input-building-radius").value = b.radius;
        }
    } else {
        document.getElementById("sim-edit-original-building-id").value = "";
        document.getElementById("sim-input-building-name").value = "";
        document.getElementById("sim-input-building-lat").value = "";
        document.getElementById("sim-input-building-lng").value = "";
        document.getElementById("sim-input-building-radius").value = "300";
    }
    
    document.getElementById("sim-building-modal").classList.add("active");
}

function saveSimBuilding() {
    const originalId = document.getElementById("sim-edit-original-building-id").value;
    const isEdit = originalId !== "";
    
    const nameVal = document.getElementById("sim-input-building-name").value.trim();
    const latVal = parseFloat(document.getElementById("sim-input-building-lat").value);
    const lngVal = parseFloat(document.getElementById("sim-input-building-lng").value);
    const radVal = parseInt(document.getElementById("sim-input-building-radius").value) || 300;
    
    if (!nameVal || isNaN(latVal) || isNaN(lngVal)) {
        alert("נא למלא את כל השדות בצורה תקינה.");
        return;
    }
    
    if (isEdit) {
        const idx = buildingsDatabase.findIndex(x => x.id === originalId);
        if (idx !== -1) {
            buildingsDatabase[idx].name = nameVal;
            buildingsDatabase[idx].latitude = latVal;
            buildingsDatabase[idx].longitude = lngVal;
            buildingsDatabase[idx].radius = radVal;
        }
    } else {
        const newId = "site_" + Date.now();
        buildingsDatabase.push({
            id: newId,
            name: nameVal,
            latitude: latVal,
            longitude: lngVal,
            radius: radVal
        });
    }
    
    localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    document.getElementById("sim-building-modal").classList.remove("active");
    
    populateSiteSelectors();
    renderAppBuildingsList();
    updateGPSStatus();
}

function deleteSimBuilding(id) {
    if (confirm(`האם אתה בטוח שברצונך למחוק את אתר החברה הזה? מחיקתו תמחוק אוטומטית גם את כל זמני הנסיעה המשויכים אליו.`)) {
        // Cascade delete building
        buildingsDatabase = buildingsDatabase.filter(x => x.id !== id);
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        
        // Cascade delete travel times associated with it
        travelTimesDatabase = travelTimesDatabase.filter(x => x.siteId !== id);
        localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
        
        populateSiteSelectors();
        renderAppBuildingsList();
        updateGPSStatus();
    }
}

// Global functions for inline HTML button triggers
window.deleteSimTravelTime = deleteSimTravelTime;
window.openSimTravelTimeModal = openSimTravelTimeModal;
window.deleteSimBuilding = deleteSimBuilding;
window.openSimBuildingModal = openSimBuildingModal;
