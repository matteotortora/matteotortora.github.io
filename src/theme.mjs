export function readThemePreference(storage, systemDark) {
    try {
        const theme = storage.getItem('theme');
        if (theme === 'light' || theme === 'dark') return theme;
        const legacy = storage.getItem('darkMode');
        if (legacy === 'true' || legacy === 'false') return legacy === 'true' ? 'dark' : 'light';
    } catch {}
    return systemDark ? 'dark' : 'light';
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute('content', theme === 'dark' ? '#17191f' : '#f8f8f8');
}

export function initializeTheme() {
    let storage;
    try { storage = window.localStorage; } catch {}
    const theme = readThemePreference(storage, window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(theme);
    return theme;
}

export function saveTheme(theme) {
    try {
        window.localStorage.setItem('theme', theme);
        window.localStorage.setItem('darkMode', String(theme === 'dark'));
    } catch {}
}

export function themeBootstrap() {
    return `(() => {${readThemePreference.toString()}\n${applyTheme.toString()}\n${initializeTheme.toString()}\ninitializeTheme();})();`;
}
