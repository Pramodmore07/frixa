import PageLayout from "../components/PageLayout";

const sections = [
  {
    title: "1. Acceptance of terms",
    body: `By accessing or using Frixa, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including individual subscribers, team members, and administrators.`,
  },
  {
    title: "2. Description of service",
    body: `Frixa provides a collaborative workspace platform including roadmap management, idea boards, task tracking, and real-time team collaboration features. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time with reasonable notice.`,
  },
  {
    title: "3. Account registration",
    body: `To use Frixa, you must create an account with a valid email address. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorised use of your account.`,
  },
  {
    title: "4. Acceptable use",
    body: `You agree to use Frixa only for lawful purposes and in accordance with these Terms. You must not use our services to transmit any material that is unlawful, harmful, threatening, abusive, or otherwise objectionable; to infringe any intellectual property rights; to distribute spam or unsolicited communications; or to interfere with the proper working of our services.`,
  },
  {
    title: "5. Intellectual property",
    body: `Frixa and its original content, features, and functionality are owned by Frixa Inc. and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of all content you create within Frixa. By using our services, you grant us a limited licence to store and process your content solely to provide the service.`,
  },
  {
    title: "6. Billing and payments",
    body: `Paid plans are billed monthly or annually in advance. All fees are non-refundable except as required by applicable law. We reserve the right to change our pricing with 30 days' notice. If you cancel, you will retain access to paid features until the end of your billing period.`,
  },
  {
    title: "7. Termination",
    body: `We may terminate or suspend your account immediately, without prior notice, if you breach these Terms. Upon termination, your right to use our services will immediately cease. All provisions that by their nature should survive termination shall survive, including ownership provisions, disclaimers, and limitations of liability.`,
  },
  {
    title: "8. Limitation of liability",
    body: `To the fullest extent permitted by law, Frixa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability to you for any claims shall not exceed the amount you paid to us in the 12 months preceding the claim.`,
  },
  {
    title: "9. Governing law",
    body: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka, India.`,
  },
  {
    title: "10. Contact",
    body: `For questions about these Terms, contact us at legal@frixa.in or write to Frixa Inc., Bengaluru, Karnataka, India.`,
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Terms of Service</h1>
          <p style={{ fontSize: 14, color: "#9CA3AF" }}>Last updated: February 1, 2026</p>
        </div>

        <p style={{ fontSize: 15.5, color: "#4B5563", lineHeight: 1.8, marginBottom: 40 }}>
          Please read these Terms of Service carefully before using Frixa. They constitute a binding legal agreement between you and Frixa Inc.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {sections.map(s => (
            <div key={s.title}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111218", marginBottom: 12 }}>{s.title}</h2>
              {s.body.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: 14.5, color: "#4B5563", lineHeight: 1.8, marginBottom: 12 }}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
