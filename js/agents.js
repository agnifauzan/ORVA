(async () => {
  const template = document.getElementById("agent-card-template");
  const list = document.querySelector("#agent .grid-3");

  try {
    const agents = await cmsApi.list("agents");
    const cards = agents.map((agent) => {
      const card = template.content.firstElementChild.cloneNode(true);
      siteContent.text(card.querySelector("h4"), agent.name);
      siteContent.text(card.querySelector(".aspec"), agent.specialty ?? "");
      siteContent.text(card.querySelector(".aexp strong"), agent.experience ?? "");
      siteContent.text(card.querySelector(".aexp span"), agent.experienceLabel ?? "");
      const photo = card.querySelector("img");
      photo.alt = agent.name;
      siteContent.image(photo, agent.photo);
      siteContent.link(card.querySelector(".btn-outline"), agent.profile);
      siteContent.link(card.querySelector(".btn-gold"), agent.whatsapp);
      return card;
    });
    list.replaceChildren(...cards);
  } catch (error) {
    console.error("Gagal memuat daftar agen:", error);
  }
})();
