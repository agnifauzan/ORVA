(async () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const button = form.querySelector('button[type="submit"]');
  const success = document.getElementById("contact-success");

  form.addEventListener("invalid", (event) => {
    const input = event.target;
    if (input.validity.valueMissing) {
      input.setCustomValidity(input.type === "radio"
        ? orvaLanguage.message("Pilih tujuan konsultasi.", "Choose a consultation purpose.")
        : orvaLanguage.message("Isi kolom ini.", "Fill in this field."));
    } else if (input.validity.typeMismatch) {
      input.setCustomValidity(orvaLanguage.message(
        "Masukkan alamat email yang valid.",
        "Enter a valid email address.",
      ));
    }
  }, true);

  form.addEventListener("input", (event) => {
    const input = event.target;
    if (input.type === "radio") {
      for (const option of form.elements.purpose) option.setCustomValidity("");
    } else {
      input.setCustomValidity("");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    const details = new FormData(form);
    const data = { source: form.dataset.contactSource };
    for (const field of ["name", "phone", "email", "purpose", "notes"]) {
      data[field] = String(details.get(field) ?? "").trim();
    }
    if (!data.name || !data.phone || !data.email || !data.purpose) {
      status.textContent = orvaLanguage.text("Lengkapi nama, WhatsApp, email, dan tujuan konsultasi.");
      return;
    }

    button.disabled = true;
    status.textContent = orvaLanguage.text("Mengirim permintaan…");
    try {
      await cmsApi.create("consultations", data);
      form.reset();
    } catch (error) {
      console.error("Gagal mengirim permintaan konsultasi:", error);
      status.textContent = orvaLanguage.text("Permintaan belum dapat dikonfirmasi. Isian Anda masih ada. Silakan coba lagi.");
      return;
    } finally {
      button.disabled = false;
    }
    if (typeof success.showModal === "function") {
      status.textContent = "";
      success.showModal();
    } else {
      status.textContent = orvaLanguage.text("Permintaan konsultasi sudah diterima. Tim ORVA akan menghubungi Anda.");
    }
  });

  success.addEventListener("close", () => button.focus());
  await siteContent.ready;
  form.hidden = false;
})();
