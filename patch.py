import sys
import re

with open('web-app/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add warningMinutesBeforeEnd to appPreferences
code = code.replace('defaultSnoozeInterval: 10,', 'defaultSnoozeInterval: 10,\n    warningMinutesBeforeEnd: 10,')

# 2. Update warningDurationOffset calculation
code = code.replace('const warningDurationOffset = ((11 * 60) + 50 - travelBackVal) * 60 * 1000;', 'const warningDurationOffset = ((12 * 60) - appPreferences.warningMinutesBeforeEnd - travelBackVal) * 60 * 1000;')

# 3. Read warningMinutesBeforeEnd from UI in saveAppPreferences
code = code.replace('appPreferences.defaultSnoozeInterval = parseInt(document.getElementById(\"settings-default-snooze-interval\").value) || 10;', 'appPreferences.defaultSnoozeInterval = parseInt(document.getElementById(\"settings-default-snooze-interval\").value) || 10;\n        appPreferences.warningMinutesBeforeEnd = parseInt(document.getElementById(\"settings-warning-minutes\").value) || 0; if(document.getElementById(\"settings-warning-minutes\").value===\"0\") appPreferences.warningMinutesBeforeEnd=0;')

# 4. Populate warningMinutesBeforeEnd in openSetupSheet
code = re.sub(r'if \(officeCityInput\) \{[^\}]*\}', lambda m: m.group(0) + '\n\n    const warnSelect = document.getElementById("settings-warning-minutes");\n    if (warnSelect) warnSelect.value = appPreferences.warningMinutesBeforeEnd;', code)

# 5. Load warningMinutesBeforeEnd from localStorage
code = code.replace('appPreferences.clockUsageApproved = clockApproved === null ? true : (clockApproved === \"true\");', 'appPreferences.clockUsageApproved = clockApproved === null ? true : (clockApproved === \"true\");\n\n    const warningMinutes = localStorage.getItem(\"iec_pref_warning_minutes\");\n    appPreferences.warningMinutesBeforeEnd = warningMinutes === null ? 10 : parseInt(warningMinutes);')

# 6. Save warningMinutesBeforeEnd to localStorage
code = code.replace('localStorage.setItem(\"iec_pref_clock_approved\", appPreferences.clockUsageApproved.toString());', 'localStorage.setItem(\"iec_pref_clock_approved\", appPreferences.clockUsageApproved.toString());\n    localStorage.setItem(\"iec_pref_warning_minutes\", appPreferences.warningMinutesBeforeEnd.toString());')

# 7. Replace the hardcoded texts
code = code.replace('הגעת ל-11:50 שעות נוכחות כולל נסיעות. נא סמן סיום.', 'הגעת לזמן היעד שלך להיום! אנא סמן סיום באפליקציה.')
code = code.replace('חרגת מתקרת ה-11:50 כולל נסיעות.', 'הגעת לזמן היעד המחושב שלך להיום.')
code = code.replace('11:50 limit', 'Warning limit')
code = code.replace('זמן התראה (11:50):', 'זמן התראה מחושב:')

with open('web-app/app.js', 'w', encoding='utf-8') as f:
    f.write(code)
