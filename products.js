const primaryTabs = document.querySelectorAll(".tab-button");
const subTabs = document.querySelectorAll(".chip");
const cards = document.querySelectorAll(".product-card");
const resultCount = document.querySelector("#resultCount");
const sortButtons = document.querySelectorAll(".sort-button");
const grid = document.querySelector("#catalogGrid");
const menuToggle = document.querySelector(".catalog-menu-toggle");
const navOverlay = document.querySelector(".catalog-nav-overlay");
const navItems = document.querySelectorAll(".catalog-nav-item");

let activeCategory = "all";
let activeSub = "all";
let activeSort = "default";

function sortCards(visibleCards) {
  if (!grid) return;

  const sorted = [...visibleCards];
  if (activeSort === "scene") {
    sorted.sort((a, b) => {
      const aScene = a.dataset.sub.includes("hotel") ? 1 : 0;
      const bScene = b.dataset.sub.includes("hotel") ? 1 : 0;
      return bScene - aScene || Number(a.dataset.order) - Number(b.dataset.order);
    });
  } else {
    sorted.sort((a, b) => Number(a.dataset.order) - Number(b.dataset.order));
  }

  sorted.forEach((card) => grid.appendChild(card));
}

function applyFilters() {
  const visibleCards = [];

  cards.forEach((card) => {
    const category = card.dataset.category;
    const sub = card.dataset.sub || "";
    const categoryMatch = activeCategory === "all" || category === activeCategory;
    const subMatch = activeSub === "all" || sub.includes(activeSub);
    const visible = categoryMatch && subMatch;

    card.classList.toggle("is-hidden", !visible);
    if (visible) visibleCards.push(card);
  });

  if (resultCount) resultCount.textContent = String(visibleCards.length);
  sortCards(visibleCards);
}

primaryTabs.forEach((button) => {
  button.addEventListener("click", () => {
    primaryTabs.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeCategory = button.dataset.filter;
    applyFilters();
  });
});

subTabs.forEach((button) => {
  button.addEventListener("click", () => {
    subTabs.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeSub = button.dataset.sub;
    applyFilters();
  });
});

sortButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sortButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    activeSort = button.dataset.sort;
    applyFilters();
  });
});

function initMobileMenu() {
  if (!menuToggle || !navOverlay || !navItems.length) return;

  let isOpen = false;
  gsap.set(navOverlay, { clipPath: "inset(0% 0% 100% 0%)", display: "flex" });

  const openTl = gsap.timeline({ paused: true })
    .to(navOverlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power4.inOut" })
    .from(navItems, { y: 64, opacity: 0, stagger: 0.07, duration: 0.5, ease: "power3.out" }, "-=0.25");

  function closeMenu() {
    isOpen = false;
    menuToggle.setAttribute("aria-expanded", "false");
    navOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    openTl.reverse();
  }

  menuToggle.addEventListener("click", () => {
    isOpen = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    navOverlay.setAttribute("aria-hidden", String(!isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
    isOpen ? openTl.play() : openTl.reverse();
  });

  navItems.forEach((item) => item.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) closeMenu();
  });
}

if (window.gsap) {
  initMobileMenu();
}

applyFilters();
