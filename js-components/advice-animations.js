const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const revealItems = document.querySelectorAll(
    ".advice-heading, .advice-section, .advice-credits"
);

if (!prefersReducedMotion && "IntersectionObserver" in window) {
    revealItems.forEach((element) => {
        element.classList.add("advice-reveal");
    });
    document.body.classList.add("advice-motion-ready");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealItems.forEach((element) => observer.observe(element));
}
