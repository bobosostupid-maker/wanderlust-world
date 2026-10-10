// Apply the saved language before paint. English stays the default.
try {
  const lang = localStorage.getItem("ww_lang");
  if (lang === "zh-HK") {
    document.documentElement.lang = "zh-HK";
    document.documentElement.classList.add("i18n-pending");
  }
} catch (_) {
  /* English remains available when storage is restricted. */
}
