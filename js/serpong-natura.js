const serpongNatura = (() => {
  const { message, text } = orvaLanguage;
  const project = "Serpong Natura City";
  const developer = "PT Natura City Developments Tbk";
  const brochure = "https://linktr.ee/SerpongNaturaCity_Kit";
  const facilities = message(
    "Clubhouse\nKolam renang\nPusat kebugaran\nNatura Green Park\nLapangan olahraga\nMasjid Raya Natura",
    "Clubhouse\nSwimming pool\nFitness center\nNatura Green Park\nSports courts\nMasjid Raya Natura",
  );
  const clusterPhotos = {
    "orchard-park": "Orchard-Park-Tipe-39_11zon-scaled.webp",
    "the-signature": "imgi_4_Signature-Neo-Klasik-159-Fasad-Serpong-Natura-City-1100x550-1.webp",
    "river-valley": "River-Valley-Type-Everest-Gran-Paradiso_11zon.webp",
    "fidelia": "Premier-Fidelia-36-72_11zon.webp",
    "gardenia": "Prestige-Gardenia-Type-43-72_11zon.webp",
    "edelweiss": "Edelweiss-Type-39_rev_11zon.webp",
  };
  const imageRoot = "https://serpongnaturacity.co.id/wp-content/uploads/2026/02/";
  const orchardPlans = {
    "39/66": "Orchard-Park_denah-tipe-39_web-258x394.jpg",
    "61/72": "Orchard-Park_denah-tipe-61-72_web.jpg",
    "61/78": "Orchard-Park_denah-tipe-61-78_web.jpg",
  };
  // Home sizes and room counts: https://serpongnaturacity.co.id/berita-media/rumah-dijual-di-serpong/
  const clusters = [
    ["Orchard Park", [[39, 66, 2, 1], [61, 72, 3, 2], [61, 78, 3, 2]]],
    ["The Signature", [[113, 90, 3, 3], [123, 120, "3+1", "2+1"], [127, 120, "3+1", "3+1"], [137, 153, "3+1", "3+1"], [140, 153, "3+1", "3+1"], [159, 200, "3+1", "3+1"], [170, 200, "3+1", "3+1"]]],
    ["River Valley", [[64, 90, 3, 2, "Rumah Taman"], [80, 90, 3, 2, "Rumah Taman"], [80, 77, 3, 2, "Everest"], [68, 66, 3, 2, "Grand Paradiso"], [56, 60, 2, 2, "Alpine"], [62, 60, 3, 2, "Alpine 2"], [41, 60, 2, 1, "Montana"]]],
    ["Fidelia", [[36, 72, 2, 1], [62, 60, 2, 2], [27, 60, 1, 1]]],
    ["Gardenia", [[39, 60, 2, 1], [39, 81, 2, 1], [28, 60, 1, 1], [28, 81, 1, 1], [43, 72, 2, 1], [60, 81, 3, 2]]],
    ["Edelweiss", [[55, 72, 3, 2], [39, 72, 2, 1]]],
  ].map(([name, types]) => {
    const clusterSlug = name.toLowerCase().replaceAll(" ", "-");
    return {
      name,
      types: types.map(([buildingArea, landArea, bedrooms, bathrooms, model]) => {
        const size = `${buildingArea}/${landArea}`;
        const typeName = model ? `${model} ${size}` : message(`Tipe ${size}`, `Type ${size}`);
        const [mainBedrooms, maidBedrooms] = String(bedrooms).split("+").map(Number);
        const [mainBathrooms, maidBathrooms] = String(bathrooms).split("+").map(Number);
        return {
          slug: `serpong-natura-city-${clusterSlug}-${buildingArea}-${landArea}`,
          name: `${typeName} · ${name}`,
          cluster: name,
          location: project,
          developer,
          transaction: "jual",
          status: message("Proyek Baru", "New Development"),
          propertyType: "rumah",
          type: text("Rumah"),
          rawPrice: null,
          price: message("Hubungi untuk harga", "Enquire for pricing"),
          area: buildingArea,
          buildingArea,
          landArea,
          bedrooms: mainBedrooms,
          bathrooms: mainBathrooms,
          maidBedrooms,
          maidBathrooms,
          ...(clusterSlug === "orchard-park" && {
            floors: buildingArea === 39 ? 1 : 2,
            plans: [{
              src: "https://serpongnaturacity.co.id/wp-content/uploads/2024/10/" + orchardPlans[size],
              label: message(`Denah tipe ${size}`, `Floor plan for type ${size}`),
            }],
          }),
          photo: imageRoot + clusterPhotos[clusterSlug],
          alt: message(`Contoh fasad cluster ${name}`, `Example facade in the ${name} cluster`),
          photoIsExample: true,
          profileUrl: "kawasan.html?profil=serpong-natura-city",
          brochurePage: brochure,
          facilities,
          description: message(
            `${typeName} berada di cluster ${name}, ${project}, dengan luas bangunan ${buildingArea} m² dan luas tanah ${landArea} m². Foto menampilkan contoh fasad cluster.`,
            `${typeName} is in the ${name} cluster at ${project}, with ${buildingArea} m² of building area and ${landArea} m² of land. The photo shows an example facade from the cluster.`,
          ),
        };
      }),
    };
  });
  return { project, developer, brochure, clusters, units: clusters.flatMap(({ types }) => types) };
})();
