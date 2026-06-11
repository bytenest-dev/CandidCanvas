import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-heading text-xl text-[#111827] mb-3">{title}</h2>
      <div className="text-[#374151] text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Candid Canvas BD</title>
        <meta name="description" content="Terms of Service for Candid Canvas BD — the rules and conditions for using our photography and booking services." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.candidcanvas.pro.bd/terms" />
      </Helmet>

      {/* Hero */}
      <div className="pt-28 pb-14 bg-[#111827] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText size={22} className="text-white" />
            </div>
            <h1 className="font-heading text-white text-4xl sm:text-5xl">Terms of Service</h1>
            <p className="text-white/50 text-sm mt-4">Last updated: June 2026</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>

          <Section title="1. Agreement to Terms">
            <p>By accessing our website at <strong>candidcanvas.pro.bd</strong> or submitting a booking request, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
          </Section>

          <Section title="2. Services">
            <p>Candid Canvas BD provides professional photography and cinematography services in Bangladesh, including but not limited to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Wedding photography and cinematography</li>
              <li>Birthday and event photography</li>
              <li>Corporate event photography</li>
              <li>Social media reels production</li>
              <li>Pre-wedding and outdoor portrait sessions</li>
            </ul>
            <p>Services are subject to availability and confirmation by our team after booking submission.</p>
          </Section>

          <Section title="3. Booking & Confirmation">
            <p>Submitting a booking through our website is a <strong>request</strong>, not a confirmed reservation. A booking is only confirmed when:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Our team reviews and approves your request</li>
              <li>You receive an approval notification via email or WhatsApp</li>
              <li>Any required advance payment or token is settled as agreed</li>
            </ul>
            <p>We reserve the right to decline any booking at our discretion.</p>
          </Section>

          <Section title="4. Cancellation Policy">
            <p><strong>Client cancellations:</strong></p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You may cancel a booking that is in <em>Submitted</em> or <em>Under Review</em> status directly from your dashboard at no charge.</li>
              <li>Once a booking is <em>Approved</em>, cancellations must be requested by contacting us directly. Cancellation fees may apply depending on proximity to the event date.</li>
              <li>Cancellations within 7 days of the event date may result in forfeiture of any advance payment made.</li>
            </ul>
            <p><strong>Our cancellations:</strong> In the unlikely event we must cancel due to an emergency or unavailability, we will notify you as soon as possible and offer a full refund of any advance payment or an alternative date.</p>
          </Section>

          <Section title="5. Payment Terms">
            <p>Payment arrangements will be discussed and agreed upon during the confirmation process. General terms:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>An advance payment (token) may be required to hold your date</li>
              <li>Remaining balance is due on or before the event date unless otherwise agreed</li>
              <li>Payment methods: Cash, bKash, Nagad, or bank transfer</li>
              <li>All prices are in Bangladeshi Taka (BDT)</li>
            </ul>
          </Section>

          <Section title="6. Deliverables & Timeline">
            <p>Delivery timelines for edited photos and videos will be communicated at the time of booking confirmation. Standard timelines:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Edited photos:</strong> 7–21 working days depending on package</li>
              <li><strong>Cinematic video:</strong> 14–30 working days depending on package</li>
              <li><strong>Social media reels:</strong> 5–10 working days</li>
            </ul>
            <p>Rush delivery may be available for an additional fee. All timelines are estimates and may vary based on complexity and volume.</p>
          </Section>

          <Section title="7. Usage Rights & Copyright">
            <p>Candid Canvas BD retains copyright of all photographs and videos taken. You are granted a <strong>personal, non-commercial license</strong> to use the delivered content for personal purposes including sharing on social media.</p>
            <p>We may use photographs and videos from your event for our portfolio, website, and social media promotions. If you prefer complete privacy, please inform us in writing before your event and we will honor that request.</p>
            <p>You may not resell, license, or use the content for commercial purposes without our written consent.</p>
          </Section>

          <Section title="8. Client Responsibilities">
            <p>To ensure the best results, clients agree to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide accurate event details at time of booking</li>
              <li>Ensure our team has safe and reasonable access to the event venue</li>
              <li>Inform us of any specific shots or requirements in advance</li>
              <li>Not engage other photographers/videographers for the same event without informing us</li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>While we take every precaution to deliver exceptional results, Candid Canvas BD shall not be held liable for:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Equipment failure beyond our control</li>
              <li>Adverse weather or venue conditions affecting shot quality</li>
              <li>Loss of data due to unforeseen technical failures (we maintain backups but cannot guarantee against catastrophic failure)</li>
              <li>Any indirect, consequential, or incidental damages</li>
            </ul>
            <p>Our total liability in any case shall not exceed the amount paid for the specific service.</p>
          </Section>

          <Section title="10. Referral Program">
            <p>Our referral program allows clients to earn discount codes by referring friends who book our services. Terms:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Referral rewards are only issued after the referred booking is approved by our team</li>
              <li>Discount codes are valid for 3 months from date of issue and may only be used once</li>
              <li>Referral codes cannot be combined with other promotional offers</li>
              <li>We reserve the right to modify or terminate the referral program at any time</li>
            </ul>
          </Section>

          <Section title="11. Promo Codes">
            <p>Promotional codes are subject to their stated validity dates and usage limits. Codes cannot be transferred, exchanged for cash, or applied retroactively to completed bookings.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These Terms are governed by and construed in accordance with the laws of Bangladesh. Any disputes shall be resolved through good-faith negotiation. If unresolved, disputes shall be subject to the jurisdiction of courts in Bogura, Rajshahi Division, Bangladesh.</p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>We reserve the right to update these Terms at any time. Changes take effect upon posting to the website. Continued use of our services after changes constitutes acceptance of the new terms.</p>
          </Section>

          <Section title="14. Contact">
            <p>For questions about these Terms, contact us:</p>
            <div className="bg-[#F8F9FA] rounded-xl p-4 border border-[#E5E7EB] mt-2">
              <p><strong>Candid Canvas BD</strong></p>
              <p>Gohail Road, Bogura, Bangladesh</p>
              <p>Email: <a href="mailto:team.candidcanvas.bd@gmail.com" className="text-[#111827] underline">team.candidcanvas.bd@gmail.com</a></p>
              <p>Phone: <a href="tel:+8801849244610" className="text-[#111827] underline">+880 1849-244610</a></p>
            </div>
          </Section>

          <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex items-center gap-4">
            <Link to="/privacy" className="text-sm text-[#6B7280] hover:text-[#111827] underline transition-colors">Privacy Policy →</Link>
            <Link to="/" className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">← Back to Home</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
