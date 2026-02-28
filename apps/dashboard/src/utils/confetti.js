export function spawnConfetti() {
    const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#F97316"];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement("div");
        const size = 5 + Math.random() * 9;
        el.style.cssText = [
            "position:fixed", `left:${Math.random() * 100}vw`, "top:-12px",
            `background:${colors[Math.floor(Math.random() * colors.length)]}`,
            `width:${size}px`, `height:${size}px`,
            `border-radius:${Math.random() > .5 ? "50%" : "3px"}`,
            "pointer-events:none", "z-index:9999",
            `animation:confettiDrop ${1.4 + Math.random() * 2}s ${Math.random() * .6}s linear forwards`,
        ].join(";");
        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
    }
}
