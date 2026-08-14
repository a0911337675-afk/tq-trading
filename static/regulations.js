const regulationCards = document.querySelector("#regulationCards");
const regulationCount = document.querySelector("#regulationCount");

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;",
    })[char]);
}

function formatDate(value) {
    return String(value || "").slice(0, 10).replaceAll("-", "/") || "日期待確認";
}

function regulationTemplate(article) {
    const excerpt = article.excerpt?.length > 180
        ? `${article.excerpt.slice(0, 180)}...`
        : article.excerpt || "點入查看本次規定的適用對象與實務重點。";
    return `
        <article class="regulation-entry">
            <div class="regulation-date">${escapeHtml(formatDate(article.published_at))}</div>
            <div class="regulation-entry-body">
                <span class="regulation-type">${escapeHtml(article.category || "法規資料庫")}</span>
                <h3><a href="/articles/${escapeHtml(article.slug)}">${escapeHtml(article.title || "未命名法規動態")}</a></h3>
                <p>${escapeHtml(excerpt)}</p>
                <a class="regulation-read" href="/articles/${escapeHtml(article.slug)}">查看整理內容 <span aria-hidden="true">→</span></a>
            </div>
        </article>
    `;
}

async function loadRegulations() {
    const response = await fetch("/api/articles?category=regulations");
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "法規資料載入失敗");
    const articles = Array.isArray(payload) ? payload : payload.articles || [];
    regulationCount.textContent = `${articles.length} 筆資料`;
    regulationCards.innerHTML = articles.length
        ? articles.map(regulationTemplate).join("")
        : `<section class="empty-state regulation-empty"><h2>尚無新增規定</h2><p>每日檢查完成後，有符合條件的新法規才會加入。</p></section>`;
}

loadRegulations().catch((error) => {
    regulationCount.textContent = "載入失敗";
    regulationCards.innerHTML = `<p class="article-empty">${escapeHtml(error.message)}</p>`;
});
