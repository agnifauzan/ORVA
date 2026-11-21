const propertyApi = (() => {
  const localHosts = ["localhost", "127.0.0.1"];
  const configuredOrigin = document.querySelector(
    'meta[name="lumira-cms-url"]',
  )?.content;
  const baseUrl =
    configuredOrigin ||
    (localHosts.includes(location.hostname) ? "http://localhost:3000" : null);
  const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 });
  const propertyTypes = {
    rumah: "Rumah",
    townhouse: "Townhouse",
    penthouse: "Penthouse",
    villa: "Villa",
    apartemen: "Apartemen",
  };

  function formatPrice(amount, rental) {
    const unit = amount >= 1e9 ? " M" : amount >= 1e6 ? " Jt" : "";
    const divisor = amount >= 1e9 ? 1e9 : amount >= 1e6 ? 1e6 : 1;
    return `Rp ${number.format(amount / divisor)}${unit}${rental ? " / bulan" : ""}`;
  }

  async function getUnit(slug) {
    const url = new URL("/api/properties", baseUrl);
    url.search = new URLSearchParams({
      "where[slug][equals]": slug,
      depth: "1",
      limit: "1",
    });
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "omit",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok)
      throw new Error(`Properties API returned ${response.status}`);
    const { docs } = await response.json();
    if (docs.length === 0) return null;

    return mapUnit(docs[0]);
  }

  function mapUnit(item) {
    const rental = item.transaction === "sewa";
    return {
      slug: item.slug,
      rawPrice: item.price,
      name: item.name,
      location: item.location,
      status: rental ? "Disewa" : "Dijual",
      type: propertyTypes[item.propertyType] || item.propertyType,
      price: formatPrice(item.price, rental),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      area: item.area,
      description: item.description,
      photo: item.coverImage?.url
        ? new URL(item.coverImage.url, baseUrl).href
        : null,
      alt: item.coverImage?.alt,
    };
  }
  async function listUnits({ sort } = {}) {
    const units = [];
    let page = 1;

    while (true) {
      const url = new URL("/api/properties", baseUrl);
      url.search = new URLSearchParams({
        depth: "1",
        limit: "100",
        page: String(page),
      });
      if (sort) url.searchParams.set("sort", sort);

      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`Gagal memuat properti (${response.status})`);
      }

      const { docs, hasNextPage } = await response.json();
      units.push(...docs.map(mapUnit));

      if (!hasNextPage) return units;
      page += 1;
    }
  }
  return { available: Boolean(baseUrl), getUnit, listUnits };
})();
