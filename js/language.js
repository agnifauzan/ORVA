const orvaLanguage = (() => {
  const root = document.documentElement;
  const storageKey = "orva-language";
  const pageURL = new URL(location.href);
  const requested = pageURL.searchParams.get("lang");

  function savedLanguage() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  const language = (requested ?? savedLanguage()) === "en" ? "en" : "id";
  const locale = language === "en" ? "en-US" : "id-ID";
  const dictionary = new Map(
    orvaTranslations.map(([source, english, indonesian]) => [
      source,
      language === "en" ? english : indonesian,
    ]),
  );
  root.lang = language;

  function message(indonesian, english) {
    return language === "en" ? english : indonesian;
  }

  function text(source) {
    if (typeof source !== "string") return source;
    return dictionary.get(source.trim().replace(/\s+/g, " ")) ?? source;
  }

  function place(source) {
    return source ? source.split(",").map((part) => text(part.trim())).join(", ") : source;
  }

  function translateTree(scope) {
    const walker = document.createTreeWalker(
      scope,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches("script, style, svg, noscript")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeType === Node.TEXT_NODE) {
        const translated = text(node.data);
        if (translated !== node.data) {
          const start = node.data.match(/^\s*/)[0];
          const end = node.data.match(/\s*$/)[0];
          node.data = start + translated + end;
        }
        continue;
      }
      if (node instanceof HTMLTemplateElement) translateTree(node.content);
      const attributes = ["aria-label", "placeholder", "title", "alt"];
      if (node.matches('meta[name="description"]')) attributes.push("content");
      for (const attribute of attributes) {
        if (node.hasAttribute(attribute)) {
          node.setAttribute(attribute, text(node.getAttribute(attribute)));
        }
      }
    }
  }

  function selectLanguage(value) {
    if (value === language) return;
    try {
      localStorage.setItem(storageKey, value);
      pageURL.searchParams.delete("lang");
    } catch {
      pageURL.searchParams.set("lang", value);
    }
    if (pageURL.href !== location.href) history.replaceState(history.state, "", pageURL);
    location.reload();
  }

  translateTree(document);
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    const group = document.createElement("div");
    group.className = "language-toggle";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", text("Bahasa tampilan"));
    for (const [code, label, name] of [
      ["id", "ID", "Bahasa Indonesia"],
      ["en", "ENG", "English"],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.lang = code;
      button.textContent = label;
      button.setAttribute("aria-label", name);
      button.setAttribute("aria-pressed", String(code === language));
      button.addEventListener("click", () => selectLanguage(code));
      group.append(button);
    }
    const switches = document.createElement("div");
    switches.className = "nav-switches";
    themeToggle.before(switches);
    switches.append(themeToggle, group);
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && !requested && (savedLanguage() === "en" ? "en" : "id") !== language) {
      location.reload();
    }
  });

  return { locale, message, text, place, translateTree };
})();
