(async () => {
  const slug = new URLSearchParams(location.search).get("slug");
  const message = document.getElementById("article-message");

  let article;
  try {
    [article] = await Promise.all([cmsApi.bySlug("articles", slug), siteContent.ready]);
  } catch (error) {
    console.error("Gagal memuat detail artikel:", error);
    message.prepend("Artikel belum bisa dimuat. ");
    return;
  }
  if (!article) {
    if (slug) message.prepend("Artikel tidak ditemukan. ");
    return;
  }

  const { title, category, coverImage, intro, sections = [] } = article;
  const words = [intro, ...sections.map(({ heading, body }) => `${heading} ${body}`)]
    .join(" ").split(/\s+/).length;

  document.title = `${title} — ${document.querySelector(".logo img").alt}`;
  document.querySelector('meta[name="description"]').content = intro;
  document.getElementById("detail-title").textContent = title;
  document.getElementById("detail-category").textContent = category;
  document.getElementById("detail-reading-time").textContent = `${Math.ceil(words / 200)} menit baca`;
  const image = document.getElementById("detail-image");
  const cover = cmsApi.media(coverImage);
  if (cover) {
    image.src = cover.src;
    image.alt = cover.alt;
  } else {
    image.hidden = true;
  }
  document.getElementById("detail-intro").textContent = intro;

  const contents = document.getElementById("detail-contents");
  const prose = document.getElementById("detail-body");

  sections.forEach(({ heading, body }, index) => {
    const id = `bagian-${index + 1}`;
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = heading;
    const item = document.createElement("li");
    item.append(link);
    contents.append(item);

    const section = document.createElement("section");
    const subtitle = document.createElement("h2");
    subtitle.id = id;
    subtitle.textContent = heading;
    section.append(subtitle);
    for (const line of body.split(/\r?\n\s*\r?\n/)) {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      section.append(paragraph);
    }
    prose.append(section);
  });

  message.hidden = true;
  document.getElementById("article-detail").hidden = false;
  const anchor = document.getElementById(location.hash.slice(1));
  anchor?.scrollIntoView();
})();
