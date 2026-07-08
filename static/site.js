const root = document.documentElement;
const menuToggle = document.querySelector("#menuToggle");
const menuOverlay = document.querySelector("#menuOverlay");
const themeToggle = document.querySelector("#themeToggle");

const terminologyTerms = [
    "投資顧問",
    "期貨顧問",
    "期貨經理",
    "證券期貨局",
    "金管會",
    "全權委託",
    "投資建議",
    "代客操作",
    "法律責任",
    "民事責任",
    "刑事責任",
    "行政責任",
    "金融思維",
    "散戶思維",
    "量化交易",
    "程式工具",
    "看盤平台",
    "策略程式",
    "下單機",
    "券商",
    "交易所",
    "成交回報",
    "實際庫存",
    "資金配置",
    "最壞情境",
    "回測",
    "實盤",
    "策略",
    "滑價",
    "停損",
    "口數",
    "風控",
    "期貨",
].sort((a, b) => b.length - a.length);

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const terminologyPattern = new RegExp(terminologyTerms.map(escapeRegex).join("|"), "g");

function highlightTerminologyTextNode(node) {
    const text = node.nodeValue;
    terminologyPattern.lastIndex = 0;
    if (!text || !terminologyPattern.test(text)) return;
    terminologyPattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(terminologyPattern, (term, index) => {
        if (index > lastIndex) {
            fragment.append(document.createTextNode(text.slice(lastIndex, index)));
        }
        const mark = document.createElement("strong");
        mark.className = "term-highlight";
        mark.textContent = term;
        fragment.append(mark);
        lastIndex = index + term.length;
        return term;
    });

    if (lastIndex < text.length) {
        fragment.append(document.createTextNode(text.slice(lastIndex)));
    }
    node.parentNode.replaceChild(fragment, node);
}

function highlightTerminology(rootElement) {
    if (!rootElement) return;
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || parent.closest("a, code, pre, script, style, .term-highlight")) {
                return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
        },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(highlightTerminologyTextNode);
}

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

highlightTerminology(document.querySelector(".faq-list"));
