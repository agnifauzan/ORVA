(async () => {
  const units = {
    "villa-tepi-danau": {
      name: "Villa Tepi Danau",
      location: "Sentul, Bogor",
      status: "Dijual",
      type: "Villa",
      price: "Rp 8,9 M",
      bedrooms: 4,
      bathrooms: 4,
      area: 380,
      photo: "property-1.svg",
      description: [
        "Villa Tepi Danau berada di Sentul, Bogor. Dengan luas 380 m², empat kamar tidur, dan empat kamar mandi, hunian ini memberi ruang untuk kegiatan keluarga sekaligus menerima tamu yang menginap.",
        "Empat kamar memberi beberapa pilihan penataan. Satu kamar bisa disiapkan untuk tamu, sementara kamar lain dapat dipakai sebagai ruang kerja. Saat survei, perhatikan hubungan antar-ruangan dan arah cahaya di bagian rumah yang akan paling sering digunakan.",
        "Jika Anda akan memakai vila ini setiap hari, coba tempuh rute dari rumah menuju tempat kerja, sekolah, atau pusat belanja yang biasa Anda kunjungi. Tim Lumira dapat membantu menjadwalkan survei dan mengonfirmasi detail unit yang ingin Anda cek.",
      ].join("\n\n"),
    },
    "penthouse-skyline": {
      name: "Penthouse Skyline",
      location: "Jakarta Selatan",
      status: "Dijual",
      type: "Penthouse",
      price: "Rp 12,5 M",
      bedrooms: 3,
      bathrooms: 3,
      area: 240,
      photo: "property-2.svg",
      description: [
        "Penthouse Skyline adalah unit seluas 240 m² dengan tiga kamar tidur dan tiga kamar mandi di Jakarta Selatan. Unit ini bisa dipertimbangkan oleh keluarga yang mencari hunian di dalam kota dengan ruang untuk bekerja dan beristirahat.",
        "Saat berkunjung, coba bayangkan rutinitas dari tiba di gedung hingga masuk ke unit. Perhatikan akses lift dan area penerimaan tamu, lalu cek ukuran kamar jika Anda berencana membawa furnitur sendiri. Jika memungkinkan, lihat kondisi cahaya pada jam ketika Anda biasanya berada di rumah.",
        "Sebelum membandingkannya dengan pilihan lain, tanyakan rincian fasilitas gedung, ketentuan parkir, dan biaya pengelolaan yang berlaku. Tim Lumira bisa membantu mengatur kunjungan serta meneruskan pertanyaan Anda ke pengelola unit.",
      ].join("\n\n"),
    },
    "rumah-modern-cluster": {
      name: "Rumah Modern Cluster",
      location: "BSD City, Tangerang Selatan",
      status: "Disewa",
      type: "Rumah",
      price: "Rp 45 Jt / bulan",
      bedrooms: 4,
      bathrooms: 3,
      area: 210,
      photo: "property-3.svg",
      description: [
        "Rumah Modern Cluster adalah rumah sewa seluas 210 m² di BSD City, Tangerang Selatan. Empat kamar tidur dan tiga kamar mandi memberi keluarga beberapa pilihan untuk membagi ruang tidur, ruang tamu, dan ruang kerja sesuai kebutuhan.",
        "Pada kunjungan pertama, ukur area yang akan ditempati furnitur besar dan perhatikan akses kendaraan untuk hari pindahan. Jika Anda bekerja dari rumah, coba tentukan kamar yang paling sesuai untuk meja kerja dan tanyakan pilihan layanan internet yang tersedia.",
        "Saat membahas sewa, sampaikan tanggal pindah dan durasi yang Anda inginkan. Tim Lumira dapat membantu menanyakan ketersediaan unit, perlengkapan yang termasuk dalam sewa, serta pengaturan serah terima dengan pemilik.",
      ].join("\n\n"),
    },
    "townhouse-tropis": {
      name: "Townhouse Tropis",
      location: "Cilandak, Jakarta Selatan",
      status: "Dijual",
      type: "Townhouse",
      price: "Rp 3,2 M",
      bedrooms: 3,
      bathrooms: 3,
      area: 160,
      photo: "property-4.svg",
      description: [
        "Townhouse Tropis berlokasi di Cilandak, Jakarta Selatan. Hunian seluas 160 m² ini memiliki tiga kamar tidur dan tiga kamar mandi, dengan pilihan pembagian ruang untuk keluarga, tamu, atau bekerja dari rumah.",
        "Ketika melihat unit, coba berjalan dari pintu masuk ke ruang yang paling sering Anda gunakan. Perhatikan apakah jalurnya cocok untuk rutinitas harian dan ukur area tempat Anda ingin meletakkan sofa, meja makan, atau lemari. Amati juga bagaimana cahaya masuk ke tiap kamar.",
        "Luangkan waktu untuk mengenali jalan di sekitarnya dan mencoba rute ke tujuan harian Anda. Bila ingin melihat unit pada waktu tertentu atau mengecek ukuran ruangan lebih rinci, hubungi tim Lumira untuk menjadwalkan kunjungan.",
      ].join("\n\n"),
    },
    "residence-bukit-asri": {
      name: "Residence Bukit Asri",
      location: "Sentul City, Bogor",
      status: "Dijual",
      type: "Rumah",
      price: "Rp 14,5 M",
      bedrooms: 5,
      bathrooms: 6,
      area: 420,
      photo: "hero.jpg",
      description: [
        "Residence Bukit Asri merupakan listing eksklusif Lumira di Sentul City, Bogor. Dengan luas 420 m², lima kamar tidur, dan enam kamar mandi, hunian ini dapat dipertimbangkan oleh keluarga yang membutuhkan lebih banyak ruang untuk anggota keluarga dan tamu.",
        "Kelima kamar dapat dibagi sesuai kebutuhan. Sebagian dapat digunakan sebagai kamar keluarga, sementara satu kamar bisa disiapkan untuk tamu atau dijadikan ruang kerja. Saat kunjungan, lihat jarak antara kamar yang akan dipakai sehari-hari dan area berkumpul, terutama jika beberapa generasi akan tinggal bersama.",
        "Sampaikan kepada tim Lumira jika ada bagian rumah yang ingin Anda ukur atau lihat lebih lama. Tim kami dapat membantu mengatur kunjungan dan mengonfirmasi rincian unit sebelum Anda membandingkannya dengan pilihan lain di Sentul.",
      ].join("\n\n"),
    },
    "rumah-taman-bintaro": {
      name: "Rumah Taman Bintaro",
      location: "Bintaro, Tangerang Selatan",
      status: "Dijual",
      type: "Rumah",
      price: "Rp 2,75 M",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      photo: "property-villa.jpg",
      description: [
        "Rumah Taman Bintaro berada di Tangerang Selatan dengan luas 180 m², tiga kamar tidur, dan dua kamar mandi. Saat survei, perhatikan ukuran ruang keluarga dan posisi kamar yang paling sesuai untuk rutinitas harian.",
        "Bawa ukuran furnitur yang akan dipindahkan, lalu cek rute dari rumah ke tempat kerja atau sekolah. Tim Lumira dapat membantu menjadwalkan kunjungan.",
      ].join("\n\n"),
    },
    "apartemen-senopati": {
      name: "Apartemen Senopati",
      location: "Senopati, Jakarta Selatan",
      status: "Dijual",
      type: "Apartemen",
      price: "Rp 4,2 M",
      bedrooms: 2,
      bathrooms: 2,
      area: 115,
      photo: "property-2.svg",
      description: [
        "Apartemen Senopati adalah unit 115 m² dengan dua kamar tidur dan dua kamar mandi di Jakarta Selatan. Saat berkunjung, amati cahaya di ruang utama dan cek apakah ukuran kamar sesuai dengan kebutuhan Anda.",
        "Tim Lumira bisa membantu mengatur kunjungan serta mengonfirmasi fasilitas gedung, aturan parkir, dan biaya pengelolaan yang berlaku.",
      ].join("\n\n"),
    },
    "villa-bukit-sentul": {
      name: "Villa Bukit Sentul",
      location: "Sentul, Bogor",
      status: "Dijual",
      type: "Villa",
      price: "Rp 6,2 M",
      bedrooms: 4,
      bathrooms: 3,
      area: 290,
      photo: "about-villa.jpg",
      description: [
        "Villa Bukit Sentul menawarkan luas 290 m² dengan empat kamar tidur dan tiga kamar mandi. Pembagian kamar memberi ruang untuk keluarga, tamu yang menginap, atau kegiatan bekerja dari rumah.",
        "Saat survei, lihat akses kendaraan dari jalan utama dan perhatikan bagaimana cahaya masuk ke ruang yang akan paling sering digunakan. Hubungi Lumira untuk mengatur jadwal kunjungan.",
      ].join("\n\n"),
    },
    "townhouse-kemang": {
      name: "Townhouse Kemang",
      location: "Kemang, Jakarta Selatan",
      status: "Disewa",
      type: "Townhouse",
      price: "Rp 32 Jt / bulan",
      bedrooms: 3,
      bathrooms: 2,
      area: 145,
      photo: "property-4.svg",
      description: [
        "Townhouse sewa di Kemang ini memiliki luas 145 m², tiga kamar tidur, dan dua kamar mandi. Lihat langsung ukuran kamar dan akses dari area parkir agar lebih mudah merencanakan hari pindahan.",
        "Saat menghubungi Lumira, sampaikan tanggal pindah dan durasi sewa yang diinginkan. Tim kami dapat membantu mengonfirmasi ketersediaan dan perlengkapan yang termasuk dalam sewa.",
      ].join("\n\n"),
    },
  };

  const slug =
    new URLSearchParams(window.location.search).get("unit") ??
    "villa-tepi-danau";
  const byId = (id) => document.getElementById(id);

  const staticUnit = Object.hasOwn(units, slug) ? units[slug] : null;
  let unit = staticUnit
    ? { ...staticUnit, photo: `images/${staticUnit.photo}` }
    : null;

  if (propertyApi.available) {
    const loading = byId("unit-loading");
    loading.hidden = false;

    try {
      unit = (await propertyApi.getUnit(slug)) ?? unit;
    } catch (error) {
      console.error("Gagal mengambil detail properti dari Payload.", error);
      if (!unit) {
        byId("unit-error").hidden = false;
        return;
      }
    } finally {
      loading.hidden = true;
    }
  }

  if (!unit) {
    byId("unit-missing").hidden = false;
    return;
  }
  const fields = {
    breadcrumb: unit.name,
    title: unit.name,
    transaction: unit.status,
    location: unit.location,
    price: unit.price,
    type: unit.type,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    area: `${unit.area} m²`,
  };
  for (const [field, value] of Object.entries(fields)) {
    byId(`unit-${field}`).textContent = value;
  }

  const description = byId("unit-description");
  const paragraphs = unit.description?.trim().split(/\r?\n\s*\r?\n/) ?? [];
  for (const text of paragraphs.filter(Boolean)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    description.append(paragraph);
  }

  const photo = byId("unit-photo");
  if (unit.photo) {
    photo.src = unit.photo;
    photo.alt = unit.alt || `Foto ${unit.name}`;
  } else {
    photo.closest("figure").hidden = true;
  }

  const whatsapp = new URL(byId("unit-whatsapp").href);
  whatsapp.searchParams.set(
    "text",
    `Halo Lumira, saya ingin mengetahui lebih lanjut tentang ${unit.name} di ${unit.location}.`,
  );
  byId("unit-whatsapp").href = whatsapp.href;

  document.title = `${unit.name} — Lumira Property`;
  byId("unit-content").hidden = false;
})();
