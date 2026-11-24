(async () => {
  const { message: localMessage, text } = orvaLanguage;
  const slug = new URLSearchParams(location.search).get("slug");
  const message = document.getElementById("article-message");

  let article;
  try {
    [article] = await Promise.all([articleApi.bySlug(slug), siteContent.ready]);
  } catch (error) {
    console.error("Gagal memuat detail artikel:", error);
    message.prepend(text("Artikel belum bisa dimuat.") + " ");
    return;
  }
  if (!article) {
    if (slug) message.prepend(text("Artikel tidak ditemukan.") + " ");
    return;
  }

  const { category, coverImage } = article;
  const title = text(article.title);
  const intro = text(article.intro);
  const sections = (article.sections ?? []).map(({ heading, body }) => ({
    heading: text(heading),
    paragraphs: body.split(/\r?\n\s*\r?\n/).map(text),
  }));
  const words = [intro, ...sections.flatMap(({ heading, paragraphs }) => [heading, ...paragraphs])]
    .join(" ").split(/\s+/).length;
  const minutes = Math.ceil(words / 200);

  document.title = `${title} — ${document.querySelector(".logo img").alt}`;
  document.querySelector('meta[name="description"]').content = intro;
  document.getElementById("detail-title").textContent = title;
  document.getElementById("detail-category").textContent = text(category);
  document.getElementById("detail-reading-time").textContent = localMessage(`${minutes} menit baca`, `${minutes} min read`);
  const image = document.getElementById("detail-image");
  const cover = articleApi.cover(coverImage);
  if (cover) {
    image.src = cover.src;
    image.alt = cover.alt;
  } else {
    image.hidden = true;
  }
  document.getElementById("detail-intro").textContent = intro;

  const contents = document.getElementById("detail-contents");
  const prose = document.getElementById("detail-body");

  sections.forEach(({ heading, paragraphs }, index) => {
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
    for (const line of paragraphs) {
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
