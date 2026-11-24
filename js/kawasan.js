(() => {
  const { message } = orvaLanguage;
  if (message(false, true)) {
    document.querySelectorAll("[data-kawasan-en]").forEach((element) => {
      element.textContent = element.dataset.kawasanEn;
    });
  }

  const target = document.querySelector("#kawasan-profile");
  if (!target) return;

  const profiles = {
    "paradise-serpong-city-2": {
      name: ecoArdence.project,
      slides: [
        ["images/eco-ardence/fasilitas-river-walk.jpg", "Paradise River Walk"],
        ["images/eco-ardence/fasilitas-kolam.jpg", message("Kolam renang EcoClub", "EcoClub swimming pool")],
        ["images/eco-ardence/gerbang.webp", message("Gerbang kawasan Paradise Serpong City 2", "Paradise Serpong City 2 entrance")],
      ],
      developer: "Progress Group",
      area: 500,
      location: "Jl. H. Atma Asnawi, Gunung Sindur",
      summary: message(
        "Paradise Serpong City 2 adalah kawasan kota mandiri yang dikembangkan Progress Group di koridor Serpong Selatan–Gunung Sindur. Pengembangannya memadukan area hunian, ruang terbuka hijau, dan area komersial. Di cluster EcoArdence, tersedia pilihan desain rumah satu dan dua lantai dengan ukuran bangunan dan tanah yang beragam.",
        "Paradise Serpong City 2 is a township developed by Progress Group in the South Serpong–Gunung Sindur corridor. The development combines residential areas, open green spaces, and commercial areas. Its EcoArdence cluster features one- and two-storey home designs with a range of building and lot sizes.",
      ),
      clusters: [{
        name: ecoArdence.cluster,
        types: ecoArdence.units,
      }],
    },
    "serpong-natura-city": {
      name: serpongNatura.project,
      slides: [
        ["https://serpongnaturacity.co.id/wp-content/uploads/2024/07/Swimming-pool-Serpong-Natura-City-web.jpg", message("Kolam renang Serpong Natura City", "Serpong Natura City swimming pool")],
        ["https://serpongnaturacity.co.id/wp-content/uploads/2019/03/Sunny-Es-Teler-77-Fountain-Plaza.jpg", "Natura Square"],
        ["https://serpongnaturacity.co.id/wp-content/uploads/2023/12/Signature-Mediterania-123-Fasad-Serpong-Natura-City-730x520.jpg", message("Contoh fasad The Signature", "Example facade at The Signature")],
      ],
      developer: serpongNatura.developer,
      area: 210,
      location: message("Koridor BSD–Bogor", "BSD–Bogor corridor"),
      summary: message(
        "Serpong Natura City adalah kawasan hunian terpadu di koridor BSD–Bogor yang dikembangkan dengan konsep lingkungan hijau. Tiap cluster punya karakter berbeda, mulai dari rumah bergaya Skandinavia di Orchard Park hingga desain Mediterania dan Neo Classic di The Signature. Pilihan ukuran bangunan dan tanah bisa dibandingkan melalui daftar tipe rumah di bawah.",
        "Serpong Natura City is an integrated residential development in the BSD–Bogor corridor, designed around green spaces. Each cluster has its own character, from Scandinavian homes at Orchard Park to Mediterranean and Neo Classic designs at The Signature. Building and lot sizes can be compared in the home listings below.",
      ),
      clusters: serpongNatura.clusters,
    },
  };

  const key = new URLSearchParams(location.search).get("profil");
  if (!Object.hasOwn(profiles, key)) return;

  const profile = profiles[key];
  target.dataset.profile = key;
  const fields = [
    [message("Pengembang", "Developer"), profile.developer],
    [message("Luas pengembangan", "Development area"), `${profile.area} ha`],
    [message("Cluster", "Clusters"), profile.clusters.length],
    [message("Lokasi", "Location"), profile.location],
  ];

  const clusterTabs = [
    {
      name: message("Semua cluster", "All clusters"),
      types: profile.clusters.flatMap((cluster) => cluster.types),
    },
    ...profile.clusters,
  ];

  document.title = `${profile.name} — ORVA`;
  document.querySelector('meta[name="description"]').content = profile.summary;
  target.innerHTML = `
    <header aria-labelledby="kawasan-overview">
      <div class="kawasan-meta">
        <div class="kawasan-banner-slider" role="group" aria-label="${message("Foto kawasan", "Development photos")}">
          <img class="kawasan-overview-image" decoding="async" alt="" />
          <p class="kawasan-banner-empty" hidden>${message("Foto belum tersedia", "Photo unavailable")}</p>
          <button class="kawasan-banner-arrow kawasan-banner-prev" type="button" aria-label="${message("Foto sebelumnya", "Previous photo")}"><span aria-hidden="true">←</span></button>
          <button class="kawasan-banner-arrow kawasan-banner-next" type="button" aria-label="${message("Foto berikutnya", "Next photo")}"><span aria-hidden="true">→</span></button>
          <span class="kawasan-banner-count" role="status"></span>
        </div>
        <div class="kawasan-overview-copy">
          <h1 id="kawasan-overview">${key === "serpong-natura-city"
              ? 'Serpong <span class="gold">Natura City</span>'
              : profile.name}</h1>
          <div class="kawasan-overview-panel">
            <p>${profile.summary}</p>
            <dl class="kawasan-overview-facts">
              ${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("")}
            </dl>
          </div>
        </div>
      </div>
    </header>
    <section aria-labelledby="kawasan-clusters">
      <div class="kawasan-section-heading">
        <h2 id="kawasan-clusters">${message("Cluster dan", "Clusters and")} <span class="gold">${message("tipe rumah", "home types")}</span></h2>
      </div>
      <div class="kawasan-tabs" role="tablist" aria-labelledby="kawasan-clusters">
        ${clusterTabs.map((cluster, index) => `
          <button class="kawasan-tab" type="button" role="tab" id="cluster-tab-${index}"
            aria-controls="cluster-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}">
            ${cluster.name}
            <span aria-label="${cluster.types.length} ${message("tipe rumah", cluster.types.length === 1 ? "home type" : "home types")}">${cluster.types.length}</span>
          </button>`).join("")}
      </div>
      ${clusterTabs.map((cluster, index) => `
        <div class="kawasan-cluster" role="tabpanel" id="cluster-panel-${index}"
          aria-labelledby="cluster-tab-${index}" tabindex="0"${index === 0 ? "" : " hidden"}>
          <div class="grid-4" data-cluster-cards></div>
        </div>`).join("")}
    </section>`;
  const slider = target.querySelector(".kawasan-banner-slider");
  const overviewImage = slider.querySelector("img");
  const emptyImage = slider.querySelector(".kawasan-banner-empty");
  const slideCount = slider.querySelector(".kawasan-banner-count");
  let slideIndex = 0;

  function showSlide(index) {
    slideIndex = (index + profile.slides.length) % profile.slides.length;
    const [src, alt] = profile.slides[slideIndex];
    overviewImage.hidden = false;
    emptyImage.hidden = true;
    overviewImage.alt = alt;
    overviewImage.src = src;
    slideCount.textContent = `${slideIndex + 1} / ${profile.slides.length}`;
  }

  overviewImage.addEventListener("error", () => {
    overviewImage.hidden = true;
    emptyImage.hidden = false;
  });
  slider.querySelector(".kawasan-banner-prev").addEventListener("click", () => showSlide(slideIndex - 1));
  slider.querySelector(".kawasan-banner-next").addEventListener("click", () => showSlide(slideIndex + 1));
  showSlide(0);

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
    const cards = clusterTabs[index].types.map((unit) =>
      createPropertyCard(unit, template, { isProject: true }),
    );
    grid.replaceChildren(...cards);
  });
})();
