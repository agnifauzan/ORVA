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

  document.addEventListener("DOMContentLoaded", () => {
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
