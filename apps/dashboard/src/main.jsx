import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";

// Global Error Handler to catch runtime errors that cause blank screen
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global Error:", { message, source, lineno, colno, error });
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="background:#fff; color:#ef4444; padding:40px; font-family:sans-serif; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
        <h1 style="margin-bottom:16px;">Application Error</h1>
        <p style="color:#6b7280; max-width:500px; line-height:1.6; margin-bottom:24px;">
          Something went wrong while starting the dashboard. Check the browser console for more details.
        </p>
        <div style="background:#f3f4f6; padding:16px; border-radius:8px; text-align:left; font-size:12px; width:100%; max-width:600px; overflow:auto;">
          <code>${message}</code><br/>
          <code style="color:#9ca3af; margin-top:8px; display:block;">at ${source}:${lineno}:${colno}</code>
        </div>
        <button onclick="window.location.reload()" style="margin-top:32px; padding:12px 24px; background:#111218; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer;">
          Reload Application
        </button>
      </div>
    `;
  }
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
