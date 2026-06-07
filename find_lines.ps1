$lines = Get-Content "src\pages\AdminPage.tsx"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "Save Settings" -or $lines[$i] -match "Save Message") {
        Write-Host "$($i+1): $($lines[$i])"
    }
}
