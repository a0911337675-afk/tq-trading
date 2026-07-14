const dailyArticleCards = document.querySelector("#dailyArticleCards");

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
    return String(value || "").slice(0, 10).replaceAll("-", "/") || "尚未發布";
}

async function requestJson(url) {
    const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
    });
    const payload = await response.json();
    if (!response.ok) {
        throw new Error(payload.error || "載入失敗");
    }
    return payload;
}

function getPayloadList(payload, key) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.value)) return payload.value;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
}

function articleTemplate(article) {
    const excerpt = article.excerpt?.length > 104
        ? `${article.excerpt.slice(0, 104)}...`
        : article.excerpt || "";
    return `
        <article class="article-card" data-category="${escapeHtml(article.category || "每日大事")}">
            <div class="article-card-body">
                <div class="card-topline">
                    <span>${escapeHtml(article.category || "每日大事")}</span>
                </div>
                <h3><a href="/articles/${escapeHtml(article.slug)}">${escapeHtml(article.title || "未命名文章")}</a></h3>
                <p>${escapeHtml(excerpt)}</p>
                <div class="article-meta">
                    <span>${escapeHtml(formatDate(article.published_at || article.created_at))}</span>
                    <span>閱讀 4 分鐘</span>
                </div>
            </div>
        </article>
    `;
}

async function loadDailyArticles() {
    const payload = await requestJson("/api/articles?category=daily-news");
    const articles = getPayloadList(payload, "articles");
    dailyArticleCards.innerHTML = articles.length
        ? articles.map(articleTemplate).join("")
        : `<section class="empty-state automated-news"><h2>尚未上傳</h2></section>`;
}

loadDailyArticles().catch((error) => {
    dailyArticleCards.innerHTML = `<p class="article-empty">${escapeHtml(error.message)}</p>`;
});
