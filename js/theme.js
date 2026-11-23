(() => {
  const storageKey = "orva-theme";
  const root = document.documentElement;
  let savedTheme;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // The theme can still be changed for this page when storage is unavailable.
  }

  root.dataset.theme = savedTheme === "light" ? "light" : "dark";

  // Recolor the dark lettering of the bundled PNG while retaining its alpha.
  function installLogoFilter() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;pointer-events:none";
    svg.innerHTML = `
      <filter id="orva-white-logo" color-interpolation-filters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" result="whiteLettering"
          values="0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                 -5 0 2 0 1"/>
        <feComposite in="whiteLettering" in2="SourceGraphic" operator="atop"/>
      </filter>`;
    document.body.append(svg);
  }

  document.addEventListener("DOMContentLoaded", () => {
    installLogoFilter();
    const toggle = document.querySelector(".theme-toggle");
    const buttons = toggle.querySelectorAll("[data-theme-choice]");

    function updateButtons() {
      for (const button of buttons) {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === root.dataset.theme));
      }
    }

    for (const button of buttons) {
      button.addEventListener("click", () => {
        root.dataset.theme = button.dataset.themeChoice;
        updateButtons();
        try {
          localStorage.setItem(storageKey, root.dataset.theme);
        } catch {
          // Storage can be unavailable in private or restricted contexts.
        }
      });
    }

    window.addEventListener("storage", (event) => {
      if (event.key !== storageKey && event.key !== null) return;
      root.dataset.theme = event.newValue === "light" ? "light" : "dark";
      updateButtons();
    });

    updateButtons();
    toggle.hidden = false;
  });
})();
