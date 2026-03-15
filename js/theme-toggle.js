document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function updateToggles(theme) {
        toggles.forEach(btn => {
            const thumb = btn.querySelector('.toggle-thumb');
            if (thumb) {
                // Update emoji based on theme
                thumb.setAttribute('data-emoji', theme === 'dark' ? '☀️' : '🌙');
                btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            }
        });
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggles(theme);
    }

    // Initialize toggles state based on current attribute (set by inline script)
    const currentTheme = document.documentElement.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    updateToggles(currentTheme);

    // Click handler
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
             const current = document.documentElement.getAttribute('data-theme');
             setTheme(current === 'dark' ? 'light' : 'dark');
        });
    });

    // System preference listener
    systemDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});
