// Predefined Default Databases
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

// Database of major Israeli cities for offline reverse geocoding fallback
const CITIES_COORDINATES = [
  { name: "חיפה", lat: 32.7940, lng: 34.9896 },
  { name: "תל אביב-יפו", lat: 32.0853, lng: 34.7818 },
  { name: "ירושלים", lat: 31.7683, lng: 35.2137 },
  { name: "באר שבע", lat: 31.2529, lng: 34.7972 },
  { name: "ראשון לציון", lat: 31.9730, lng: 34.7925 },
  { name: "פתח תקווה", lat: 32.0840, lng: 34.8878 },
  { name: "אשדוד", lat: 31.8044, lng: 34.6553 },
  { name: "נתניה", lat: 32.3215, lng: 34.8532 },
  { name: "חולון", lat: 32.0161, lng: 34.7731 },
  { name: "בני ברק", lat: 32.0837, lng: 34.8314 },
  { name: "רמת גן", lat: 32.0823, lng: 34.8106 },
  { name: "רחובות", lat: 31.8928, lng: 34.8113 },
  { name: "אשקלון", lat: 31.6688, lng: 34.5743 },
  { name: "בת ים", lat: 32.0167, lng: 34.7431 },
  { name: "בית שמש", lat: 31.7438, lng: 34.9875 },
  { name: "כפר סבא", lat: 32.1750, lng: 34.9064 },
  { name: "הרצליה", lat: 32.1624, lng: 34.8447 },
  { name: "חדרה", lat: 32.4340, lng: 34.9197 },
  { name: "מודיעין-מכבים-רעות", lat: 31.9077, lng: 35.0076 },
  { name: "רעננה", lat: 32.1848, lng: 34.8713 },
  { name: "רמלה", lat: 31.9272, lng: 34.8622 },
  { name: "לוד", lat: 31.9513, lng: 34.8878 },
  { name: "גבעתיים", lat: 32.0722, lng: 34.8106 },
  { name: "הוד השרון", lat: 32.1550, lng: 34.8931 },
  { name: "ראש העין", lat: 32.0956, lng: 34.9575 },
  { name: "נהרייה", lat: 33.0036, lng: 35.0939 },
  { name: "קריית גת", lat: 31.6033, lng: 34.7639 },
  { name: "אילת", lat: 29.5577, lng: 34.9519 },
  { name: "כרמיאל", lat: 32.9136, lng: 35.2961 },
  { name: "עכו", lat: 32.9278, lng: 35.0817 },
  { name: "נצרת", lat: 32.6996, lng: 35.3035 },
  { name: "עפולה", lat: 32.6062, lng: 35.2891 },
  { name: "טבריה", lat: 32.7922, lng: 35.5312 },
  { name: "קרית שמונה", lat: 33.2078, lng: 35.5696 },
  { name: "קריית מוצקין", lat: 32.8392, lng: 35.0767 },
  { name: "קריית ביאליק", lat: 32.8336, lng: 35.0864 },
  { name: "קריית ים", lat: 32.8456, lng: 35.0725 },
  { name: "נשר", lat: 32.7628, lng: 35.0381 },
  { name: "טירת כרמל", lat: 32.7633, lng: 34.9700 },
  { name: "זיכרון יעקב", lat: 32.5736, lng: 34.9525 },
  { name: "קיסריה", lat: 32.5186, lng: 34.9039 },
  { name: "בנימינה-גבעת עדה", lat: 32.5158, lng: 34.9497 },
  { name: "פרדס חנה-כרכור", lat: 32.4756, lng: 34.9817 },
  { name: "אור עקיבא", lat: 32.5028, lng: 34.9197 },
  { name: "יקנעם עילית", lat: 32.6642, lng: 35.1097 },
  { name: "קריית מלאכי", lat: 31.7275, lng: 34.7431 },
  { name: "דימונה", lat: 31.0694, lng: 35.0322 },
  { name: "ערד", lat: 31.2606, lng: 35.2153 },
  { name: "מצפה רמון", lat: 30.6128, lng: 34.8028 }
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

// Real GPS Variables
let gpsWatcherId = null;
let currentLat = null;
let currentLng = null;
let detectedBuilding = null;
let gpsErrorStatus = null;
let currentCityName = null;
let lastGeocodedLat = null;
let lastGeocodedLng = null;

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
    
    // Load travel database
    fetch("travel_db.json")
        .then(res => res.json())
        .then(data => {
            travelDatabaseCities = data.cities;
            travelDatabaseTimes = data.times;
            populateCityDropdowns();
            populateSiteSelectors();
        })
        .catch(err => {
            console.error("Failed to load travel database:", err);
        });

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
function populateCityDropdowns() {
    const onboardingSelect = document.getElementById("onboarding-city");
    const settingsSelect = document.getElementById("settings-default-city");
    
    if (!onboardingSelect || !settingsSelect || !travelDatabaseCities.length) return;
    
    let htmlContent = "";
    travelDatabaseCities.forEach(city => {
        htmlContent += `<option value="${city}">${city}</option>`;
    });
    htmlContent += `<option value="other">אחר (הזנה ידנית)</option>`;
    
    onboardingSelect.innerHTML = htmlContent;
    settingsSelect.innerHTML = htmlContent;
    
    if (appPreferences.defaultCity) {
        settingsSelect.value = appPreferences.defaultCity;
    }
}

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
    
    // GPS Badge Manual Refresh Click
    document.getElementById("gps-status-badge").addEventListener("click", () => {
        startRealGPS();
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

function findNearestCityOffline(lat, lng) {
    let nearestCity = "שטח כללי";
    let minDistance = Infinity;
    for (const c of CITIES_COORDINATES) {
        const dist = calculateDistance(lat, lng, c.lat, c.lng);
        if (dist < minDistance) {
            minDistance = dist;
            nearestCity = c.name;
        }
    }
    return nearestCity;
}

async function fetchOnlineCity(lat, lng) {
    // Avoid spamming requests if coordinates barely changed (less than 150m)
    if (lastGeocodedLat !== null && lastGeocodedLng !== null) {
        const distanceMoved = calculateDistance(lat, lng, lastGeocodedLat, lastGeocodedLng);
        if (distanceMoved < 150) {
            return;
        }
    }
    
    lastGeocodedLat = lat;
    lastGeocodedLng = lng;
    
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=he`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.city_district || addr.county;
                if (city) {
                    currentCityName = city;
                    updateGPSStatus();
                }
            }
        }
    } catch (e) {
        console.error("Failed to fetch online city name:", e);
    }
}

function startRealGPS(highAccuracy = true) {
    if (!appPreferences.gpsUsageApproved) {
        stopRealGPS();
        return;
    }
    
    const dot = document.querySelector("#gps-status-badge .badge-dot");
    const text = document.getElementById("gps-status-text");
    const refreshIcon = document.getElementById("gps-refresh-icon");
    
    if (refreshIcon) {
        refreshIcon.classList.add("fa-spin");
    }
    
    if (gpsWatcherId !== null) {
        navigator.geolocation.clearWatch(gpsWatcherId);
        gpsWatcherId = null;
    }
    
    if (navigator.geolocation) {
        if (currentLat === null || currentLng === null) {
            if (dot) dot.className = "badge-dot orange";
            if (text) text.innerText = highAccuracy ? "מזהה מיקום GPS..." : "מזהה מיקום GPS (דיוק בסיסי)...";
        }
        
        // Fetch current position immediately
        navigator.geolocation.getCurrentPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                gpsErrorStatus = null;
                
                // Set offline city name estimate immediately
                currentCityName = findNearestCityOffline(currentLat, currentLng);
                updateGPSStatus();
                
                // Fetch precise city name online
                fetchOnlineCity(currentLat, currentLng);
                
                if (refreshIcon) {
                    refreshIcon.classList.remove("fa-spin");
                }
            },
            (error) => {
                console.error(`GPS initial fetch failed (highAccuracy=${highAccuracy}):`, error);
                
                // Fallback to low accuracy if high accuracy failed
                if (highAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
                    console.log("Retrying GPS with low accuracy...");
                    startRealGPS(false);
                    return;
                }
                
                gpsErrorStatus = error;
                detectedBuilding = null;
                updateGPSStatus();
                if (refreshIcon) {
                    refreshIcon.classList.remove("fa-spin");
                }
            },
            { enableHighAccuracy: highAccuracy, timeout: 15000, maximumAge: 0 }
        );
        
        // Watch for position updates
        gpsWatcherId = navigator.geolocation.watchPosition(
            (position) => {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                gpsErrorStatus = null;
                
                currentCityName = findNearestCityOffline(currentLat, currentLng);
                updateGPSStatus();
                fetchOnlineCity(currentLat, currentLng);
                
                if (refreshIcon) {
                    refreshIcon.classList.remove("fa-spin");
                }
            },
            (error) => {
                console.error(`GPS Watcher error (highAccuracy=${highAccuracy}):`, error);
                
                // Fallback to low accuracy for watcher if it fails due to timeout/signal
                if (highAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
                    console.log("Retrying GPS watcher with low accuracy...");
                    startRealGPS(false);
                    return;
                }
                
                gpsErrorStatus = error;
                detectedBuilding = null;
                updateGPSStatus();
                if (refreshIcon) {
                    refreshIcon.classList.remove("fa-spin");
                }
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: 15000,
                maximumAge: 0
            }
        );
    } else {
        gpsErrorStatus = { code: 0, message: "הדפדפן אינו תומך ב-GPS" };
        detectedBuilding = null;
        updateGPSStatus();
        if (refreshIcon) {
            refreshIcon.classList.remove("fa-spin");
        }
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
    gpsErrorStatus = null;
    currentCityName = null;
    lastGeocodedLat = null;
    lastGeocodedLng = null;
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
    
    if (!dot || !text) return;
    
    if (!appPreferences.gpsUsageApproved) {
        detectedBuilding = null;
        dot.className = "badge-dot red";
        text.innerText = "שימוש ב-GPS לא מאושר בהגדרות";
        return;
    }
    
    if (gpsErrorStatus) {
        detectedBuilding = null;
        dot.className = "badge-dot red";
        switch (gpsErrorStatus.code) {
            case 1: // PERMISSION_DENIED
                text.innerText = "שגיאה: הרשאת מיקום נחסמה במכשיר/דפדפן. יש לאשר בהגדרות.";
                break;
            case 2: // POSITION_UNAVAILABLE
                text.innerText = "שגיאה: אות ה-GPS אינו זמין (נסה לעבור למקום פתוח).";
                break;
            case 3: // TIMEOUT
                text.innerText = "שגיאה: פג זמן ההמתנה לקבלת מיקום מהלוויין.";
                break;
            default:
                text.innerText = `שגיאת מיקום: ${gpsErrorStatus.message || 'לא ידועה'}`;
                break;
        }
        return;
    }
    
    if (currentLat === null || currentLng === null) {
        detectedBuilding = null;
        dot.className = "badge-dot orange";
        text.innerText = "מחפש אות GPS...";
        return;
    }
    
    detectedBuilding = findMatchingBuilding(currentLat, currentLng);
    
    if (detectedBuilding) {
        dot.className = "badge-dot green";
        text.innerText = `אתר מזוהה: ${detectedBuilding.name}`;
    } else {
        dot.className = "badge-dot green";
        const cityDisplay = currentCityName ? `עיר: ${currentCityName}` : "שטח / אתר אחר";
        text.innerText = `שטח / אתר אחר (${cityDisplay})`;
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

function getTravelTimeFromDB(city, destCity) {
    if (!city || !destCity || !travelDatabaseCities.length) return null;
    
    const cityIdx = travelDatabaseCities.indexOf(city);
    const destIdx = travelDatabaseCities.indexOf(destCity);
    
    if (cityIdx === -1 || destIdx === -1) return null;
    
    const cityKey = cityIdx.toString();
    const destKey = destIdx.toString();
    
    if (travelDatabaseTimes[cityKey] && travelDatabaseTimes[cityKey][destKey]) {
        return travelDatabaseTimes[cityKey][destKey]; // returns [arrival, return]
    }
    return null;
}

function lookupArrivalTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 30;
    
    const building = buildingsDatabase.find(x => x.id === siteId);
    if (building && building.destinationCity) {
        const times = getTravelTimeFromDB(city, building.destinationCity);
        if (times) return times[0];
    }
    
    return 30;
}

function lookupReturnTravelTime(city, siteId) {
    if (city === "other" || siteId === "other") return 30;
    
    const building = buildingsDatabase.find(x => x.id === siteId);
    if (building && building.destinationCity) {
        const times = getTravelTimeFromDB(city, building.destinationCity);
        if (times) return times[1];
    }
    
    return 30;
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



// --------------------------------------------------------------------------
// Buildings List & Modals
// --------------------------------------------------------------------------

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
    populateSiteSelectors();
}

function renderAppBuildingsList() {
    const searchVal = document.getElementById("sim-app-search-buildings").value.trim().toLowerCase();
    const listContainer = document.getElementById("sim-app-buildings-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    
    let filtered = buildingsDatabase;
    if (searchVal) {
        filtered = buildingsDatabase.filter(x => x.name.toLowerCase().includes(searchVal) || x.id.toLowerCase().includes(searchVal));
    }
    
    // Sort so that isPrimary === true buildings come first
    filtered = [...filtered].sort((a, b) => {
        const aPri = a.isPrimary ? 1 : 0;
        const bPri = b.isPrimary ? 1 : 0;
        if (aPri !== bPri) return bPri - aPri;
        return a.name.localeCompare(b.name, 'he');
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 20px;">לא נמצאו אתרים</div>`;
        return;
    }
    
    filtered.forEach(item => {
        const row = document.createElement("div");
        row.className = "building-item-row";
        const starClass = item.isPrimary ? "fa-solid fa-star" : "fa-regular fa-star";
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <button class="action-icon-btn star-toggle" onclick="event.stopPropagation(); toggleBuildingPrimary('${item.id}')" style="color: ${item.isPrimary ? '#ffb300' : 'var(--text-muted)'}; font-size: 14px; background: none; border: none; cursor: pointer; padding: 4px;">
                    <i class="${starClass}"></i>
                </button>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-weight: bold; font-size: 13px;">${item.name}</span>
                    <span style="color: var(--text-muted); font-size: 11px;">קואורדינטות: ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</span>
                </div>
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
    
    const destCitySelect = document.getElementById("sim-input-building-dest-city");
    if (destCitySelect && travelDatabaseCities.length) {
        let options = "";
        travelDatabaseCities.forEach(city => {
            options += `<option value="${city}">${city}</option>`;
        });
        destCitySelect.innerHTML = options;
    }
    
    if (isEdit) {
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
        document.getElementById("sim-edit-original-building-id").value = "";
        document.getElementById("sim-input-building-name").value = "";
        document.getElementById("sim-input-building-lat").value = "";
        document.getElementById("sim-input-building-lng").value = "";
        document.getElementById("sim-input-building-radius").value = "300";
        if (destCitySelect) destCitySelect.value = "חיפה";
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
    const destCityVal = document.getElementById("sim-input-building-dest-city").value;
    
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
            buildingsDatabase[idx].destinationCity = destCityVal;
        }
    } else {
        const newId = "site_" + Date.now();
        buildingsDatabase.push({
            id: newId,
            name: nameVal,
            latitude: latVal,
            longitude: lngVal,
            radius: radVal,
            destinationCity: destCityVal,
            isPrimary: false
        });
    }
    
    localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    document.getElementById("sim-building-modal").classList.remove("active");
    
    populateSiteSelectors();
    renderAppBuildingsList();
    updateGPSStatus();
}

function deleteSimBuilding(id) {
    if (confirm(`האם אתה בטוח שברצונך למחוק את אתר החברה הזה?`)) {
        // Cascade delete building
        buildingsDatabase = buildingsDatabase.filter(x => x.id !== id);
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        
        populateSiteSelectors();
        renderAppBuildingsList();
        updateGPSStatus();
    }
}

// Global functions for inline HTML button triggers
window.deleteSimBuilding = deleteSimBuilding;
window.openSimBuildingModal = openSimBuildingModal;
window.toggleBuildingPrimary = toggleBuildingPrimary;
