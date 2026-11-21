const cmsApi = (() => {
  const publishedCmsURL = "";
  const local = ["localhost", "127.0.0.1"].includes(location.hostname);
  const configured = document.querySelector('meta[name="orva-cms-url"]')?.content
    || window.ORVA_CMS_URL || publishedCmsURL;
  const base = configured || (local ? "http://localhost:3000" : location.origin);

  function safeURL(value, relativeTo = document.baseURI, protocols = ["http:", "https:"]) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, relativeTo);
      return protocols.includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  async function read(path, parameters) {
    const url = new URL(`/api/${path}`, base);
    if (parameters) url.search = new URLSearchParams(parameters);
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`CMS: ${path} (${response.status})`);
    return response.json();
  }

  async function list(collection, parameters = {}) {
    const docs = [];
    let page = 1;
    while (true) {
      const result = await read(collection, { depth: "1", limit: "100", ...parameters, page });
      docs.push(...result.docs);
      if (!result.hasNextPage) return docs;
      page += 1;
    }
  }

  async function bySlug(collection, slug) {
    if (!slug) return null;
    const result = await read(collection, {
      "where[slug][equals]": slug,
      depth: "1",
      limit: "1",
    });
    return result.docs[0] ?? null;
  }

  function media(file) {
    const src = safeURL(file?.url, base);
    return src ? { src, alt: file.alt ?? "" } : null;
  }

  return { read, list, bySlug, media, safeURL };
})();
