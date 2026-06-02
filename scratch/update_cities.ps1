$raw = Get-Content -Path "scratch/cities_raw.txt" -Encoding UTF8
$cities = $raw | Where-Object { $_.Trim() -ne "" } | ForEach-Object { $_.Trim() }

Write-Host "Parsed $($cities.Count) cities."

$dbPaths = @("web-app/travel_db.json", "web-simulator/travel_db.json")

foreach ($p in $dbPaths) {
    $dbStr = Get-Content -Path $p -Raw -Encoding UTF8
    $db = $dbStr | ConvertFrom-Json
    $db.sources = $cities
    $db | ConvertTo-Json -Depth 10 | Set-Content -Path $p -Encoding UTF8
    Write-Host "Updated $p"
}
