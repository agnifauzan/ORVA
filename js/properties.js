(async () => {
  const search = document.querySelector("[data-property-search]");
  const form = search.querySelector("form");
  const tabs = [...search.querySelectorAll("[data-status]")];
  const region = form.querySelector("#lokasi");
  const type = form.querySelector("#tipe");
  const price = form.querySelector("#harga");
  const catalog = document.getElementById("daftar-properti");
  const [result] = await Promise.allSettled([
    propertyApi.listUnits(catalog ? { sort: "-createdAt" } : undefined),
    siteContent.ready,
  ]);
  const loading = document.querySelector("[data-property-load-status]");
  const loadFailed = result.status === "rejected";
  const units = loadFailed ? [] : result.value;
  if (loadFailed) {
    console.error("Gagal memuat properti:", result.reason);
    loading.textContent = "Daftar properti belum bisa dimuat. Coba muat ulang halaman.";
  } else {
    loading.hidden = true;
  }

  const regionOf = (unit) => unit.location?.split(",").pop().trim() || "";
  const existingRegions = new Set([...region.options].map((option) => option.value));
  const additions = [...new Set(units.map(regionOf).filter(Boolean))]
    .filter((value) => !existingRegions.has(value))
    .sort((a, b) => a.localeCompare(b, "id-ID"));
  region.append(...additions.map((value) => new Option(value)));

  const statusField = form.elements.namedItem("status");
  const params = new URLSearchParams(window.location.search);
  const requestedType = params.get("type");
  const requestedStatus = params.get("status") || requestedType;
  let status =
    tabs.find((tab) => tab.dataset.status === requestedStatus)?.dataset
      .status || "jual";

  const saleRanges = [
    ["< Rp 1 M", 0, 999_999_999],
    ["Rp 1 M – Rp 5 M", 1_000_000_000, 5_000_000_000],
    ["> Rp 5 M", 5_000_000_001, Infinity],
  ];
  const rentRanges = [
    ["< Rp 25 Jt / bulan", 0, 24_999_999],
    ["Rp 25 Jt – Rp 50 Jt / bulan", 25_000_000, 50_000_000],
    ["> Rp 50 Jt / bulan", 50_000_001, Infinity],
  ];
  let ranges;

  function selectedValues(select) {
    return [...select.selectedOptions]
      .map((option) => option.value)
      .filter(Boolean);
  }

  function selectValues(select, values) {
    if (!select.multiple) {
      select.value =
        values.find((value) =>
          [...select.options].some((option) => option.value === value),
        ) ?? "";
      return;
    }
    for (const option of select.options) {
      option.selected = values.includes(option.value);
    }
  }

  function updatePriceOptions() {
    const isRent = status === "sewa";
    ranges = isRent ? rentRanges : saleRanges;
    price.replaceChildren(
      new Option(isRent ? "Semua Harga Sewa" : "Semua Harga", ""),
      ...ranges.map(([label], index) => new Option(label, String(index))),
    );
    price.dispatchEvent(new Event("change"));
  }

  function setPressed(button, pressed) {
    button.classList.toggle("active", pressed);
    button.setAttribute("aria-pressed", String(pressed));
  }

  function updateTabs() {
    tabs.forEach((tab) => setPressed(tab, tab.dataset.status === status));
    if (statusField) statusField.value = status;
  }

  updatePriceOptions();
  updateTabs();

  for (const [select, parameter] of [
    [region, "lokasi"],
    [type, "type"],
    [price, "harga"],
  ]) {
    const values = params.getAll(parameter);
    if (typeof HTMLElement.prototype.showPopover === "function") {
      select.multiple = select !== price;
      createFilterDropdown(select);
    } else if (catalog && select !== price && values.length > 1) {
      select.multiple = true;
    }
    if (catalog) {
      selectValues(select, values);
      select.dispatchEvent(new Event("change"));
    }
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const nextStatus = tab.dataset.status;
      const changeRanges = (status === "sewa") !== (nextStatus === "sewa");
      status = nextStatus;
      if (changeRanges) updatePriceOptions();
      updateTabs();
      renderCatalog?.();
    });
  }

  const renderCatalog = catalog && initCatalog();
  const homepageGrid = document.getElementById("homepage-property-results");
  const homepageCardTemplate = document.getElementById("homepage-property-template");
  if (homepageCardTemplate) {
    const template = homepageCardTemplate.content.firstElementChild;
    homepageGrid.replaceChildren(...units.map((unit) => createPropertyCard(unit, template)));
  }

  function createFilterDropdown(select) {
    const label = select.labels[0];
    const title = label.textContent.trim();
    const panelId = `${select.id}-filter`;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "filter-trigger";
    trigger.id = `${panelId}-trigger`;
    trigger.setAttribute("popovertarget", panelId);
    trigger.setAttribute("aria-controls", panelId);
    trigger.setAttribute("aria-expanded", "false");

    const panel = document.createElement("div");
    panel.id = panelId;
    panel.className = "filter-panel";
    panel.setAttribute("popover", "auto");
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-labelledby", `${panelId}-title`);
    panel.innerHTML = `
      <h3 class="filter-title" id="${panelId}-title"></h3>
      <div class="filter-query">
        <input type="search" placeholder="Search" />
        <svg class="icon" aria-hidden="true"><use href="#i-search"></use></svg>
      </div>
      <div class="filter-options"></div>
      <p class="filter-empty" role="status" hidden>Opsi tidak ditemukan.</p>
      <div class="filter-actions">
        <button type="button" class="filter-reset">Reset</button>
        <button type="button" class="filter-apply">Apply</button>
      </div>`;

    const query = panel.querySelector("input");
    const list = panel.querySelector(".filter-options");
    const empty = panel.querySelector(".filter-empty");
    panel.querySelector(".filter-title").textContent = title;
    query.setAttribute("aria-label", `Cari ${title.toLowerCase()}`);
    label.htmlFor = trigger.id;
    select.hidden = true;
    select.after(trigger, panel);

    function syncSummary() {
      const options = [...select.selectedOptions].filter(
        (option) => option.value,
      );
      const summary =
        options.length > 1
          ? `${options.length} dipilih`
          : options[0]?.text || select.options[0].text;
      trigger.textContent = summary;
      trigger.setAttribute("aria-label", `${title}: ${summary}`);
    }

    function buildOptions() {
      const rows = [...select.options]
        .filter((option) => option.value)
        .map((option) => {
          const row = document.createElement("label");
          const input = document.createElement("input");
          input.type = select.multiple ? "checkbox" : "radio";
          if (input.type === "radio") {
            input.name = `${panelId}-draft`;
            // Group the radios without including draft choices in search submissions.
            input.setAttribute("form", "");
          }
          input.value = option.value;
          input.checked = option.selected;
          row.append(input, document.createTextNode(option.text));
          return row;
        });
      list.replaceChildren(...rows);
    }

    function filterOptions() {
      const term = query.value.trim().toLocaleLowerCase("id");
      let hasMatch = false;
      for (const row of list.children) {
        row.hidden = !row.textContent.toLocaleLowerCase("id").includes(term);
        hasMatch ||= !row.hidden;
      }
      list.hidden = !hasMatch;
      empty.hidden = hasMatch;
    }

    function positionPanel() {
      const searchRect = form.getBoundingClientRect();
      const fieldRect = trigger.closest(".field").getBoundingClientRect();
      const stacked = getComputedStyle(form).flexDirection === "column";
      const anchorLeft = stacked || select === region
        ? searchRect.left
        : fieldRect.left;
      const anchorBottom = stacked ? fieldRect.bottom : searchRect.bottom;
      const mobileInset = 24;
      const width = stacked
        ? searchRect.width - 2 * mobileInset
        : Math.min(368, window.innerWidth - 24);
      const left = stacked
        ? anchorLeft + mobileInset
        : Math.max(12, Math.min(anchorLeft, window.innerWidth - width - 10));
      panel.style.width = `${width}px`;
      panel.style.left = `${left}px`;
      panel.style.top = `${anchorBottom + 8}px`;
    }

    panel.addEventListener("beforetoggle", (event) => {
      const opening = event.newState === "open";
      trigger.setAttribute("aria-expanded", String(opening));
      if (!opening) return;
      query.value = "";
      buildOptions();
      filterOptions();
      list.scrollTop = 0;
      positionPanel();
    });
    function updateOpenPanelPosition() {
      if (panel.matches(":popover-open")) positionPanel();
    }
    window.addEventListener("resize", updateOpenPanelPosition);
    window.addEventListener("scroll", updateOpenPanelPosition);
    query.addEventListener("input", filterOptions);
    panel.addEventListener("keydown", (event) => {
      if (event.target === query && event.key === "Enter")
        event.preventDefault();
    });
    panel.querySelector(".filter-reset").addEventListener("click", () => {
      for (const input of list.querySelectorAll("input")) input.checked = false;
      query.value = "";
      filterOptions();
      list.scrollTop = 0;
    });
    panel.querySelector(".filter-apply").addEventListener("click", () => {
      const values = [...list.querySelectorAll("input:checked")].map(
        (option) => option.value,
      );
      selectValues(select, values);
      panel.hidePopover();
      trigger.focus();
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    select.addEventListener("change", syncSummary);
    syncSummary();
  }

  function createPropertyCard(unit, cardTemplate) {
    const card = cardTemplate.cloneNode(true);
    const title = card.querySelector(".property-card-link");
    const photo = card.querySelector(".pimg img");
    const location = card.querySelector(".loc");
    const favorite = card.querySelector(".heart");

    card.dataset.status = unit.status === "Disewa" ? "sewa" : "jual";
    card.dataset.region = regionOf(unit);
    card.dataset.propertyType = unit.type?.toLowerCase() || "";
    card.dataset.price = String(unit.rawPrice);
    card.dataset.area = String(unit.area ?? 0);

    title.textContent = unit.name;
    title.href = `property-detail.html?unit=${encodeURIComponent(unit.slug)}`;
    photo.src = unit.photo || "images/property-1.svg";
    photo.alt = unit.alt || `Foto ${unit.name}`;

    location.querySelector(".property-card-location").textContent =
      unit.location || "Lokasi belum diisi";
    card.querySelector(".badge").textContent = unit.status;
    card.querySelector(".price").textContent = unit.price;

    const [bedrooms, bathrooms, area] = card.querySelectorAll(".mini span");
    bedrooms.textContent =
      unit.bedrooms == null ? "— KT" : `${unit.bedrooms} KT`;
    bathrooms.textContent =
      unit.bathrooms == null ? "— KM" : `${unit.bathrooms} KM`;
    area.textContent = unit.area == null ? "— m²" : `${unit.area} m²`;

    favorite.classList.remove("on");
    favorite.setAttribute("aria-pressed", "false");
    favorite.addEventListener("click", () => {
      favorite.setAttribute(
        "aria-pressed",
        String(favorite.classList.toggle("on")),
      );
    });

    return card;
  }

  function initCatalog() {
    const grid = catalog.querySelector("#property-results");
    const template = document.getElementById("catalog-property-template").content.firstElementChild;
    const cards = units.map((unit) => createPropertyCard(unit, template));
    const count = catalog.querySelector(".count-text strong");
    const empty = catalog.querySelector("#property-empty");
    const sort = catalog.querySelector("#sort-select");
    const pagination = catalog.querySelector("#property-pagination");
    const pageSize = 8;
    let page = 1;
    let orderedCards = cards;
    const viewButtons = catalog.querySelectorAll("[data-view]");
    const sortBy = {
      "price-asc": (a, b) => Number(a.dataset.price) - Number(b.dataset.price),
      "price-desc": (a, b) => Number(b.dataset.price) - Number(a.dataset.price),
      "area-desc": (a, b) => Number(b.dataset.area) - Number(a.dataset.area),
    };

    function render() {
      const locations = selectedValues(region);
      const types = selectedValues(type);
      const selectedRanges = selectedValues(price).map(
        (value) => ranges[value],
      );
      const matches = orderedCards.filter((card) => {
        const listing = card.dataset;
        const amount = Number(listing.price);
        const matchesPrice =
          !selectedRanges.length ||
          selectedRanges.some(([, min, max]) => amount >= min && amount <= max);
        return (
          listing.status === status &&
          (!locations.length || locations.includes(listing.region)) &&
          (!types.length || types.includes(listing.propertyType)) &&
          matchesPrice
        );
      });

      const pageCount = Math.ceil(matches.length / pageSize);
      page = Math.min(page, Math.max(1, pageCount));
      const start = (page - 1) * pageSize;
      const visibleCards = new Set(matches.slice(start, start + pageSize));
      for (const card of cards) {
        card.hidden = !visibleCards.has(card);
      }

      count.textContent = loadFailed ? "—" : `${matches.length} properti`;
      empty.hidden = loadFailed || matches.length > 0;
      renderPagination(pageCount);
    }

    function renderPagination(pageCount) {
      pagination.hidden = pageCount <= 1;
      if (pagination.hidden) {
        pagination.replaceChildren();
        return;
      }

      function pageButton(label, destination, disabled = false) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline page-button";
        button.textContent = label;
        button.dataset.page = String(destination);
        button.disabled = disabled;
        return button;
      }

      const firstPage = Math.max(1, Math.min(page - 2, pageCount - 4));
      const lastPage = Math.min(firstPage + 4, pageCount);
      const buttons = [pageButton("Sebelumnya", page - 1, page === 1)];
      for (let number = firstPage; number <= lastPage; number += 1) {
        const button = pageButton(String(number), number);
        button.setAttribute("aria-label", `Halaman ${number}`);
        if (number === page) {
          button.setAttribute("aria-current", "page");
          button.classList.replace("btn-outline", "btn-gold");
        }
        buttons.push(button);
      }
      buttons.push(pageButton("Berikutnya", page + 1, page === pageCount));
      pagination.replaceChildren(...buttons);
    }

    function resetPage() {
      page = 1;
      render();
    }

    function applySort() {
      const compare = sortBy[sort.value];
      orderedCards = compare ? [...cards].sort(compare) : cards;
      grid.replaceChildren(...orderedCards);
      resetPage();
    }

    sort.addEventListener("change", applySort);
    pagination.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-page]");
      if (!button || button.disabled || Number(button.dataset.page) === page) return;
      page = Number(button.dataset.page);
      render();
      pagination.querySelector('[aria-current="page"]').focus({ preventScroll: true });
      catalog.scrollIntoView({ block: "start" });
    });

    for (const button of viewButtons) {
      button.addEventListener("click", () => {
        grid.classList.toggle("property-list", button.dataset.view === "list");
        viewButtons.forEach((option) => setPressed(option, option === button));
      });
    }

    form.addEventListener("change", resetPage);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      resetPage();
      catalog.scrollIntoView({ block: "start" });
    });

    applySort();
    return resetPage;
  }
})();
