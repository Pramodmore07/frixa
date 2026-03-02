import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChangelogPage from "./pages/ChangelogPage";
import RoadmapPage from "./pages/RoadmapPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import SecurityPage from "./pages/SecurityPage";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.frixa.in";

function App() {
  const handleGetStarted = () => {
    window.location.href = APP_URL;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onGetStarted={handleGetStarted} />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/security" element={<SecurityPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
