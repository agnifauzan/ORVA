(() => {
  const slug = new URLSearchParams(location.search).get("slug");
  const message = document.getElementById("article-message");

  if (!Object.hasOwn(articleContent, slug)) {
    if (slug) message.prepend("Artikel tidak ditemukan. ");
    return;
  }

  const { title, category, image, intro, sections } = articleContent[slug];
  const words = [intro, ...sections.map(({ heading, body }) => `${heading} ${body}`)]
    .join(" ").split(/\s+/).length;

  document.title = `${title} — Lumira Property`;
  document.querySelector('meta[name="description"]').content = intro;
  document.getElementById("detail-title").textContent = title;
  document.getElementById("detail-category").textContent = category;
  document.getElementById("detail-reading-time").textContent = `${Math.ceil(words / 200)} menit baca`;
  document.getElementById("detail-image").src = image;
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
    const paragraph = document.createElement("p");
    paragraph.textContent = body;
    section.append(subtitle, paragraph);
    prose.append(section);
  });

  message.hidden = true;
  document.getElementById("article-detail").hidden = false;
  const anchor = document.getElementById(location.hash.slice(1));
  anchor?.scrollIntoView();
})();
