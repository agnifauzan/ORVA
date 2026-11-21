(() => {
  const form = document.querySelector(".article-tools");
  const query = document.getElementById("article-query");
  const category = document.getElementById("article-category");
  const count = document.getElementById("article-count");
  const empty = document.getElementById("article-empty");
  const reset = document.getElementById("article-reset");
  const articles = [...document.querySelectorAll(".article-card")].map((card) => ({
    card,
    category: card.dataset.category,
    text: [card.textContent, ...articleContent[card.getAttribute("aria-labelledby")].sections.map((section) => section.body)]
      .join(" ").toLocaleLowerCase("id-ID"),
  }));

  function filterArticles() {
    const terms = query.value.trim().toLocaleLowerCase("id-ID").split(/\s+/).filter(Boolean);
    let matches = 0;

    for (const article of articles) {
      const matchesCategory = !category.value || category.value === article.category;
      const matchesSearch = terms.every((term) => article.text.includes(term));
      const visible = matchesCategory && matchesSearch;
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
