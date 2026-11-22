(() => {
  const { text: agentText, whatsappURL, setPhoto, profileURL } = agentApi;

  function setContact(link, agent) {
    const href = whatsappURL(agent);
    link.href = href || "contact.html#konsultasi";
    link.textContent = href ? agentText(agent.whatsapp?.label) || orvaLanguage.text("Chat WhatsApp") : orvaLanguage.text("Hubungi ORVA");
    link.target = href ? "_blank" : "_self";
  }

  async function renderCards(template) {
    const list = document.querySelector("#agent .grid-3");
    const agents = await cmsApi.list("agents");
    const cards = agents.map((agent) => {
      const card = template.content.firstElementChild.cloneNode(true);
      siteContent.text(card.querySelector("h4"), agent.name);
      const specialty = card.querySelector(".aspec");
      siteContent.text(specialty, agentText(agent.specialty));
      specialty.hidden = !agentText(agent.specialty);
      const experience = card.querySelector(".aexp");
      siteContent.text(experience.querySelector("strong"), agentText(agent.experience));
      siteContent.text(experience.querySelector("span"), agentText(agent.experienceLabel));
      experience.hidden = !agentText(agent.experience);
      setPhoto(card.querySelector("img"), agent);
      card.querySelector(".btn-outline").href = profileURL(agent);
      setContact(card.querySelector(".btn-gold"), agent);
      return card;
    });
    list.replaceChildren(...cards);
  }

  async function renderProfile(profile) {
    const status = document.getElementById("agent-profile-status");
    const id = new URLSearchParams(location.search).get("agent");
    if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
      status.textContent = orvaLanguage.text("Pilih agen dari Tim ORVA untuk melihat profilnya.");
      return;
    }

    let agent;
    try {
      const result = await cmsApi.read("agents", { "where[id][equals]": id, depth: "1", limit: "1" });
      [agent] = result.docs;
    } catch (error) {
      console.error("Gagal memuat profil agen:", error);
      status.textContent = orvaLanguage.text("Profil agen belum bisa dimuat. Coba muat ulang halaman.");
      return;
    }
    if (!agent) {
      status.textContent = orvaLanguage.text("Profil agen ini tidak tersedia.");
      return;
    }

    function field(name) {
      return document.getElementById(`agent-profile-${name}`);
    }

    function setField(name, value, selector) {
      const element = field(name);
      (selector ? element.querySelector(selector) : element).textContent = value;
      element.hidden = !value;
    }

    function setList(name, value) {
      const lines = agentText(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      field(name).querySelector("ul").replaceChildren(...lines.map((line) => {
        const item = document.createElement("li");
        item.textContent = orvaLanguage.text(line);
        return item;
      }));
      field(name).hidden = !lines.length;
    }

    document.title = `${agent.name} — ${orvaLanguage.text("Agen Properti ORVA")}`;
    setField("name", agent.name);
    setField("specialty", agentText(agent.specialty));
    const area = orvaLanguage.place(agentText(agent.serviceArea));
    setField("area", area, "dd");
    const years = agentText(agent.experience);
    const label = agentText(agent.experienceLabel);
    const experience = label && !/^(experience|pengalaman)$/i.test(label) ? `${years} ${label}` : years;
    setField("experience", years ? experience : "", "dd");
    field("facts").hidden = !area && !years;
    setField("bio", agentText(agent.bio), "p");
    setList("services", agent.services);
    setList("highlights", agent.experienceHighlights);

    field("initials").textContent = agent.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
    const image = field("photo");
    setPhoto(image, agent);
    image.hidden = false;
    setContact(field("whatsapp"), agent);
    const external = cmsApi.safeURL(agent.profile?.href, document.baseURI, ["http:", "https:"]);
    if (external && !agent.profile.href.trim().startsWith("#")) {
      const link = field("external");
      link.href = external;
      link.hidden = false;
    }

    status.hidden = true;
    profile.hidden = false;
  }

  const template = document.getElementById("agent-card-template");
  if (template) renderCards(template).catch((error) => console.error("Gagal memuat daftar agen:", error));
  const profile = document.getElementById("agent-profile");
  if (profile) renderProfile(profile);
})();
