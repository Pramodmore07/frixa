import { useState, useRef, useEffect } from "react";

/**
 * IOSDatePicker
 * A custom date picker with an iOS-inspired calendar popover.
 */
export function IOSDatePicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const popoverRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const date = value ? new Date(value) : new Date();
    const [viewDate, setViewDate] = useState(date);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)); };
    const handleNextMonth = (e) => { e.stopPropagation(); setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)); };

    const handleSelectDay = (day) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange({ target: { value: selected.toISOString().split("T")[0] } });
        setOpen(false);
    };

    const renderCalendar = () => {
        const month = viewDate.getMonth();
        const year = viewDate.getFullYear();
        const days = daysInMonth(month, year);
        const start = firstDayOfMonth(month, year);
        const cells = [];

        // empty cells for start of month
        for (let i = 0; i < start; i++) cells.push(<div key={`empty-${i}`} />);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const curSelected = value ? new Date(value) : null;
        if (curSelected) curSelected.setHours(0, 0, 0, 0);

        for (let i = 1; i <= days; i++) {
            const d = new Date(year, month, i);
            const isToday = d.getTime() === today.getTime();
            const isSelected = curSelected && d.getTime() === curSelected.getTime();
            cells.push(
                <div
                    key={i}
                    onClick={(e) => { e.stopPropagation(); handleSelectDay(i); }}
                    style={{
                        padding: "8px 0", textAlign: "center", borderRadius: "50%", cursor: "pointer", fontSize: 13, fontWeight: 500,
                        background: isSelected ? "#007AFF" : "transparent",
                        color: isSelected ? "#fff" : isToday ? "#007AFF" : "#111218",
                        transition: "background .15s",
                    }}
                    onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = "#F2F2F7")}
                    onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = "transparent")}
                >
                    {i}
                </div>
            );
        }
        return cells;
    };

    const displayValue = value ? new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Pick a date";

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    padding: "10px 14px", background: "#F4F5F7", border: "1.5px solid #E8EAED", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontSize: 14, color: value ? "#111218" : "#9CA3AF"
                }}
            >
                <span>{displayValue}</span>
                <span style={{ fontSize: 16 }}>🗓️</span>
            </div>

            {open && (
                <div ref={popoverRef} style={{
                    position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 1000,
                    background: "#fff", border: "1px solid #E8EAED", borderRadius: 20,
                    padding: 16, width: 260, boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                    animation: "pickerIn .2s cubic-bezier(.22,1,.36,1)"
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <button onClick={handlePrevMonth} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#007AFF", padding: 4 }}>‹</button>
                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
                        <button onClick={handleNextMonth} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 18, color: "#007AFF", padding: 4 }}>›</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                            <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>{d}</div>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                        {renderCalendar()}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes pickerIn { 
                    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}

/**
 * IOSTimePicker
 * A custom time picker with an iOS-inspired grid popover.
 */
export function IOSTimePicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleSelect = (h, m) => {
        const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        onChange({ target: { value: timeStr } });
        setOpen(false);
    };

    const displayValue = value ? value : "Set time";

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 15, 30, 45];

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <div
                onClick={() => setOpen(!open)}
                style={{
                    padding: "10px 14px", background: "#F4F5F7", border: "1.5px solid #E8EAED", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
                    fontFamily: "'Poppins',sans-serif", fontSize: 14, color: value ? "#111218" : "#9CA3AF"
                }}
            >
                <span>{displayValue}</span>
                <span style={{ fontSize: 16 }}>🕒</span>
            </div>

            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 1000,
                    background: "#fff", border: "1px solid #E8EAED", borderRadius: 20,
                    padding: 12, width: 220, boxShadow: "0 12px 40px rgba(0,0,0,.12)",
                    animation: "pickerIn .2s cubic-bezier(.22,1,.36,1)"
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: 10, paddingLeft: 6 }}>Select Time</div>
                    <div style={{ maxHeight: 200, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                        {hours.map(h => (
                            <div key={h} style={{ display: "contents" }}>
                                {minutes.map(m => {
                                    const t = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                                    const isSelected = value === t;
                                    return (
                                        <div
                                            key={`${h}-${m}`}
                                            onClick={(e) => { e.stopPropagation(); handleSelect(h, m); }}
                                            style={{
                                                padding: "6px 0", textAlign: "center", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                                background: isSelected ? "#007AFF" : "#F2F2F7",
                                                color: isSelected ? "#fff" : "#111218",
                                            }}
                                            onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = "#E5E5EA")}
                                            onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = "#F2F2F7")}
                                        >
                                            {t}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
