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

        const drawer = document.createElement('mdui-navigation-drawer');
        drawer.className = 'mobile-navigation-drawer';
        drawer.id = 'mobile-navigation-drawer';
        drawer.setAttribute('modal', '');
        drawer.setAttribute('close-on-esc', '');
        drawer.setAttribute('close-on-overlay-click', '');
        drawer.setAttribute('aria-label', 'Navigatie');
        toggle.setAttribute('aria-controls', drawer.id);

        const header = document.createElement('div');
        header.className = 'mobile-drawer-header';

        const title = document.createElement('h2');
        title.textContent = 'Navigatie';

        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-drawer-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Menu sluiten');
        const closeIcon = document.createElement('span');
        closeIcon.className = 'material-symbols-outlined';
        closeIcon.setAttribute('aria-hidden', 'true');
        closeIcon.textContent = 'close';
        closeButton.append(closeIcon);
        header.append(title, closeButton);

        const navigation = document.createElement('nav');
        navigation.className = 'mobile-drawer-links';
        navigation.setAttribute('aria-label', 'Hoofdnavigatie');

        links.querySelectorAll('a.navbar-icon-control').forEach((link) => {
            const drawerLink = document.createElement('a');
            drawerLink.className = 'mobile-drawer-link';
            drawerLink.href = link.href;
            if (link.target) drawerLink.target = link.target;
            if (link.rel) drawerLink.rel = link.rel;

            const icon = link.querySelector('.material-symbols-outlined');
            if (icon) {
                const drawerIcon = document.createElement('span');
                drawerIcon.className = 'material-symbols-outlined';
                drawerIcon.setAttribute('aria-hidden', 'true');
                drawerIcon.textContent = icon.textContent.trim();
                drawerLink.append(drawerIcon);
            }

            const label = document.createElement('span');
            label.textContent = link.closest('mdui-tooltip')?.getAttribute('content')
                || (link.classList.contains('location-control') ? 'Locatie' : link.getAttribute('aria-label'));
            drawerLink.append(label);
            navigation.append(drawerLink);
        });

        drawer.append(header, navigation);
        navbar.append(drawer);

        const syncExpandedState = (isOpen) => {
            toggle.setAttribute('aria-expanded', String(isOpen));
        };

        toggle.addEventListener('click', () => {
            drawer.open = true;
        });
        closeButton.addEventListener('click', () => {
            drawer.open = false;
        });
        navigation.addEventListener('click', (event) => {
            if (event.target.closest('a')) drawer.open = false;
        });
        drawer.addEventListener('open', () => syncExpandedState(true));
        drawer.addEventListener('close', () => syncExpandedState(false));

        window.matchMedia('(min-width: 801px)').addEventListener('change', (event) => {
            if (event.matches) drawer.open = false;
        });
    });
});
