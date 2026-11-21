(async () => {
  await siteContent.ready;
  const price = document.getElementById("c-harga");
  const downPayment = document.getElementById("c-dp");
  const term = document.getElementById("c-tenor");
  const interest = document.getElementById("c-bunga");
  const payment = document.querySelector("[data-kpr-payment]");
  const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
  const millions = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  function parseAmount(value) {
    return Number.parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
  }

  function updatePayment() {
    const propertyPrice = parseAmount(price.value);
    const upfrontPercent = parseAmount(downPayment.value);
    const months = parseAmount(term.value) * 12;
    const monthlyRate = parseAmount(interest.value) / 1200;
    if (!(propertyPrice > 0 && upfrontPercent >= 0 && upfrontPercent <= 100 &&
      months > 0 && monthlyRate >= 0)) {
      payment.textContent = "—";
      return;
    }

    const principal = propertyPrice * (1 - upfrontPercent / 100);
    const amount = monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);

    payment.textContent = amount >= 1_000_000
      ? `Rp ${millions.format(amount / 1_000_000)} Jt`
      : `Rp ${rupiah.format(amount)}`;
  }

  for (const input of [price, downPayment, term, interest]) {
    input.addEventListener("input", updatePayment);
  }

  price.addEventListener("blur", () => {
    const amount = parseAmount(price.value);
    price.value = Number.isFinite(amount) ? `Rp ${rupiah.format(amount)}` : "";
    updatePayment();
  });

  updatePayment();
})();
