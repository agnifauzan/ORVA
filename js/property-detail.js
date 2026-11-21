(async () => {
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
    location: unit.location,
    price: unit.price,
    type: unit.type,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    area: unit.area == null ? "—" : `${unit.area} m²`,
  };
  for (const [field, value] of Object.entries(fields)) {
    byId(`unit-${field}`).textContent = value ?? "—";
  }

  const description = byId("unit-description");
  const paragraphs = unit.description?.trim().split(/\r?\n\s*\r?\n/) ?? [];
  for (const text of paragraphs.filter(Boolean)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
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
      photo.alt = image.alt || `Foto ${unit.name}`;
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
        const label = `Tampilkan foto ${index + 1} dari ${gallery.length}`;
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
    player.title = `Video ${unit.name} di YouTube`;
    byId("unit-video-link").href = `https://www.youtube.com/watch?v=${videoID}`;
    byId("unit-video").hidden = false;

    const threshold = 0.6;
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < threshold) return;
        player.src = `https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&mute=1&playsinline=1`;
        videoObserver.disconnect();
      },
      { threshold },
    );
    videoObserver.observe(player);
  }

  const whatsapp = new URL(byId("unit-whatsapp").href);
  whatsapp.searchParams.set(
    "text",
    `Halo ORVA, saya ingin mengetahui lebih lanjut tentang ${unit.name} di ${unit.location}.`,
  );
  byId("unit-whatsapp").href = whatsapp.href;

  document.title = `${unit.name} — ORVA`;
  byId("unit-content").hidden = false;
})();
