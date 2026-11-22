// Mobile menu & navbar scroll
const nav = document.getElementById("nav");
const menuButton = document.getElementById("burger");
const primaryMenu = document.getElementById("primary-menu");
const navActions = menuButton.closest(".nav-actions");
const navSwitches = navActions.querySelector(".nav-switches");
const mobileNav = window.matchMedia("(max-width: 1024px)");
const background = document.querySelectorAll("main, footer");
const menuLabel = menuButton.getAttribute("aria-label");

function setMenuOpen(open) {
  if (Boolean(history.state?.orvaMobileMenuOpen) !== open) {
    history.replaceState({ ...history.state, orvaMobileMenuOpen: open }, "");
  }
  nav.classList.toggle("open", open);
  document.documentElement.classList.toggle("mobile-menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? orvaLanguage.message("Tutup menu", "Close menu") : menuLabel,
  );
  primaryMenu.inert = mobileNav.matches && !open;
  for (const section of background) section.inert = open;
  if (open) {
    primaryMenu.scrollTop = 0;
    const animations = primaryMenu.getAnimations?.() ?? [];
    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      const focus = document.activeElement;
      if (nav.classList.contains("open") && (focus === menuButton || focus === document.body)) {
        primaryMenu.querySelector("a")?.focus({ preventScroll: true });
      }
    });
  }
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("open"));
});

primaryMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

navActions.querySelector(".nav-cta").addEventListener("click", () => {
  if (nav.classList.contains("open")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

function syncNavigation() {
  if (navSwitches) {
    if (mobileNav.matches) {
      primaryMenu.append(navSwitches);
    } else {
      navActions.prepend(navSwitches);
    }
  }
  setMenuOpen(mobileNav.matches && Boolean(history.state?.orvaMobileMenuOpen));
}

mobileNav.addEventListener("change", syncNavigation);
syncNavigation();

function updateNavPosition() {
  nav.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateNavPosition, { passive: true });
updateNavPosition();

// Favorite hearts
for (const button of document.querySelectorAll(".heart")) {
  button.setAttribute("aria-pressed", String(button.classList.contains("on")));
  button.addEventListener("click", () => {
    button.setAttribute("aria-pressed", String(button.classList.toggle("on")));
  });
}

// Count up once when each About page statistic enters view.
(async () => {
  await siteContent.ready;
  const stats = document.querySelectorAll(".stats-grid .stat-num");
  if (!stats.length || !("IntersectionObserver" in window)) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches) return;

  const duration = 1000;
  const observer = new IntersectionObserver((entries) => {
    for (const { target: stat, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(stat);

      const finalText = stat.textContent.trim();
      const parts = finalText.match(/^(\d+)(\+?)$/);
      if (!parts || reducedMotion.matches) continue;

      const total = Number(parts[1]);
      const suffix = parts[2];
      let start;
      stat.textContent = `0${suffix}`;

      function tick(now) {
        start ??= now;
        const progress = Math.min((now - start) / duration, 1);
        if (progress === 1 || reducedMotion.matches) {
          stat.textContent = finalText;
          return;
        }

        const eased = 1 - (1 - progress) ** 3;
        stat.textContent = `${Math.floor(total * eased)}${suffix}`;
        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }
  });

  for (const stat of stats) observer.observe(stat);
})();
