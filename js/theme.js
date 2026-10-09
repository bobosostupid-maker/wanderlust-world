// Set the saved preference before paint. With no override, CSS follows the system.
document.documentElement.classList.add("js-enabled");
try {
  const theme = localStorage.getItem("ww_theme");
  if (theme === "light" || theme === "dark")
    document.documentElement.dataset.theme = theme;
} catch (_) {
  /* System preference remains available when storage is restricted. */
}
