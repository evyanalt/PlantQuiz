// I'm lazy and don't want to add any more comments
// Also 90% of the time i don't even know what i'm doing myself
// One thing i do know is that this adds a correct mobile navigation bar
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
