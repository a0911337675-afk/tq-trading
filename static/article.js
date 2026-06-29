const articleTitle = document.querySelector("#articleTitle");
const articleCategory = document.querySelector("#articleCategory");
const articleMeta = document.querySelector("#articleMeta");
const articleBody = document.querySelector("#articleBody");

const articleLinkMap = {
    "00_index.md": "trading-history-series",
    "01_trade_origin.md": "trade-origin",
    "02_open_outcry.md": "open-outcry-era",
    "03_math_enters_finance.md": "math-enters-finance",
    "04_technical_analysis.md": "technical-analysis-formulas",
    "05_program_trading_birth.md": "program-trading-birth",
    "06_quant_funds.md": "legendary-quant-funds",
    "07_high_frequency_trading.md": "high-frequency-trading",
    "08_statistical_arbitrage.md": "statistical-arbitrage",
    "09_modern_quant_system.md": "modern-quant-system",
    "10_ai_machine_learning.md": "ai-machine-learning-trading",
    "11_crypto_quant.md": "crypto-quant-trading",
    "12_profitable_strategies.md": "profitable-strategy-types",
    "13_formula_library.md": "trading-formula-library",
    "14_major_quant_firms.md": "major-quant-firms",
    "15_future_of_trading.md": "future-of-trading",
};

const seriesTitleMap = {
    "第一章｜交易的起源：從股份公司到現代市場": "trade-origin",
    "第二章｜人工喊價時代：交易員、交易池與資訊優勢": "open-outcry-era",
    "第三章｜數學正式進入金融：從平均數到投資組合理論": "math-enters-finance",
    "第四章｜技術分析黃金年代：大眾最常用的交易公式": "technical-analysis-formulas",
    "第五章｜程式交易的誕生：國外何時開始自動化交易": "program-trading-birth",
    "第六章｜傳奇量化基金：從 Jim Simons 到現代 Quant": "legendary-quant-funds",
    "第七章｜高頻交易：速度、延遲與市場微結構": "high-frequency-trading",
    "第八章｜統計套利：Z-score、配對交易與均值回歸": "statistical-arbitrage",
    "第九章｜現代量化交易系統：從 Python 到 API 自動下單": "modern-quant-system",
    "第十章｜AI 如何改變交易：從機器學習到大型語言模型": "ai-machine-learning-trading",
    "第十一章｜加密貨幣量化：24 小時市場的新實驗場": "crypto-quant-trading",
    "第十二章｜真正長期存在的策略：趨勢、均值、套利與做市": "profitable-strategy-types",
    "第十三章｜大眾最常用金融數學公式總整理": "trading-formula-library",
    "第十四章｜現代大型量化公司：技術、人才與護城河": "major-quant-firms",
    "第十五章｜未來十年交易會如何演變：AI Agent、量子運算與自適應系統": "future-of-trading",
};

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

function normalizeHref(href) {
    const cleaned = href.trim();
    const fileName = cleaned.replace(/^\.?\//, "").split("#")[0];
    if (articleLinkMap[fileName]) {
        return `/articles/${articleLinkMap[fileName]}`;
    }
    if (cleaned.startsWith("/articles/") || cleaned.startsWith("#")) {
        return cleaned;
    }
    if (/^https?:\/\//.test(cleaned)) {
        return cleaned;
    }
    return "#";
}

function normalizeImageSrc(src) {
    const cleaned = src.trim();
    if (cleaned.startsWith("/assets/") || /^https?:\/\//.test(cleaned)) {
        return cleaned;
    }
    return "";
}

function renderInline(value) {
    const parts = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkPattern.exec(value)) !== null) {
        parts.push(escapeHtml(value.slice(lastIndex, match.index)));
        parts.push(`<a href="${escapeHtml(normalizeHref(match[2]))}">${escapeHtml(match[1])}</a>`);
        lastIndex = match.index + match[0].length;
    }
    parts.push(escapeHtml(value.slice(lastIndex)));

    return parts.join("")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderImage(alt, src) {
    const safeSrc = normalizeImageSrc(src);
    if (!safeSrc) return "";
    const caption = alt.trim();
    return `
        <figure class="article-image">
            <a href="${escapeHtml(safeSrc)}" target="_blank" rel="noopener">
                <img src="${escapeHtml(safeSrc)}" alt="${escapeHtml(caption)}" loading="lazy">
            </a>
            ${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}
        </figure>
    `;
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

function simplifyFormula(formula) {
    return formula
        .replace(/^\\\[/, "")
        .replace(/\\\]$/, "")
        .replace(/\\left/g, "")
        .replace(/\\right/g, "")
        .replace(/\\times/g, " × ")
        .replace(/\\sum/g, "Σ")
        .replace(/\\sqrt/g, "√")
        .replace(/\\ln/g, "ln")
        .replace(/\\sigma/g, "σ")
        .replace(/\\mu/g, "μ")
        .replace(/\\beta/g, "β")
        .replace(/\\alpha/g, "α")
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1) / ($2)")
        .replace(/\s+/g, " ")
        .trim();
}

function explainFormula(formula) {
    const compact = formula.replace(/\s+/g, "");
    const rules = [
        ["平均數", /mu=|\\mu=|sum_\{i=1\}\^\{n\}x_i/],
        ["標準差", /sigma=|\\sigma=|sqrt/],
        ["Z-score", /Z=|x-\\mu|x-mu/],
        ["簡單報酬", /R_t=|P_t-P_\{t-1\}/],
        ["對數報酬", /r_t=|ln/],
        ["最大回撤", /MDD=/],
        ["移動平均", /SMA/],
        ["指數移動平均", /EMA/],
        ["相對強弱指標", /RSI/],
        ["MACD", /MACD/],
        ["布林通道", /Upper=|Lower=/],
        ["真實波幅", /TR=max|ATR/],
        ["投資組合報酬", /E\\(R_p\\)|E\\(R_i\\)/],
        ["投資組合變異數", /sigma_p|Cov/],
        ["夏普比率", /Sharpe/],
        ["Beta", /beta=|\\beta=/],
        ["交易期望值", /Expectancy/],
        ["盈虧比", /PayoffRatio/],
        ["勝率", /WinRate/],
        ["Kelly 公式", /f\^\*=|bp-q/],
        ["VWAP", /VWAP/],
        ["委託簿失衡", /OBI|BidVolume/],
        ["滑價", /Slippage/],
        ["邏輯斯迴歸", /P\\(y=1\\)|e\^\{-z\}/],
        ["均方誤差", /MSE/],
        ["交叉熵", /L=-|log/],
    ];
    const matched = rules.find(([, pattern]) => pattern.test(compact));
    if (!matched) {
        return "這是一個交易研究公式，用來把市場資料轉成可以比較、回測或控管風險的數字。";
    }

    const details = {
        "平均數": "把一組數字加總後除以資料筆數，用來看資料的中心位置。",
        "標準差": "衡量資料上下波動有多大。標準差越大，代表變動越劇烈。",
        "Z-score": "衡量目前數值離平均值有幾個標準差，常用來判斷偏離是否過大。",
        "簡單報酬": "用今天價格和前一期價格比較，算出這一期漲跌百分比。",
        "對數報酬": "把價格比值取自然對數，適合做連續報酬與時間序列分析。",
        "最大回撤": "衡量資產從高點跌到低點的幅度，是風險控管常看的指標。",
        "移動平均": "把最近 n 期價格取平均，用來降低短期雜訊。",
        "指數移動平均": "比一般均線更重視近期價格，反應速度較快。",
        "相對強弱指標": "用漲跌動能衡量市場是否偏熱或偏弱。",
        "MACD": "比較快慢均線的差距，用來觀察趨勢動能變化。",
        "布林通道": "用均線加減標準差形成價格區間，觀察價格是否偏離常態範圍。",
        "真實波幅": "衡量價格單期波動幅度，常用在停損與部位大小控制。",
        "投資組合報酬": "把每個資產的預期報酬乘上權重後加總。",
        "投資組合變異數": "衡量整個投資組合的波動，會考慮資產彼此是否一起漲跌。",
        "夏普比率": "用每承擔一單位波動能換到多少超額報酬來評估績效。",
        "Beta": "衡量單一資產相對整體市場的敏感度。",
        "交易期望值": "把勝率、平均獲利、敗率、平均虧損合在一起，看長期是否有正期望。",
        "盈虧比": "平均獲利除以平均虧損，用來看賺一次是否足以抵消虧損。",
        "勝率": "獲利交易數除以總交易數。勝率高不一定代表策略好，還要看盈虧比。",
        "Kelly 公式": "用勝率和盈虧比估算理論下注比例，但實務上通常會降低使用。",
        "VWAP": "用成交量加權後的平均價格，常用來衡量成交是否接近市場平均成本。",
        "委託簿失衡": "比較買賣掛單量差異，用來觀察短線供需壓力。",
        "滑價": "實際成交價和預期成交價的差距，是實盤交易的重要成本。",
        "邏輯斯迴歸": "把模型輸出轉成 0 到 1 的機率，常用於分類問題。",
        "均方誤差": "衡量預測值和真實值差多少，誤差越小代表模型越貼近資料。",
        "交叉熵": "分類模型常用損失函數，用來衡量預測機率和真實答案的差距。",
    };
    return details[matched[0]];
}

function formulaBlock(formula) {
    const clean = formula.trim();
    return `
        <div class="formula-card">
            <div class="formula-label">公式</div>
            <code>${escapeHtml(simplifyFormula(clean))}</code>
            <p>${escapeHtml(explainFormula(clean))}</p>
        </div>
    `;
}

function closeList(state, output) {
    if (!state.type) return;
    output.push(`</${state.type}>`);
    state.type = "";
    state.className = "";
}

function openList(type, state, output, className = "") {
    if (state.type === type && state.className === className) return;
    closeList(state, output);
    output.push(className ? `<${type} class="${className}">` : `<${type}>`);
    state.type = type;
    state.className = className;
}

function renderSeriesItem(value) {
    const matched = value.match(/^\[([^\]]+)\]\(([^)]+)\)[：:]\s*(.*)$/);
    if (matched) {
        const [, title, href, description] = matched;
        return `
            <li class="series-shortcut">
                <a href="${escapeHtml(normalizeHref(href))}">
                    <span>${escapeHtml(title)}</span>
                    <em>${escapeHtml(description)}</em>
                </a>
            </li>
        `;
    }

    for (const [title, slug] of Object.entries(seriesTitleMap)) {
        const prefixes = [`${title}：`, `${title}:`];
        const prefix = prefixes.find((candidate) => value.startsWith(candidate));
        if (!prefix) continue;

        const description = value.slice(prefix.length).trim();
        return `
            <li class="series-shortcut">
                <a href="/articles/${escapeHtml(slug)}">
                    <span>${escapeHtml(title)}</span>
                    <em>${escapeHtml(description)}</em>
                </a>
            </li>
        `;
    }

    return `<li>${renderInline(value)}</li>`;
}

function renderMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const output = [];
    const paragraph = [];
    const listState = { type: "", className: "" };
    let inCode = false;
    let codeLines = [];
    let inCallout = false;
    let inFormula = false;
    let formulaLines = [];
    let inSeriesIndex = false;

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

        if (line.trim() === "\\[") {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            inFormula = true;
            formulaLines = [];
            continue;
        }

        if (inFormula) {
            if (line.trim() === "\\]") {
                output.push(formulaBlock(formulaLines.join(" ")));
                formulaLines = [];
                inFormula = false;
            } else {
                formulaLines.push(line.trim());
            }
            continue;
        }

        if (line.trim() === ":::note") {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            output.push(`<details class="article-note"><summary><span>🔔</span>重點說明</summary><div>`);
            inCallout = true;
            continue;
        }

        if (line.trim() === ":::") {
            flushParagraph(paragraph, output);
            if (inCallout) {
                output.push(`</div></details>`);
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
            const headingText = heading[2].trim();
            inSeriesIndex = headingText === "系列文章目錄";
            output.push(`<h${level}>${renderInline(headingText)}</h${level}>`);
            continue;
        }

        const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (image) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            output.push(renderImage(image[1], image[2]));
            continue;
        }

        const quote = line.match(/^>\s?(.*)$/);
        if (quote) {
            flushParagraph(paragraph, output);
            closeList(listState, output);
            output.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
            continue;
        }

        const bullet = line.match(/^[-*]\s+(.*)$/);
        if (bullet) {
            flushParagraph(paragraph, output);
            if (inSeriesIndex) {
                openList("ul", listState, output, "series-shortcuts");
                output.push(renderSeriesItem(bullet[1]));
            } else {
                openList("ul", listState, output);
                output.push(`<li>${renderInline(bullet[1])}</li>`);
            }
            continue;
        }

        const ordered = line.match(/^\d+\.\s+(.*)$/);
        if (ordered) {
            flushParagraph(paragraph, output);
            openList("ol", listState, output);
            output.push(`<li>${renderInline(ordered[1])}</li>`);
            continue;
        }

        paragraph.push(renderInline(line.trim()));
    }

    flushParagraph(paragraph, output);
    closeList(listState, output);
    if (inCallout) output.push(`</div></details>`);
    if (inFormula) output.push(formulaBlock(formulaLines.join(" ")));
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
