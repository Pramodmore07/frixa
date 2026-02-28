import LandingPage from "./pages/LandingPage";

function App() {
  const handleGetStarted = () => {
    // In a real monorepo with custom domains, this would point to dashboard.frixa.com
    // For local development, we'll assume the dashboard runs on port 5174
    window.location.href = "http://localhost:5174";
  };

  return (
    <LandingPage onGetStarted={handleGetStarted} />
  );
}

export default App;
