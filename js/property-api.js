const propertyApi = (() => {
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

  function mapUnit(item) {
    const rental = item.transaction === "sewa";
    const cover = cmsApi.media(item.coverImage);
    return {
      slug: item.slug,
      rawPrice: item.price,
      name: item.name,
      location: item.location,
      status: rental ? "Disewa" : "Dijual",
      type: propertyTypes[item.propertyType],
      price: formatPrice(item.price, rental),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      area: item.area,
      description: item.description,
      photo: cover?.src ?? null,
      alt: cover?.alt,
    };
  }

  async function getUnit(slug) {
    const item = await cmsApi.bySlug("properties", slug);
    if (!item) return null;
    return {
      ...mapUnit(item),
      gallery: (item.gallery ?? []).map(cmsApi.media).filter(Boolean),
      youtubeUrl: item.youtubeUrl,
    };
  }

  async function listUnits({ sort } = {}) {
    const items = await cmsApi.list("properties", {
      ...(sort && { sort }),
      "select[gallery]": "false",
      "select[youtubeUrl]": "false",
    });
    return items.map(mapUnit);
  }

  return { getUnit, listUnits };
})();
