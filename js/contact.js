(async () => {
  await siteContent.ready;
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const details = new FormData(form);
    const body = [
      `Nama: ${details.get("name")}`,
      `WhatsApp / Seluler: ${details.get("phone")}`,
      `Email: ${details.get("email")}`,
      `Tujuan konsultasi: ${details.get("purpose")}`,
      "",
      "Kriteria khusus:",
      details.get("notes").trim() || "-",
    ].join("\r\n");

    status.textContent = "Periksa draf di aplikasi email Anda, lalu kirim dari sana.";
    window.location.href = `${form.action}?subject=${encodeURIComponent("Permintaan Konsultasi ORVA")}&body=${encodeURIComponent(body)}`;
  });

  form.hidden = false;
})();
