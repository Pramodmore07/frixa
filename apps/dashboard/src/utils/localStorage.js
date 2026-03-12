// Max size per key: 2MB — prevents localStorage bomb attacks
const MAX_BYTES = 2 * 1024 * 1024;

export const ls = {
    get: (key, fallback) => {
        try {
            const v = localStorage.getItem(key);
            if (!v) return fallback;
            const parsed = JSON.parse(v);
            // Guard against null/undefined parsed values
            return parsed ?? fallback;
        }
        catch { return fallback; }
    },
    set: (key, val) => {
        try {
            const str = JSON.stringify(val);
            if (str.length > MAX_BYTES) {
                console.warn(`[ls] Skipping write to "${key}": data exceeds ${MAX_BYTES / 1024}KB limit`);
                return;
            }
            localStorage.setItem(key, str);
        } catch { /* ignore quota errors */ }
    },
};
