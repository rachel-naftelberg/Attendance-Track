$jsonPath = "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\temp_excel_data.json"
$content = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$data = $content | ConvertFrom-Json

function Get-Minutes-From-Fraction($val) {
    if (!$val -or $val -eq "0" -or $val -eq "0:00" -or $val -eq 0 -or $val -eq "99:99") {
        return 0
    }
    if ($val -like "*:*") {
        $parts = $val -split ":"
        return [int]([int]$parts[0] * 60 + [int]$parts[1])
    }
    if ($val -like "*E-*") {
        $parts = $val -split "E-"
        $base = [double]$parts[0]
        $exp = [int]$parts[1]
        $doubleVal = $base * [Math]::Pow(10, -$exp)
        return [int][Math]::Round($doubleVal * 24 * 60)
    }
    $doubleVal = 0.0
    if ([double]::TryParse($val, [ref]$doubleVal)) {
        return [int][Math]::Round($doubleVal * 24 * 60)
    }
    return 0
}

function Get-Minutes-Direct($val) {
    if (!$val -or $val -eq "0" -or $val -eq 0) {
        return 0
    }
    if ($val -like "*:*") {
        $parts = $val -split ":"
        return [int]([int]$parts[0] * 60 + [int]$parts[1])
    }
    $doubleVal = 0.0
    if ([double]::TryParse($val, [ref]$doubleVal)) {
        return [int][Math]::Round($doubleVal)
    }
    return 0
}

$travelTimes = @{}
$uniqueCities = [System.Collections.Generic.HashSet[string]]::new()
$uniqueDests = [System.Collections.Generic.HashSet[string]]::new()

foreach ($r in $data) {
    if ($r.RowIndex -le 1) { continue }
    
    $city = $r.A
    $dest = $r.C
    if (!$city -or !$dest) { continue }
    
    $city = $city.Trim()
    $dest = $dest.Trim()
    
    [void]$uniqueCities.Add($city)
    [void]$uniqueDests.Add($dest)
    
    $arrivalMin = Get-Minutes-From-Fraction $r.G
    $returnMin = Get-Minutes-From-Fraction $r.H
    $distance = if ($r.E -ne "9999" -and $r.E -ne "") { $r.E } else { "" }
    $durationMin = Get-Minutes-Direct $r.F
    
    $arrivalNote = if ($r.I -match "זמן משוער|פחות מ") { $r.I.Trim() } else { "" }
    $returnNote = if ($r.J -match "זמן משוער|פחות מ") { $r.J.Trim() } else { "" }
    
    if (!$travelTimes.ContainsKey($city)) {
        $travelTimes[$city] = @{}
    }
    
    $travelTimes[$city][$dest] = @($arrivalMin, $returnMin, $distance, $durationMin, $arrivalNote, $returnNote)
}

$sortedCities = [System.Linq.Enumerable]::ToArray($uniqueCities)
[System.Array]::Sort($sortedCities)

$sortedDests = [System.Linq.Enumerable]::ToArray($uniqueDests)
[System.Array]::Sort($sortedDests)

$outputObj = @{
    sources = $sortedCities
    cities = $sortedDests
    times = $travelTimes
}

$newJson = ConvertTo-Json -InputObject $outputObj -Depth 5 -Compress
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Write to both web-app and web-simulator
$path1 = "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\web-app\travel_db.json"
$path2 = "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app\web-simulator\travel_db.json"

[System.IO.File]::WriteAllText($path1, $newJson, $utf8NoBom)
[System.IO.File]::WriteAllText($path2, $newJson, $utf8NoBom)

Write-Output "Processed JSON successfully. Sources: $($sortedCities.Length), Destinations: $($sortedDests.Length)"
