const TELEGRAM_BOT_TOKEN = "8128864671:AAFEoV6HD1AfaHRSpAAbpz3-DKd5LIVv5f8";
const TELEGRAM_BOT_USERNAME = "Max12Hours_bot";

// Predefined Default Databases
const DEFAULT_BUILDINGS = [];

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
let travelDatabaseCities = [];   // Destination cities (IEC site locations)
let travelDatabaseSources = [];  // Source settlements (where employees live)
let travelDatabaseTimes = {};

// Version stamp - bump this to force-reset buildingsDatabase to DEFAULT_BUILDINGS
const DB_VERSION = "v3";

function normalizeHebrewCityName(name) {
    if (!name) return "";
    return name
        .trim()
        .replace(/[\u0591-\u05C7]/g, "")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .replace(/יי/g, "י")
        .replace(/^זיכרון/, "זכרון")
        .replace(/^קרית/, "קריית")
        .replace(/^נהריה/, "נהרייה")
    ;
}

function findCanonicalCityName(rawCityName) {
    if (!rawCityName) return rawCityName;
    const cleanRaw = normalizeHebrewCityName(rawCityName);
    
    for (const city of travelDatabaseSources) {
        if (normalizeHebrewCityName(city) === cleanRaw) {
            return city;
        }
    }
    
    for (const city of travelDatabaseCities) {
        if (normalizeHebrewCityName(city) === cleanRaw) {
            return city;
        }
    }
    
    for (const c of CITIES_COORDINATES) {
        if (normalizeHebrewCityName(c.name) === cleanRaw) {
            return c.name;
        }
    }
    
    return rawCityName;
}

function getTravelTimeDetails(isArrival, destCity) {
    if (!destCity) {
        return { minutes: 0, showAsterisk: false };
    }
    
    // Check if custom override exists
    const isCustom = appPreferences.customTravelTimes && appPreferences.customTravelTimes[destCity];
    if (isCustom) {
        const val = isArrival ? isCustom.arrival : isCustom.return;
        if (val !== undefined) {
            return { minutes: val, showAsterisk: false };
        }
    }
    
    const originCity = appPreferences.defaultCity || currentCityName;
    if (!originCity) {
        return { minutes: 0, showAsterisk: false };
    }
    
    const times = getTravelTimeFromDB(originCity, destCity);
    const arrivalDb = times ? parseInt(times[0]) || 0 : 0;
    const returnDb = times ? parseInt(times[1]) || 0 : 0;
    const totalTimeDb = times ? parseInt(times[3]) || 0 : 0;
    
    const dbVal = isArrival ? arrivalDb : returnDb;
    
    // Rule 1: Dedicated arrival/return time > 0 -> use it
    if (dbVal > 0) {
        // Rule 3: If calculated travel time is < 30 minutes, display 0:00
        if (dbVal < 30) {
            return { minutes: 0, showAsterisk: false };
        }
        return { minutes: dbVal, showAsterisk: false };
    }

    // Rule 2: If main office city == arrival/return site -> 0:00, no asterisk, no note.
    if (appPreferences.mainOfficeCity && destCity === appPreferences.mainOfficeCity) {
        return { minutes: 0, showAsterisk: false };
    }
    
    // Rule 4: If database arrival/return time is 0:00 but general travel time exists
    if (dbVal === 0 && totalTimeDb > 0) {
        // Rule 3: If calculated travel time is < 30 minutes, display 0:00
        if (totalTimeDb < 30) {
            return { minutes: 0, showAsterisk: false };
        }
        return { minutes: totalTimeDb, showAsterisk: true };
    }
    
    return { minutes: 0, showAsterisk: false };
}

function setTravelValueWithNote(inputId, noteId, val, destCity) {
    const inputEl = document.getElementById(inputId);
    const noteEl = document.getElementById(noteId);
    if (!inputEl) return;
    
    let displayVal = val.toString().replace("*", "").trim();
    const isArrival = inputId.toLowerCase().includes("arrival");
    const details = getTravelTimeDetails(isArrival, destCity);
    const isCustom = appPreferences.customTravelTimes && appPreferences.customTravelTimes[destCity];
    
    let asteriskId = inputId + "-asterisk";
    if (inputId === "settings-travel-arrival") asteriskId = "settings-arrival-travel-asterisk";
    if (inputId === "settings-travel-return") asteriskId = "settings-return-travel-asterisk";
    const asteriskEl = document.getElementById(asteriskId);
    
    if (!isCustom && details.showAsterisk) {
        if (!displayVal.includes("*")) displayVal += "*";
        if (noteEl) noteEl.style.display = "block";
        if (asteriskEl) asteriskEl.style.display = "inline";
    } else {
        if (noteEl) noteEl.style.display = "none";
        if (asteriskEl) asteriskEl.style.display = "none";
    }
    inputEl.value = displayVal;
}

let pickerHour = 17;
let pickerMinute = 55;

function openSmartTimePicker() {
    const input = document.getElementById("setup-arrival-time");
    if (!input) return;
    
    let currentVal = input.value.trim();
    let parts = currentVal.split(":");
    if (parts.length === 2) {
        pickerHour = parseInt(parts[0]) || 0;
        pickerMinute = parseInt(parts[1]) || 0;
    } else {
        const now = new Date();
        pickerHour = now.getHours();
        pickerMinute = now.getMinutes();
    }
    
    updateSmartPickerUI();
    const modal = document.getElementById("smart-time-picker-modal");
    if (modal) modal.classList.add("active");
}

function updateSmartPickerUI() {
    pickerHour = (pickerHour + 24) % 24;
    pickerMinute = (pickerMinute + 60) % 60;
    
    const hh = String(pickerHour).padStart(2, '0');
    const mm = String(pickerMinute).padStart(2, '0');
    
    const hourValEl = document.getElementById("smart-picker-hour-val");
    if (hourValEl) hourValEl.innerText = hh;
    
    const minValEl = document.getElementById("smart-picker-min-val");
    if (minValEl) minValEl.innerText = mm;
    
    const displayEl = document.getElementById("smart-picker-display");
    if (displayEl) displayEl.innerText = `${hh}:${mm}`;
}

function initDatabases() {
    const savedBuildings = localStorage.getItem("iec_db_buildings");
    const savedVersion  = localStorage.getItem("iec_db_version");
    
    // Force reset to defaults if version mismatch (ensures מחוז דן + מטה are present)
    if (!savedBuildings || savedVersion !== DB_VERSION) {
        buildingsDatabase = JSON.parse(JSON.stringify(DEFAULT_BUILDINGS));
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
        localStorage.setItem("iec_db_version", DB_VERSION);
        return;
    }
    
    buildingsDatabase = JSON.parse(savedBuildings);
    
    // Migration: ensure isPrimary and destinationCity exist
    let updated = false;
    buildingsDatabase.forEach(b => {
        if (b.isPrimary === undefined) {
            b.isPrimary = ["haifa_headquarters","orot_rabin","rotenberg","eshkol","gezer","dan_district"].includes(b.id);
            updated = true;
        }
        if (!b.destinationCity) {
            const map = { haifa_headquarters: "חיפה", orot_rabin: "חדרה", rotenberg: "אשקלון", eshkol: "אשדוד", gezer: "רמלה", dan_district: "תל אביב - יפו" };
            b.destinationCity = map[b.id] || "חיפה";
            updated = true;
        }
    });
    if (updated) {
        localStorage.setItem("iec_db_buildings", JSON.stringify(buildingsDatabase));
    }
}

// App-wide Preferences (Persistent settings, not wiped on shift reset)
let appPreferences = {
    defaultCity: "",
    defaultSnooze: true,
    defaultSnoozeInterval: 30,   // Fix 3: default 30 min
    gpsUsageApproved: true,
    clockUsageApproved: true,
    customTravelTimes: {},
    telegramChatId: null
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
    
    // Load travel database (new format with separate sources/cities)
    fetch("travel_db.json")
        .then(res => res.json())
        .then(data => {
            travelDatabaseTimes = data.times || {};
            const timeKeys = Object.keys(travelDatabaseTimes);
            travelDatabaseSources = timeKeys.length > 0 ? timeKeys.sort((a,b) => a.localeCompare(b, 'he')) : (data.sources || data.cities || []);
            const destSet = new Set();
            Object.values(travelDatabaseTimes).forEach(dObj => Object.keys(dObj).forEach(d => destSet.add(d)));
            travelDatabaseCities = destSet.size > 0 ? Array.from(destSet).sort((a,b) => a.localeCompare(b, 'he')) : (data.cities && data.cities.length > 0 ? data.cities : data.sources || []);
            renderCityAutocomplete(); // pre-render empty or full list
            renderOfficeAutocomplete();
            renderEditTravelAutocomplete();
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
    }
});

// Populate custom autocomplete dropdown for city setting
function renderCityAutocomplete(searchTerm = "") {
    const dropdown = document.getElementById("settings-city-dropdown");
    if (!dropdown || !travelDatabaseSources) return;
    
    dropdown.innerHTML = "";
    
    // Filter
    const filtered = travelDatabaseSources.filter(c => c.includes(searchTerm));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">לא נמצאו יישובים</div>`;
        return;
    }
    
    // Render limit for perf
    const limit = 50; 
    filtered.slice(0, limit).forEach(city => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = city;
        item.addEventListener("click", () => {
            document.getElementById("settings-default-city").value = city;
            dropdown.classList.remove("active");
        });
        dropdown.appendChild(item);
    });
}

// Populate custom autocomplete dropdown for office setting
function renderOfficeAutocomplete(searchTerm = "") {
    const dropdown = document.getElementById("settings-office-dropdown");
    if (!dropdown || !travelDatabaseCities) return;
    
    dropdown.innerHTML = "";
    
    // Filter
    const filtered = travelDatabaseCities.filter(c => c.includes(searchTerm));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">לא נמצאו יישובים</div>`;
        return;
    }
    
    const limit = 50; 
    filtered.slice(0, limit).forEach(city => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = city;
        item.addEventListener("click", () => {
            document.getElementById("settings-main-office-city").value = city;
            dropdown.classList.remove("active");
        });
        dropdown.appendChild(item);
    });
}

function renderEditTravelAutocomplete(searchTerm = "") {
    const dropdown = document.getElementById("settings-edit-travel-dropdown");
    if (!dropdown || !travelDatabaseCities) return;
    
    dropdown.innerHTML = "";
    const filtered = travelDatabaseCities.filter(c => c.includes(searchTerm));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">לא נמצאו יישובים</div>`;
        return;
    }
    
    filtered.slice(0, 50).forEach(city => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = city;
        item.addEventListener("click", () => {
            document.getElementById("settings-edit-travel-dest").value = city;
            dropdown.classList.remove("active");
            updateTravelFields(city);
        });
        dropdown.appendChild(item);
    });
}

function renderSetupAutocomplete(searchTerm, type) {
    const dropdown = document.getElementById(type === "arrival" ? "setup-arrival-dropdown" : "setup-return-dropdown");
    if (!dropdown || !travelDatabaseCities) return;
    
    dropdown.innerHTML = "";
    const filtered = travelDatabaseCities.filter(c => c.includes(searchTerm));
    
    if (filtered.length === 0) {
        dropdown.innerHTML = `<div style="padding:10px; color:var(--text-muted); text-align:center;">לא נמצאו יישובים</div>`;
        return;
    }
    
    filtered.slice(0, 50).forEach(city => {
        const item = document.createElement("div");
        item.className = "autocomplete-item";
        item.textContent = city;
        item.addEventListener("click", () => {
            document.getElementById(`setup-${type}-site`).value = city;
            dropdown.classList.remove("active");
            
            const b = { destinationCity: city };
            const time = type === "arrival" ? lookupArrivalTravelTime(b) : lookupReturnTravelTime(b);
            setTravelValueWithNote(`setup-${type}-travel`, `setup-${type}-travel-note`, formatMinutes(time), city);
            
            if (type === "arrival") {
                const returnInput = document.getElementById("setup-return-site");
                returnInput.value = city;
                setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(lookupReturnTravelTime(b)), city);
            }
        });
        dropdown.appendChild(item);
    });
}

function formatMinutes(mins) {
    if (isNaN(mins) || mins === null) return "00:00";
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

function lookupArrivalTravelTime(building) {
    if (!building || !building.destinationCity) return 0;
    return getTravelTimeDetails(true, building.destinationCity).minutes;
}

function lookupReturnTravelTime(building) {
    if (!building || !building.destinationCity) return 0;
    return getTravelTimeDetails(false, building.destinationCity).minutes;
}

function updateTravelFields(destCity) {
    const originCity = document.getElementById("settings-default-city").value.trim() || appPreferences.defaultCity;
    // If the origin city (GPS or user selected) is not present in the travel database, default to 0 minutes
    if (!travelDatabaseSources.includes(originCity)) {
        // No travel data available – keep zeros and hide extra fields
        document.getElementById("settings-travel-distance").value = "--";
        document.getElementById("settings-travel-total").value = "--";
        document.getElementById("settings-travel-arrival").value = "00:00";
        document.getElementById("settings-travel-return").value = "00:00";
        return;
    }
    const fieldsContainer = document.getElementById("settings-edit-travel-fields");
    
    if (!originCity || !destCity || !travelDatabaseCities.includes(destCity)) {
        fieldsContainer.style.display = "none";
        return;
    }
    
    fieldsContainer.style.display = "block";
    
    let distance = "--";
    let totalTime = "--";
    
    const arrivalDetails = getTravelTimeDetails(true, destCity);
    const returnDetails = getTravelTimeDetails(false, destCity);
    
    const arrival = formatMinutes(arrivalDetails.minutes);
    const returnTime = formatMinutes(returnDetails.minutes);
    
    const times = getTravelTimeFromDB(originCity, destCity);
    if (times && times.length >= 4) {
        distance = times[2] !== "" ? times[2] : "--";
        totalTime = times[3] !== undefined ? formatMinutes(times[3]) : "--";
    }
    
    document.getElementById("settings-travel-distance").value = distance;
    document.getElementById("settings-travel-total").value = totalTime;
    setTravelValueWithNote("settings-travel-arrival", "settings-arrival-travel-note", arrival, destCity);
    setTravelValueWithNote("settings-travel-return", "settings-return-travel-note", returnTime, destCity);
}


function populateSiteSelectors() {
    // Deprecated, no longer using predefined selects
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
    
    // Setup Screen Autocomplete Logic
    const arrivalInput = document.getElementById("setup-arrival-site");
    const arrivalDropdown = document.getElementById("setup-arrival-dropdown");
    if (arrivalInput && arrivalDropdown) {
        arrivalInput.addEventListener("input", (e) => {
            arrivalDropdown.classList.add("active");
            const val = e.target.value.trim();
            renderSetupAutocomplete(val, "arrival");
            
            // Sync return text too
            const returnInput = document.getElementById("setup-return-site");
            if (returnInput) {
                returnInput.value = val;
            }
            
            // Auto update instantly if it matches a city perfectly
            if (travelDatabaseCities && travelDatabaseCities.includes(val)) {
                const b = { destinationCity: val };
                setTravelValueWithNote("setup-arrival-travel", "setup-arrival-travel-note", formatMinutes(lookupArrivalTravelTime(b)), val);
                if (returnInput && returnInput.value === val) {
                    setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(lookupReturnTravelTime(b)), val);
                }
            }
        });
        arrivalInput.addEventListener("blur", (e) => {
            setTimeout(() => {
                const city = e.target.value.trim();
                if (city) {
                    const b = { destinationCity: city };
                    setTravelValueWithNote("setup-arrival-travel", "setup-arrival-travel-note", formatMinutes(lookupArrivalTravelTime(b)), city);
                    const returnInput = document.getElementById("setup-return-site");
                    if (returnInput && returnInput.value === city) {
                        setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(lookupReturnTravelTime(b)), city);
                    }
                }
            }, 200);
        });
        arrivalInput.addEventListener("focus", (e) => {
            arrivalDropdown.classList.add("active");
            renderSetupAutocomplete(e.target.value.trim(), "arrival");
        });
        document.addEventListener("click", (e) => {
            if (!arrivalInput.contains(e.target) && !arrivalDropdown.contains(e.target)) {
                arrivalDropdown.classList.remove("active");
            }
        });
    }

    const returnInput = document.getElementById("setup-return-site");
    const returnDropdown = document.getElementById("setup-return-dropdown");
    if (returnInput && returnDropdown) {
        returnInput.addEventListener("input", (e) => {
            returnDropdown.classList.add("active");
            const val = e.target.value.trim();
            renderSetupAutocomplete(val, "return");
            
            // Auto update instantly if it matches a city perfectly
            if (travelDatabaseCities && travelDatabaseCities.includes(val)) {
                const b = { destinationCity: val };
                setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(lookupReturnTravelTime(b)), val);
            }
        });
        returnInput.addEventListener("blur", (e) => {
            setTimeout(() => {
                const city = e.target.value.trim();
                if (city) {
                    const b = { destinationCity: city };
                    setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(lookupReturnTravelTime(b)), city);
                }
            }, 200);
        });
        returnInput.addEventListener("focus", (e) => {
            returnDropdown.classList.add("active");
            renderSetupAutocomplete(e.target.value.trim(), "return");
        });
        document.addEventListener("click", (e) => {
            if (!returnInput.contains(e.target) && !returnDropdown.contains(e.target)) {
                returnDropdown.classList.remove("active");
            }
        });
    }
    
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
        appPreferences.gpsUsageApproved = true;
        appPreferences.clockUsageApproved = true;
        saveAppPreferences();
        
        // Mark onboarding as completed (don't ask again)
        localStorage.setItem("iec_pref_onboarding_done", "true");
        
        document.getElementById("onboarding-screen").classList.remove("active");
        
        // Start GPS now that user approved
        startRealGPS();
    });
    
    // Settings Button Open (1.1: populate city text input)
    document.getElementById("btn-settings-toggle").addEventListener("click", () => {
        if (shiftState !== "idle") {
            alert("לא ניתן לשנות הגדרות כלליות במהלך משמרת פעילה!");
            return;
        }
        // Populate city input with saved preference
        const cityInput = document.getElementById("settings-default-city");
        if (cityInput) {
            cityInput.value = appPreferences.defaultCity || "";
        }
        
        const officeInput = document.getElementById("settings-main-office-city");
        if (officeInput) {
            officeInput.value = appPreferences.mainOfficeCity || "";
        }
        
        document.getElementById("settings-default-snooze").checked = appPreferences.defaultSnooze;
        document.getElementById("settings-default-snooze-interval").value = appPreferences.defaultSnoozeInterval || 30;
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
    
    // Settings Save (1.1: read city from text input)
    document.getElementById("btn-settings-save").addEventListener("click", () => {
        const cityVal = document.getElementById("settings-default-city").value.trim();
        if (cityVal) appPreferences.defaultCity = cityVal;
        
        const officeVal = document.getElementById("settings-main-office-city").value.trim();
        appPreferences.mainOfficeCity = officeVal;
        
        appPreferences.defaultSnooze = document.getElementById("settings-default-snooze").checked;
        appPreferences.defaultSnoozeInterval = parseInt(document.getElementById("settings-default-snooze-interval").value) || 30;
        
        // Save approvals
        const prevGpsApproved = appPreferences.gpsUsageApproved;
        appPreferences.gpsUsageApproved = document.getElementById("settings-gps-approved").checked;
        appPreferences.clockUsageApproved = document.getElementById("settings-clock-approved").checked;
        
        // Save Custom Travel Times
        const destCity = document.getElementById("settings-edit-travel-dest").value.trim();
        if (destCity && document.getElementById("settings-edit-travel-fields").style.display === "block") {
            const arrStr = document.getElementById("settings-travel-arrival").value;
            const retStr = document.getElementById("settings-travel-return").value;
            if (!appPreferences.customTravelTimes) appPreferences.customTravelTimes = {};
            
            const pTime = (ts) => {
                if (!ts) return undefined;
                const p = ts.split(":");
                return parseInt(p[0]||0, 10)*60 + parseInt(p[1]||0, 10);
            };
            
            appPreferences.customTravelTimes[destCity] = {
                arrival: pTime(arrStr),
                return: pTime(retStr)
            };
        }
        
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
            }
        
        document.getElementById("settings-sheet").classList.remove("active");
    });

    // Custom city autocomplete logic
    const cityInput = document.getElementById("settings-default-city");
    const cityDropdown = document.getElementById("settings-city-dropdown");
    if (cityInput && cityDropdown) {
        cityInput.addEventListener("input", (e) => {
            cityDropdown.classList.add("active");
            renderCityAutocomplete(e.target.value.trim());
        });
        cityInput.addEventListener("focus", (e) => {
            cityDropdown.classList.add("active");
            renderCityAutocomplete(e.target.value.trim());
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!cityInput.contains(e.target) && !cityDropdown.contains(e.target)) {
                cityDropdown.classList.remove("active");
            }
        });
    }

    // Custom office autocomplete logic
    const officeInput = document.getElementById("settings-main-office-city");
    const officeDropdown = document.getElementById("settings-office-dropdown");
    if (officeInput && officeDropdown) {
        officeInput.addEventListener("input", (e) => {
            officeDropdown.classList.add("active");
            renderOfficeAutocomplete(e.target.value.trim());
        });
        officeInput.addEventListener("focus", (e) => {
            officeDropdown.classList.add("active");
            renderOfficeAutocomplete(e.target.value.trim());
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!officeInput.contains(e.target) && !officeDropdown.contains(e.target)) {
                officeDropdown.classList.remove("active");
            }
        });
    }

    // Custom Edit Travel Times logic
    const editTravelInput = document.getElementById("settings-edit-travel-dest");
    const editTravelDropdown = document.getElementById("settings-edit-travel-dropdown");
    if (editTravelInput && editTravelDropdown) {
        editTravelInput.addEventListener("input", (e) => {
            editTravelDropdown.classList.add("active");
            renderEditTravelAutocomplete(e.target.value.trim());
            updateTravelFields(e.target.value.trim());
        });
        editTravelInput.addEventListener("focus", (e) => {
            editTravelDropdown.classList.add("active");
            renderEditTravelAutocomplete(e.target.value.trim());
        });
        
        document.addEventListener("click", (e) => {
            if (!editTravelInput.contains(e.target) && !editTravelDropdown.contains(e.target)) {
                editTravelDropdown.classList.remove("active");
            }
        });
    }

    // Close push notification banner on click
    document.getElementById("ios-push-banner").addEventListener("click", () => {
        document.getElementById("ios-push-banner").classList.remove("active");
    });
    
    // Strip asterisk and hide red note on manual edit of travel times
    const setupArrivalTravelInput = document.getElementById("setup-arrival-travel");
    if (setupArrivalTravelInput) {
        setupArrivalTravelInput.addEventListener("input", (e) => {
            if (e.target.value.includes("*")) {
                e.target.value = e.target.value.replace("*", "");
            }
            const note = document.getElementById("setup-arrival-travel-note");
            if (note) note.style.display = "none";
            const ast = document.getElementById("setup-arrival-travel-asterisk");
            if (ast) ast.style.display = "none";
        });
    }

    const setupReturnTravelInput = document.getElementById("setup-return-travel");
    if (setupReturnTravelInput) {
        setupReturnTravelInput.addEventListener("input", (e) => {
            if (e.target.value.includes("*")) {
                e.target.value = e.target.value.replace("*", "");
            }
            const note = document.getElementById("setup-return-travel-note");
            if (note) note.style.display = "none";
            const ast = document.getElementById("setup-return-travel-asterisk");
            if (ast) ast.style.display = "none";
        });
    }

    const settingsTravelArrivalInput = document.getElementById("settings-travel-arrival");
    if (settingsTravelArrivalInput) {
        settingsTravelArrivalInput.addEventListener("input", (e) => {
            if (e.target.value.includes("*")) {
                e.target.value = e.target.value.replace("*", "");
            }
            const note = document.getElementById("settings-arrival-travel-note");
            if (note) note.style.display = "none";
            const ast = document.getElementById("settings-arrival-travel-asterisk");
            if (ast) ast.style.display = "none";
        });
    }

    const settingsTravelReturnInput = document.getElementById("settings-travel-return");
    if (settingsTravelReturnInput) {
        settingsTravelReturnInput.addEventListener("input", (e) => {
            if (e.target.value.includes("*")) {
                e.target.value = e.target.value.replace("*", "");
            }
            const note = document.getElementById("settings-return-travel-note");
            if (note) note.style.display = "none";
            const ast = document.getElementById("settings-return-travel-asterisk");
            if (ast) ast.style.display = "none";
        });
    }
    
    // GPS Badge Manual Refresh Click
    const gpsStatusBadge = document.getElementById("gps-status-badge");
    if (gpsStatusBadge) {
        gpsStatusBadge.addEventListener("click", () => {
            startRealGPS();
        });
    }

    // Smart Time Picker bindings
    const timeInput = document.getElementById("setup-arrival-time");
    if (timeInput) {
        timeInput.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSmartTimePicker();
        });
        timeInput.addEventListener("focus", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSmartTimePicker();
            timeInput.blur();
        });
    }

    const closeSmartPicker = () => {
        const modal = document.getElementById("smart-time-picker-modal");
        if (modal) modal.classList.remove("active");
    };

    const btnClosePicker = document.getElementById("btn-close-smart-picker");
    if (btnClosePicker) btnClosePicker.addEventListener("click", closeSmartPicker);

    const btnCancelPicker = document.getElementById("btn-cancel-smart-picker");
    if (btnCancelPicker) btnCancelPicker.addEventListener("click", closeSmartPicker);

    const btnSavePicker = document.getElementById("btn-save-smart-picker");
    if (btnSavePicker) {
        btnSavePicker.addEventListener("click", () => {
            const hh = String(pickerHour).padStart(2, '0');
            const mm = String(pickerMinute).padStart(2, '0');
            const input = document.getElementById("setup-arrival-time");
            if (input) input.value = `${hh}:${mm}`;
            closeSmartPicker();
        });
    }

    const btnHourDec = document.getElementById("btn-hour-dec");
    if (btnHourDec) btnHourDec.addEventListener("click", () => {
        pickerHour--;
        updateSmartPickerUI();
    });

    const btnHourInc = document.getElementById("btn-hour-inc");
    if (btnHourInc) btnHourInc.addEventListener("click", () => {
        pickerHour++;
        updateSmartPickerUI();
    });

    const btnMinDec = document.getElementById("btn-min-dec");
    if (btnMinDec) btnMinDec.addEventListener("click", () => {
        pickerMinute = (pickerMinute - 5 + 60) % 60;
        updateSmartPickerUI();
    });

    const btnMinInc = document.getElementById("btn-min-inc");
    if (btnMinInc) btnMinInc.addEventListener("click", () => {
        pickerMinute = (pickerMinute + 5) % 60;
        updateSmartPickerUI();
    });

    const btnPresetNow = document.getElementById("btn-preset-now");
    if (btnPresetNow) {
        btnPresetNow.addEventListener("click", () => {
            const now = new Date();
            pickerHour = now.getHours();
            pickerMinute = now.getMinutes();
            updateSmartPickerUI();
        });
    }

    const btnPresetMinus10 = document.getElementById("btn-preset-minus10");
    if (btnPresetMinus10) {
        btnPresetMinus10.addEventListener("click", () => {
            pickerMinute = (pickerMinute - 10 + 60) % 60;
            updateSmartPickerUI();
        });
    }

    const btnPresetMinus30 = document.getElementById("btn-preset-minus30");
    if (btnPresetMinus30) {
        btnPresetMinus30.addEventListener("click", () => {
            pickerMinute = (pickerMinute - 30 + 60) % 60;
            updateSmartPickerUI();
        });
    }

    const pickerModal = document.getElementById("smart-time-picker-modal");
    if (pickerModal) {
        pickerModal.addEventListener("click", (e) => {
            const card = document.querySelector("#smart-time-picker-modal .sim-modal-card");
            if (card && !card.contains(e.target)) {
                closeSmartPicker();
            }
        });
    }
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
    return findCanonicalCityName(nearestCity);
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
                    currentCityName = findCanonicalCityName(city);
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

    // Populate read-only profile city fields
    const homeCityInput = document.getElementById("setup-user-home-city");
    if (homeCityInput) {
        homeCityInput.value = appPreferences.defaultCity || "לא הוגדרה";
    }
    const officeCityInput = document.getElementById("setup-user-office-city");
    if (officeCityInput) {
        officeCityInput.value = appPreferences.mainOfficeCity || "לא הוגדרה";
    }
    
    const arrivalInput = document.getElementById("setup-arrival-site");
    const returnInput = document.getElementById("setup-return-site");
    
    // Update label to show GPS city
    const cityLabel = currentCityName || appPreferences.defaultCity || "";
    const arrivalLabelSpan = document.getElementById("setup-arrival-site-label");
    if (arrivalLabelSpan) {
        arrivalLabelSpan.textContent = cityLabel
            ? `אתר הגעה (GPS: ${cityLabel})`
            : "אתר הגעה";
    }
    
    // If no building detected, fallback to GPS city, then default city, then main office, then Haifa
    const fallbackDest = currentCityName || appPreferences.defaultCity || appPreferences.mainOfficeCity || "חיפה";

    if (detectedBuilding) {
        arrivalInput.value = detectedBuilding.destinationCity;
        returnInput.value = detectedBuilding.destinationCity;
        
        const destCity = detectedBuilding.destinationCity;
        const arrMin = lookupArrivalTravelTime(detectedBuilding);
        const retMin = lookupReturnTravelTime(detectedBuilding);
        
        setTravelValueWithNote("setup-arrival-travel", "setup-arrival-travel-note", formatMinutes(arrMin), destCity);
        setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(retMin), destCity);
    } else {
        arrivalInput.value = fallbackDest;
        returnInput.value = fallbackDest;
        
        const b = { destinationCity: fallbackDest };
        const arrMin = lookupArrivalTravelTime(b);
        const retMin = lookupReturnTravelTime(b);
        
        setTravelValueWithNote("setup-arrival-travel", "setup-arrival-travel-note", formatMinutes(arrMin), fallbackDest);
        setTravelValueWithNote("setup-return-travel", "setup-return-travel-note", formatMinutes(retMin), fallbackDest);
    }
    
    document.getElementById("setup-sheet").classList.add("active");
}

function closeSetupSheet() {
    document.getElementById("setup-sheet").classList.remove("active");
}

function confirmStartShift() {
    const timeVal = document.getElementById("setup-arrival-time").value.trim();
    if (!timeVal) {
        alert("נא להזין שעת הגעה תקינה.");
        return;
    }
    
    // Validate time format HH:MM for 24-hour clock
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(timeVal)) {
        alert("נא להזין שעת הגעה בפורמט 24 שעות תקין (HH:MM), למשל 17:55");
        return;
    }
    
    // Construct Date from arrival time input
    const parts = timeVal.split(":");
    const arrivalDateObj = new Date();
    arrivalDateObj.setHours(parseInt(parts[0]));
    arrivalDateObj.setMinutes(parseInt(parts[1]));
    arrivalDateObj.setSeconds(0);
    arrivalDateObj.setMilliseconds(0);
    
    const arrivalName = document.getElementById("setup-arrival-site").value.trim() || "אתר הגעה";
    const returnName = document.getElementById("setup-return-site").value.trim() || "אתר חזרה";
    const arrivalSiteId = "other";
    const returnSiteId = "other";
    
    const parseHHMM = (val) => {
        if (!val) return 0;
        const cleanVal = val.toString().replace("*", "").trim();
        const p = cleanVal.split(":");
        if (p.length === 1) return parseInt(p[0]) || 0;
        return parseInt(p[0]||0, 10)*60 + parseInt(p[1]||0, 10);
    };
    
    const travelToVal   = parseHHMM(document.getElementById("setup-arrival-travel").value);
    const travelBackVal = parseHHMM(document.getElementById("setup-return-travel").value);
    
    const snoozeVal         = appPreferences.defaultSnooze;
    const snoozeIntervalVal = appPreferences.defaultSnoozeInterval || 30;
    
    // Calculate leave home date = arrival date - travel to minutes
    const leaveHomeDateObj = new Date(arrivalDateObj.getTime() - (travelToVal * 60 * 1000));
    
    // Calculate warning date = leave home date + 11 hours 50 minutes - travel back minutes
    const warningDurationOffset = ((11 * 60) + 50 - travelBackVal) * 60 * 1000;
    const warningDateObj = new Date(leaveHomeDateObj.getTime() + warningDurationOffset);
    
    // Calculate max end date = leave home date + 12 hours - travel back minutes
    const maxDurationOffset = ((12 * 60) - travelBackVal) * 60 * 1000;
    const maxEndDateObj = new Date(leaveHomeDateObj.getTime() + maxDurationOffset);
    
    shiftData = {
        arrivalDate: arrivalDateObj.toISOString(),
        leaveHomeDate: leaveHomeDateObj.toISOString(),
        warningDate: warningDateObj.toISOString(),
        maxEndDate: maxEndDateObj.toISOString(),
        arrivalBuildingId: arrivalSiteId,
        arrivalBuildingName: arrivalName,
        travelToSiteMinutes: travelToVal,
        returnBuildingId: returnSiteId,
        returnBuildingName: returnName,
        travelBackMinutes: travelBackVal,
        snoozeEnabled: snoozeVal,
        snoozeIntervalMinutes: snoozeIntervalVal
    };
    
    shiftState = "active";
    lastSnoozeAlertTime = null;
    
    saveShiftStateToDisk();
    
    // Schedule background notification via Service Worker
    scheduleBackgroundNotification(
        warningDateObj,
        "עליך לסיים את היום!",
        "הגעת ל-11:50 שעות נוכחות כולל נסיעות. נא סמן סיום."
    );
    
    closeSetupSheet();
    renderViewState();
}

function getBuildingName(id) {
    if (id === "other") return "אחר (אתר מרוחק)";
    const b = buildingsDatabase.find(x => x.id === id);
    return b ? b.name : "עבודה מהבית / שטח";
}

function getTravelTimeFromDB(sourceCity, destCity) {
    if (!sourceCity || !destCity || !travelDatabaseTimes) return null;
    return travelDatabaseTimes[sourceCity]?.[destCity] || null;
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

// Fix 6: Schedule a notification to fire at targetDate even when app is in background
// The Service Worker receives the schedule via postMessage and uses setTimeout to fire it.
function scheduleBackgroundNotification(targetDate, title, body) {
    if (!appPreferences.clockUsageApproved) return;
    if (!('serviceWorker' in navigator)) return;
    
    const delayMs = targetDate.getTime() - Date.now();
    if (delayMs <= 0) return; // Already past the time
    
    navigator.serviceWorker.ready.then(registration => {
        // Send message to SW to schedule the notification
        registration.active.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            title: title,
            body: body,
            delayMs: delayMs
        });
        console.log(`Scheduled background notification in ${Math.round(delayMs/60000)} minutes`);
    }).catch(err => {
        console.error("Could not schedule background notification:", err);
    });
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
    if (appPreferences.telegramChatId) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: appPreferences.telegramChatId, text: `\\n\\n` })
        }).catch(console.error);
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
    
    // Cancel any scheduled background notification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (registration.active) {
                registration.active.postMessage({ type: 'CANCEL_NOTIFICATION' });
            }
        }).catch(() => {});
    }
    
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
        // Fix 5: Check if onboarding was already completed (even if city not set)
        const onboardingDone = localStorage.getItem("iec_pref_onboarding_done");
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

// Fix 6: Schedule a notification to fire at targetDate even when app is in background
// The Service Worker receives the schedule via postMessage and uses setTimeout to fire it.
function scheduleBackgroundNotification(targetDate, title, body) {
    if (!appPreferences.clockUsageApproved) return;
    if (!('serviceWorker' in navigator)) return;
    
    const delayMs = targetDate.getTime() - Date.now();
    if (delayMs <= 0) return; // Already past the time
    
    navigator.serviceWorker.ready.then(registration => {
        // Send message to SW to schedule the notification
        registration.active.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            title: title,
            body: body,
            delayMs: delayMs
        });
        console.log(`Scheduled background notification in ${Math.round(delayMs/60000)} minutes`);
    }).catch(err => {
        console.error("Could not schedule background notification:", err);
    });
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
    if (appPreferences.telegramChatId) {
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: appPreferences.telegramChatId, text: `\n\n` })
        }).catch(console.error);
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
    
    // Cancel any scheduled background notification
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            if (registration.active) {
                registration.active.postMessage({ type: 'CANCEL_NOTIFICATION' });
            }
        }).catch(() => {});
    }
    
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
        // Fix 5: Check if onboarding was already completed (even if city not set)
        const onboardingDone = localStorage.getItem("iec_pref_onboarding_done");
        if (onboardingDone === "true") {
            // Already did onboarding, just hide the screen
            document.getElementById("onboarding-screen").classList.remove("active");
        } else {
            // First launch - show onboarding
            document.getElementById("onboarding-screen").classList.add("active");
        }
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


// ==========================================================================
// TELEGRAM INTEGRATION
// ==========================================================================

async function connectTelegram() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const deepLink = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${code}`;
    
    // Open telegram deep link
    window.open(deepLink, "_blank");
    
    // Show loading spinner
    const loader = document.getElementById("telegram-polling-loader");
    if (loader) loader.style.display = "flex";
    
    // Poll getUpdates
    let connected = false;
    let attempts = 0;
    while (!connected && attempts < 60) {
        try {
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?allowed_updates=["message"]`);
            const data = await res.json();
            if (data.ok) {
                for (let update of data.result) {
                    if (update.message && update.message.text === `/start ${code}`) {
                        const chatId = update.message.chat.id;
                        appPreferences.telegramChatId = chatId;
                        saveAppPreferences();
                        updateTelegramUI();
                        connected = true;
                        
                        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${update.update_id + 1}`);
                        
                        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ chat_id: chatId, text: "האפליקציה חוברה בהצלחה! התראות יישלחו לכאן." })
                        });
                        break;
                    }
                }
            }
        } catch (e) {
            console.error("Telegram polling error", e);
        }
        if (!connected) {
            attempts++;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    
    if (loader) loader.style.display = "none";
    if (!connected) {
        alert("תם הזמן להמתנה לחיבור טלגרם. נסה שוב.");
    }
}

function updateTelegramUI() {
    const statusText = document.getElementById("telegram-status-text");
    const btn = document.getElementById("btn-connect-telegram");
    if (appPreferences.telegramChatId) {
        if(statusText) {
            statusText.innerText = "׳¡׳˜׳˜׳•׳¡: ׳׳—׳•׳‘׳¨ ׳₪׳¢׳™׳";
            statusText.style.color = "var(--success-color)";
        }
        if(btn) btn.innerHTML = '<i class="fa-brands fa-telegram"></i> ׳©׳ ׳” ׳—׳™׳‘׳•׳¨';
    } else {
        if(statusText) {
            statusText.innerText = "׳¡׳˜׳˜׳•׳¡: ׳׳ ׳׳—׳•׳‘׳¨";
            statusText.style.color = "var(--text-muted)";
        }
        if(btn) btn.innerHTML = '<i class="fa-brands fa-telegram"></i> ׳—׳‘׳¨ ׳˜׳׳’׳¨׳';
    }
}

