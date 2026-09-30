document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.mobile-nav-toggle').forEach((toggle) => {
        const navbar = toggle.closest('.navbar');
        const links = navbar?.querySelector('.nav-links');

        if (!navbar || !links) {
            return;
        }

        const closeMenu = () => {
            navbar.classList.remove('menu-open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('menu-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });

        links.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    });
});
