const propertyApi = (() => {
  const { locale, message, text } = orvaLanguage;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const propertyTypes = {
    rumah: "Rumah",
    townhouse: "Townhouse",
    penthouse: "Penthouse",
    villa: "Villa",
    apartemen: "Apartemen",
  };

  function formatPrice(amount, rental) {
    const unit =
      amount >= 1e9
        ? message(" M", "B")
        : amount >= 1e6
          ? message(" Jt", "M")
          : "";
    const divisor = amount >= 1e9 ? 1e9 : amount >= 1e6 ? 1e6 : 1;
    return `Rp ${number.format(amount / divisor)}${unit}${rental ? message(" / bulan", " / month") : ""}`;
  }

  function mapUnit(item) {
    const rental = item.transaction === "sewa";
    const cover = cmsApi.media(item.coverImage);
    return {
      slug: item.slug,
      rawPrice: item.price,
      name: text(item.name),
      location: item.location,
      transaction: rental ? "sewa" : "jual",
      status: text(rental ? "Disewa" : "Dijual"),
      propertyType: item.propertyType,
      type: text(propertyTypes[item.propertyType]),
      price: formatPrice(item.price, rental),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      area: item.buildingArea ?? item.area,
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
      landArea: item.landArea,
      buildingArea: item.buildingArea,
      certificate: item.certificate,
      buildingPermit: item.buildingPermit,
      furnishing: item.furnishing,
      facing: item.facing,
      floors: item.floors,
      garage: item.garage,
      maidBedrooms: item.maidBedrooms,
      maidBathrooms: item.maidBathrooms,
      electricity: item.electricity,
      water: item.water,
      facilities: item.facilities,
      agent: item.agent?.active ? item.agent : null,
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
