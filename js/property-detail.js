(async () => {
  const { locale, message, place, text } = orvaLanguage;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const area = (value) => value == null ? null : `${number.format(value)} m²`;
  const slug = new URLSearchParams(location.search).get("unit");
  const byId = (id) => document.getElementById(id);
  const loading = byId("unit-loading");
  loading.hidden = false;

  let unit;
  try {
    [unit] = await Promise.all([propertyApi.getUnit(slug), siteContent.ready]);
  } catch (error) {
    console.error("Gagal mengambil detail properti dari Payload.", error);
    byId("unit-error").hidden = false;
    return;
  } finally {
    loading.hidden = true;
  }

  if (!unit) {
    byId("unit-missing").hidden = false;
    return;
  }
  const fields = {
    breadcrumb: unit.name,
    title: unit.name,
    transaction: unit.status,
    location: place(unit.location),
    price: unit.price,
    type: unit.type,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    area: area(unit.area),
    "land-area": area(unit.landArea),
    "building-area": area(unit.buildingArea),
  };
  for (const [field, value] of Object.entries(fields)) {
    byId(`unit-${field}`).textContent = value ?? "—";
  }
  byId("unit-land-area-row").hidden = unit.landArea == null;
  byId("unit-building-area-row").hidden = unit.buildingArea == null;
  byId("unit-area-row").hidden = unit.landArea != null || unit.buildingArea != null;

  const certificates = {
    shm: "SHM (Sertifikat Hak Milik)",
    shgb: "SHGB (Sertifikat Hak Guna Bangunan)",
    hak_pakai: "Hak Pakai",
    strata: "Hak Milik Satuan Rumah Susun",
    other: "Lainnya",
  };
  const furnishings = {
    full: "Perabot lengkap",
    semi: "Perabot sebagian",
    unfurnished: "Tanpa perabot",
  };
  const buildingPermits = {
    imb: "IMB",
    pbg: "PBG",
    both: "IMB dan PBG",
    pending: "Dalam proses",
  };
  const specs = byId("unit-extra-specs");
  for (const [label, value] of [
    ["Tipe properti", unit.type],
    ["Kamar tidur", unit.bedrooms],
    ["Kamar mandi", unit.bathrooms],
    ["Luas", unit.landArea == null && unit.buildingArea == null ? fields.area : null],
    ["Luas tanah", fields["land-area"]],
    ["Luas bangunan", fields["building-area"]],
    ["Sertifikat", certificates[unit.certificate]],
    ["Izin bangunan (IMB/PBG)", buildingPermits[unit.buildingPermit]],
    ["Kondisi perabot", furnishings[unit.furnishing]],
    ["Jumlah lantai", unit.floors],
    ["Arah hadap", unit.facing],
    ["Garasi dan parkir", unit.garage],
    ["Kamar tidur ART", unit.maidBedrooms],
    ["Kamar mandi ART", unit.maidBathrooms],
    ["Daya listrik", unit.electricity],
    ["Sumber air", unit.water],
  ]) {
    if (value == null || (typeof value === "string" && !value.trim())) continue;
    const row = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = text(label);
    detail.textContent = typeof value === "number" ? number.format(value) : text(value.trim());
    row.append(term, detail);
    specs.append(row);
  }
  specs.hidden = !specs.childElementCount;
  const facilityList = byId("unit-facility-list");
  for (const line of (unit.facilities ?? "").split(/\r?\n/)) {
    const facility = line.trim();
    if (!facility) continue;
    const item = document.createElement("li");
    item.textContent = text(facility);
    facilityList.append(item);
  }
  byId("unit-facilities").hidden = !facilityList.childElementCount;
  byId("unit-specs-empty").hidden = !specs.hidden || facilityList.childElementCount > 0;

  const description = byId("unit-description");
  const paragraphs = unit.description?.trim().split(/\r?\n\s*\r?\n/) ?? [];
  for (const paragraphText of paragraphs.filter(Boolean)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text(paragraphText);
    description.append(paragraph);
  }

  const photos = new Map();
  if (unit.photo) {
    photos.set(unit.photo, { src: unit.photo, alt: unit.alt });
  }
  for (const image of unit.gallery ?? []) {
    if (!photos.has(image.src)) photos.set(image.src, image);
  }

  const gallery = [...photos.values()].slice(0, 5);
  if (gallery.length) {
    const photo = byId("unit-photo");
    const thumbnails = byId("unit-thumbnails");
    const showPhoto = (index) => {
      const image = gallery[index];
      photo.src = image.src;
      photo.alt =
        image.alt || message(`Foto ${unit.name}`, `Photo of ${unit.name}`);
      for (const [position, button] of Array.from(
        thumbnails.children,
      ).entries()) {
        button.setAttribute("aria-pressed", String(position === index));
      }
    };

    if (gallery.length > 1) {
      gallery.forEach((image, index) => {
        const button = document.createElement("button");
        button.type = "button";
        const label = message(
          `Tampilkan foto ${index + 1} dari ${gallery.length}`,
          `View photo ${index + 1} of ${gallery.length}`,
        );
        button.setAttribute(
          "aria-label",
          image.alt ? `${label}: ${image.alt}` : label,
        );
        button.addEventListener("click", () => showPhoto(index));

        const thumbnail = document.createElement("img");
        thumbnail.src = image.src;
        thumbnail.alt = "";
        thumbnail.loading = "lazy";
        button.append(thumbnail);
        thumbnails.append(button);
      });
      thumbnails.hidden = false;
    }
    showPhoto(0);
    byId("unit-gallery").hidden = false;
  }

  const videoID = unit.youtubeUrl?.match(
    /^https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})$/,
  )?.[1];
  if (videoID) {
    const player = byId("unit-video-player");
    player.title = message(
      `Video ${unit.name} di YouTube`,
      `Video of ${unit.name} on YouTube`,
    );
    player.src = `https://www.youtube-nocookie.com/embed/${videoID}?playsinline=1`;
    byId("unit-video-link").href = `https://www.youtube.com/watch?v=${videoID}`;
    byId("unit-video-content").hidden = false;
    byId("unit-video-empty").hidden = true;
  }

  const contact = byId("unit-whatsapp");
  const directWhatsApp = unit.agent ? agentApi.whatsappURL(unit.agent) : null;
  const whatsapp = new URL(directWhatsApp ?? contact.href);
  const placeName = place(unit.location);
  whatsapp.searchParams.set(
    "text",
    message(
      `Halo ORVA, saya ingin mengetahui lebih lanjut tentang ${unit.name}${placeName ? ` di ${placeName}` : ""}.`,
      `Hello ORVA, I would like to learn more about ${unit.name}${placeName ? ` in ${placeName}` : ""}.`,
    ),
  );
  contact.href = whatsapp.href;

  document.title = `${unit.name} — ORVA`;
  byId("unit-content").hidden = false;
})();
