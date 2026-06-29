const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const refreshButton = document.querySelector("#refreshButton");
const toast = document.querySelector("#toast");
const articleCards = document.querySelector("#articleCards");
const quickArticleLinks = document.querySelector("#quickArticleLinks");
const categoryRows = document.querySelector("#categoryRows");
const categoryList = document.querySelector("#categoryList");

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
    const excerpt = article.excerpt.length > 72
        ? `${article.excerpt.slice(0, 72)}...`
        : article.excerpt;
    return `
        <article class="article-card" data-category="${escapeHtml(article.category)}">
            <a href="/articles/${escapeHtml(article.slug)}">
                <img src="/assets/stock-finance-banner.png" alt="">
                <span class="category-pill">${escapeHtml(article.category)}</span>
            </a>
            <div>
                <h3><a href="/articles/${escapeHtml(article.slug)}">${escapeHtml(article.title)}</a></h3>
                <p class="meta">by TQ Trading　${escapeHtml(article.published_at.slice(0, 10))}</p>
                <p>${escapeHtml(excerpt)}</p>
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
            <td><a class="text-link" href="#articles" data-category-filter="${escapeHtml(category.name)}">查看文章</a></td>
        </tr>
    `;
}

function categoryListTemplate(category) {
    return `
        <button type="button" class="category-filter" data-category-filter="${escapeHtml(category.name)}">
            <span>${escapeHtml(category.name)}</span>
            <strong>${category.article_count}</strong>
        </button>
    `;
}

async function loadSummary() {
    const summary = await requestJson("/api/summary");
    document.querySelector("#productCount").textContent = summary.product_count;
    document.querySelector("#totalQuantity").textContent = summary.total_quantity;
    document.querySelector("#inventoryValue").textContent = summary.inventory_value;
    document.querySelector("#lowStockCount").textContent = summary.low_stock_count;
}

async function loadArticles(search = "") {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const payload = await requestJson(`/api/articles${query}`);
    articleCards.innerHTML = payload.articles.length
        ? payload.articles.map(articleTemplate).join("")
        : `<p>目前沒有符合條件的文章</p>`;
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
}

async function refresh() {
    await Promise.all([loadSummary(), loadArticles(searchInput.value.trim()), loadCategories()]);
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadArticles(searchInput.value.trim());
    await loadSummary();
});

refreshButton.addEventListener("click", refresh);

document.addEventListener("click", async (event) => {
    const filter = event.target.closest("[data-category-filter]");
    if (!filter) return;
    event.preventDefault();
    const category = filter.dataset.categoryFilter;
    searchInput.value = category;
    await loadArticles(category);
    await loadSummary();
    document.querySelector("#articles").scrollIntoView({ behavior: "smooth", block: "start" });
});

refresh().catch((error) => showToast(error.message));
