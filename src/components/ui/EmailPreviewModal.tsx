import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Eye } from 'lucide-react';
import type { OrderEmailData } from '../../lib/emailService';
import { sendOrderEmail } from '../../lib/emailService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: OrderEmailData | null;
  onSend: () => void;
}

export default function EmailPreviewModal({ isOpen, onClose, data, onSend }: Props) {
  const [preview, setPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!data) return null;

  const handleSend = async () => {
    try {
      setSending(true);
      await sendOrderEmail(data);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setPreview(false);
        onSend();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Email send error:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    approved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Approval Email', icon: '✅' },
    rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejection Email', icon: '❌' },
    contacted: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Contact Notice', icon: '📞' },
    completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Completion Email', icon: '🎉' },
  };

  const cfg = statusConfig[data.status] || statusConfig.approved;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-[#374151]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#111827] text-sm">Send Email Notification</h2>
                  <p className="text-xs text-[#9CA3AF]">To: {data.clientName} &lt;{data.clientEmail}&gt;</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg"><X size={18} /></button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              <div className="p-6 space-y-5">
                {/* Status badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                  <span>{cfg.icon}</span> {cfg.label}
                </div>

                {/* Recipient info */}
                <div className="bg-[#F8F9FA] rounded-xl p-4 space-y-2.5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      { l: 'To', v: `${data.clientName} <${data.clientEmail}>` },
                      { l: 'Order ID', v: data.orderId },
                      { l: 'Package', v: data.packageName },
                      { l: 'Event Date', v: data.eventDate },
                    ].map(({ l, v }) => (
                      <div key={l}>
                        <p className="text-[#9CA3AF] text-xs uppercase tracking-wide mb-0.5">{l}</p>
                        <p className="text-[#111827] font-medium text-xs">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email details */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-[#111827]">Email Content:</h3>
                  <div className="text-sm text-[#6B7280] space-y-2">
                    {data.status === 'approved' && (
                      <>
                        <p>✅ Congratulations message</p>
                        <p>📋 Booking details summary</p>
                        <p>📞 Next steps and contact information</p>
                      </>
                    )}
                    {data.status === 'rejected' && (
                      <>
                        <p>ℹ️ Polite rejection message</p>
                        <p>💡 Alternative options</p>
                        <p>📞 Contact information for discussion</p>
                      </>
                    )}
                    {data.status === 'contacted' && (
                      <>
                        <p>📧 Acknowledgment message</p>
                        <p>⏰ Expected response time</p>
                        <p>📞 Contact information</p>
                      </>
                    )}
                    {data.status === 'completed' && (
                      <>
                        <p>🎉 Completion message</p>
                        <p>📸 Delivery timeline</p>
                        <p>⭐ Review request</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex items-center justify-between gap-3 flex-shrink-0">
              <p className="text-xs text-[#9CA3AF]">
                Email will be logged. Configure EmailJS in .env for real delivery.
              </p>
              <button
                onClick={handleSend}
                disabled={sending || sent}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  sent ? 'bg-green-500 text-white' : sending ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#111827] text-white hover:bg-[#374151]'
                }`}
              >
                {sent ? '✓ Sent!' : sending ? 'Sending...' : <><Send size={14} /> Send Email</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
