const agentApi = (() => {
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
    const fallback = "images/agent.jpg";
    image.alt = photo?.alt || agent.name;
    if (photo) {
      image.addEventListener("error", () => {
        image.alt = agent.name;
        image.src = fallback;
      }, { once: true });
    }
    image.src = photo?.src || fallback;
  }

  function profileURL(agent) {
    return `agent-detail.html?agent=${encodeURIComponent(agent.id)}`;
  }

  return { text: agentText, whatsappURL, setPhoto, profileURL };
})();
