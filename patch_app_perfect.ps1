$appJsPath = "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\web-app\app.js"
$content = [System.IO.File]::ReadAllText($appJsPath, [System.Text.Encoding]::UTF8)

# Target 1
$target1 = @'
    const originCity = appPreferences.defaultCity || currentCityName;
    if (!originCity) {
        return { minutes: 0, note: "" };
    }
'@

# Replace 1
$replace1 = @'
    let originCity = "";
    const settingsCityInput = document.getElementById("settings-default-city");
    if (settingsCityInput && settingsCityInput.value.trim()) {
        originCity = settingsCityInput.value.trim();
    } else {
        originCity = appPreferences.defaultCity || currentCityName;
    }
    if (!originCity) {
        return { minutes: 0, note: "" };
    }
'@

# Target 2
$target2 = @'
let appPreferences = {
    defaultCity: "",
    defaultSnooze: true,
    defaultSnoozeInterval: 30,   // Fix 3: default 30 min
    gpsUsageApproved: true,
    clockUsageApproved: true,
    customTravelTimes: {},
    telegramChatId: null
};
'@

# Replace 2: Using ASCII-safe unicode escapes for Hebrew default values
$replace2 = @'
let appPreferences = {
    defaultCity: "\u05e8\u05e2\u05e0\u05e0\u05d4",
    mainOfficeCity: "\u05d2\u05df \u05e9\u05d5\u05e8\u05e7",
    defaultSnooze: true,
    defaultSnoozeInterval: 10,
    gpsUsageApproved: true,
    clockUsageApproved: true,
    customTravelTimes: {},
    telegramChatId: null
};
'@

# Target 3
$target3 = @'
function formatMinutes(mins) {
    if (isNaN(mins) || mins === null) return "00:00";
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}
'@

# Replace 3
$replace3 = @'
function formatMinutes(mins) {
    if (isNaN(mins) || mins === null) return "00:00";
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

function parseTimeStr(ts) {
    if (!ts) return 0;
    const clean = ts.replace("*", "").trim();
    if (!clean || !clean.includes(":")) return 0;
    const p = clean.split(":");
    return (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0);
}
'@

# Target 4
$target4 = @'
            appPreferences.customTravelTimes[destCity] = {
                arrival: parseTimeStr(arrStr),
                return: parseTimeStr(retStr)
            };
            savePreferences(appPreferences);
'@

# Replace 4
$replace4 = @'
            appPreferences.customTravelTimes[destCity] = {
                arrival: parseTimeStr(arrStr),
                return: parseTimeStr(retStr)
            };
            saveAppPreferences();
'@

# Target 5
$target5 = @'
function loadAppPreferences() {
    const city = localStorage.getItem("iec_pref_default_city");
    const snooze = localStorage.getItem("iec_pref_default_snooze");
    const snoozeInterval = localStorage.getItem("iec_pref_default_snooze_interval");
    const gpsApproved = localStorage.getItem("iec_pref_gps_approved");
    const clockApproved = localStorage.getItem("iec_pref_clock_approved");
    
    const tgChatId = localStorage.getItem("iec_pref_tg_chat_id");
    if (tgChatId) {
        appPreferences.telegramChatId = tgChatId;
    }
    
    if (city) {
        appPreferences.defaultCity = city;
        appPreferences.defaultSnooze = snooze === null ? true : (snooze === "true");
        appPreferences.defaultSnoozeInterval = snoozeInterval === null ? 10 : parseInt(snoozeInterval);
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
'@

# Replace 5: Using ASCII-safe unicode escapes for Hebrew default values
$replace5 = @'
function loadAppPreferences() {
    const city = localStorage.getItem("iec_pref_default_city");
    const mainOffice = localStorage.getItem("iec_pref_main_office_city");
    const snooze = localStorage.getItem("iec_pref_default_snooze");
    const snoozeInterval = localStorage.getItem("iec_pref_default_snooze_interval");
    const gpsApproved = localStorage.getItem("iec_pref_gps_approved");
    const clockApproved = localStorage.getItem("iec_pref_clock_approved");
    
    // Set fallback defaults if not found in localStorage
    appPreferences.defaultCity = city !== null ? city : "\u05e8\u05e2\u05e0\u05e0\u05d4";
    appPreferences.mainOfficeCity = mainOffice !== null ? mainOffice : "\u05d2\u05df \u05e9\u05d5\u05e8\u05e7";
    appPreferences.defaultSnooze = snooze === null ? true : (snooze === "true");
    appPreferences.defaultSnoozeInterval = snoozeInterval === null ? 10 : parseInt(snoozeInterval);
    appPreferences.gpsUsageApproved = gpsApproved === null ? true : (gpsApproved === "true");
    appPreferences.clockUsageApproved = clockApproved === null ? true : (clockApproved === "true");
    
    const tgChatId = localStorage.getItem("iec_pref_tg_chat_id");
    if (tgChatId) {
        appPreferences.telegramChatId = tgChatId;
    }
    
    // If onboarding is not done, show it, otherwise hide it
    const onboardingDone = localStorage.getItem("iec_pref_onboarding_done");
    if (onboardingDone === "true" || city !== null) {
        document.getElementById("onboarding-screen").classList.remove("active");
    } else {
        document.getElementById("onboarding-screen").classList.add("active");
    }
}
'@

# Target 6
$target6 = @'
function saveAppPreferences() {
    localStorage.setItem("iec_pref_default_city", appPreferences.defaultCity);
    if (appPreferences.mainOfficeCity) {
        localStorage.setItem("iec_pref_main_office_city", appPreferences.mainOfficeCity);
    }
    localStorage.setItem("iec_pref_default_snooze", appPreferences.defaultSnooze.toString());
    localStorage.setItem("iec_pref_default_snooze_interval", appPreferences.defaultSnoozeInterval.toString());
    localStorage.setItem("iec_pref_gps_approved", appPreferences.gpsUsageApproved.toString());
    localStorage.setItem("iec_pref_clock_approved", appPreferences.clockUsageApproved.toString());
    if (appPreferences.telegramChatId) {
        localStorage.setItem("iec_pref_tg_chat_id", appPreferences.telegramChatId);
    }
}
}
'@

# Replace 6
$replace6 = @'
function saveAppPreferences() {
    localStorage.setItem("iec_pref_default_city", appPreferences.defaultCity);
    if (appPreferences.mainOfficeCity) {
        localStorage.setItem("iec_pref_main_office_city", appPreferences.mainOfficeCity);
    }
    localStorage.setItem("iec_pref_default_snooze", appPreferences.defaultSnooze.toString());
    localStorage.setItem("iec_pref_default_snooze_interval", appPreferences.defaultSnoozeInterval.toString());
    localStorage.setItem("iec_pref_gps_approved", appPreferences.gpsUsageApproved.toString());
    localStorage.setItem("iec_pref_clock_approved", appPreferences.clockUsageApproved.toString());
    if (appPreferences.telegramChatId) {
        localStorage.setItem("iec_pref_tg_chat_id", appPreferences.telegramChatId);
    }
}
'@

# Normalize line endings to match app.js (CRLF)
function Norm($s) {
    return $s -replace "`r`n", "`n" -replace "`n", "`r`n"
}

$target1 = Norm $target1
$replace1 = Norm $replace1
$target2 = Norm $target2
$replace2 = Norm $replace2
$target3 = Norm $target3
$replace3 = Norm $replace3
$target4 = Norm $target4
$replace4 = Norm $replace4
$target5 = Norm $target5
$replace5 = Norm $replace5
$target6 = Norm $target6
$replace6 = Norm $replace6

# Apply replacements
$contentBefore = $content.Length
$content = $content.Replace($target1, $replace1)
$content = $content.Replace($target2, $replace2)
$content = $content.Replace($target3, $replace3)
$content = $content.Replace($target4, $replace4)
$content = $content.Replace($target5, $replace5)
$content = $content.Replace($target6, $replace6)
$contentAfter = $content.Length

[System.IO.File]::WriteAllText($appJsPath, $content, [System.Text.Encoding]::UTF8)

Write-Output "Applied ASCII-safe updates. Length before: $contentBefore, Length after: $contentAfter"
