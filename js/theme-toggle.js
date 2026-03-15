document.addEventListener('DOMContentLoaded', function() {
    const toggles = Array.from(document.querySelectorAll('.theme-toggle-btn'));
    const systemDark = (typeof window.matchMedia === 'function')
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : { matches: false };

    function updateToggles(theme) {
        toggles.forEach(btn => {
            const thumb = btn.querySelector('.toggle-thumb');
            const emoji = theme === 'dark' ? '☀️' : '🌙';
            if (thumb) {
                // Update data attribute (used by CSS)
                thumb.setAttribute('data-emoji', emoji);
            }
            btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            // Using role="switch" on the button, expose state with aria-checked only
            btn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        });
    }

    function getSavedTheme() {
        try {
            return window.localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function persistTheme(theme) {
        try {
            window.localStorage.setItem('theme', theme);
        } catch (e) {
            // Ignore storage errors; treat as non-persistent
        }
    }

    function setTheme(theme, persist = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) {
            persistTheme(theme);
        }
        updateToggles(theme);
    }

    // Prefer persisted theme, then existing attribute, then system preference
    const saved = getSavedTheme();
    const initial = saved || document.documentElement.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    // Apply initial theme to document (don't overwrite storage unless saved exists)
    document.documentElement.setAttribute('data-theme', initial);
    updateToggles(initial);

    // Click handler toggles and persists choice
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next, true);
        });
    });

    // System preference listener with compatibility for older browsers
    const onPrefChange = (e) => {
        if (!getSavedTheme()) {
            setTheme(e.matches ? 'dark' : 'light', false);
        }
    };
    // Helper: attach a listener to a MediaQueryList with backwards compatibility
    function addMQLListener(mql, cb) {
        if (!mql) return;
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', cb);
        } else if (typeof mql.addListener === 'function') {
            mql.addListener(cb);
        }
    }

    addMQLListener(systemDark, onPrefChange);
});
