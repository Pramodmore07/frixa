import LandingPage from "./pages/LandingPage";

const APP_URL = import.meta.env.VITE_APP_URL || "https://app.frixa.in";

function App() {
  const handleGetStarted = () => {
    window.location.href = APP_URL;
  };

  return (
    <LandingPage onGetStarted={handleGetStarted} />
  );
}

export default App;
