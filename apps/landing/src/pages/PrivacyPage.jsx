import PageLayout from "../components/PageLayout";

const sections = [
  {
    title: "1. Information we collect",
    body: `We collect information you provide directly to us when you create an account, invite team members, create tasks or ideas, and communicate with us. This includes your name, email address, and any content you add to Frixa.\n\nWe also collect certain technical information automatically when you use our services, including your IP address, browser type, operating system, referring URLs, and pages visited. We use cookies and similar tracking technologies to collect this information.`,
  },
  {
    title: "2. How we use your information",
    body: `We use the information we collect to provide, maintain, and improve Frixa; to process transactions and send related information; to send technical notices, updates, security alerts, and support messages; to respond to your comments, questions, and requests; and to monitor and analyse trends, usage, and activities in connection with our services.`,
  },
  {
    title: "3. Information sharing",
    body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with third-party vendors and service providers that perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, and customer service. These parties are only permitted to use your information to perform these tasks on our behalf.`,
  },
  {
    title: "4. Data retention",
    body: `We retain personal information for as long as your account is active or as needed to provide you with our services. If you delete your account, we will delete or anonymise your personal information within 30 days, unless we are required to retain it by law.`,
  },
  {
    title: "5. Security",
    body: `We take the security of your information seriously and use reasonable technical and organisational measures to protect it. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.`,
  },
  {
    title: "6. Your rights",
    body: `Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data; object to or restrict certain processing; and receive a copy of your data in a portable format. To exercise these rights, please contact us at privacy@frixa.in.`,
  },
  {
    title: "7. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of Frixa after any changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "8. Contact us",
    body: `If you have any questions about this Privacy Policy, please contact us at privacy@frixa.in or write to us at Frixa Inc., Bengaluru, Karnataka, India.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, color: "#111218", letterSpacing: "-1.5px", marginBottom: 12 }}>Privacy Policy</h1>
          <p style={{ fontSize: 14, color: "#9CA3AF" }}>Last updated: February 1, 2026</p>
        </div>

        <p style={{ fontSize: 15.5, color: "#4B5563", lineHeight: 1.8, marginBottom: 40 }}>
          At Frixa, your privacy is not an afterthought — it's core to how we operate. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
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
