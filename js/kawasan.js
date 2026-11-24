(() => {
  const { message } = orvaLanguage;
  if (message(false, true)) {
    document.querySelectorAll("[data-kawasan-en]").forEach((element) => {
      element.textContent = element.dataset.kawasanEn;
    });
  }

  const target = document.querySelector("#kawasan-profile");
  if (!target) return;

  const naturaCatalog = "https://serpongnaturacity.co.id/berita-media/rumah-dijual-di-serpong/";
  const paradiseSite = "https://www.paradiseserpongcity2.co/";
  const profiles = {
    "paradise-serpong-city-2": {
      name: ecoArdence.project,
      theme: "paradise",
      developer: "Progress Group",
      area: 500,
      location: "Jl. H. Atma Asnawi, Gunung Sindur",
      summary: message(
        "Kota mandiri di kawasan Serpong Selatan dengan ruang terbuka hijau dan fasilitas untuk aktivitas keluarga.",
        "A township in the South Serpong area with green spaces and family amenities.",
      ),
      facilities: message(
        "Clubhouse, kolam renang, Paradise River Walk, jalur lari dan sepeda, area bermain, dan keamanan 24 jam.",
        "Clubhouse, swimming pool, Paradise River Walk, jogging and cycling paths, playgrounds, and 24-hour security.",
      ),
      map: "https://www.google.com/maps/search/?api=1&query=Paradise+Serpong+City+2+Gunung+Sindur",
      source: paradiseSite,
      brochure: paradiseSite,
      brochureLabel: message("Situs kawasan", "Development website"),
      clusters: [{
        name: ecoArdence.cluster,
        types: ecoArdence.units,
      }],
    },
    "serpong-natura-city": {
      name: serpongNatura.project,
      theme: "natura",
      developer: serpongNatura.developer,
      area: 210,
      location: message("Koridor BSD–Bogor", "BSD–Bogor corridor"),
      summary: message(
        "Kawasan hunian dengan ruang terbuka hijau, fasilitas olahraga, dan pilihan rumah bergaya Skandinavia hingga Mediterania.",
        "A residential development with green spaces, sports facilities, and homes ranging from Scandinavian to Mediterranean styles.",
      ),
      facilities: message(
        "Clubhouse, kolam renang, pusat kebugaran, Natura Green Park, lapangan olahraga, dan Masjid Raya Natura.",
        "Clubhouse, swimming pool, fitness center, Natura Green Park, sports courts, and Masjid Raya Natura.",
      ),
      map: "https://www.google.com/maps/search/?api=1&query=-6.369357%2C106.681350",
      source: naturaCatalog,
      brochure: serpongNatura.brochure,
      brochureLabel: message("Brosur, daftar harga & stok", "Brochures, price list & stock"),
      clusters: serpongNatura.clusters,
    },
  };

  const key = new URLSearchParams(location.search).get("profil");
  if (!Object.hasOwn(profiles, key)) return;

  const profile = profiles[key];
  const typesCount = profile.clusters.reduce((total, cluster) => total + cluster.types.length, 0);
  const fields = [
    [message("Pengembang", "Developer"), profile.developer],
    [message("Lokasi", "Location"), profile.location],
    [message("Luas pengembangan", "Development area"), `${profile.area} ha`],
    [message("Cluster dalam profil", "Clusters listed"), profile.clusters.length],
    [message("Tipe rumah dalam profil", "Home types listed"), typesCount],
  ];

  document.title = `${profile.name} — ORVA`;
  document.querySelector('meta[name="description"]').content = profile.summary;
  target.innerHTML = `
    <header class="kawasan-hero kawasan-${profile.theme}">
      <div class="kawasan-card-content">
        <span>${message("Profil Kawasan", "Development Profile")}</span>
        <h1>${profile.name}</h1>
      </div>
    </header>
    <section aria-labelledby="kawasan-overview">
      <h2 id="kawasan-overview">${message("Tentang kawasan", "About the development")}</h2>
      <div class="kawasan-meta">
        <div class="kawasan-panel">
          <p>${profile.summary}</p>
          <p><strong>${message("Fasilitas kawasan", "Amenities")}</strong><br>${profile.facilities}</p>
          <p><a class="kawasan-text-link" href="${profile.map}">${message("Lihat lokasi di peta", "View location on map")}</a></p>
        </div>
        <dl class="kawasan-panel">
          ${fields.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join("")}
        </dl>
      </div>
    </section>
    <section aria-labelledby="kawasan-clusters">
      <h2 id="kawasan-clusters">${message("Cluster dan tipe rumah", "Clusters and home types")}</h2>
      <div class="kawasan-tabs" role="tablist" aria-labelledby="kawasan-clusters">
        ${profile.clusters.map((cluster, index) => `
          <button class="kawasan-tab" type="button" role="tab" id="cluster-tab-${index}"
            aria-controls="cluster-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
            ${cluster.name}
            <span>${cluster.types.length} ${message("tipe rumah", cluster.types.length === 1 ? "home type" : "home types")}</span>
          </button>`).join("")}
      </div>
      ${profile.clusters.map((cluster, index) => `
        <div class="kawasan-cluster" role="tabpanel" id="cluster-panel-${index}"
          aria-labelledby="cluster-tab-${index}" tabindex="0"${index === 0 ? "" : " hidden"}>
          <div class="grid-4 kawasan-property-grid" data-cluster-cards></div>
          <a class="btn btn-outline" href="properties.html?${new URLSearchParams({ lokasi: profile.name, cluster: cluster.name })}#daftar-properti">
            ${message("Lihat properti di cluster ini", "View properties in this cluster")}
          </a>
        </div>`).join("")}
      <p class="kawasan-actions">
        <a class="btn btn-outline" href="${profile.brochure}">${profile.brochureLabel}</a>
        <a class="btn btn-gold" href="contact.html#konsultasi">${message("Tanya ketersediaan unit", "Enquire about availability")}</a>
      </p>
      ${profile.source === profile.brochure ? "" : `<p><a class="kawasan-text-link" href="${profile.source}">${message("Sumber spesifikasi rumah", "Source for home specifications")}</a></p>`}
    </section>`;
  const tabs = [...target.querySelectorAll('[role="tab"]')];
  const panels = [...target.querySelectorAll('[role="tabpanel"]')];

  function selectCluster(index) {
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectCluster(index));
    tab.addEventListener("keydown", (event) => {
      const destinations = {
        ArrowLeft: (index + tabs.length - 1) % tabs.length,
        ArrowRight: (index + 1) % tabs.length,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!Object.hasOwn(destinations, event.key)) return;
      event.preventDefault();
      const destination = destinations[event.key];
      selectCluster(destination);
      tabs[destination].focus();
    });
  });

  const template = document.getElementById("kawasan-property-template").content.firstElementChild;
  target.querySelectorAll("[data-cluster-cards]").forEach((grid, index) => {
    const cards = profile.clusters[index].types.map((unit) =>
      createPropertyCard(unit, template, { isProject: true }),
    );
    grid.replaceChildren(...cards);
  });
})();
