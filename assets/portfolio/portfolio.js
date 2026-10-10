(() => {
  "use strict";
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");

  let publicationCategory = "all";
  const search = document.getElementById("paper-search");
  function filterPapers() {
    let count = 0;
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll(".pub").forEach((p) => {
      const match =
        (publicationCategory === "all" || p.dataset.category === publicationCategory) &&
        p.querySelector(".pub-copy").textContent.toLowerCase().includes(query);
      p.hidden = !match;
      if (match) count++;
    });
    const status = document.getElementById("paper-count");
    status.textContent = count + " " + status.dataset.suffix;
    document.getElementById("no-papers").hidden = count > 0;
  }
  document.querySelectorAll(".filter").forEach((button) =>
    button.addEventListener("click", () => {
      publicationCategory = button.dataset.filter;
      document.querySelectorAll(".filter").forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      filterPapers();
    })
  );
  search.addEventListener("input", filterPapers);
  filterPapers();
  const canvas = document.getElementById("scene"),
    ctx = canvas.getContext("2d");
  let width = 0,
    height = 0,
    time = 0,
    last = 0;
  let paused = motionPreference.matches;
  let visible = true,
    frameId = 0;
  const pause = document.getElementById("pause");
  function sync() {
    pause.textContent = paused ? pause.dataset.play : pause.dataset.pause;
    pause.setAttribute("aria-pressed", String(paused));
  }
  sync();
  pause.addEventListener("click", () => {
    paused = !paused;
    sync();
    syncAnimation();
  });
  function resize() {
    const r = canvas.getBoundingClientRect();
    width = r.width;
    height = r.height;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  new ResizeObserver(resize).observe(canvas);
  function point(x, y, z = 0) {
    return [width * 0.5 + (x - y) * width * 0.032, height * 0.53 + (x + y) * height * 0.019 - z * height * 0.037];
  }
  function line(a, b, color, w = 1) {
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.stroke();
  }
  function box(x, y, w, l) {
    let p = [
        [x - w, y - l, 0],
        [x + w, y - l, 0],
        [x + w, y + l, 0],
        [x - w, y + l, 0],
      ],
      q = p.map((a) => [a[0], a[1], 1.3]);
    for (let i = 0; i < 4; i++) {
      line(point(...p[i]), point(...p[(i + 1) % 4]), "#64b193");
      line(point(...q[i]), point(...q[(i + 1) % 4]), "#cce59c");
      line(point(...p[i]), point(...q[i]), "#88b99a");
    }
    for (let k = 0; k < 30; k++) {
      let a = x - w + 2 * w * (((k * 17) % 31) / 31),
        b = y - l + 2 * l * (((k * 13) % 29) / 29);
      let c = point(a, b, 0.9);
      ctx.fillStyle = "#acd4aa";
      ctx.fillRect(c[0], c[1], 1.6, 1.6);
    }
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = -14; i <= 14; i++) {
      line(point(i, -14), point(i, 14), "#28413b", 0.5);
      line(point(-14, i), point(14, i), "#28413b", 0.5);
    }
    for (let x of [-5, 5]) line(point(x, -14), point(x, 14), "#567368");
    for (let y = -14; y < 14; y += 3) line(point(0, y), point(0, y + 1.3), "#74836a");
    for (let i = 0; i < 430; i++) {
      let x = (((i * 37) % 103) / 103) * 28 - 14,
        y = (((i * 61) % 107) / 107) * 28 - 14;
      if (Math.abs(x) < 6) continue;
      let p = point(x, y, ((i * 7) % 9) / 10);
      ctx.fillStyle = i % 4 === 0 ? "#7f9d6f" : "#355c50";
      ctx.fillRect(p[0], p[1], 1.7, 1.7);
    }
    for (let [x, y] of [
      [-7, -7],
      [7, 7],
    ]) {
      const p = point(x, y, 1.7);
      line(point(x, y), p, "#d8e7ad", 2);
      ctx.fillStyle = "#d6e7a6";
      ctx.beginPath();
      ctx.arc(...p, 3.5, 0, Math.PI * 2);
      ctx.fill();
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.ellipse(p[0], p[1], 18 + ((time * 15 + k * 30) % 90), (18 + ((time * 15 + k * 30) % 90)) * 0.48, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#91b97930";
        ctx.stroke();
      }
    }
    box(-2.5, ((time * 1.5 + 5) % 25) - 12, 0.9, 1.8);
    box(2.5, 12 - ((time * 1.2 + 10) % 25), 0.9, 1.65);
    box(-2.5, ((time * 1.5 + 17) % 25) - 12, 0.9, 1.65);
  }
  function render(stamp) {
    if (last) time += Math.min((stamp - last) / 1000, 0.06);
    last = stamp;
    draw();
    frameId = requestAnimationFrame(render);
  }
  function syncAnimation() {
    cancelAnimationFrame(frameId);
    last = 0;
    draw();
    if (!paused && visible && !document.hidden) frameId = requestAnimationFrame(render);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  }).observe(canvas);
  document.addEventListener("visibilitychange", syncAnimation);
  motionPreference.addEventListener("change", (event) => {
    paused = event.matches;
    sync();
    syncAnimation();
  });
  resize();
  syncAnimation();

  // A study link must still reveal its paper after a search or category filter.
  function revealPaper(hash) {
    if (!hash.startsWith("#paper-")) return;
    const paper = document.getElementById(hash.slice(1));
    if (!paper) return;
    search.value = "";
    document.querySelector('[data-filter="all"]').click();
    paper.scrollIntoView({ block: "start" });
  }
  document.querySelectorAll('a[href^="#paper-"]').forEach((link) => {
    link.addEventListener("click", () => revealPaper(link.hash));
  });
  window.addEventListener("hashchange", () => revealPaper(location.hash));
  revealPaper(location.hash);

  const languageLink = document.querySelector(".language-switch");
  languageLink.addEventListener("click", () => {
    languageLink.href = languageLink.pathname + location.search + location.hash;
  });
})();
