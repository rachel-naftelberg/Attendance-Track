$excelFile = "C:\Users\um624\Downloads\חוברת1 (1).xlsx"
Write-Host "Parsing Excel file: $excelFile"

# Create a temporary directory in workspace
$tempDir = Join-Path "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app" "temp_excel2"
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy and rename to zip
$zipFile = Join-Path $tempDir "excel.zip"
Copy-Item $excelFile $zipFile

# Unzip
Expand-Archive -Path $zipFile -DestinationPath $tempDir

# Load shared strings
$sharedStringsFile = Join-Path $tempDir "xl/sharedStrings.xml"
$sharedStrings = @()
if (Test-Path $sharedStringsFile) {
    [xml]$sharedStringsXml = Get-Content $sharedStringsFile -Encoding UTF8
    $ns = New-Object Xml.XmlNamespaceManager $sharedStringsXml.NameTable
    $ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
    $sharedStrings = $sharedStringsXml.SelectNodes("//x:t", $ns) | ForEach-Object { $_.InnerText }
}

# Load sheet1
$sheetFile = Join-Path $tempDir "xl/worksheets/sheet1.xml"
[xml]$sheetXml = Get-Content $sheetFile -Encoding UTF8
$ns = New-Object Xml.XmlNamespaceManager $sheetXml.NameTable
$ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")

# Parse rows and cells
$rows = $sheetXml.SelectNodes("//x:row", $ns)
$records = @()

foreach ($row in $rows) {
    $rowData = @{ RowIndex = [int]$row.r }
    $cells = $row.SelectNodes("x:c", $ns)
    foreach ($cell in $cells) {
        $colRef = $cell.r -replace '\d+' 
        $valNode = $cell.SelectSingleNode("x:v", $ns)
        $val = ""
        if ($valNode) {
            $rawVal = $valNode.InnerText
            if ($cell.t -eq "s") {
                $val = $sharedStrings[[int]$rawVal]
            } else {
                $val = $rawVal
            }
        }
        $rowData[$colRef] = $val
    }
    $records += [PSCustomObject]$rowData
}

# Clean up
Remove-Item -Recurse -Force $tempDir
Write-Host "Excel data parsed!"

function Get-Minutes($val) {
    if (!$val -or $val -eq "0" -or $val -eq "0:00" -or $val -eq 0) {
        return 0
    }
    if ($val -like "*E-*") {
        $parts = $val -split "E-"
        $base = [double]$parts[0]
        $exp = [int]$parts[1]
        $doubleVal = $base * [Math]::Pow(10, -$exp)
        return [int][Math]::Round($doubleVal * 24 * 60)
    }
    
    $outVal = 0.0
    if ([double]::TryParse($val, [ref]$outVal)) {
        return [int][Math]::Round($outVal * 24 * 60)
    }
    return 0
}

$travelTimes = @{}

foreach ($r in $records) {
    if ($r.RowIndex -le 1) { continue }
    if (-not $r.A -or -not $r.C) { continue }
    
    $city = $r.A.Trim()
    $dest = $r.C.Trim()
    
    $arrival = Get-Minutes $r.G
    $return = Get-Minutes $r.H
    
    if ($arrival -eq 0 -and $return -eq 0) {
        $duration = Get-Minutes $r.F
        if ($duration -gt 30) {
            $arrival = $duration
            $return = $duration
        }
    }
    
    if (!$travelTimes.ContainsKey($city)) {
        $travelTimes[$city] = @{}
    }
    $travelTimes[$city][$dest] = @($arrival, $return)
}

Write-Host "Parsed travel times for $($travelTimes.Keys.Count) source cities."

# Now update travel_db.json
$dbPaths = @("web-app/travel_db.json", "web-simulator/travel_db.json")

foreach ($p in $dbPaths) {
    $pFull = Join-Path "C:\Users\um624\.gemini\antigravity\scratch\iec-attendance-app" $p
    $dbStr = Get-Content -Path $pFull -Raw -Encoding UTF8
    $db = $dbStr | ConvertFrom-Json
    $db.times = $travelTimes
    $db | ConvertTo-Json -Depth 10 | Set-Content -Path $pFull -Encoding UTF8
    Write-Host "Updated $p"
}
