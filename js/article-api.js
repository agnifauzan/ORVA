const articleApi = (() => {
  let bundledArticles;

  function bundled() {
    bundledArticles ??= fetch("data/articles.json").then((response) => {
      if (!response.ok) throw new Error("Gagal memuat artikel bawaan ORVA.");
      return response.json();
    });
    return bundledArticles;
  }

  async function list() {
    try {
      return await cmsApi.list("articles");
    } catch (error) {
      console.warn("Menggunakan daftar artikel bawaan ORVA:", error);
      return bundled();
    }
  }

  async function bySlug(slug) {
    if (!slug) return null;
    try {
      return await cmsApi.bySlug("articles", slug);
    } catch (error) {
      console.warn("Menggunakan detail artikel bawaan ORVA:", error);
      return (await bundled()).find((article) => article.slug === slug) ?? null;
    }
  }

  function cover(file) {
    if (file?.path) {
      const src = cmsApi.safeURL(file.path);
      return src ? { src, alt: orvaLanguage.text(file.alt ?? "") } : null;
    }
    return cmsApi.media(file);
  }

  return { list, bySlug, cover };
})();
