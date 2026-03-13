import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.jsx";

// Global Error Handler to catch runtime errors that cause blank screen
window.onerror = function (message, source, lineno, colno, error) {
  if (import.meta.env.DEV) {
    console.error("Global Error:", { message, source, lineno, colno, error });
  }
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  // Build DOM safely — never use innerHTML with dynamic content to prevent XSS
  rootElement.textContent = "";

  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    background: "#fff", color: "#ef4444", padding: "40px",
    fontFamily: "sans-serif", minHeight: "100vh", display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center",
  });

  const heading = document.createElement("h1");
  heading.style.marginBottom = "16px";
  heading.textContent = "Application Error";

  const para = document.createElement("p");
  Object.assign(para.style, { color: "#6b7280", maxWidth: "500px", lineHeight: "1.6", marginBottom: "24px" });
  para.textContent = "Something went wrong. Please reload the page or contact support if the problem persists.";

  const btn = document.createElement("button");
  Object.assign(btn.style, {
    marginTop: "8px", padding: "12px 24px", background: "#111218",
    color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer",
  });
  btn.textContent = "Reload Application";
  btn.addEventListener("click", () => window.location.reload());

  wrapper.appendChild(heading);
  wrapper.appendChild(para);

  if (import.meta.env.DEV) {
    const details = document.createElement("div");
    Object.assign(details.style, {
      background: "#f3f4f6", padding: "16px", borderRadius: "8px",
      textAlign: "left", fontSize: "12px", width: "100%", maxWidth: "600px",
      overflow: "auto", marginBottom: "24px",
    });
    const code = document.createElement("code");
    code.textContent = String(message).slice(0, 200);
    const hint = document.createElement("code");
    Object.assign(hint.style, { color: "#9ca3af", marginTop: "8px", display: "block" });
    hint.textContent = "Check browser console for details";
    details.appendChild(code);
    details.appendChild(document.createElement("br"));
    details.appendChild(hint);
    wrapper.appendChild(details);
  }

  wrapper.appendChild(btn);
  rootElement.appendChild(wrapper);
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
