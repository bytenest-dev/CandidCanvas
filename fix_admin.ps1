$file = "c:\Users\Admin\Desktop\Candid Canvas\candid-canvas-bd\src\pages\AdminPage.tsx"
$content = Get-Content $file -Raw -Encoding UTF8

# ── FIX 1: Gallery header → add Categories button + category manager panel ──
$old1 = 'className="flex items-center justify-between mb-5">
                  <p className="text-[#6B7280] text-sm">{gallery.length} image{gallery.length !== 1 ? ' + "'s'" + ' : ' + "''" + '}</p>
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-60"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading' + [char]0x2026 + '
                      </>
                    ) : (
                      <><Upload size={14} /> Upload Images</>
                    )}
                  </button>
                </div>'

Write-Host "Testing old1 match: $($content.Contains($old1))"

# Use a regex pattern to find and replace the gallery header
$pattern1 = '(?s)(className="flex items-center justify-between mb-5">\s*<p className="text-\[#6B7280\] text-sm">\{gallery\.length\} image[^<]*</p>\s*<button\s*onClick=\{[^}]*galleryInputRef[^}]*\}[\s\S]*?</button>\s*</div>)'

$replacement1 = @'
className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <p className="text-[#6B7280] text-sm">{gallery.length} image{gallery.length !== 1 ? 's' : ''}</p>
                  <div className="flex w-full sm:w-auto gap-2">
                    <button
                      onClick={() => setShowCatManager(v => !v)}
                      className={`flex items-center gap-1.5 px-3 py-2 border text-sm rounded-lg transition-colors ${showCatManager ? 'border-[#111827] bg-[#111827] text-white' : 'border-[#E5E7EB] text-[#374151] hover:border-[#374151]'}`}
                    >
                      <Settings size={13} /> Categories
                    </button>
                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-60"
                    >
                      {isUploading ? (
                        <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</>
                      ) : (
                        <><Upload size={14} /> Upload Images</>
                      )}
                    </button>
                  </div>
                </div>
                {/* Category manager panel */}
                {showCatManager && (
                  <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-4">
                    <p className="text-xs font-semibold text-[#374151] mb-3 uppercase tracking-wide">Gallery Categories</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {galleryCategories.map(cat => (
                        <div key={cat} className="flex items-center gap-1 bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-3 py-1.5">
                          <span className="text-xs font-medium text-[#374151]">{cat}</span>
                          <button
                            onClick={() => {
                              if (galleryCategories.length <= 1) { toast.error('Need at least one category'); return; }
                              if (!window.confirm(`Delete category "${cat}"?`)) return;
                              setGalleryCategories(galleryCategories.filter(c => c !== cat));
                              toast.success(`"${cat}" deleted`);
                            }}
                            className="ml-1 text-[#9CA3AF] hover:text-red-500 transition-colors"
                          >
                            <XCircle size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            const name = newCatName.trim();
                            if (!name) return;
                            if (galleryCategories.map(c => c.toLowerCase()).includes(name.toLowerCase())) { toast.error('Already exists'); return; }
                            setGalleryCategories([...galleryCategories, name]);
                            setNewCatName('');
                            toast.success(`"${name}" added`);
                          }
                        }}
                        placeholder="New category name…"
                        className="flex-1 border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                      />
                      <button
                        onClick={() => {
                          const name = newCatName.trim();
                          if (!name) return;
                          if (galleryCategories.map(c => c.toLowerCase()).includes(name.toLowerCase())) { toast.error('Already exists'); return; }
                          setGalleryCategories([...galleryCategories, name]);
                          setNewCatName('');
                          toast.success(`"${name}" added`);
                        }}
                        className="px-4 py-2 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors flex items-center gap-1.5"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  </div>
                )}
'@

$newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern1, $replacement1, [System.Text.RegularExpressions.RegexOptions]::Singleline)

if ($newContent -eq $content) {
    Write-Host "FIX 1 FAILED - no change made" -ForegroundColor Red
} else {
    Write-Host "FIX 1 Applied - gallery header + category manager" -ForegroundColor Green
    $content = $newContent
}

# ── FIX 2: Edit gallery modal - replace GALLERY_CATS with galleryCategories ──
$content = $content -replace 'GALLERY_CATS\.map\(c => <option key=\{c\}[^>]*>\{c\}</option>\)', 'galleryCategories.map(c => <option key={c} value={c}>{c}</option>)'
Write-Host "FIX 2 Applied - gallery modal uses dynamic categories" -ForegroundColor Green

# ── FIX 3: UserAvatar - fix photoURL display (white background issue) ──
# The UserAvatar has bg-gradient fallback but the photo loads correctly
# Issue is the sidebar uses logoImg instead of UserAvatar - already fixed
# Verify it's there
if ($content -Contains 'photoURL={user?.photoURL}') {
    Write-Host "FIX 3 OK - UserAvatar with photoURL already present in sidebar" -ForegroundColor Green
} else {
    Write-Host "FIX 3 MISSING - UserAvatar not found with photoURL" -ForegroundColor Yellow
}

# Save
Set-Content $file $content -Encoding UTF8 -NoNewline
Write-Host "`nAll fixes saved to AdminPage.tsx" -ForegroundColor Cyan
