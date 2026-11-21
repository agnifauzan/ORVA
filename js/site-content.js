const siteContent = (() => {
  const linkProtocols = ["http:", "https:", "mailto:", "tel:"];

  function text(element, value) {
    if (!element || typeof value !== "string") return;
    const nodes = [...element.childNodes].filter(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim(),
    );
    if (nodes.length) {
      nodes[0].textContent = value;
      nodes.slice(1).forEach((node) => node.remove());
    } else {
      element.prepend(value);
    }
  }

  function formatted(element, value, emphasis = "em") {
    element.replaceChildren();
    value.split("\n").forEach((line, index) => {
      if (index) element.append(document.createElement("br"));
      line.split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
        if (!part.startsWith("**") || !part.endsWith("**")) {
          element.append(part);
          return;
        }
        const mark = document.createElement(emphasis === "gold" ? "span" : "em");
        if (emphasis === "gold") mark.className = "gold";
        mark.textContent = part.slice(2, -2);
        element.append(mark);
      });
    });
  }

  function link(element, value) {
    if (!element || !value) return;
    const url = cmsApi.safeURL(value.href, document.baseURI, linkProtocols);
    if (url) element.href = url;
    text(element, value.label);
  }

  function image(element, value) {
    const photo = cmsApi.media(value);
    if (!element || !photo) return;
    const decorative = element.getAttribute("alt") === "";
    element.src = photo.src;
    if (!decorative) element.alt = photo.alt;
  }

  const bindings = {
    text(element, value) {
      text(element, value);
      const radio = element.closest(".purpose-option")?.querySelector('input[type="radio"]');
      if (radio && typeof value === "string") radio.value = value;
    },
    formatted(element, value) {
      if (typeof value === "string") formatted(element, value, element.dataset.cmsEmphasis);
    },
    href(element, value) {
      const url = cmsApi.safeURL(value, document.baseURI, linkProtocols);
      if (url) element.href = url;
    },
    action(element, value) {
      if (typeof value !== "string" || !value.trim()) return;
      const url = cmsApi.safeURL(`mailto:${value}`, document.baseURI, ["mailto:"]);
      if (url) element.action = url;
    },
    placeholder(element, value) {
      if (typeof value === "string") element.placeholder = value;
    },
    value(element, value) {
      if (typeof value === "string") element.defaultValue = value;
    },
    content(element, value) {
      if (typeof value === "string") element.content = value;
    },
    image,
    background(element, value) {
      const photo = cmsApi.media(value);
      if (photo) element.style.setProperty("--hero-photo", `url(${JSON.stringify(photo.src)})`);
    },
  };

  function applyPage(data) {
    if (!data.updatedAt) return;
    for (const [kind, render] of Object.entries(bindings)) {
      const attribute = `data-cms-${kind}`;
      for (const element of document.querySelectorAll(`[${attribute}]`)) {
        const value = element.getAttribute(attribute).split(".")
          .reduce((group, key) => group?.[key], data);
        render(element, value);
      }
    }
  }

  function makeLink(value) {
    const anchor = document.createElement("a");
    link(anchor, value);
    return anchor;
  }

  function applyMenu(header) {
    const menu = document.getElementById("primary-menu");
    const chevron = menu.querySelector(".nav-chevron");
    const current = location.pathname.split("/").pop() || "index.html";
    const parent = {
      "article-detail.html": "articles.html",
      "property-detail.html": "properties.html",
    };
    const isCurrent = (anchor) => {
      if (!anchor.href) return false;
      const url = new URL(anchor.href);
      return url.origin === location.origin
        && url.pathname.split("/").pop() === (parent[current] ?? current);
    };

    if (Array.isArray(header.navigation)) {
      const items = header.navigation.map((item) => {
        const anchor = makeLink(item);
        const active = isCurrent(anchor);
        if (active) anchor.setAttribute("aria-current", parent[current] ? "location" : "page");
        if (!item.children?.length) return anchor;

        const group = document.createElement("div");
        group.className = active ? "nav-item active" : "nav-item";
        if (chevron) anchor.append(chevron.cloneNode(true));
        const dropdown = document.createElement("div");
        dropdown.className = "dropdown-menu";
        dropdown.append(...item.children.map(makeLink));
        group.append(anchor, dropdown);
        return group;
      });
      if (header.contact?.href) {
        const button = makeLink(header.contact);
        button.className = "nav-mobile-only";
        items.push(button);
      }
      menu.replaceChildren(...items);
    }
    link(document.querySelector(".nav-cta"), header.contact);
  }

  function applyFooter(footer) {
    const grid = document.querySelector("footer .foot-grid");
    const brand = grid.firstElementChild;
    text(brand.querySelector("p"), footer.description);
    if (typeof footer.address === "string") formatted(brand.querySelector("address"), footer.address);
    if (Array.isArray(footer.columns)) {
      const columns = footer.columns.map((column) => {
        const section = document.createElement("div");
        const title = document.createElement("h5");
        title.textContent = column.title;
        const links = document.createElement("ul");
        for (const item of column.links ?? []) {
          const li = document.createElement("li");
          li.append(makeLink(item));
          links.append(li);
        }
        section.append(title, links);
        return section;
      });
      grid.replaceChildren(brand, ...columns);
    }
    text(document.querySelector("footer .copy"), footer.copyright);
  }

  function applySite(data) {
    if (!data.updatedAt) return;
    if (data.header) {
      applyMenu(data.header);
      const lightLogo = cmsApi.media(data.header.lightLogo);
      for (const logo of document.querySelectorAll(".logo img, footer .foot-grid > div:first-child img")) {
        image(logo, data.header.logo);
        logo.classList.add("site-logo");
        if (lightLogo) {
          logo.style.setProperty("--site-light-logo", `url(${JSON.stringify(lightLogo.src)})`);
        }
      }
    }
    if (data.footer) applyFooter(data.footer);
  }

  const ready = Promise.allSettled([
    cmsApi.read("globals/pengaturan-situs", { depth: "1" }).then(applySite),
    cmsApi.read(`globals/${document.body.dataset.cmsPage}`, { depth: "1" }).then(applyPage),
  ]).then((results) => {
    for (const result of results) {
      if (result.status === "rejected") console.error("Gagal memuat isi halaman ORVA:", result.reason);
    }
  });

  return { ready, text, link, image };
})();
