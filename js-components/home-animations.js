const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const heroItems = document.querySelectorAll(
    ".home-hero-copy, .home-visual-hero"
);

heroItems.forEach((element, index) => {
    element.classList.add("home-load-in");
    element.style.setProperty("--home-delay", `${index * 140}ms`);
});

const revealItems = document.querySelectorAll(
    ".home-section > .home-section-copy, .home-section > .home-visual"
);

revealItems.forEach((element) => {
    element.classList.add("home-reveal");
});

document.body.classList.add("home-motion-ready");

if (!prefersReducedMotion && "IntersectionObserver" in window) {
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
} else {
    revealItems.forEach((element) => element.classList.add("is-visible"));
}