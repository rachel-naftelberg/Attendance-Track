// Predefined Default Databases (Embedded directly to support opening via file:// protocol without CORS errors as fallback)
const DEFAULT_BUILDINGS = [
  {
    "id": "haifa_headquarters",
    "name": "מטה חברת החשמל (חיפה)",
    "latitude": 32.7937,
    "longitude": 34.9608,
    "radius": 300,
    "travelTimeMinutes": 30,
    "destinationCity": "חיפה",
    "isPrimary": true
  },
  {
    "id": "orot_rabin",
    "name": "תחנת הכוח אורות רבין (חדרה)",
    "latitude": 32.4697,
    "longitude": 34.8878,
    "radius": 500,
    "travelTimeMinutes": 45,
    "destinationCity": "חדרה",
    "isPrimary": true
  },
  {
    "id": "rotenberg",
    "name": "תחנת הכוח רוטנברג (אשקלון)",
    "latitude": 31.6293,
    "longitude": 34.5098,
    "radius": 500,
    "travelTimeMinutes": 60,
    "destinationCity": "אשקלון",
    "isPrimary": true
  },
  {
    "id": "eshkol",
    "name": "תחנת הכוח אשכול (אשדוד)",
    "latitude": 31.8317,
    "longitude": 34.6547,
    "radius": 400,
    "travelTimeMinutes": 45,
    "destinationCity": "אשדוד",
    "isPrimary": true
  },
  {
    "id": "gezer",
    "name": "תחנת הכוח גזר (רמלה)",
    "latitude": 31.8906,
    "longitude": 34.8814,
    "radius": 400,
    "travelTimeMinutes": 35,
    "destinationCity": "רמלה",
    "isPrimary": true
  },
  {
    "id": "dan_district",
    "name": "מחוז דן (תל אביב)",
    "latitude": 32.0725,
    "longitude": 34.7865,
    "radius": 200,
    "travelTimeMinutes": 40,
    "destinationCity": "תל אביב - יפו",
    "isPrimary": true
  }
];

let buildingsDatabase = [];
let travelDatabaseCities = [];
let travelDatabaseTimes = {};

function initDatabases() {
    const savedBuildings = localStorage.getItem("iec_db_buildings");
    if (savedBuildings) {
        buildingsDatabase = JSON.parse(savedBuildings);
        // Run data migration to ensure isPrimary and destinationCity exist
        let updated = false;
        buildingsDatabase.forEach(b => {
            if (b.isPrimary === undefined) {
                b.isPrimary = b.id === "haifa_headquarters" || b.id === "orot_rabin" || b.id === "rotenberg" || b.id === "eshkol" || b.id === "gezer" || b.id === "dan_district";
                updated = true;
            }
            if (!b.destinationCity) {
                if (b.id === "haifa_headquarters") b.destinationCity = "חיפה";
                else if (b.id === "orot_rabin") b.destinationCity = "חדרה";
                else if (b.id === "rotenberg") b.destinationCity = "אשקלון";
                else if (b.id === "eshkol") b.destinationCity = "אשדוד";
                else if (b.id === "gezer") b.destinationCity = "רמלה";
                else if (b.id === "dan_district") b.destinationCity = "תל אביב - יפו";
                else b.destinationCity = "חיפה";
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        }
    } else {
        buildingsDatabase = DEFAULT_BUILDINGS;
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
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
    
    // Load travel database
    fetch("travel_db.json")
        .then(res => res.json())
        .then(data => {
            travelDatabaseCities = data.cities;
            travelDatabaseTimes = data.times;
            populateCitySelectors();
            populateSiteSelectors();
        })
        .catch(err => {
            console.error("Failed to load travel database:", err);
        });

    // Initial GPS calculation
    updateGPSStatus();
    
    // Start main simulator ticks (every 1 second)
    setInterval(simulatorTick, 1000);
    
    // Bind UI elements
    bindUIEvents();
    
    // Initialize select dropdown options
    populateSiteSelectors();
    renderBuildingsTable();
    
    // Refresh inspector views
    updateStorageInspector();
});

// Populate dropdown selectors in the shift setup sheet
function populateSiteSelectors() {
    const arrivalSelect = document.getElementById("setup-arrival-site");
    const returnSelect = document.getElementById("setup-return-site");
    
    if (!arrivalSelect || !returnSelect) return;
    
    // Sort buildingsDatabase so isPrimary comes first
    const sortedBuildings = [...buildingsDatabase].sort((a, b) => {
        const aPri = a.isPrimary ? 1 : 0;
        const bPri = b.isPrimary ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.name.localeCompare(b.name, 'he');
    });
    
    let htmlContent = "";
    sortedBuildings.forEach(b => {
        const prefix = b.isPrimary ? "⭐ " : "";
        htmlContent += `<option value="${b.id}">${prefix}${b.name}</option>`;
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

function getTravelTimeFromDB(city, destCity) {
    if (!city || !destCity || !travelDatabaseTimes) return null;
    return travelDatabaseTimes[city]?.[destCity] || null;
}

function getTravelTimeDetails(isArrival, city, destCity) {
    if (!city || !destCity || city === "other" || destCity === "other") {
        return 0;
    }
    
    // Rule 2: Office city override
    if (appPreferences.mainOfficeCity && destCity === appPreferences.mainOfficeCity) {
        return 0;
    }
    
    const times = getTravelTimeFromDB(city, destCity);
    if (!times) return 0;
    
    const arrivalDb = parseInt(times[0]) || 0;
    const returnDb = parseInt(times[1]) || 0;
    const totalTimeDb = parseInt(times[3]) || 0;
    
    const dbVal = isArrival ? arrivalDb : returnDb;
    
    // Rule 1: Dedicated arrival/return time > 0
    if (dbVal > 0) {
        // Rule 3: If calculated travel time is < 30 minutes, display 0
        if (dbVal < 30) {
            return 0;
        }
        return dbVal;
    }
    
    // Rule 4: Database arrival/return is 0:00 but general travel time exists
    if (dbVal === 0 && totalTimeDb > 0) {
        // Rule 3: If calculated travel time is < 30 minutes, display 0
        if (totalTimeDb < 30) {
            return 0;
        }
        return totalTimeDb;
    }
    
    return 0;
}

function lookupArrivalTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 0;
    
    const building = buildingsDatabase.find(x => x.id === siteId);
    if (building && building.destinationCity) {
        return getTravelTimeDetails(true, city, building.destinationCity);
    }
    
    return 0;
}

function lookupReturnTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 0;
    
    const building = buildingsDatabase.find(x => x.id === siteId);
    if (building && building.destinationCity) {
        return getTravelTimeDetails(false, city, building.destinationCity);
    }
    
    return 0;
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
    if (!travelDatabaseCities.length) return;
    
    const onboardingSelect = document.getElementById("onboarding-city");
    const settingsSelect = document.getElementById("settings-default-city");
    
    let htmlContent = "";
    travelDatabaseCities.forEach(city => {
        htmlContent += `<option value="${city}">${city}</option>`;
    });
    htmlContent += `<option value="other">אחר (הזנה ידנית)</option>`;
    
    if (onboardingSelect) onboardingSelect.innerHTML = htmlContent;
    if (settingsSelect) settingsSelect.innerHTML = htmlContent;
}

function toggleBuildingPrimary(id) {
    const building = buildingsDatabase.find(x => x.id === id);
    if (!building) return;
    
    if (!building.isPrimary) {
        const primaryCount = buildingsDatabase.filter(x => x.isPrimary).length;
        if (primaryCount >= 10) {
            alert("ניתן לסמן עד 10 אתרים עיקריים בלבד!");
            return;
        }
        building.isPrimary = true;
    } else {
        building.isPrimary = false;
    }
    
    localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    
    renderAppBuildingsList();
    renderBuildingsTable();
    populateSiteSelectors();
}
window.toggleBuildingPrimary = toggleBuildingPrimary;

function renderBuildingsTable() {
    const tbody = document.getElementById("buildings-table-body");
    if (!tbody) return;
    
    tbody.innerHTML = "";
    
    let sorted = [...buildingsDatabase].sort((a, b) => {
        const aPri = a.isPrimary ? 1 : 0;
        const bPri = b.isPrimary ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.name.localeCompare(b.name, 'he');
    });
    
    sorted.forEach((b) => {
        const tr = document.createElement("tr");
        const nameShort = b.name.replace("חברת החשמל", "").replace("תחנת הכוח", "").trim();
        const starClass = b.isPrimary ? "fa-solid fa-star" : "fa-regular fa-star";
        
        tr.innerHTML = `
            <td>
                <button class="star-toggle" onclick="toggleBuildingPrimary('${b.id}')" style="color: ${b.isPrimary ? '#ffb300' : 'var(--text-muted)'}; font-size: 12px; background: none; border: none; cursor: pointer; padding: 2px;">
                    <i class="${starClass}"></i>
                </button>
                ${nameShort}
            </td>
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
    let filtered = buildingsDatabase.filter(b => {
        if (!searchVal) return true;
        return b.name.toLowerCase().includes(searchVal);
    });
    
    // Sort so that isPrimary === true buildings come first
    filtered = [...filtered].sort((a, b) => {
        const aPri = a.isPrimary ? 1 : 0;
        const bPri = b.isPrimary ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.name.localeCompare(b.name, 'he');
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">לא נמצאו אתרים</div>`;
        return;
    }
    
    filtered.forEach(b => {
        const row = document.createElement("div");
        row.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color); cursor: pointer; direction: rtl;";
        const starClass = b.isPrimary ? "fa-solid fa-star" : "fa-regular fa-star";
        
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <button class="action-icon-btn star-toggle" onclick="event.stopPropagation(); toggleBuildingPrimary('${b.id}')" style="color: ${b.isPrimary ? '#ffb300' : 'var(--text-muted)'}; font-size: 14px; background: none; border: none; cursor: pointer; padding: 4px;">
                     <i class="${starClass}"></i>
                </button>
                <div style="display: flex; flex-direction: column; gap: 2px; text-align: right;">
                    <span style="font-size: 14px; font-weight: 600; color: var(--text-main);">${b.name}</span>
                    <span style="font-size: 11px; color: var(--text-muted);">קואורדינטות: ${b.latitude.toFixed(4)}, ${b.longitude.toFixed(4)}</span>
                </div>
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
    
    const destCitySelect = document.getElementById("sim-input-building-dest-city");
    if (destCitySelect && travelDatabaseCities.length) {
        let options = "";
        travelDatabaseCities.forEach(city => {
            options += `<option value="${city}">${city}</option>`;
        });
        destCitySelect.innerHTML = options;
    }
    
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
            if (destCitySelect) destCitySelect.value = b.destinationCity || "חיפה";
        }
    } else {
        // Add mode
        title.innerText = "הוספת אתר חברה";
        document.getElementById("sim-edit-original-building-id").value = "";
        
        document.getElementById("sim-input-building-name").value = "";
        document.getElementById("sim-input-building-lat").value = "";
        document.getElementById("sim-input-building-lng").value = "";
        document.getElementById("sim-input-building-radius").value = 300;
        if (destCitySelect) destCitySelect.value = "חיפה";
    }
    
    modal.classList.add("active");
};

window.deleteSimBuilding = function(buildingId) {
    const b = buildingsDatabase.find(x => x.id === buildingId);
    if (!b) return;
    
window.deleteSimBuilding = function(buildingId) {
    const b = buildingsDatabase.find(x => x.id === buildingId);
    if (!b) return;
    
    if (confirm(`האם אתה בטוח שברצונך למחוק את האתר "${b.name}"?`)) {
        // Delete building
        const bIndex = buildingsDatabase.findIndex(x => x.id === buildingId);
        if (bIndex > -1) {
            buildingsDatabase.splice(bIndex, 1);
            localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        }
        
        // Re-evaluate GPS status in case user was in this building
        updateGPSStatus();
        
        // Re-render and repopulate UI
        renderBuildingsTable();
        renderAppBuildingsList();
        populateSiteSelectors();
    }
};

function saveSimBuilding() {
    const origId = document.getElementById("sim-edit-original-building-id").value;
    
    const name = document.getElementById("sim-input-building-name").value.trim();
    const lat = parseFloat(document.getElementById("sim-input-building-lat").value);
    const lng = parseFloat(document.getElementById("sim-input-building-lng").value);
    const radius = parseFloat(document.getElementById("sim-input-building-radius").value);
    const destCityVal = document.getElementById("sim-input-building-dest-city").value;
    
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
            b.destinationCity = destCityVal;
        }
    } else {
        // Add mode
        const id = "custom_site_" + Date.now();
        buildingsDatabase.push({
            id: id,
            name: name,
            latitude: lat,
            longitude: lng,
            radius: radius,
            destinationCity: destCityVal,
            isPrimary: false
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
    populateSiteSelectors();
}
