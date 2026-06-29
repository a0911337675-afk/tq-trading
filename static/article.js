const articleTitle = document.querySelector("#articleTitle");
const articleCategory = document.querySelector("#articleCategory");
const articleMeta = document.querySelector("#articleMeta");
const articleBody = document.querySelector("#articleBody");

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
    const response = await fetch(url);
    const payload = await response.json();
    if (!response.ok) {
        throw new Error(payload.error || "Article loading failed");
    }
    return payload;
}

function flushParagraph(parts, output) {
    if (!parts.length) return;
    output.push(`<p>${parts.join(" ")}</p>`);
    parts.length = 0;
}

function renderMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const output = [];
    const paragraph = [];
    let inList = false;
    let inCode = false;
    let codeLines = [];

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        if (line.startsWith("```")) {
            flushParagraph(paragraph, output);
            if (inCode) {
                output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
                codeLines = [];
                inCode = false;
            } else {
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            codeLines.push(rawLine);
            continue;
        }

        if (!line.trim()) {
            flushParagraph(paragraph, output);
            if (inList) {
                output.push("</ul>");
                inList = false;
            }
            continue;
        }

        const heading = line.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
            flushParagraph(paragraph, output);
            if (inList) {
                output.push("</ul>");
                inList = false;
            }
            const level = heading[1].length;
            output.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
            continue;
        }

        const bullet = line.match(/^[-*]\s+(.*)$/);
        if (bullet) {
            flushParagraph(paragraph, output);
            if (!inList) {
                output.push("<ul>");
                inList = true;
            }
            output.push(`<li>${escapeHtml(bullet[1])}</li>`);
            continue;
        }

        paragraph.push(escapeHtml(line.trim()));
    }

    flushParagraph(paragraph, output);
    if (inList) output.push("</ul>");
    if (inCode) output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    return output.join("");
}

async function loadArticle() {
    const slug = window.location.pathname.split("/").filter(Boolean).pop();
    const article = await requestJson(`/api/articles/${encodeURIComponent(slug)}`);
    document.title = `${article.title} - TQ Trading`;
    articleTitle.textContent = article.title;
    articleCategory.textContent = article.category;
    articleMeta.textContent = `by TQ Trading　${article.published_at.slice(0, 10)}`;
    articleBody.innerHTML = renderMarkdown(article.content);
}

loadArticle().catch((error) => {
    articleTitle.textContent = "文章載入失敗";
    articleBody.textContent = error.message;
});
