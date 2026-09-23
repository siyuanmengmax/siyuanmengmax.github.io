// Explicit page URLs win; use the remembered choice only when returning to the home page.
(() => {
  const key = "preferred-language";
  document.querySelectorAll("[data-language]").forEach((link) => {
    link.addEventListener("click", () => {
      try {
        localStorage.setItem(key, link.dataset.language);
      } catch (_) {
        /* Storage may be disabled. */
      }
    });
  });
  const english = document.querySelector('link[rel="alternate"][hreflang="en"]');
  const chinese = document.querySelector('link[rel="alternate"][hreflang="zh-CN"]');
  if (!english || !chinese) return;
  const enPath = new URL(english.href).pathname;
  const zhPath = new URL(chinese.href).pathname;
  // /zh/ is only the home page; do not redirect other translated pages.
  if (zhPath !== enPath + "zh/" || location.pathname !== enPath) return;
  try {
    if (localStorage.getItem(key) === "zh-CN") {
      location.replace(zhPath + location.search + location.hash);
    }
  } catch (_) {
    /* Ordinary links still work without storage. */
  }
})();
