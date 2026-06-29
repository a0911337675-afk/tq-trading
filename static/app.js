const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const refreshButton = document.querySelector("#refreshButton");
const toast = document.querySelector("#toast");
const articleCards = document.querySelector("#articleCards");
const quickArticleLinks = document.querySelector("#quickArticleLinks");
const categoryRows = document.querySelector("#categoryRows");
const categoryList = document.querySelector("#categoryList");
const articleFilters = document.querySelector("#articleFilters");
let currentCategory = new URLSearchParams(window.location.search).get("category") || "";

function syncRouteMode() {
    document.body.classList.toggle("article-route", window.location.pathname === "/articles");
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\"": "&quot;",
            "'": "&#039;",
        };
        return entities[char];
    });
}

function formatDate(value) {
    return value.slice(0, 10).replaceAll("-", "/");
}

async function requestJson(url) {
    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
    });
    const payload = await response.json();
    if (!response.ok) {
        throw new Error(payload.error || "操作失敗");
    }
    return payload;
}

function articleTemplate(article) {
    const excerpt = article.excerpt.length > 96
        ? `${article.excerpt.slice(0, 96)}...`
        : article.excerpt;
    return `
        <article class="article-card" data-category="${escapeHtml(article.category)}">
            <div class="article-card-body">
                <div class="card-topline">
                    <span>${escapeHtml(article.category)}</span>
                </div>
                <h3><a href="/articles/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></h3>
                <p>${escapeHtml(excerpt)}</p>
                <div class="article-meta">
                    <span>${escapeHtml(formatDate(article.published_at))}</span>
                    <span>閱讀 8 分鐘</span>
                </div>
            </div>
        </article>
    `;
}

function categoryRowTemplate(category) {
    return `
        <tr>
            <td><span class="category-name">${escapeHtml(category.name)}</span></td>
            <td>${escapeHtml(category.description)}</td>
            <td><span class="badge">${category.article_count}</span></td>
            <td><span class="status-tag">${escapeHtml(category.status)}</span></td>
            <td><a class="text-link" href="/articles?category=${escapeHtml(category.slug)}" data-category-filter="${escapeHtml(category.name)}" data-category-slug="${escapeHtml(category.slug)}">查看文章</a></td>
        </tr>
    `;
}

function categoryListTemplate(category) {
    return `
        <button type="button" class="category-filter" data-category-filter="${escapeHtml(category.name)}" data-category-slug="${escapeHtml(category.slug)}">
            <span>${escapeHtml(category.name)}</span>
            <strong>${category.article_count}</strong>
        </button>
    `;
}

function articleFilterTemplate(category) {
    const active = currentCategory === category.slug
        || currentCategory === category.name
        || (currentCategory === "ai" && category.slug === "ai-econ-info-articles")
        ? " active"
        : "";
    return `
        <a class="article-filter${active}" href="/articles?category=${escapeHtml(category.slug)}" data-category-filter="${escapeHtml(category.name)}" data-category-slug="${escapeHtml(category.slug)}">
            ${escapeHtml(category.name)}
            <span>${category.article_count}</span>
        </a>
    `;
}

async function loadSummary() {
    const summary = await requestJson("/api/summary");
    document.querySelector("#productCount").textContent = summary.product_count;
    document.querySelector("#totalQuantity").textContent = summary.total_quantity;
    document.querySelector("#inventoryValue").textContent = summary.inventory_value;
    document.querySelector("#lowStockCount").textContent = summary.low_stock_count;
}

async function loadArticles(search = "", category = currentCategory) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const query = params.toString() ? `?${params.toString()}` : "";
    const payload = await requestJson(`/api/articles${query}`);
    articleCards.innerHTML = payload.articles.length
        ? payload.articles.map(articleTemplate).join("")
        : `<p class="article-empty">目前沒有符合條件的文章</p>`;
    quickArticleLinks.innerHTML = payload.articles.slice(0, 8).map((article) => `
        <a href="/articles/${escapeHtml(article.slug)}">
            <img src="/assets/stock-finance-banner.png" alt="">
            <span>${escapeHtml(article.title)}</span>
        </a>
    `).join("");
}

async function loadCategories() {
    const payload = await requestJson("/api/categories");
    categoryRows.innerHTML = payload.categories.map(categoryRowTemplate).join("");
    categoryList.innerHTML = payload.categories.map(categoryListTemplate).join("");
    articleFilters.innerHTML = `
        <a class="article-filter${currentCategory ? "" : " active"}" href="/articles" data-category-filter="" data-category-slug="">全部</a>
        ${payload.categories.map(articleFilterTemplate).join("")}
    `;
}

async function refresh() {
    await Promise.all([loadSummary(), loadArticles(searchInput.value.trim()), loadCategories()]);
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentCategory = "";
    history.pushState(null, "", searchInput.value.trim() ? `/?search=${encodeURIComponent(searchInput.value.trim())}` : "/");
    syncRouteMode();
    await loadArticles(searchInput.value.trim(), "");
    await loadCategories();
    await loadSummary();
});

refreshButton.addEventListener("click", refresh);

document.addEventListener("click", async (event) => {
    const filter = event.target.closest("[data-category-filter]");
    if (!filter) return;
    event.preventDefault();
    const category = filter.dataset.categoryFilter;
    const slug = filter.dataset.categorySlug || "";
    currentCategory = slug;
    searchInput.value = "";
    history.pushState(null, "", slug ? `/articles?category=${encodeURIComponent(slug)}` : "/articles");
    syncRouteMode();
    await loadArticles("", slug);
    await loadCategories();
    await loadSummary();
    document.querySelector("#articles").scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("popstate", async () => {
    syncRouteMode();
    currentCategory = new URLSearchParams(window.location.search).get("category") || "";
    await refresh();
});

syncRouteMode();
refresh().catch((error) => showToast(error.message));
