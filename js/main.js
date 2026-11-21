// Mobile menu & navbar scroll
const nav = document.getElementById("nav");
const menuButton = document.getElementById("burger");
const primaryMenu = document.getElementById("primary-menu");

function setMenuOpen(open) {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("open"));
});

primaryMenu.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    setMenuOpen(false);
    menuButton.focus();
  }
});

window.matchMedia("(max-width: 1024px)").addEventListener("change", () => {
  setMenuOpen(false);
});

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
(() => {
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
