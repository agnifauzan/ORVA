(async () => {
  const { locale, message, text } = orvaLanguage;
  const form = document.querySelector(".article-tools");
  const query = document.getElementById("article-query");
  const category = document.getElementById("article-category");
  const count = document.getElementById("article-count");
  const empty = document.getElementById("article-empty");
  const reset = document.getElementById("article-reset");
  const list = document.getElementById("article-results");
  const template = document.getElementById("article-card-template");
  let articles = [];

  try {
    const [items] = await Promise.all([articleApi.list(), siteContent.ready]);
    const categories = [...new Set(items.map((article) => article.category))]
      .sort((a, b) => text(a).localeCompare(text(b), locale));
    category.replaceChildren(category.options[0], ...categories.map((name) => new Option(text(name), name)));

    articles = items.map((article, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      const title = card.querySelector("h3");
      title.id = `artikel-${index + 1}`;
      title.textContent = text(article.title);
      card.setAttribute("aria-labelledby", title.id);
      const link = card.querySelector("a");
      link.href = `article-detail.html?slug=${encodeURIComponent(article.slug)}`;
      link.setAttribute("aria-labelledby", title.id);
      const image = card.querySelector("img");
      const cover = articleApi.cover(article.coverImage);
      if (cover) {
        image.src = cover.src;
        image.alt = cover.alt;
      } else {
        image.remove();
      }
      card.querySelector(".eyebrow").textContent = text(article.category);
      card.querySelector("p").textContent = text(article.intro);

      const searchable = [article.title, article.category, article.intro];
      for (const { heading, body } of article.sections ?? []) {
        searchable.push(heading, ...body.split(/\r?\n\s*\r?\n/));
      }
      return {
        card,
        category: article.category,
        text: [...searchable, ...searchable.map(text)].join(" ").toLocaleLowerCase(locale),
      };
    });

    list.replaceChildren(...articles.map(({ card }) => card));
  } catch (error) {
    console.error("Gagal memuat artikel:", error);
    count.textContent = text("Artikel belum bisa dimuat.");
    return;
  }

  function filterArticles() {
    const terms = query.value.trim().toLocaleLowerCase(locale).split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const article of articles) {
      const matchesCategory = !category.value || category.value === article.category;
      const visible = matchesCategory && terms.every((term) => article.text.includes(term));
      article.card.hidden = !visible;
      if (visible) matches += 1;
    }
    count.textContent = message(
      `${matches} artikel ditampilkan`,
      `${matches} ${matches === 1 ? "article" : "articles"} shown`,
    );
    empty.hidden = matches > 0;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterArticles();
  });
  query.addEventListener("input", filterArticles);
  category.addEventListener("change", filterArticles);
  reset.addEventListener("click", () => {
    form.reset();
    filterArticles();
    query.focus();
  });

  filterArticles();
  form.hidden = false;
})();
