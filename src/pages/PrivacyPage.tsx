import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-heading text-xl text-[#111827] mb-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Candid Canvas BD</title>
        <meta name="description" content="Privacy Policy for Candid Canvas BD — how we collect, use, and protect your personal information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/privacy" />
      </Helmet>

      {/* Hero */}
      <div className="pt-28 pb-14 bg-[#111827] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Shield size={22} className="text-white" />
            </div>
            <h1 className="font-heading text-white text-4xl sm:text-5xl">Privacy Policy</h1>
            <p className="text-white/50 text-sm mt-4">Last updated: June 2026</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>

          <Section title="1. Introduction">
            <p>Welcome to Candid Canvas BD ("we", "our", or "us"). We are a professional photography and cinematography studio based in Bogura, Bangladesh. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at <strong>candidcanvas.pro.bd</strong> or use our booking services.</p>
            <p>By using our website or services, you agree to the collection and use of information as described in this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account information:</strong> Name, email address, profile photo when you sign in with Google or create an account.</li>
              <li><strong>Booking information:</strong> Event type, event date, event location, package selected, phone number, and any additional notes you provide when placing a booking.</li>
              <li><strong>Contact messages:</strong> Messages you send through our contact form or dashboard messaging system.</li>
              <li><strong>Usage data:</strong> Anonymous visit counts and session data to help us improve the site. We do not use third-party tracking cookies.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Process and manage your photography/cinematography booking requests</li>
              <li>Contact you via phone, WhatsApp, or email to confirm bookings and discuss details</li>
              <li>Send booking status updates and notifications</li>
              <li>Respond to your messages and inquiries</li>
              <li>Improve our website and services based on usage patterns</li>
              <li>Send you discount rewards if you participate in our referral program</li>
            </ul>
            <p>We do not sell, trade, or rent your personal information to third parties.</p>
          </Section>

          <Section title="4. Data Storage & Security">
            <p>Your data is stored securely using <strong>Google Firebase Firestore</strong> — a cloud database hosted on Google's infrastructure with industry-standard encryption at rest and in transit.</p>
            <p>Account authentication is handled through <strong>Google Firebase Authentication</strong>. We do not store your passwords. Google Sign-In uses OAuth 2.0, and we only receive your name, email, and profile photo from Google.</p>
            <p>Photo uploads are stored via <strong>Cloudinary</strong>, a secure cloud media management platform.</p>
          </Section>

          <Section title="5. Cookies">
            <p>We use only essential cookies and browser session storage for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Keeping you signed in during your session</li>
              <li>Counting unique visits (stored anonymously with no personal identifiers)</li>
            </ul>
            <p>We do not use advertising cookies, cross-site tracking, or analytics platforms like Google Analytics that track your behavior across sites.</p>
          </Section>

          <Section title="6. Third-Party Services">
            <p>We use the following third-party services that may process some of your data:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Google Firebase</strong> — authentication and database (Google Privacy Policy applies)</li>
              <li><strong>Cloudinary</strong> — image/video hosting (Cloudinary Privacy Policy applies)</li>
              <li><strong>EmailJS</strong> — sending booking confirmation emails (no data is stored by them beyond delivery)</li>
            </ul>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Cancel a booking before it is approved</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:team.candidcanvas.bd@gmail.com" className="text-[#111827] underline">team.candidcanvas.bd@gmail.com</a>.</p>
          </Section>

          <Section title="8. Data Retention">
            <p>We retain booking and account data for as long as your account is active or as needed to provide services. Completed booking records may be kept for up to 3 years for business records. You may request deletion at any time.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating the "Last updated" date at the top of this page. Continued use of our services after changes constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] mt-2">
              <p><strong>Candid Canvas BD</strong></p>
              <p>Gohail Road, Bogura, Bangladesh</p>
              <p>Email: <a href="mailto:team.candidcanvas.bd@gmail.com" className="text-[#111827] underline">team.candidcanvas.bd@gmail.com</a></p>
              <p>Phone: <a href="tel:+8801849244610" className="text-[#111827] underline">+880 1849-244610</a></p>
            </div>
          </Section>

          <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex items-center gap-4">
            <Link to="/terms" className="text-sm text-[#6B7280] hover:text-[#111827] underline transition-colors">Terms of Service →</Link>
            <Link to="/" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">← Back to Home</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
