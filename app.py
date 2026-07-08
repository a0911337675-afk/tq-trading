from __future__ import annotations

import json
import os
import re
import sqlite3
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
CONTENT_DIR = BASE_DIR / "content"
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "stock.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"

ARTICLE_CATEGORIES = {
    "article_thinking.md": "量化基礎",
    "article_strategy.md": "交易實戰",
    "article_math_finance.md": "工具對比",
    "article_machine_learning.md": "AI的經濟/資訊/文章",
    "auto_trading_tools_order_machine_comparison.md": "工具對比",
    "ai_statement_gallery_2025_11_2026_05.md": "AI 對帳單",
    "popular_financial_products_risks.md": "量化基礎",
    "underground_vs_legal_futures.md": "量化基礎",
    "futures_capital_waterline.md": "交易實戰",
    "00_index.md": "量化基礎",
    "01_trade_origin.md": "量化基礎",
    "02_open_outcry.md": "量化基礎",
    "03_math_enters_finance.md": "量化基礎",
    "04_technical_analysis.md": "工具對比",
    "05_program_trading_birth.md": "交易實戰",
    "06_quant_funds.md": "交易實戰",
    "07_high_frequency_trading.md": "交易實戰",
    "08_statistical_arbitrage.md": "交易實戰",
    "09_modern_quant_system.md": "交易實戰",
    "10_ai_machine_learning.md": "AI的經濟/資訊/文章",
    "11_crypto_quant.md": "交易實戰",
    "12_profitable_strategies.md": "交易實戰",
    "13_formula_library.md": "工具對比",
    "14_major_quant_firms.md": "交易實戰",
    "15_future_of_trading.md": "AI的經濟/資訊/文章",
}

ARTICLE_CATEGORY_DEFINITIONS = [
    {
        "slug": "quant-basics",
        "name": "量化基礎",
        "description": "交易觀念、統計思維、資料處理與量化入門內容。",
    },
    {
        "slug": "trading-practice",
        "name": "交易實戰",
        "description": "策略設計、回測、風控、執行流程與實盤經驗。",
    },
    {
        "slug": "tool-comparison",
        "name": "工具對比",
        "description": "平台、券商、資料源、看盤工具與研究工具比較。",
    },
    {
        "slug": "ai-statement",
        "name": "AI 對帳單",
        "description": "用 AI 整理交易紀錄、對帳單、績效歸因與異常檢查。",
    },
    {
        "slug": "ai-econ-info-articles",
        "name": "AI的經濟/資訊/文章",
        "description": "AI、經濟、資訊整理、研究筆記與市場觀察文章。",
    },
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def row_to_dict(row: sqlite3.Row) -> dict:
    return {key: row[key] for key in row.keys()}


def init_db() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    with get_connection() as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        migrate_db(conn)
        init_site_stats(conn)
        import_articles(conn)
        count = conn.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        if count == 0:
            seed = [
                ("SKU-1001", "無線滑鼠", "3C 配件", 32, 10, 399),
                ("SKU-1002", "機械鍵盤", "3C 配件", 14, 6, 1890),
                ("SKU-2001", "A4 影印紙", "辦公用品", 8, 12, 120),
                ("SKU-3001", "不鏽鋼水壺", "生活用品", 21, 8, 450),
            ]
            conn.executemany(
                """
                INSERT INTO products (sku, name, category, quantity, reorder_level, price)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                seed,
            )


def migrate_db(conn: sqlite3.Connection) -> None:
    article_columns = {
        row["name"] for row in conn.execute("PRAGMA table_info(articles)").fetchall()
    }
    if "status" not in article_columns:
        conn.execute("ALTER TABLE articles ADD COLUMN status TEXT NOT NULL DEFAULT 'published'")
    if "view_count" not in article_columns:
        conn.execute("ALTER TABLE articles ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0")


def init_site_stats(conn: sqlite3.Connection) -> None:
    conn.execute(
        "INSERT OR IGNORE INTO site_stats (key, value) VALUES ('search_count', 0)"
    )


def parse_frontmatter(content: str) -> tuple[dict[str, str], str]:
    lines = content.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}, content

    meta: dict[str, str] = {}
    for index, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            body = "\n".join(lines[index + 1 :]).strip()
            return meta, body
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        cleaned = value.strip().strip('"').strip("'")
        meta[key.strip()] = cleaned
    return {}, content


def article_slug(path: Path, meta: dict[str, str] | None = None) -> str:
    if meta and meta.get("slug"):
        return re.sub(r"[^a-z0-9-]+", "-", meta["slug"].lower()).strip("-")

    name = path.stem
    if name.startswith("article_"):
        name = name.removeprefix("article_")
    return re.sub(r"[^a-z0-9-]+", "-", name.lower()).strip("-")


def article_title(content: str, fallback: str, meta: dict[str, str] | None = None) -> str:
    if meta and meta.get("title"):
        return meta["title"]

    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("# "):
            return stripped[2:].strip()
    return fallback


def article_excerpt(content: str, meta: dict[str, str] | None = None) -> str:
    if meta and meta.get("description"):
        return meta["description"]

    for line in content.splitlines():
        stripped = line.strip()
        if (
            not stripped
            or stripped == "---"
            or stripped.startswith("#")
            or stripped.startswith(":::")
        ):
            continue
        if stripped.startswith(">"):
            stripped = stripped.lstrip("> ").strip()
        return stripped[:150]
    return ""


def article_published_at(meta: dict[str, str] | None = None) -> str | None:
    if not meta:
        return None
    value = meta.get("published_at") or meta.get("date")
    if not value:
        return None
    cleaned = value.strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", cleaned):
        return f"{cleaned} 09:00:00"
    return cleaned


def import_articles(conn: sqlite3.Connection) -> None:
    article_dir = CONTENT_DIR / "articles"
    if not article_dir.exists():
        return

    for path in sorted(article_dir.glob("*.md")):
        raw_content = path.read_text(encoding="utf-8")
        meta, content = parse_frontmatter(raw_content)
        slug = article_slug(path, meta)
        title = article_title(content, path.stem, meta)
        category = ARTICLE_CATEGORIES.get(path.name, "文章")
        excerpt = article_excerpt(content, meta)
        published_at = article_published_at(meta)
        conn.execute(
            """
            INSERT INTO articles (slug, title, category, excerpt, content, source_file, status, published_at)
            VALUES (?, ?, ?, ?, ?, ?, 'published', COALESCE(?, CURRENT_TIMESTAMP))
            ON CONFLICT(slug) DO UPDATE SET
                title = excluded.title,
                category = excluded.category,
                excerpt = excluded.excerpt,
                content = excluded.content,
                source_file = excluded.source_file,
                status = 'published',
                published_at = excluded.published_at,
                updated_at = CURRENT_TIMESTAMP
            """,
            (slug, title, category, excerpt, content, str(path.relative_to(BASE_DIR)), published_at),
        )


def resolve_category_filter(value: str = "") -> str:
    cleaned = value.strip()
    if not cleaned:
        return ""

    aliases = {
        "ai": "AI的經濟/資訊/文章",
        "ai-articles": "AI的經濟/資訊/文章",
        "quant": "量化基礎",
        "trading": "交易實戰",
        "tools": "工具對比",
    }
    if cleaned in aliases:
        return aliases[cleaned]

    for item in ARTICLE_CATEGORY_DEFINITIONS:
        if cleaned in {item["slug"], item["name"]}:
            return item["name"]
    return cleaned


def is_index_hidden_article(article: dict | sqlite3.Row) -> bool:
    source_file = str(article["source_file"]).replace("\\", "/")
    filename = source_file.rsplit("/", 1)[-1]
    return re.match(r"^(0[1-9]|1[0-5])_", filename) is not None


def list_articles(
    search: str = "",
    category: str = "",
    include_index_hidden: bool = False,
) -> list[dict]:
    params: list[str] = []
    where = "WHERE status = 'published'"
    category_name = resolve_category_filter(category)
    if category_name:
        where += " AND category = ?"
        params.append(category_name)
    if search:
        where += " AND (title LIKE ? OR excerpt LIKE ? OR category LIKE ?)"
        keyword = f"%{search}%"
        params.extend([keyword, keyword, keyword])

    with get_connection() as conn:
        rows = conn.execute(
            f"""
            SELECT slug, title, category, excerpt, source_file, status, view_count, published_at, updated_at
            FROM articles
            {where}
            ORDER BY datetime(published_at) DESC, id DESC
            """,
            params,
        ).fetchall()
    articles = [row_to_dict(row) for row in rows]
    if not include_index_hidden:
        articles = [article for article in articles if not is_index_hidden_article(article)]
    return articles


def list_article_categories() -> list[dict]:
    counts: dict[str, int] = {}
    for article in list_articles():
        counts[article["category"]] = counts.get(article["category"], 0) + 1

    categories = []
    for item in ARTICLE_CATEGORY_DEFINITIONS:
        categories.append(
            {
                **item,
                "article_count": counts.get(item["name"], 0),
                "status": "已啟用",
            }
        )
    return categories


def get_article(slug: str) -> dict:
    with get_connection() as conn:
        conn.execute(
            "UPDATE articles SET view_count = view_count + 1 WHERE slug = ? AND status = 'published'",
            (slug,),
        )
        row = conn.execute(
            """
            SELECT slug, title, category, excerpt, content, source_file, status, view_count, published_at, updated_at
            FROM articles
            WHERE slug = ? AND status = 'published'
            """,
            (slug,),
        ).fetchone()
    if row is None:
        raise LookupError("Article not found")
    return row_to_dict(row)


def list_products(search: str = "") -> list[dict]:
    query = """
        SELECT
            id, sku, name, category, quantity, reorder_level, price,
            created_at, updated_at,
            CASE WHEN quantity <= reorder_level THEN 1 ELSE 0 END AS is_low_stock
        FROM products
    """
    params: tuple[str, ...] = ()
    if search:
        query += " WHERE sku LIKE ? OR name LIKE ? OR category LIKE ?"
        keyword = f"%{search}%"
        params = (keyword, keyword, keyword)
    query += " ORDER BY updated_at DESC, id DESC"

    with get_connection() as conn:
        rows = conn.execute(query, params).fetchall()
    return [row_to_dict(row) for row in rows]


def increment_search_count() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO site_stats (key, value)
            VALUES ('search_count', 1)
            ON CONFLICT(key) DO UPDATE SET value = value + 1
            """
        )


def get_summary() -> dict:
    visible_articles = list_articles()
    with get_connection() as conn:
        article_row = conn.execute(
            """
            SELECT
                COALESCE(SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END), 0) AS draft_count
            FROM articles
            """
        ).fetchone()
        search_row = conn.execute(
            "SELECT value FROM site_stats WHERE key = 'search_count'"
        ).fetchone()

    return {
        "product_count": len(visible_articles),
        "total_quantity": sum(article["view_count"] for article in visible_articles),
        "inventory_value": search_row["value"] if search_row else 0,
        "low_stock_count": article_row["draft_count"],
    }


def create_product(payload: dict) -> dict:
    sku = str(payload.get("sku", "")).strip()
    name = str(payload.get("name", "")).strip()
    category = str(payload.get("category", "未分類")).strip() or "未分類"

    if not sku or not name:
        raise ValueError("SKU 和商品名稱為必填")

    quantity = int(payload.get("quantity", 0))
    reorder_level = int(payload.get("reorder_level", 5))
    price = float(payload.get("price", 0))

    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO products (sku, name, category, quantity, reorder_level, price)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (sku, name, category, quantity, reorder_level, price),
        )
        product_id = cursor.lastrowid
        conn.execute(
            "INSERT INTO stock_movements (product_id, change_amount, note) VALUES (?, ?, ?)",
            (product_id, quantity, "建立商品"),
        )
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return row_to_dict(row)


def update_stock(product_id: int, payload: dict) -> dict:
    change_amount = int(payload.get("change_amount", 0))
    note = str(payload.get("note", "")).strip()
    if change_amount == 0:
        raise ValueError("庫存異動數量不能為 0")

    with get_connection() as conn:
        current = conn.execute(
            "SELECT quantity FROM products WHERE id = ?", (product_id,)
        ).fetchone()
        if current is None:
            raise LookupError("找不到商品")

        next_quantity = current["quantity"] + change_amount
        if next_quantity < 0:
            raise ValueError("庫存不能小於 0")

        conn.execute(
            """
            UPDATE products
            SET quantity = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (next_quantity, product_id),
        )
        conn.execute(
            """
            INSERT INTO stock_movements (product_id, change_amount, note)
            VALUES (?, ?, ?)
            """,
            (product_id, change_amount, note),
        )
        row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return row_to_dict(row)


def delete_product(product_id: int) -> None:
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
        if cursor.rowcount == 0:
            raise LookupError("找不到商品")


class StockRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/products":
            params = parse_qs(parsed.query)
            search = params.get("search", [""])[0].strip()
            if search:
                increment_search_count()
            self.send_json({"products": list_products(search)})
            return

        if parsed.path == "/api/summary":
            self.send_json(get_summary())
            return

        if parsed.path == "/api/articles":
            params = parse_qs(parsed.query)
            search = params.get("search", [""])[0].strip()
            category = params.get("category", [""])[0].strip()
            if search:
                increment_search_count()
            self.send_json({"articles": list_articles(search, category)})
            return

        if parsed.path == "/api/categories":
            self.send_json({"categories": list_article_categories()})
            return

        if parsed.path.startswith("/api/articles/"):
            try:
                slug = parsed.path.split("/")[3]
                self.send_json(get_article(slug))
            except LookupError as exc:
                self.send_json({"error": str(exc)}, HTTPStatus.NOT_FOUND)
            return

        if parsed.path == "/articles":
            self.path = "/index.html"

        if parsed.path.startswith("/articles/"):
            self.path = "/article.html"

        page_routes = {
            "/daily": "/daily.html",
            "/faq": "/faq.html",
            "/community": "/community.html",
        }
        if parsed.path in page_routes:
            self.path = page_routes[parsed.path]

        if parsed.path == "/":
            self.path = "/index.html"

        super().do_GET()

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        try:
            payload = self.read_json()
            if parsed.path == "/api/products":
                self.send_json(create_product(payload), HTTPStatus.CREATED)
                return

            if parsed.path.startswith("/api/products/") and parsed.path.endswith("/stock"):
                product_id = int(parsed.path.split("/")[3])
                self.send_json(update_stock(product_id, payload))
                return

            self.send_error(HTTPStatus.NOT_FOUND)
        except ValueError as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
        except sqlite3.IntegrityError:
            self.send_json({"error": "SKU 已存在，請改用不同 SKU"}, HTTPStatus.CONFLICT)
        except LookupError as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        try:
            if parsed.path.startswith("/api/products/"):
                product_id = int(parsed.path.split("/")[3])
                delete_product(product_id)
                self.send_json({"ok": True})
                return

            self.send_error(HTTPStatus.NOT_FOUND)
        except LookupError as exc:
            self.send_json({"error": str(exc)}, HTTPStatus.NOT_FOUND)

    def read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(length).decode("utf-8") if length else "{}"
        return json.loads(raw_body)

    def send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def main() -> None:
    init_db()
    port = int(os.environ.get("PORT", "8000"))
    host = os.environ.get("HOST", "0.0.0.0")
    server = ThreadingHTTPServer((host, port), StockRequestHandler)
    print(f"Stock web app running at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
