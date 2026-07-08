const root = document.documentElement;
const menuToggle = document.querySelector("#menuToggle");
const menuOverlay = document.querySelector("#menuOverlay");
const themeToggle = document.querySelector("#themeToggle");

function preferredTheme() {
    const saved = localStorage.getItem("tq-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("tq-theme", theme);
    if (!themeToggle) return;
    const dark = theme === "dark";
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", dark ? "切換為日間模式" : "切換為夜間模式");
    themeToggle.title = dark ? "日間模式" : "夜間模式";
}

function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuToggle?.setAttribute("aria-expanded", String(open));
    menuOverlay?.setAttribute("aria-hidden", String(!open));
}

document.querySelectorAll(".drawer-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    const active = href === "/"
        ? window.location.pathname === "/"
        : href === "/articles"
            ? window.location.pathname.startsWith("/articles")
            : window.location.pathname === href;
    link.classList.toggle("active", active);
});

applyTheme(preferredTheme());

themeToggle?.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

menuToggle?.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("menu-open"));
});

menuOverlay?.addEventListener("click", (event) => {
    if (event.target === menuOverlay || event.target.closest("[data-close-menu]")) {
        setMenu(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});
