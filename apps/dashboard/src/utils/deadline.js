import { MONTHS } from "../constants";

export const p2 = (n) => String(n).padStart(2, "0");

export function dlDiff(date, time) {
    if (!date) return null;
    const nd = new Date(); nd.setHours(0, 0, 0, 0);
    const dl = new Date(date + (time ? "T" + time : "T23:59"));
    const dd = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate());
    return Math.floor((dd - nd) / 86400000);
}

export function dlStatus(date, time) {
    const diff = dlDiff(date, time);
    if (diff === null) return "none";
    if (diff > 2) return "green";
    if (diff >= 0) return "orange";
    return "red";
}

export function dlBadge(date, time) {
    const diff = dlDiff(date, time);
    if (diff === null) return null;
    const dl = new Date(date + (time ? "T" + time : "T23:59"));
    const lbl = `${MONTHS[dl.getMonth()]} ${dl.getDate()}${time ? " · " + time : ""}`;
    if (diff > 2) return { type: "green", text: lbl };
    if (diff === 1) return { type: "orange", text: "Tomorrow" };
    if (diff === 0) return { type: "orange", text: "Today" };
    return { type: "red", text: "Overdue · " + lbl };
}

export const DL_BADGE_STYLE = {
    green: { bg: "rgba(5,150,105,.1)", fg: "#059669" },
    orange: { bg: "rgba(217,119,6,.1)", fg: "#D97706" },
    red: { bg: "rgba(220,38,38,.1)", fg: "#DC2626" },
};

export const DL_BORDER_COLOR = { green: "#059669", orange: "#D97706", red: "#DC2626" };
