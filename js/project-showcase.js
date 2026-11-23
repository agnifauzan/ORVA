(() => {
  const container = document.getElementById("eco-ardence-types");
  const { message } = orvaLanguage;
  const typeURL = (unit) => `property-detail.html?unit=${unit.slug}`;

  for (const unit of ecoArdence.units) {
    const card = document.createElement("a");
    card.className = "project-type";
    card.href = typeURL(unit);
    const photo = document.createElement("img");
    photo.src = unit.photo;
    photo.alt = unit.alt;
    photo.loading = "lazy";
    photo.width = 1160;
    photo.height = 820;
    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = unit.name;
    const development = document.createElement("p");
    development.className = "property-development";
    development.textContent = `${ecoArdence.project} · ${ecoArdence.cluster}`;
    const size = document.createElement("p");
    size.textContent = message(`LT ${unit.landArea} m² · LB ${unit.buildingArea} m²`, `Land ${unit.landArea} m² · Building ${unit.buildingArea} m²`);
    const rooms = document.createElement("p");
    rooms.textContent = message(
      `${unit.floors} lantai · ${unit.bedrooms} kamar tidur`,
      `${unit.floors} ${unit.floors === 1 ? "storey" : "storeys"} · ${unit.bedrooms} bedrooms`,
    );
    const linkLabel = document.createElement("span");
    linkLabel.textContent = message("Lihat detail →", "View details →");
    body.append(title, development, size, rooms, linkLabel);
    card.append(photo, body);
    container.append(card);
  }

  const comparison = document.getElementById("eco-ardence-comparison");
  if (!comparison) return;
  for (const unit of ecoArdence.units) {
    const row = document.createElement("tr");
    const title = document.createElement("th");
    title.scope = "row";
    const link = document.createElement("a");
    link.href = typeURL(unit);
    link.textContent = unit.name;
    title.append(link);
    row.append(title);
    for (const value of [unit.lotDimensions, unit.buildingArea + " m²", unit.floors, unit.bedrooms, unit.bathrooms]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    comparison.append(row);
  }
})();
