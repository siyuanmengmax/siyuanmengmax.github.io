(() => {
  "use strict";
  const search = document.getElementById("paper-search");
  if (search) {
    let category = "all";
    const papers = [...document.querySelectorAll(".pub")];
    const filters = [...document.querySelectorAll("[data-filter]")];
    const filter = () => {
      const query = search.value.trim().toLowerCase();
      let count = 0;
      for (const paper of papers) {
        paper.hidden =
          !(category === "all" || category === paper.dataset.category) ||
          !paper.querySelector(".pub-copy").textContent.toLowerCase().includes(query);
        if (!paper.hidden) count++;
      }
      const status = document.getElementById("paper-count");
      status.textContent = `${count} ${status.dataset.suffix}`;
      document.getElementById("no-papers").hidden = count > 0;
    };
    filters.forEach((button) =>
      button.addEventListener("click", () => {
        category = button.dataset.filter;
        filters.forEach((b) => {
          b.classList.toggle("active", b === button);
          b.setAttribute("aria-pressed", String(b === button));
        });
        filter();
      }),
    );
    search.addEventListener("input", filter);
    filter();
    const reveal = () => {
      let id;
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {
        return;
      }
      // Preserve both homepage paper-* anchors and the old bibliography entry anchors.
      const paper = papers.find((p) => p.id === id || p.id === `paper-${id}`);
      if (!paper) return;
      search.value = "";
      filters.find((b) => b.dataset.filter === "all").click();
      paper.scrollIntoView({ block: "start" });
    };
    addEventListener("hashchange", reveal);
    document.querySelectorAll('a[href^="#paper-"]').forEach((a) =>
      a.addEventListener("click", () => {
        search.value = "";
        filters.find((b) => b.dataset.filter === "all").click();
      }),
    );
    reveal();
  }
  document.querySelectorAll("[data-language]").forEach((link) =>
    link.addEventListener("click", () => {
      link.href = link.pathname + location.search + location.hash;
      try {
        localStorage.setItem("preferred-language", link.dataset.language);
      } catch {
        /* Links still work without storage. */
      }
    }),
  );
  if (location.pathname === "/") {
    try {
      if (localStorage.getItem("preferred-language") === "zh-CN")
        location.replace("/zh/" + location.search + location.hash);
    } catch {
      /* A private browser may disable storage. */
    }
  }
})();
