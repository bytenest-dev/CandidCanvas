$file = "src\pages\AdminPage.tsx"
$content = Get-Content $file -Raw -Encoding UTF8

# Insert password change section after the closing </div> of Special Notice section (line 1823)
$oldBlock = @'
                </div>

              </motion.div>
            )}

          </main>
        </div>
      </div>

      {/* — Mobile Bottom Nav Bar
'@

# We do a targeted line-based insertion instead
$lines = Get-Content $file -Encoding UTF8
$insertAfter = 1822  # 0-indexed = line 1823 (the closing </div> after Save Settings)

$passwordBlock = @'

                {/* Change Password */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings size={16} className="text-[#374151]" />
                    <h3 className="font-semibold text-[#111827]">Change Password</h3>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mb-4">Update your admin account password.</p>
                  <div className="space-y-3 max-w-sm">
                    <input
                      id="new-password-input"
                      type="password"
                      placeholder="New password (min 6 characters)"
                      className="w-full border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                    <button
                      onClick={async () => {
                        const input = document.getElementById('new-password-input') as HTMLInputElement;
                        const newPwd = input?.value?.trim();
                        if (!newPwd || newPwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
                        try {
                          const { updatePassword } = await import('firebase/auth');
                          const { auth } = await import('../lib/firebase');
                          if (!auth.currentUser) { toast.error('Not authenticated'); return; }
                          await updatePassword(auth.currentUser, newPwd);
                          input.value = '';
                          toast.success('Password updated successfully');
                        } catch (e: unknown) {
                          const msg = (e as { message?: string })?.message || '';
                          if (msg.includes('requires-recent-login')) {
                            toast.error('Please sign out and sign in again before changing password');
                          } else {
                            toast.error('Failed to update password');
                          }
                        }
                      }}
                      className="w-full py-2.5 bg-[#111827] text-white text-sm rounded-lg hover:bg-[#374151] transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
'@

$before = $lines[0..($insertAfter - 1)]
$after = $lines[$insertAfter..($lines.Length - 1)]
$result = ($before -join "`n") + "`n" + $passwordBlock + "`n" + ($after -join "`n")
Set-Content $file -Value $result -Encoding UTF8
Write-Host "Password section inserted at line $insertAfter"
