gsap.registerPlugin(ScrollTrigger);

function initHeroEntrance(containerSelector, itemSelector) {
  gsap.from(itemSelector || `${containerSelector} > *`, {
    y: 32,
    opacity: 0,
    filter: "blur(6px)",
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    clearProps: "filter",
  });
}

function initLineReveal(headingSelector) {
  const headings = document.querySelectorAll(headingSelector);
  headings.forEach((heading) => {
    const lines = heading.querySelectorAll(".line-inner");
    gsap.from(lines, {
      y: "110%",
      duration: 0.85,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: heading,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initParallax(layers) {
  layers.forEach(({ selector, speed }) => {
    gsap.to(selector, {
      y: () => window.innerHeight * (speed - 1) * -0.4,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: speed,
      },
    });
  });
}

function initBlastMenu(triggerSelector, overlaySelector, itemSelector) {
  const trigger = document.querySelector(triggerSelector);
  const overlay = document.querySelector(overlaySelector);
  const items = document.querySelectorAll(itemSelector);
  if (!trigger || !overlay || !items.length) return;

  let isOpen = false;
  gsap.set(overlay, { clipPath: "inset(0% 0% 100% 0%)", display: "flex" });

  const openTl = gsap.timeline({ paused: true })
    .to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.inOut" })
    .from(items, { y: 64, opacity: 0, stagger: 0.07, duration: 0.5, ease: "power3.out" }, "-=0.25");

  function closeMenu() {
    isOpen = false;
    trigger.setAttribute("aria-expanded", "false");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openTl.reverse();
  }

  trigger.addEventListener("click", () => {
    isOpen = !isOpen;
    trigger.setAttribute("aria-expanded", String(isOpen));
    overlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
    isOpen ? openTl.play() : openTl.reverse();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });

  items.forEach((item) => item.addEventListener("click", () => {
    if (isOpen) closeMenu();
  }));
}

function initShowcaseReveal() {
  gsap.utils.toArray(".js-showcase-item, .pricing-card, .case-card, .faq-item, .cta__panel").forEach((element) => {
    gsap.from(element, {
      y: 42,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  });
}

function initSideRail() {
  const links = Array.from(document.querySelectorAll(".side-nav__link"));
  const sections = Array.from(document.querySelectorAll("[data-nav]"));
  const progress = document.querySelector(".side-nav__progress-line");
  if (!links.length || !sections.length || !progress) return;

  function setActiveNavItem(label) {
    const index = links.findIndex((link) => link.textContent.trim() === label);
    if (index === -1) return;
    links.forEach((link, i) => link.classList.toggle("is-active", i === index));
    const scale = Math.max((index + 1) / links.length, 0.12);
    gsap.to(progress, { scaleY: scale, duration: 0.35, ease: "power2.out" });
  }

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveNavItem(section.dataset.nav),
      onEnterBack: () => setActiveNavItem(section.dataset.nav),
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeroEntrance(".hero__content", ".js-hero-item");
  initParallax([
    { selector: ".hero__parallax-slow", speed: 0.65 },
    { selector: ".hero__parallax-fast", speed: 1.15 },
  ]);
  initLineReveal(".section-heading");
  initBlastMenu(".menu-toggle", ".nav-overlay", ".nav-item");
  initShowcaseReveal();
  initSideRail();

  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });
});
