document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canRepel = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion;
    const icon = document.body.dataset.leafIcon || 'eco';
    const background = document.createElement('div');
    background.className = 'leaf-background';
    background.setAttribute('aria-hidden', 'true');
    document.body.prepend(background);

    const spacing = 190;
    const leaves = [];

    const createLeaves = () => {
        background.replaceChildren();
        leaves.length = 0;

        const columns = Math.ceil(window.innerWidth / spacing) + 1;
        const rows = Math.ceil(window.innerHeight / spacing) + 1;

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const leaf = document.createElement('span');
                const startAngle = Math.round(Math.random() * 70 - 35);
                leaf.className = 'material-symbols-outlined leaf-background-icon';
                leaf.textContent = icon;
                leaf.style.left = `${column * spacing + Math.random() * 70 - 35}px`;
                leaf.style.top = `${row * spacing + Math.random() * 70 - 35}px`;
                leaf.style.setProperty('--leaf-start', `${startAngle}deg`);
                leaf.style.setProperty('--sway-duration', `${11 + Math.random() * 7}s`);
                leaf.style.setProperty('--sway-delay', `${Math.random() * -12}s`);
                background.append(leaf);
                leaves.push(leaf);
            }
        }
    };

    createLeaves();
    window.addEventListener('resize', createLeaves, { passive: true });

    if (!canRepel) return;

    let animationFrame = 0;
    const resetLeaves = () => {
        leaves.forEach((leaf) => {
            leaf.style.setProperty('--repel-x', '0px');
            leaf.style.setProperty('--repel-y', '0px');
        });
    };

    document.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
            const radius = 125;

            leaves.forEach((leaf) => {
                const deltaX = leaf.offsetLeft - event.clientX;
                const deltaY = leaf.offsetTop - event.clientY;
                const distance = Math.hypot(deltaX, deltaY);

                if (distance >= radius || distance === 0) {
                    leaf.style.setProperty('--repel-x', '0px');
                    leaf.style.setProperty('--repel-y', '0px');
                    return;
                }

                const strength = ((radius - distance) / radius) * 13;
                leaf.style.setProperty('--repel-x', `${(deltaX / distance) * strength}px`);
                leaf.style.setProperty('--repel-y', `${(deltaY / distance) * strength}px`);
            });
        });
    }, { passive: true });

    document.addEventListener('pointerleave', resetLeaves);
});
