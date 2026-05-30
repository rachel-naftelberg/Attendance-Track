// Predefined Default Databases (Embedded directly to support opening via file:// protocol without CORS errors as fallback)
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

// Simulator State Machine Variables
let simTimeOffsetMs = 0; // Offset from actual date in MS (used for fast forward)
let simSpeedActive = false; // Fast clock mode (1s real = 1m sim)
let simTimeRate = 1; // Speed factor multiplier

let currentLat = 32.7937; // Default to Haifa Headquarters coordinates
let currentLng = 34.9608;
let detectedBuilding = null;

// Active Shift State Variables
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
    // Initialize mutable databases from localStorage
    initDatabases();

    // Load saved state (Zero Storage validation)
    loadShiftState();
    
    // Load preferences (Persistent onboarding/snooze settings)
    loadAppPreferences();
    
    // Initial GPS calculation
    updateGPSStatus();
    
    // Start main simulator ticks (every 1 second)
    setInterval(simulatorTick, 1000);
    
    // Bind UI elements
    bindUIEvents();
    
    // Initialize select dropdown options
    populateSiteSelectors();
    populateCitySelectors();
    renderTravelTimesTable();
    renderBuildingsTable();
    
    // Refresh inspector views
    updateStorageInspector();
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
        updateStorageInspector();
    });
    
    // Live Snooze Interval Change
    document.getElementById("active-snooze-interval").addEventListener("change", (e) => {
        shiftData.snoozeIntervalMinutes = parseInt(e.target.value) || 5;
        saveShiftStateToDisk();
        updateStorageInspector();
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
    
    // GPS Preset Buttons
    document.querySelectorAll(".preset-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
            const targetBtn = e.currentTarget;
            targetBtn.classList.add("active");
            
            currentLat = parseFloat(targetBtn.getAttribute("data-lat"));
            currentLng = parseFloat(targetBtn.getAttribute("data-lng"));
            
            updateGPSStatus();
        });
    });
    
    // Time Simulator Buttons
    document.getElementById("btn-ff-1h").addEventListener("click", () => {
        simTimeOffsetMs += 60 * 60 * 1000;
        updateUIClock();
    });
    
    document.getElementById("btn-ff-5h").addEventListener("click", () => {
        simTimeOffsetMs += 5 * 60 * 60 * 1000;
        updateUIClock();
    });
    
    document.getElementById("btn-ff-warning").addEventListener("click", () => {
        if (shiftState === "active" && shiftData.warningDate) {
            const warnTime = new Date(shiftData.warningDate).getTime();
            const currSimTime = getSimulatedTime().getTime();
            if (warnTime > currSimTime) {
                simTimeOffsetMs += (warnTime - currSimTime) + 1000; // Jump slightly past warning date
                updateUIClock();
            }
        } else {
            alert("המשמרת אינה פעילה! התחל עבודה תחילה.");
        }
    });
    
    // Speed checkbox
    document.getElementById("chk-speed-time").addEventListener("change", (e) => {
        simSpeedActive = e.target.checked;
        simTimeRate = simSpeedActive ? 60 : 1; // 1 second real = 1 minute simulated
    });
    
    // Close push notification banner on click
    document.getElementById("ios-push-banner").addEventListener("click", () => {
        document.getElementById("ios-push-banner").classList.remove("active");
    });
    
    // Onboarding Submit
    document.getElementById("btn-onboarding-submit").addEventListener("click", () => {
        const city = document.getElementById("onboarding-city").value;
        appPreferences.defaultCity = city;
        saveAppPreferences();
        document.getElementById("onboarding-screen").classList.remove("active");
        updateStorageInspector();
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
        
        // Populate approvals
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
        appPreferences.gpsUsageApproved = document.getElementById("settings-gps-approved").checked;
        appPreferences.clockUsageApproved = document.getElementById("settings-clock-approved").checked;
        
        saveAppPreferences();
        updateGPSStatus(); // Update badge status immediately based on preference change!
        
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
    
    // Travel Times Modal add button
    document.getElementById("btn-add-travel-time").addEventListener("click", () => {
        openSimTravelTimeModal();
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

    // Add Building from sidebar panel
    document.getElementById("btn-add-building").addEventListener("click", () => {
        openSimBuildingModal();
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
        document.getElementById("sim-input-building-lat").value = currentLat;
        document.getElementById("sim-input-building-lng").value = currentLng;
    });
}

// ==========================================================================
// SYSTEM CLOCK & TICKERS
// ==========================================================================

function getSimulatedTime() {
    return new Date(Date.now() + simTimeOffsetMs);
}

function simulatorTick() {
    // If speed clock is active, increment offset
    if (simSpeedActive) {
        // We speed up time by adding 59 seconds every real second (plus the 1s that ticks naturally)
        simTimeOffsetMs += 59 * 1000;
    }
    
    const now = getSimulatedTime();
    
    // Update system clock headers
    updateUIClock();
    
    // Check workday alerts if active
    if (shiftState === "active") {
        updateActiveCounters();
        checkWorkdayAlertThresholds(now);
    }
}

function updateUIClock() {
    const now = getSimulatedTime();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById("sim-clock").innerText = `${hh}:${mm}:${ss}`;
    document.getElementById("device-status-time").innerText = `${hh}:${mm}`;
}

// ==========================================================================
// GPS & LOCATION MAPPING LOGIC
// ==========================================================================

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
    const now = getSimulatedTime();
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
    const arrivalDateObj = getSimulatedTime();
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
    updateStorageInspector();
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
    
    const now = getSimulatedTime();
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

// Watch simulated clock ticks against shift limits
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
        
        // Push notification logic: trigger alert banner
        // Tapping push will open app and trigger transition to reset view
        if (lastSnoozeAlertTime === null) {
            triggerPushNotification("עליך לסיים את היום!", "הגעת ל-11:50 שעות נוכחות כולל נסיעות. נא סמן סיום.");
            lastSnoozeAlertTime = now.getTime();
        } else if (shiftData.snoozeEnabled) {
            // Snooze trigger every snoozeIntervalMinutes (or accelerated equivalent)
            const snoozeIntervalMs = shiftData.snoozeIntervalMinutes * 60 * 1000;
            if (now.getTime() - lastSnoozeAlertTime >= snoozeIntervalMs) {
                triggerPushNotification("תזכורת נודניק נוכחות", `חלפו ${shiftData.snoozeIntervalMinutes} דקות נוספות משעת היעד! נא אשר סיום משמרת.`);
                lastSnoozeAlertTime = now.getTime();
            }
        }
    }
}

function triggerPushNotification(title, text) {
    const banner = document.getElementById("ios-push-banner");
    document.getElementById("push-title").innerText = title;
    document.getElementById("push-body").innerText = text;
    
    // Play alert sound
    const audio = document.getElementById("alert-sound");
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Sound interaction blocked:", e));
    
    // Show banner
    banner.classList.add("active");
    
    // Auto hide after 6 seconds
    setTimeout(() => {
        banner.classList.remove("active");
    }, 6000);
}

// Transition from Active to ResetPending screen
function transitionToResetPending() {
    shiftState = "resetPending";
    saveShiftStateToDisk();
    renderViewState();
    updateStorageInspector();
    
    // Hide any running notifications
    document.getElementById("ios-push-banner").classList.remove("active");
}

// Confirm Exit and wipe all local storage (Zero Storage compliance)
function confirmExitAndWipeData() {
    // Clear variables
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
    
    // Wipe local storage completely
    clearShiftStateFromDisk();
    
    renderViewState();
    updateStorageInspector();
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
    localStorage.setItem("iec_sim_shift_state", shiftState);
    localStorage.setItem("iec_sim_shift_data", JSON.stringify(shiftData));
}

function loadShiftState() {
    const savedState = localStorage.getItem("iec_sim_shift_state");
    const savedData = localStorage.getItem("iec_sim_shift_data");
    
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
    localStorage.removeItem("iec_sim_shift_state");
    localStorage.removeItem("iec_sim_shift_data");
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

function updateStorageInspector() {
    const inspector = document.getElementById("storage-inspector");
    const statusBadge = document.getElementById("storage-status-badge");
    const indicator = statusBadge.querySelector(".status-indicator");
    const text = statusBadge.querySelector(".status-text");
    
    const keys = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("iec_sim_")) {
            try {
                keys[key] = JSON.parse(localStorage.getItem(key));
            } catch {
                keys[key] = localStorage.getItem(key);
            }
        }
    }
    
    inspector.innerText = JSON.stringify(keys, null, 2);
    
    if (Object.keys(keys).length === 0) {
        indicator.className = "status-indicator clean";
        text.innerText = "נקי (אפס שמירת נתונים)";
    } else {
        indicator.className = "status-indicator dirty";
        text.innerText = "פעיל (שמירה זמנית)";
    }
}

// ==========================================================================
// SIMULATOR TRAVEL TIMES MANAGEMENT HELPER FUNCTIONS
// ==========================================================================

function populateCitySelectors() {
    // Get unique cities from travelTimesDatabase
    const citiesSet = new Set();
    travelTimesDatabase.forEach(item => {
        citiesSet.add(item.cityName);
    });
    
    // Convert to sorted array
    const cities = Array.from(citiesSet).sort();
    
    // Update onboarding, settings, and modal city dropdowns
    const onboardingSelect = document.getElementById("onboarding-city");
    const settingsSelect = document.getElementById("settings-default-city");
    const modalSelect = document.getElementById("sim-input-city");
    
    let htmlContent = "";
    cities.forEach(city => {
        htmlContent += `<option value="${city}">${city}</option>`;
    });
    htmlContent += `<option value="other">אחר (הזנה ידנית)</option>`;
    
    if (onboardingSelect) onboardingSelect.innerHTML = htmlContent;
    if (settingsSelect) settingsSelect.innerHTML = htmlContent;
    
    let modalHtml = "";
    cities.forEach(city => {
        modalHtml += `<option value="${city}">${city}</option>`;
    });
    if (modalSelect) modalSelect.innerHTML = modalHtml;
}

function renderTravelTimesTable() {
    const tbody = document.getElementById("travel-times-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    travelTimesDatabase.forEach((item) => {
        const tr = document.createElement("tr");
        
        const building = buildingsDatabase.find(b => b.id === item.siteId);
        const siteName = building ? building.name.replace("חברת החשמל", "").replace("תחנת הכוח", "").trim() : item.siteId;
        
        tr.innerHTML = `
            <td>${item.cityName}</td>
            <td>${siteName}</td>
            <td>${item.arrivalTimeMinutes} דק'</td>
            <td>${item.returnTimeMinutes} דק'</td>
            <td>
                <div class="table-actions">
                    <button class="action-icon-btn edit" onclick="openSimTravelTimeModal('${item.cityName}', '${item.siteId}')" title="ערוך">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="deleteSimTravelTime('${item.cityName}', '${item.siteId}')" title="מחק">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.openSimTravelTimeModal = function(cityName, siteId) {
    const modal = document.getElementById("sim-travel-time-modal");
    const title = document.getElementById("sim-modal-title");
    
    // Populate site options
    const siteSelect = document.getElementById("sim-input-site");
    let siteHtml = "";
    buildingsDatabase.forEach(b => {
        siteHtml += `<option value="${b.id}">${b.name}</option>`;
    });
    siteSelect.innerHTML = siteHtml;
    
    if (cityName && siteId) {
        // Edit mode
        title.innerText = "עריכת זמני נסיעה";
        document.getElementById("sim-edit-original-city").value = cityName;
        document.getElementById("sim-edit-original-site").value = siteId;
        
        const record = travelTimesDatabase.find(x => x.cityName === cityName && x.siteId === siteId);
        if (record) {
            document.getElementById("sim-input-city").value = cityName;
            document.getElementById("sim-input-site").value = siteId;
            document.getElementById("sim-input-arrival").value = record.arrivalTimeMinutes;
            document.getElementById("sim-input-return").value = record.returnTimeMinutes;
        }
        
        document.getElementById("chk-sim-custom-city").checked = false;
        document.getElementById("sim-group-city-custom").style.display = "none";
        document.getElementById("sim-group-city-select").style.opacity = "0.7";
        document.getElementById("sim-input-city").disabled = true;
        document.getElementById("sim-input-site").disabled = true;
        document.getElementById("chk-sim-custom-city").disabled = true;
    } else {
        // Add mode
        title.innerText = "הוספת זמני נסיעה";
        document.getElementById("sim-edit-original-city").value = "";
        document.getElementById("sim-edit-original-site").value = "";
        
        document.getElementById("sim-input-arrival").value = 30;
        document.getElementById("sim-input-return").value = 30;
        
        document.getElementById("chk-sim-custom-city").checked = false;
        document.getElementById("sim-input-custom-city").value = "";
        document.getElementById("sim-group-city-custom").style.display = "none";
        document.getElementById("sim-group-city-select").style.opacity = "1";
        document.getElementById("sim-input-city").disabled = false;
        document.getElementById("sim-input-site").disabled = false;
        document.getElementById("chk-sim-custom-city").disabled = false;
    }
    
    modal.classList.add("active");
};

window.deleteSimTravelTime = function(cityName, siteId) {
    if (confirm(`האם אתה בטוח שברצונך למחוק את זמני הנסיעה עבור ${cityName} אל ${getBuildingName(siteId)}?`)) {
        const index = travelTimesDatabase.findIndex(x => x.cityName === cityName && x.siteId === siteId);
        if (index > -1) {
            travelTimesDatabase.splice(index, 1);
            localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
            
            // Re-render and repopulate UI
            renderTravelTimesTable();
            populateCitySelectors();
            populateSiteSelectors();
            renderAppTravelTimesList();
        }
    }
};

function saveSimTravelTime() {
    const origCity = document.getElementById("sim-edit-original-city").value;
    const origSite = document.getElementById("sim-edit-original-site").value;
    
    const isCustom = document.getElementById("chk-sim-custom-city").checked;
    let city = "";
    
    if (origCity) {
        // Edit mode (key is fixed)
        city = origCity;
    } else {
        // Add mode
        city = isCustom ? document.getElementById("sim-input-custom-city").value.trim() : document.getElementById("sim-input-city").value;
    }
    
    const site = origSite || document.getElementById("sim-input-site").value;
    const arrival = parseInt(document.getElementById("sim-input-arrival").value) || 0;
    const returnTime = parseInt(document.getElementById("sim-input-return").value) || 0;
    
    if (!city) {
        alert("נא להזין שם עיר חוקי.");
        return;
    }
    
    if (arrival < 0 || returnTime < 0) {
        alert("זמני הנסיעה חייבים להיות מספרים חיוביים.");
        return;
    }
    
    if (origCity && origSite) {
        // Update existing record
        const record = travelTimesDatabase.find(x => x.cityName === city && x.siteId === site);
        if (record) {
            record.arrivalTimeMinutes = arrival;
            record.returnTimeMinutes = returnTime;
        }
    } else {
        // Add or overwrite new record
        const existingIndex = travelTimesDatabase.findIndex(x => x.cityName === city && x.siteId === site);
        if (existingIndex > -1) {
            // Overwrite existing record
            travelTimesDatabase[existingIndex] = {
                cityName: city,
                siteId: site,
                arrivalTimeMinutes: arrival,
                returnTimeMinutes: returnTime
            };
        } else {
            // Push new record
            travelTimesDatabase.push({
                cityName: city,
                siteId: site,
                arrivalTimeMinutes: arrival,
                returnTimeMinutes: returnTime
            });
        }
    }
    
    localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
    
    // Close modal
    document.getElementById("sim-travel-time-modal").classList.remove("active");
    
    // Re-render and repopulate UI
    renderTravelTimesTable();
    populateCitySelectors();
    populateSiteSelectors();
    renderAppTravelTimesList();
}

function renderAppTravelTimesList() {
    const listContainer = document.getElementById("sim-app-travel-times-list");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    const searchVal = (document.getElementById("sim-app-search-travel-times")?.value || "").toLowerCase().trim();
    
    // Filter
    const filtered = travelTimesDatabase.filter(item => {
        if (!searchVal) return true;
        const b = buildingsDatabase.find(x => x.id === item.siteId);
        const bName = b ? b.name : "";
        return item.cityName.toLowerCase().includes(searchVal) || bName.toLowerCase().includes(searchVal);
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">לא נמצאו רשומות</div>`;
        return;
    }
    
    filtered.forEach(item => {
        const b = buildingsDatabase.find(x => x.id === item.siteId);
        const bName = b ? b.name : item.siteId;
        
        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer; direction: rtl;";
        
        row.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px; text-align: right;">
                <span style="font-size: 14px; font-weight: 600; color: var(--text-main);">${item.cityName}</span>
                <span style="font-size: 11px; color: var(--text-muted);">אתר: ${bName}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px; font-size: 11px; text-align: left;">
                    <span style="color: var(--secondary-color);">הלוך: ${item.arrivalTimeMinutes} דק'</span>
                    <span style="color: var(--accent-orange);">חזור: ${item.returnTimeMinutes} דק'</span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="action-icon-btn edit" onclick="event.stopPropagation(); openSimTravelTimeModal('${item.cityName}', '${item.siteId}')" style="font-size: 12px;">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteSimTravelTime('${item.cityName}', '${item.siteId}')" style="font-size: 12px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
        
        row.addEventListener("click", () => {
            openSimTravelTimeModal(item.cityName, item.siteId);
        });
        
        listContainer.appendChild(row);
    });
}

function renderBuildingsTable() {
    const tbody = document.getElementById("buildings-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    buildingsDatabase.forEach((b) => {
        const tr = document.createElement("tr");
        const nameShort = b.name.replace("חברת החשמל", "").replace("תחנת הכוח", "").trim();
        
        tr.innerHTML = `
            <td>${nameShort}</td>
            <td>${b.latitude.toFixed(3)}, ${b.longitude.toFixed(3)}</td>
            <td>${b.radius} מ'</td>
            <td>
                <div class="table-actions">
                    <button class="action-icon-btn edit" onclick="openSimBuildingModal('${b.id}')" title="ערוך">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="deleteSimBuilding('${b.id}')" title="מחק">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAppBuildingsList() {
    const listContainer = document.getElementById("sim-app-buildings-list");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    const searchVal = (document.getElementById("sim-app-search-buildings")?.value || "").toLowerCase().trim();
    
    // Filter
    const filtered = buildingsDatabase.filter(b => {
        if (!searchVal) return true;
        return b.name.toLowerCase().includes(searchVal);
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">לא נמצאו אתרים</div>`;
        return;
    }
    
    filtered.forEach(b => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer; direction: rtl;";
        
        row.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 2px; text-align: right;">
                <span style="font-size: 14px; font-weight: 600; color: var(--text-main);">${b.name}</span>
                <span style="font-size: 11px; color: var(--text-muted);">קואורדינטות: ${b.latitude.toFixed(4)}, ${b.longitude.toFixed(4)}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 12px; color: var(--secondary-color); font-weight: 600;">רדיוס: ${b.radius} מ'</span>
                <div style="display: flex; gap: 8px;">
                    <button class="action-icon-btn edit" onclick="event.stopPropagation(); openSimBuildingModal('${b.id}')" style="font-size: 12px;">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="action-icon-btn delete" onclick="event.stopPropagation(); deleteSimBuilding('${b.id}')" style="font-size: 12px;">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
        
        row.addEventListener("click", () => {
            openSimBuildingModal(b.id);
        });
        
        listContainer.appendChild(row);
    });
}

window.openSimBuildingModal = function(buildingId) {
    const modal = document.getElementById("sim-building-modal");
    const title = document.getElementById("sim-building-modal-title");
    
    if (buildingId) {
        // Edit mode
        title.innerText = "עריכת אתר חברה";
        document.getElementById("sim-edit-original-building-id").value = buildingId;
        
        const b = buildingsDatabase.find(x => x.id === buildingId);
        if (b) {
            document.getElementById("sim-input-building-name").value = b.name;
            document.getElementById("sim-input-building-lat").value = b.latitude;
            document.getElementById("sim-input-building-lng").value = b.longitude;
            document.getElementById("sim-input-building-radius").value = b.radius;
        }
    } else {
        // Add mode
        title.innerText = "הוספת אתר חברה";
        document.getElementById("sim-edit-original-building-id").value = "";
        
        document.getElementById("sim-input-building-name").value = "";
        document.getElementById("sim-input-building-lat").value = "";
        document.getElementById("sim-input-building-lng").value = "";
        document.getElementById("sim-input-building-radius").value = 300;
    }
    
    modal.classList.add("active");
};

window.deleteSimBuilding = function(buildingId) {
    const b = buildingsDatabase.find(x => x.id === buildingId);
    if (!b) return;
    
    if (confirm(`האם אתה בטוח שברצונך למחוק את האתר "${b.name}"?\nפעולה זו תמחק גם את כל זמני הנסיעה המשויכים אליו!`)) {
        // Delete building
        const bIndex = buildingsDatabase.findIndex(x => x.id === buildingId);
        if (bIndex > -1) {
            buildingsDatabase.splice(bIndex, 1);
            localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        }
        
        // Cascading delete corresponding travel times
        travelTimesDatabase = travelTimesDatabase.filter(x => x.siteId !== buildingId);
        localStorage.setItem("iec_db_travel_times", JSON.stringify(travelTimesDatabase));
        
        // Re-evaluate GPS status in case user was in this building
        updateGPSStatus();
        
        // Re-render and repopulate UI
        renderBuildingsTable();
        renderAppBuildingsList();
        renderTravelTimesTable();
        renderAppTravelTimesList();
        populateSiteSelectors();
    }
};

function saveSimBuilding() {
    const origId = document.getElementById("sim-edit-original-building-id").value;
    
    const name = document.getElementById("sim-input-building-name").value.trim();
    const lat = parseFloat(document.getElementById("sim-input-building-lat").value);
    const lng = parseFloat(document.getElementById("sim-input-building-lng").value);
    const radius = parseFloat(document.getElementById("sim-input-building-radius").value);
    
    if (!name) {
        alert("נא להזין שם אתר.");
        return;
    }
    
    if (isNaN(lat) || isNaN(lng)) {
        alert("נא להזין קואורדינטות GPS חוקיות.");
        return;
    }
    
    if (isNaN(radius) || radius <= 0) {
        alert("רדיוס זיהוי חייב להיות מספר חיובי גדול מ-0.");
        return;
    }
    
    if (origId) {
        // Edit mode
        const b = buildingsDatabase.find(x => x.id === origId);
        if (b) {
            b.name = name;
            b.latitude = lat;
            b.longitude = lng;
            b.radius = radius;
        }
    } else {
        // Add mode
        const id = "custom_site_" + Date.now();
        buildingsDatabase.push({
            id: id,
            name: name,
            latitude: lat,
            longitude: lng,
            radius: radius
        });
    }
    
    localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    
    // Close modal
    document.getElementById("sim-building-modal").classList.remove("active");
    
    // Re-evaluate GPS status
    updateGPSStatus();
    
    // Re-render and repopulate UI
    renderBuildingsTable();
    renderAppBuildingsList();
    renderTravelTimesTable();
    renderAppTravelTimesList();
    populateSiteSelectors();
}
