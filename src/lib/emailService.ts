export interface OrderEmailData {
  clientName: string;
  clientEmail: string;
  orderId: string;
  packageName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  status: 'approved' | 'rejected' | 'contacted' | 'completed';
}

const BASE_STYLES = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', Arial, sans-serif; background-color: #f4f4f5; color: #111827; -webkit-font-smoothing: antialiased; }
    .wrapper { background-color: #f4f4f5; padding: 40px 20px; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { padding: 36px 40px; text-align: center; }
    .header-icon { font-size: 48px; margin-bottom: 16px; }
    .header-title { font-size: 26px; font-weight: 700; color: #ffffff; margin-bottom: 4px; letter-spacing: -0.5px; }
    .header-subtitle { font-size: 14px; color: rgba(255,255,255,0.75); }
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; line-height: 1.6; }
    .message { font-size: 15px; color: #4B5563; line-height: 1.7; margin-bottom: 28px; }
    .booking-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
    .booking-card-title { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .booking-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #E5E7EB; }
    .booking-row:last-child { border-bottom: none; }
    .booking-label { font-size: 13px; color: #6B7280; font-weight: 500; }
    .booking-value { font-size: 13px; color: #111827; font-weight: 600; text-align: right; max-width: 55%; }
    .booking-id { font-family: 'Courier New', monospace; background: #111827; color: #ffffff; padding: 10px 16px; border-radius: 8px; font-size: 16px; font-weight: 700; text-align: center; letter-spacing: 1px; margin-bottom: 24px; }
    .steps { background: #F9FAFB; border-radius: 12px; padding: 24px; margin-bottom: 28px; }
    .steps-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 16px; }
    .step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .step:last-child { margin-bottom: 0; }
    .step-icon { font-size: 18px; flex-shrink: 0; }
    .step-text { font-size: 13px; color: #4B5563; line-height: 1.5; }
    .cta-button { display: block; text-align: center; padding: 14px 32px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; margin: 0 auto 28px; max-width: 280px; }
    .divider { height: 1px; background: #E5E7EB; margin: 28px 0; }
    .footer { padding: 24px 40px; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
    .footer-brand { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 8px; }
    .footer-contact { font-size: 13px; color: #6B7280; line-height: 2; }
    .footer-note { font-size: 11px; color: #9CA3AF; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
  </style>
`;

const EMAIL_TEMPLATES = {
  approved: (data: OrderEmailData) => ({
    subject: `✅ Your Booking is Confirmed! — ${data.orderId} | Candid Canvas BD`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body><div class="wrapper"><div class="card">
  <div class="header" style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%);">
    <div class="header-icon">🎉</div>
    <div class="header-title">Booking Confirmed!</div>
    <div class="header-subtitle">We can't wait to capture your special moments</div>
  </div>
  <div class="body">
    <p class="greeting">Dear <strong>${data.clientName}</strong>,</p>
    <p class="message">
      Wonderful news — your booking with <strong>Candid Canvas BD</strong> has been <strong style="color:#10B981;">officially approved</strong>! 
      Our team is thrilled to be part of your special occasion. We're already looking forward to creating something beautiful together.
    </p>
    <div class="booking-id">${data.orderId}</div>
    <div class="booking-card">
      <div class="booking-card-title">📋 Booking Details</div>
      <div class="booking-row">
        <span class="booking-label">Package</span>
        <span class="booking-value">${data.packageName}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event Type</span>
        <span class="booking-value" style="text-transform:capitalize;">${data.eventType}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event Date</span>
        <span class="booking-value">${data.eventDate}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Location</span>
        <span class="booking-value">${data.eventLocation}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Status</span>
        <span class="booking-value" style="color:#10B981;">✅ Confirmed</span>
      </div>
    </div>
    <div class="steps">
      <div class="steps-title">What Happens Next?</div>
      <div class="step"><span class="step-icon">📞</span><span class="step-text"><strong>We'll call or message you within 24 hours</strong> to confirm final details and discuss any special requirements you have.</span></div>
      <div class="step"><span class="step-icon">📸</span><span class="step-text"><strong>Prepare your shot list</strong> — think about moments, people, and details you'd love captured forever.</span></div>
      <div class="step"><span class="step-icon">💬</span><span class="step-text"><strong>Stay in touch</strong> — feel free to message us anytime via WhatsApp or email with any questions.</span></div>
      <div class="step"><span class="step-icon">✨</span><span class="step-text"><strong>On your big day</strong>, our team will arrive early, fully prepared to tell your story beautifully.</span></div>
    </div>
    <div class="divider"></div>
    <p style="font-size:14px;color:#4B5563;text-align:center;line-height:1.7;">
      Thank you for choosing us. We treat every booking as a privilege and promise to deliver memories that will last a lifetime. 
      <br><br><strong style="color:#111827;">— The Candid Canvas BD Team</strong>
    </p>
  </div>
  <div class="footer">
    <div class="footer-brand">📷 Candid Canvas BD</div>
    <div class="footer-contact">
      📧 candidcanvasbd@gmail.com<br>
      📱 WhatsApp: +8801849244610<br>
      🌐 Premium Photography & Cinematography, Dhaka, Bangladesh
    </div>
    <div class="footer-note">This email was sent regarding booking ${data.orderId}. Please keep this for your records.</div>
  </div>
</div></div></body></html>`,
  }),

  rejected: (data: OrderEmailData) => ({
    subject: `Regarding Your Booking Request — ${data.orderId} | Candid Canvas BD`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body><div class="wrapper"><div class="card">
  <div class="header" style="background: linear-gradient(135deg, #374151 0%, #4B5563 100%);">
    <div class="header-icon">📩</div>
    <div class="header-title">An Update on Your Booking</div>
    <div class="header-subtitle">Thank you for your interest in Candid Canvas BD</div>
  </div>
  <div class="body">
    <p class="greeting">Dear <strong>${data.clientName}</strong>,</p>
    <p class="message">
      Thank you so much for considering <strong>Candid Canvas BD</strong> for your special occasion. 
      We truly appreciate your interest and the time you took to reach out to us.
      <br><br>
      Unfortunately, after reviewing your request, we are unable to accommodate your booking at this time. 
      We understand this may be disappointing, and we sincerely apologize for any inconvenience.
    </p>
    <div class="booking-id">${data.orderId}</div>
    <div class="booking-card">
      <div class="booking-card-title">📋 Request Details</div>
      <div class="booking-row">
        <span class="booking-label">Package Requested</span>
        <span class="booking-value">${data.packageName}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event Date</span>
        <span class="booking-value">${data.eventDate}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Location</span>
        <span class="booking-value">${data.eventLocation}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Status</span>
        <span class="booking-value" style="color:#EF4444;">Not Available</span>
      </div>
    </div>
    <div class="steps">
      <div class="steps-title">This may be due to one of the following reasons:</div>
      <div class="step"><span class="step-icon">📅</span><span class="step-text">The requested date is already fully booked by another client.</span></div>
      <div class="step"><span class="step-icon">📍</span><span class="step-text">The location or event type may not align with our current service area.</span></div>
      <div class="step"><span class="step-icon">🔄</span><span class="step-text">There may be a scheduling conflict with our team's availability.</span></div>
    </div>
    <div class="steps" style="background:#FEF3C7;border:1px solid #FDE68A;">
      <div class="steps-title" style="color:#92400E;">💡 We'd Still Love to Work With You!</div>
      <div class="step"><span class="step-icon">📞</span><span class="step-text"><strong>Contact us directly</strong> — we may be able to suggest an alternative date or customize a solution for you.</span></div>
      <div class="step"><span class="step-icon">📆</span><span class="step-text"><strong>Try a different date</strong> — submit a new booking request with flexible dates for a better chance of availability.</span></div>
      <div class="step"><span class="step-icon">🤝</span><span class="step-text"><strong>Explore custom packages</strong> — we can discuss tailored options that fit your specific needs.</span></div>
    </div>
    <div class="divider"></div>
    <p style="font-size:14px;color:#4B5563;text-align:center;line-height:1.7;">
      We hope to have the opportunity to serve you in the future. Your special moments deserve to be captured beautifully, and we'd love to be part of that journey.
      <br><br><strong style="color:#111827;">— The Candid Canvas BD Team</strong>
    </p>
  </div>
  <div class="footer">
    <div class="footer-brand">📷 Candid Canvas BD</div>
    <div class="footer-contact">
      📧 candidcanvasbd@gmail.com<br>
      📱 WhatsApp: +8801849244610<br>
      🌐 Premium Photography & Cinematography, Dhaka, Bangladesh
    </div>
    <div class="footer-note">This email was sent regarding booking request ${data.orderId}.</div>
  </div>
</div></div></body></html>`,
  }),

  contacted: (data: OrderEmailData) => ({
    subject: `We've Received Your Booking! — ${data.orderId} | Candid Canvas BD`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body><div class="wrapper"><div class="card">
  <div class="header" style="background: linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%);">
    <div class="header-icon">📬</div>
    <div class="header-title">Booking Received!</div>
    <div class="header-subtitle">We're reviewing your request now</div>
  </div>
  <div class="body">
    <p class="greeting">Dear <strong>${data.clientName}</strong>,</p>
    <p class="message">
      Thank you for booking with <strong>Candid Canvas BD</strong>! We've received your request and our team is currently reviewing it. 
      You'll hear back from us very soon with a confirmation or any follow-up questions.
    </p>
    <div class="booking-id">${data.orderId}</div>
    <div class="booking-card">
      <div class="booking-card-title">📋 Your Booking Summary</div>
      <div class="booking-row">
        <span class="booking-label">Package</span>
        <span class="booking-value">${data.packageName}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event Type</span>
        <span class="booking-value" style="text-transform:capitalize;">${data.eventType}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event Date</span>
        <span class="booking-value">${data.eventDate}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Location</span>
        <span class="booking-value">${data.eventLocation}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Status</span>
        <span class="booking-value" style="color:#8B5CF6;">🔍 Under Review</span>
      </div>
    </div>
    <div class="steps">
      <div class="steps-title">⏰ What to Expect</div>
      <div class="step"><span class="step-icon">✅</span><span class="step-text"><strong>Within 24 hours</strong> — we'll review availability and confirm or reach out with any questions.</span></div>
      <div class="step"><span class="step-icon">📞</span><span class="step-text"><strong>We may contact you</strong> via WhatsApp or email to clarify event details.</span></div>
      <div class="step"><span class="step-icon">📧</span><span class="step-text"><strong>Final confirmation</strong> will be sent as a separate email once everything is verified.</span></div>
    </div>
    <div class="divider"></div>
    <p style="font-size:14px;color:#4B5563;text-align:center;line-height:1.7;">
      In the meantime, feel free to reach out to us directly with any questions or additional information.
      <br><br><strong style="color:#111827;">— The Candid Canvas BD Team</strong>
    </p>
  </div>
  <div class="footer">
    <div class="footer-brand">📷 Candid Canvas BD</div>
    <div class="footer-contact">
      📧 candidcanvasbd@gmail.com<br>
      📱 WhatsApp: +8801849244610
    </div>
    <div class="footer-note">Booking reference: ${data.orderId}</div>
  </div>
</div></div></body></html>`,
  }),

  completed: (data: OrderEmailData) => ({
    subject: `Your Session is Complete! — ${data.orderId} | Candid Canvas BD`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${BASE_STYLES}</head>
<body><div class="wrapper"><div class="card">
  <div class="header" style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%);">
    <div class="header-icon">🌟</div>
    <div class="header-title">Session Complete!</div>
    <div class="header-subtitle">Thank you for choosing Candid Canvas BD</div>
  </div>
  <div class="body">
    <p class="greeting">Dear <strong>${data.clientName}</strong>,</p>
    <p class="message">
      It was an absolute pleasure working with you! Your <strong>${data.eventType}</strong> session has been completed, 
      and we're so excited about the incredible memories we captured together. 
      Our editing team is now working their magic! ✨
    </p>
    <div class="booking-id">${data.orderId}</div>
    <div class="booking-card">
      <div class="booking-card-title">📋 Session Summary</div>
      <div class="booking-row">
        <span class="booking-label">Package</span>
        <span class="booking-value">${data.packageName}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Event</span>
        <span class="booking-value" style="text-transform:capitalize;">${data.eventType}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Date</span>
        <span class="booking-value">${data.eventDate}</span>
      </div>
      <div class="booking-row">
        <span class="booking-label">Status</span>
        <span class="booking-value" style="color:#10B981;">✅ Completed</span>
      </div>
    </div>
    <div class="steps">
      <div class="steps-title">📸 Your Deliverables Are On the Way</div>
      <div class="step"><span class="step-icon">🎨</span><span class="step-text"><strong>Editing in progress</strong> — our editors are carefully retouching every photo and frame to perfection.</span></div>
      <div class="step"><span class="step-icon">⏳</span><span class="step-text"><strong>Delivery timeline</strong> — expect your photos/videos within <strong>7–14 business days</strong>.</span></div>
      <div class="step"><span class="step-icon">🔗</span><span class="step-text"><strong>Download link</strong> — you'll receive a private gallery link via email once ready.</span></div>
      <div class="step"><span class="step-icon">📱</span><span class="step-text"><strong>We'll notify you</strong> via WhatsApp as soon as your gallery is ready for download.</span></div>
    </div>
    <div class="steps" style="background:#F0FDF4;border:1px solid #BBF7D0;">
      <div class="steps-title" style="color:#166534;">⭐ Share Your Experience</div>
      <div class="step"><span class="step-icon">💬</span><span class="step-text">If you loved working with us, we'd be honored if you could share your experience! Your feedback helps us grow and helps other clients make informed decisions.</span></div>
      <div class="step"><span class="step-icon">📲</span><span class="step-text">Feel free to tag us on social media and share your memories with the world!</span></div>
    </div>
    <div class="divider"></div>
    <p style="font-size:14px;color:#4B5563;text-align:center;line-height:1.7;">
      Working with you was a true privilege. Every photo tells a story, and we're honored to have told yours.
      <br><br><strong style="color:#111827;">— The Candid Canvas BD Team</strong>
    </p>
  </div>
  <div class="footer">
    <div class="footer-brand">📷 Candid Canvas BD</div>
    <div class="footer-contact">
      📧 candidcanvasbd@gmail.com<br>
      📱 WhatsApp: +8801849244610<br>
      🌐 Premium Photography & Cinematography, Dhaka, Bangladesh
    </div>
    <div class="footer-note">Session reference: ${data.orderId}. Thank you for your trust.</div>
  </div>
</div></div></body></html>`,
  }),
};

export async function sendOrderEmail(data: OrderEmailData): Promise<void> {
  const template = EMAIL_TEMPLATES[data.status](data);

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Log the email
  logEmail(data, template.subject);

  if (serviceId && templateId && publicKey && serviceId !== 'your_service_id') {
    try {
      const emailjs = await import('@emailjs/browser');
      const result = await emailjs.default.send(
        serviceId,
        templateId,
        {
          to_email: data.clientEmail,
          to_name: data.clientName,
          subject: template.subject,
          message: template.html,
          email: data.clientEmail,
        },
        { publicKey }
      );
      console.log('✅ Email sent!', result.status);
    } catch (error: unknown) {
      const err = error as { text?: string; status?: number; message?: string };
      console.error('❌ Email error:', err?.text || err?.message || error);
    }
  }
}

function logEmail(data: OrderEmailData, subject: string) {
  const logs = JSON.parse(sessionStorage.getItem('email_logs') || '[]');
  logs.unshift({
    id: Date.now(),
    to: data.clientEmail,
    toName: data.clientName,
    subject,
    orderId: data.orderId,
    status: data.status,
    sentAt: new Date().toISOString(),
  });
  sessionStorage.setItem('email_logs', JSON.stringify(logs.slice(0, 50)));
}
