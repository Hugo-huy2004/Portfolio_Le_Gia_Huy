// Runs before first paint (CSP allows only same-origin scripts, so this can't be inline): saved theme, else the device's.
try {
  document.documentElement.dataset.theme = localStorage.getItem("hugo-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
} catch (error) {
  document.documentElement.dataset.theme = "dark";
}
