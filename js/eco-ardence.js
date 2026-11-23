const ecoArdence = (() => {
  const { locale, message, text } = orvaLanguage;
  const rupiah = new Intl.NumberFormat(locale);
  const project = "Paradise Serpong City 2";
  const cluster = "EcoArdence";
  const imageRoot = "images/eco-ardence/";
  // Published starting prices by unit type: https://www.paradiseserpongcity2.co/
  const types = [
    { name: "Capri", width: 6, length: 10, buildingArea: 34, floors: 1, bedrooms: 2, bathrooms: 1, startingPrice: 498_000_000 },
    { name: "Catania", width: 5, length: 12, buildingArea: 36, floors: 1, bedrooms: 2, bathrooms: 1 },
    { name: "Dafni", width: 5, length: 12, buildingArea: 58, floors: 2, bedrooms: 3, bathrooms: 2, startingPrice: 785_000_000 },
    { name: "Elato", width: 6, length: 10, buildingArea: 60, floors: 2, bedrooms: 3, bathrooms: 2, startingPrice: 801_000_000 },
    { name: "Fiora", width: 7, length: 12, buildingArea: 85, floors: 2, bedrooms: 3, bathrooms: 2, maidBedrooms: 1, maidBathrooms: 1, startingPrice: 1_110_000_000 },
  ];

  const facilityCards = [
    [message("Gerbang Ecoscape", "Ecoscape Gate"), "gerbang", message("Keamanan 24 jam, CCTV, dan akses kartu", "24-hour security, CCTV, and card access")],
    ["EcoClub", "kolam", message("Kolam Eco Aquatic dan Waterloo Fun", "Eco Aquatic and Waterloo Fun pools")],
    ["Laguna Gym & Studio", "gym"],
    [message("Ruang kerja bersama", "Coworking Space"), "coworking", message("Khusus penghuni", "For residents")],
    [message("Area bermain anak", "Playgrounds"), "playground"],
    ["Paradise River Walk", "river-walk"],
  ].map(([name, image, description]) => ({
    name,
    photo: imageRoot + "fasilitas-" + image + ".jpg",
    description,
  }));
  const smartHome = message(
    "Paket promosi dalam brosur. Tanyakan ketentuan dan ketersediaannya kepada ORVA.\nKendali melalui Google Home\nLampu pintar di ruang tamu, kamar utama, dan teras\nKamera pintar luar ruangan\nKunci pintu pintar",
    "Promotional package in the brochure. Ask ORVA about terms and availability.\nGoogle Home controls\nSmart lighting in the living room, main bedroom, and terrace\nOutdoor smart camera\nSmart door lock",
  );
  const galleryLocations = message(
    "Galeri Pemasaran Paradise 1 — Jl. Puspiptek Raya, Serpong\nGaleri Pemasaran Paradise 2 — Jl. Atma Asnawi, Gunung Sindur",
    "Paradise 1 Sales Gallery — Jl. Puspiptek Raya, Serpong\nParadise 2 Sales Gallery — Jl. Atma Asnawi, Gunung Sindur",
  );
  function materials(isFiora) {
    return [
      message("Pondasi: beton bertulang", "Foundation: reinforced concrete"),
      message("Dinding: bata ringan diplester dan diaci", "Walls: plastered and skim-coated lightweight masonry"),
      isFiora ? message("Kusen: kayu dan aluminium", "Frames: timber and aluminum") : message("Kusen: aluminium", "Frames: aluminum"),
      isFiora ? message("Daun pintu: pintu engineered", "Door leaves: engineered doors") : message("Pintu: UPVC dan pintu engineered", "Doors: UPVC and engineered doors"),
      message("Jendela: kaca polos 5 mm", "Windows: 5 mm clear glass"),
      message("Atap: rangka baja ringan dan genteng beton berwarna", "Roof: light-gauge steel frame and colored concrete tiles"),
      message("Plafon: gipsum dengan rangka besi hollow", "Ceiling: gypsum board on hollow steel framing"),
      isFiora ? message("Lantai utama: ubin homogen", "Main flooring: homogeneous tile") : message("Lantai utama: ubin homogen dan keramik", "Main flooring: homogeneous and ceramic tile"),
      message("Kamar mandi utama: kloset duduk TOTO atau setara", "Main bathroom: TOTO or equivalent seated toilet"),
      message("Lantai dan dinding kamar mandi: keramik", "Bathroom floors and walls: ceramic tile"),
      message("Parkir beratap: rabat beton", "Carport: concrete surfacing"),
    ].join("\n");
  }

  const units = types.map((type) => {
    const key = type.name.toLowerCase();
    const name = message(`Tipe ${type.name}`, `${type.name} Type`);
    return {
      ...type,
      name,
      slug: `eco-ardence-${key}`,
      cluster,
      location: project,
      transaction: "jual",
      status: message("Proyek Baru", "New Development"),
      type: text("Rumah"),
      propertyType: "rumah",
      rawPrice: type.startingPrice ?? null,
      price: type.startingPrice == null
        ? message("Hubungi untuk harga", "Enquire for pricing")
        : `${message("Mulai dari", "Starting at")} Rp ${rupiah.format(type.startingPrice)}`,
      landArea: type.width * type.length,
      area: type.buildingArea,
      lotDimensions: `${type.width} × ${type.length} m`,
      electricity: type.floors === 1 ? message("1.300 VA", "1,300 VA") : message("2.200 VA", "2,200 VA"),
      water: "PDAM",
      garage: message("1 mobil sesuai denah brosur", "1 car as shown in the brochure plan"),
      photo: imageRoot + key + ".webp",
      alt: message(`Ilustrasi fasad ${name}`, `Illustrated facade of the ${name}`),
      gallery: [{ src: imageRoot + key + "-interior.webp", alt: message(`Ilustrasi interior ${name}`, `Illustrated interior of the ${name}`) }],
      plans: Array.from({ length: type.floors }, (_, index) => ({
        label: index === 0 ? message("Denah lantai dasar", "Ground-floor plan") : message("Denah lantai atas", "Upper-floor plan"),
        src: imageRoot + key + "-denah-" + (index + 1) + ".webp",
      })),
      brochure: `documents/eco-ardence/${key}.pdf`,
      description: message(
        `${name} adalah rumah ${type.floors} lantai di klaster EcoArdence, Paradise Serpong City 2. Brosur menampilkan ${type.bedrooms} kamar tidur utama dan ${type.bathrooms} kamar mandi${type.maidBedrooms ? ", ditambah 1 kamar tidur dan 1 kamar mandi servis" : ""}.`,
        `The ${name} is a ${type.floors}-storey house in the EcoArdence cluster at Paradise Serpong City 2. The brochure shows ${type.bedrooms} bedrooms and ${type.bathrooms} bathrooms${type.maidBedrooms ? ", plus one service bedroom and one service bathroom" : ""}.`,
      ),
      facilityCards,
      smartHome,
      technicalSpecs: materials(type.name === "Fiora"),
      showUnitLocations: galleryLocations,
    };
  });

  return { project, cluster, units };
})();
