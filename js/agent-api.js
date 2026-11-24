const agentApi = (() => {
  let bundledAgents;

  function bundled() {
    bundledAgents ??= fetch("data/agents.json").then((response) => {
      if (!response.ok) throw new Error("Gagal memuat daftar agen bawaan ORVA.");
      return response.json();
    });
    return bundledAgents;
  }

  async function list() {
    try {
      return await cmsApi.list("agents", { "where[active][equals]": "true" });
    } catch (error) {
      console.warn("Menggunakan daftar agen bawaan ORVA:", error);
      return bundled();
    }
  }

  async function byId(id) {
    try {
      const { docs } = await cmsApi.read("agents", {
        "where[id][equals]": id,
        "where[active][equals]": "true",
        depth: "1",
        limit: "1",
      });
      return docs[0] ?? null;
    } catch (error) {
      console.warn("Menggunakan profil agen bawaan ORVA:", error);
      return (await bundled()).find((agent) => String(agent.id) === id) ?? null;
    }
  }

  function initials(agent) {
    return agent.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("");
  }

  function agentText(value) {
    const text = typeof value === "string" ? value.trim() : "";
    return text === "Spesialis [Area]" ? "" : orvaLanguage.text(text);
  }

  function whatsappURL(agent) {
    const href = cmsApi.safeURL(agent.whatsapp?.href, document.baseURI, ["https:"]);
    if (!href) return null;
    const url = new URL(href);
    if (url.hostname === "wa.me") {
      const number = url.pathname.replace(/^\//, "").replace(/\/$/, "");
      return /^\d{7,15}$/.test(number) && number !== "6281234567890" ? href : null;
    }
    if (url.hostname === "api.whatsapp.com") {
      const number = url.searchParams.get("phone") ?? "";
      return /^\d{7,15}$/.test(number) && number !== "6281234567890" ? href : null;
    }
    return null;
  }

  function setPhoto(image, agent) {
    const photo = cmsApi.media(agent.photo);
    image.hidden = !photo;
    if (!photo) return;
    image.alt = photo.alt || agent.name;
    image.addEventListener("error", () => {
      image.hidden = true;
    }, { once: true });
    image.src = photo.src;
  }

  function profileURL(agent) {
    return `agent-detail.html?agent=${encodeURIComponent(agent.id)}`;
  }

  return { list, byId, initials, text: agentText, whatsappURL, setPhoto, profileURL };
})();
