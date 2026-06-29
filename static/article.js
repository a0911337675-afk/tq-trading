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

function closeList(state, output) {
    if (!state.type) return;
    output.push(`</${state.type}>`);
    state.type = "";
}

function renderMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const output = [];
    const paragraph = [];
    const listState = { type: "" };
    let inCode = false;
    let codeLines = [];
    let inCallout = false;

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();

        if (line.startsWith("```")) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
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

        if (line.trim() === ":::note") {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            output.push(`<aside class="article-note">`);
            inCallout = true;
            continue;
        }

        if (line.trim() === ":::") {
            flushParagraph(paragraph, output);
            if (inCallout) {
                output.push(`</aside>`);
                inCallout = false;
            }
            continue;
        }

        if (!line.trim()) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            continue;
        }

        const heading = line.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            const level = heading[1].length;
            output.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
            continue;
        }

        const quote = line.match(/^>\s?(.*)$/);
        if (quote) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            output.push(`<blockquote>${escapeHtml(quote[1])}</blockquote>`);
            continue;
        }

        const bullet = line.match(/^[-*]\s+(.*)$/);
        if (bullet) {
            flushParagraph(paragraph, output);
            if (listState.type !== "ul") {
                closeList(listState, output);
                output.push("<ul>");
                listState.type = "ul";
            }
            output.push(`<li>${escapeHtml(bullet[1])}</li>`);
            continue;
        }

        const ordered = line.match(/^\d+\.\s+(.*)$/);
        if (ordered) {
            flushParagraph(paragraph, output);
            if (listState.type !== "ol") {
                closeList(listState, output);
                output.push("<ol>");
                listState.type = "ol";
            }
            output.push(`<li>${escapeHtml(ordered[1])}</li>`);
            continue;
        }

        paragraph.push(escapeHtml(line.trim()));
    }

    flushParagraph(paragraph, output);
    closeList(listState, output);
    if (inCallout) output.push(`</aside>`);
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
