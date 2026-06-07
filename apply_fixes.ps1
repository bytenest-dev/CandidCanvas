# Apply all remaining fixes to AdminPage
$file = "c:\Users\Admin\Desktop\Candid Canvas\candid-canvas-bd\src\pages\AdminPage.tsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Fix 1: Add UserAvatar to mobile top bar (after "View Site" link)
$old1 = @'
              <Link to="/" className="hidden sm:block text-xs text-[#6B7280] hover:text-[#111827] px-2 py-1 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                → View Site
              </Link>
            </div>
          </header>
'@

$new1 = @'
              <Link to="/" className="hidden sm:block text-xs text-[#6B7280] hover:text-[#111827] px-2 py-1 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                → View Site
              </Link>
              {/* Admin profile picture (Google photo) */}
              <UserAvatar
                photoURL={user?.photoURL}
                displayName={user?.displayName || 'Admin'}
                size="md"
                className="hidden sm:flex"
              />
            </div>
          </header>
'@

if ($content -match [regex]::Escape($old1)) {
    $content = $content -replace [regex]::Escape($old1), $new1
    Write-Host "✓ Fix 1: Added UserAvatar to top bar" -ForegroundColor Green
} else {
    Write-Host "✗ Fix 1: Pattern not found (might already be applied)" -ForegroundColor Yellow
}

# Fix 2: Make packages header responsive
$old2 = @'
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[#6B7280] text-sm">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
                  <button onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    <Plus size={14} /> Add Package
                  </button>
                </div>
'@

$new2 = @'
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                  <p className="text-[#6B7280] text-sm">{packages.length} package{packages.length !== 1 ? 's' : ''}</p>
                  <button onClick={openAdd}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors">
                    <Plus size={14} /> Add Package
                  </button>
                </div>
'@

if ($content -match [regex]::Escape($old2)) {
    $content = $content -replace [regex]::Escape($old2), $new2
    Write-Host "✓ Fix 2: Made packages header responsive" -ForegroundColor Green
} else {
    Write-Host "✗ Fix 2: Pattern not found (might already be applied)" -ForegroundColor Yellow
}

# Save the modified content
$content | Set-Content $file -Encoding UTF8 -NoNewline
Write-Host "`n✅ All fixes applied to AdminPage.tsx" -ForegroundColor Cyan
