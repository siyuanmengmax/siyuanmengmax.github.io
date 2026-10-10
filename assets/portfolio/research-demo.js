(() => {
  "use strict";
  const panels = [...document.querySelectorAll(".study-panel")];
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  const c = document.getElementById("study-canvas"),
    g = c.getContext("2d");
  const buttons = [...document.querySelectorAll(".stage-button")],
    toggle = document.getElementById("study-overlay"),
    pause = document.getElementById("study-pause");
  let stage = 0,
    t = 3,
    paused = motionPreference.matches,
    frameId = 0,
    visible = true,
    last = 0,
    w = 600,
    h = 320;
  function pauseLabel() {
    pause.textContent = paused ? pause.dataset.play : pause.dataset.pause;
    pause.setAttribute("aria-pressed", String(paused));
  }
  function select(n) {
    stage = n;
    buttons.forEach((button, i) => {
      button.classList.toggle("active", i === n);
      button.setAttribute("aria-pressed", String(i === n));
      panels[i].hidden = i !== n;
    });
    document.getElementById("demo-stage-label").textContent = panels[n].dataset.method;
    document.getElementById("overlay-label").textContent = panels[n].dataset.overlay;
    draw();
  }
  buttons.forEach((b, i) => b.addEventListener("click", () => select(i)));
  buttons.forEach((button, i) =>
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (i + 1) % buttons.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (i + buttons.length - 1) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next);
      buttons[next].focus();
    })
  );
  toggle.addEventListener("change", draw);
  pause.addEventListener("click", () => {
    paused = !paused;
    pauseLabel();
    syncAnimation();
  });
  function resize() {
    const r = c.getBoundingClientRect();
    w = r.width || 600;
    h = r.height || 320;
    const d = Math.min(devicePixelRatio || 1, 2);
    c.width = w * d;
    c.height = h * d;
    g.setTransform(d, 0, 0, d, 0, 0);
    draw();
  }
  new ResizeObserver(resize).observe(c);
  new IntersectionObserver(
    (e) => {
      visible = e[0].isIntersecting;
      syncAnimation();
    },
    { threshold: 0.05 }
  ).observe(c);
  function xy(x, y) {
    return [w * (0.08 + x * 0.84), h * (0.13 + y * 0.74)];
  }
  function path(points, color, width = 1, dash = []) {
    g.beginPath();
    points.forEach(([x, y], i) => {
      const p = xy(x, y);
      i ? g.lineTo(...p) : g.moveTo(...p);
    });
    g.strokeStyle = color;
    g.lineWidth = width;
    g.setLineDash(dash);
    g.stroke();
    g.setLineDash([]);
  }
  function dot(x, y, color, size = 1.4) {
    const p = xy(x, y);
    g.fillStyle = color;
    g.fillRect(p[0] - size / 2, p[1] - size / 2, size, size);
  }
  function carsAt(q) {
    if (stage === 3) {
      const u = (q % 10) / 10;
      return [
        { x: 0.08 + 0.84 * u, y: 0.49, a: 0, color: "#cfe49c", id: "A" },
        { x: 0.51, y: 0.92 - 0.84 * u, a: Math.PI / 2, color: "#72bfaf", id: "B" },
      ];
    }
    const u = (q % 12) / 12;
    return [
      { x: 0.05 + 0.9 * u, y: 0.37, a: 0, color: "#cfe49c", id: "01" },
      { x: 0.93 - 0.85 * u, y: 0.65, a: 0, color: "#72bfaf", id: "02" },
      { x: 0.05 + 0.9 * ((u + 0.48) % 1), y: 0.37, a: 0, color: "#d4b980", id: "03" },
    ];
  }
  function vehicle(v) {
    g.save();
    const [x, y] = xy(v.x, v.y);
    g.translate(x, y);
    g.rotate(v.a);
    const bw = w * 0.071,
      bh = h * 0.071;
    for (let k = 0; k < 37; k++) {
      g.fillStyle = stage === 0 || !toggle.checked ? "#c9dcc4" : v.color;
      g.fillRect((((k * 13) % 37) / 37 - 0.5) * bw, (((k * 19) % 31) / 31 - 0.5) * bh, 2, 2);
    }
    if (stage > 0 && toggle.checked) {
      g.strokeStyle = v.color;
      g.lineWidth = 1;
      g.strokeRect(-bw * 0.63, -bh * 0.7, bw * 1.26, bh * 1.4);
    }
    g.restore();
    if (stage === 2 && toggle.checked) {
      g.fillStyle = v.color;
      g.font = "10px monospace";
      g.fillText("ID " + v.id, x - 10, y - 19);
    }
  }
  function draw() {
    g.clearRect(0, 0, w, h);
    const on = toggle.checked;
    const fade = stage === 0 && on;
    for (let i = 0; i < 500; i++) {
      const x = ((i * 37) % 499) / 499,
        y = ((i * 113) % 503) / 503;
      const road = stage === 3 ? Math.abs(y - 0.5) < 0.18 || Math.abs(x - 0.5) < 0.18 : Math.abs(y - 0.5) < 0.27;
      if (!road) dot(x, y, fade ? "#18332e" : i % 3 ? "#446a59" : "#809e78");
    }
    if (stage === 3) {
      path(
        [
          [0, 0.32],
          [0.32, 0.32],
          [0.32, 0],
        ],
        "#426254"
      );
      path(
        [
          [0.68, 0],
          [0.68, 0.32],
          [1, 0.32],
        ],
        "#426254"
      );
      path(
        [
          [0, 0.68],
          [0.32, 0.68],
          [0.32, 1],
        ],
        "#426254"
      );
      path(
        [
          [0.68, 1],
          [0.68, 0.68],
          [1, 0.68],
        ],
        "#426254"
      );
    } else {
      path(
        [
          [0, 0.22],
          [1, 0.22],
        ],
        "#426254"
      );
      path(
        [
          [0, 0.78],
          [1, 0.78],
        ],
        "#426254"
      );
      path(
        [
          [0, 0.5],
          [1, 0.5],
        ],
        "#668471",
        1,
        [8, 10]
      );
    }
    const cars = carsAt(t);
    if (stage === 2 && on) {
      cars.forEach((v) => {
        const pts = [];
        for (let k = 0; k < 24; k++) {
          const old = carsAt(t - k * 0.07).find((x) => x.id === v.id);
          if (Math.abs(old.x - v.x) < 0.4) pts.push([old.x, old.y]);
        }
        if (pts.length) path(pts, v.color, 2);
      });
    }
    if (stage === 3 && on) {
      path(
        [
          [0.08, 0.49],
          [0.92, 0.49],
        ],
        "#cfe49c",
        1,
        [5, 5]
      );
      path(
        [
          [0.51, 0.92],
          [0.51, 0.08],
        ],
        "#72bfaf",
        1,
        [5, 5]
      );
      cars.forEach((v) => {
        const [x, y] = xy(v.x, v.y);
        g.beginPath();
        g.ellipse(x, y, w * 0.069, h * 0.087, 0, 0, Math.PI * 2);
        g.fillStyle = v.id === "A" ? "#cfe49c20" : "#72bfaf20";
        g.fill();
        g.strokeStyle = v.id === "A" ? "#cfe49c77" : "#72bfaf77";
        g.stroke();
      });
    }
    cars.forEach(vehicle);
    if (stage === 1) {
      [
        [0.15, 0.12],
        [0.83, 0.9],
      ].forEach(([x, y], i) => {
        const p = xy(x, y);
        g.fillStyle = "#90b9aa";
        g.beginPath();
        g.arc(...p, 3, 0, Math.PI * 2);
        g.fill();
        g.font = "9px monospace";
        g.fillText("L" + (i + 1), p[0] + 8, p[1] + 3);
      });
    }
    g.fillStyle = "#9cb2a3";
    g.font = "10px monospace";
    g.fillText(c.dataset.caption, 20, h - 12);
  }
  function frame(now) {
    if (last) t += Math.min((now - last) / 1000, 0.06);
    last = now;
    draw();
    frameId = requestAnimationFrame(frame);
  }
  function syncAnimation() {
    cancelAnimationFrame(frameId);
    last = 0;
    draw();
    if (!paused && visible && !document.hidden) frameId = requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", syncAnimation);
  motionPreference.addEventListener("change", (event) => {
    paused = event.matches;
    pauseLabel();
    syncAnimation();
  });
  select(0);
  pauseLabel();
  resize();
  syncAnimation();
})();
