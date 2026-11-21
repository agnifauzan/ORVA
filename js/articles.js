(async () => {
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
    const [items] = await Promise.all([cmsApi.list("articles"), siteContent.ready]);
    const categories = [...new Set(items.map((article) => article.category))]
      .sort((a, b) => a.localeCompare(b, "id-ID"));
    category.replaceChildren(category.options[0], ...categories.map((name) => new Option(name)));

    articles = items.map((article, index) => {
      const card = template.content.firstElementChild.cloneNode(true);
      const title = card.querySelector("h3");
      title.id = `artikel-${index + 1}`;
      title.textContent = article.title;
      card.setAttribute("aria-labelledby", title.id);
      const link = card.querySelector("a");
      link.href = `article-detail.html?slug=${encodeURIComponent(article.slug)}`;
      link.setAttribute("aria-labelledby", title.id);
      const image = card.querySelector("img");
      if (article.coverImage) siteContent.image(image, article.coverImage);
      else image.remove();
      card.querySelector(".eyebrow").textContent = article.category;
      card.querySelector("p").textContent = article.intro;

      return {
        card,
        category: article.category,
        text: [article.title, article.category, article.intro, ...(article.sections ?? []).map(({ heading, body }) => `${heading} ${body}`)]
          .join(" ").toLocaleLowerCase("id-ID"),
      };
    });

    list.replaceChildren(...articles.map(({ card }) => card));
  } catch (error) {
    console.error("Gagal memuat artikel:", error);
    count.textContent = "Artikel belum bisa dimuat.";
    return;
  }

  function filterArticles() {
    const terms = query.value.trim().toLocaleLowerCase("id-ID").split(/\s+/).filter(Boolean);
    let matches = 0;
    for (const article of articles) {
      const matchesCategory = !category.value || category.value === article.category;
      const visible = matchesCategory && terms.every((term) => article.text.includes(term));
      article.card.hidden = !visible;
      if (visible) matches += 1;
    }
    count.textContent = `${matches} artikel ditampilkan`;
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
