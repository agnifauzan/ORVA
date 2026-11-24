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
    const isProject = typeof ecoArdence !== "undefined"
      && ecoArdence.units.some((unit) => unit.slug === item.slug);
    const cover = cmsApi.media(item.coverImage);
    return {
      slug: item.slug,
      rawPrice: item.price > 0 ? item.price : null,
      name: text(item.name),
      location: item.location,
      cluster: item.cluster,
      transaction: rental ? "sewa" : "jual",
      status: isProject ? message("Proyek Baru", "New Development") : text(rental ? "Disewa" : "Dijual"),
      propertyType: item.propertyType,
      type: text(propertyTypes[item.propertyType]),
      price: item.price > 0
        ? (isProject ? message("Mulai dari", "Starting at") + ` Rp ${number.format(item.price)}` : formatPrice(item.price, rental))
        : message("Hubungi untuk harga", "Enquire for pricing"),
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
      area: item.buildingArea ?? item.area,
      landArea: item.landArea,
      buildingArea: item.buildingArea,
      lotDimensions: item.lotDimensions,
      floors: item.floors,
      description: item.description,
      photo: cover?.src ?? null,
      alt: cover?.alt,
    };
  }

  async function getUnit(slug) {
    const naturaUnit = typeof serpongNatura === "undefined"
      ? null
      : serpongNatura.units.find((unit) => unit.slug === slug);
    if (naturaUnit) return naturaUnit;

    const projectUnit = typeof ecoArdence === "undefined"
      ? null
      : ecoArdence.units.find((unit) => unit.slug === slug);
    const item = await cmsApi.bySlug("properties", slug).catch((error) => {
      if (!projectUnit) throw error;
      console.error("Gagal memuat unit EcoArdence dari CMS:", error);
      return null;
    });
    if (!item) return projectUnit ?? null;
    const plans = (item.floorPlans ?? [])
      .filter((file) => file?.mimeType?.startsWith("image/"))
      .map(cmsApi.media)
      .filter(Boolean);
    const facilityCards = (item.facilityCards ?? [])
      .filter(({ name }) => name?.trim())
      .map(({ name, photo }) => ({
        name: text(name.trim()),
        photo: photo?.mimeType?.startsWith("image/") ? cmsApi.media(photo)?.src : undefined,
      }));
    return {
      ...mapUnit(item),
      gallery: (item.gallery ?? []).map(cmsApi.media).filter(Boolean),
      youtubeUrl: item.youtubeUrl,
      plans: plans.map(({ src, alt }, index) => ({
        src,
        label: alt || message(`Denah ${index + 1}`, `Floor plan ${index + 1}`),
      })),
      brochure: item.brochure?.mimeType === "application/pdf"
        ? cmsApi.media(item.brochure)?.src
        : null,
      certificate: item.certificate,
      buildingPermit: item.buildingPermit,
      furnishing: item.furnishing,
      facing: item.facing,
      garage: item.garage,
      maidBedrooms: item.maidBedrooms,
      maidBathrooms: item.maidBathrooms,
      electricity: item.electricity,
      water: item.water,
      facilities: item.facilities,
      facilityCards: facilityCards.length ? facilityCards : undefined,
      developer: item.developer,
      smartHome: item.smartHome,
      technicalSpecs: item.technicalSpecs,
      floorPlanNotes: item.floorPlanNotes,
      showUnitLocations: item.showUnitLocations,
      agent: item.agent?.active ? item.agent : null,
    };
  }

  async function listUnits({ sort } = {}) {
    const items = await cmsApi.list("properties", {
      ...(sort && { sort }),
      "select[gallery]": "false",
      "select[floorPlans]": "false",
      "select[facilityCards]": "false",
      "select[brochure]": "false",
      "select[youtubeUrl]": "false",
    });
    return items.map(mapUnit);
  }

  function projectUnits(cmsUnits) {
    const unitsBySlug = new Map(cmsUnits.map((unit) => [unit.slug, unit]));
    const naturaUnits = typeof serpongNatura === "undefined" ? [] : serpongNatura.units;
    return [
      ...ecoArdence.units.map((unit) => unitsBySlug.get(unit.slug) ?? unit),
      ...naturaUnits,
    ];
  }

  return { getUnit, listUnits, projectUnits };
})();
