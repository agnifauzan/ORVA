function createPropertyCard(unit, cardTemplate, { isProject, showCluster } = {}) {
  const { locale, message, place, text } = orvaLanguage;
  const card = cardTemplate.cloneNode(true);
  const title = card.querySelector(".property-card-link");
  const photo = card.querySelector(".pimg img");
  const location = card.querySelector(".loc");
  const favorite = card.querySelector(".heart");

  card.dataset.status = unit.transaction;
  card.dataset.cluster = unit.cluster?.trim() || "";
  card.dataset.region = unit.location?.split(",").pop().trim() || "";
  card.dataset.propertyType = unit.propertyType || "";
  card.dataset.price = String(unit.rawPrice);
  card.dataset.area = String(unit.area ?? 0);

  title.textContent = unit.name;
  title.href = `property-detail.html?unit=${encodeURIComponent(unit.slug)}`;
  if (showCluster && unit.cluster?.trim()) {
    const development = document.createElement("p");
    development.className = "property-development";
    development.textContent = unit.cluster.trim();
    title.closest("h3").after(development);
  }
  photo.addEventListener("error", () => {
    photo.src = "images/property-1.svg";
    photo.alt = "";
  }, { once: true });
  photo.src = unit.photo || "images/property-1.svg";
  photo.alt = unit.alt || message(`Foto ${unit.name}`, `Photo of ${unit.name}`);

  location.querySelector(".property-card-location").textContent =
    place(unit.location) || text("Lokasi belum diisi");
  card.querySelector(".badge").textContent = unit.status;
  const priceRow = card.querySelector(".price");
  priceRow.textContent = unit.price;
  if (isProject) {
    favorite.remove();
    priceRow.classList.add("property-starting-price");
    if (unit.rawPrice != null) {
      priceRow.textContent = `Rp ${unit.rawPrice.toLocaleString(locale)}`;
    }
  } else {
    favorite.classList.remove("on");
    favorite.setAttribute("aria-pressed", "false");
    favorite.addEventListener("click", () => {
      favorite.setAttribute(
        "aria-pressed",
        String(favorite.classList.toggle("on")),
      );
    });
  }

  const [bedrooms, bathrooms, area] = card.querySelectorAll(".mini span");
  bedrooms.textContent = `${unit.bedrooms ?? "—"} ${message("KT", unit.bedrooms === 1 ? "bed" : "beds")}`;
  bathrooms.textContent = `${unit.bathrooms ?? "—"} ${message("KM", unit.bathrooms === 1 ? "bath" : "baths")}`;
  area.textContent = unit.area == null ? "— m²" : `${unit.area} m²`;

  return card;
}
