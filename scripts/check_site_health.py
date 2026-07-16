from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path


SITE_URL = "https://tq-trading-production.up.railway.app"
SNAPSHOT_PATH = Path("data/site_health_snapshot.json")


def fetch_json(path: str) -> dict:
    url = f"{SITE_URL}{path}"
    with urllib.request.urlopen(url, timeout=20) as response:
        return json.loads(response.read().decode("utf-8"))


def article_list(payload: dict) -> list[dict]:
    value = payload.get("articles", [])
    return value if isinstance(value, list) else []


def category_list(payload: dict) -> list[dict]:
    value = payload.get("categories", [])
    return value if isinstance(value, list) else []


def build_snapshot() -> dict:
    articles = article_list(fetch_json("/api/articles"))
    categories = category_list(fetch_json("/api/categories"))
    summary = fetch_json("/api/summary")
    tool_articles = article_list(fetch_json("/api/articles?category=tool-comparison"))
    daily_articles = article_list(fetch_json("/api/articles?category=daily-news"))

    latest = articles[0] if articles else {}
    return {
        "checked_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "article_count": len(articles),
        "category_count": len(categories),
        "category_counts": {
            item.get("name", ""): item.get("article_count", 0)
            for item in categories
            if item.get("name")
        },
        "summary": summary,
        "latest_slug": latest.get("slug"),
        "latest_title": latest.get("title"),
        "latest_published_at": latest.get("published_at"),
        "daily_news_count": len(daily_articles),
        "tool_filter_count": len(tool_articles),
        "tool_filter_categories": sorted(
            {item.get("category", "") for item in tool_articles if item.get("category")}
        ),
    }


def compare_snapshot(current: dict, previous: dict | None) -> list[str]:
    issues: list[str] = []
    if current["article_count"] < 9:
        issues.append(f"文章數偏低：目前 {current['article_count']} 篇，低於 9 篇警戒線。")
    if "每日大事" not in current["category_counts"]:
        issues.append("分類清單缺少「每日大事」。")
    if current["daily_news_count"] == 0:
        issues.append("每日大事分類目前查不到文章。")
    if current["tool_filter_categories"] and current["tool_filter_categories"] != ["工具對比"]:
        issues.append(
            "工具對比分類篩選異常，回傳分類為："
            + "、".join(current["tool_filter_categories"])
        )

    if previous:
        old_count = int(previous.get("article_count", 0))
        if current["article_count"] < old_count:
            issues.append(
                f"文章數比前一次檢查下降：{old_count} -> {current['article_count']}。"
            )
        old_daily = int(previous.get("daily_news_count", 0))
        if current["daily_news_count"] < old_daily:
            issues.append(
                f"每日大事文章數下降：{old_daily} -> {current['daily_news_count']}。"
            )
    return issues


def load_previous() -> dict | None:
    if not SNAPSHOT_PATH.exists():
        return None
    return json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))


def save_snapshot(snapshot: dict) -> None:
    SNAPSHOT_PATH.parent.mkdir(exist_ok=True)
    SNAPSHOT_PATH.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def main() -> int:
    try:
        previous = load_previous()
        current = build_snapshot()
        issues = compare_snapshot(current, previous)
        save_snapshot(current)
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        print(f"網站健康檢查失敗：{exc}")
        return 1

    print("網站健康檢查完成")
    print(json.dumps(current, ensure_ascii=False, indent=2))
    if issues:
        print("異常：")
        for issue in issues:
            print(f"- {issue}")
        return 1
    print("狀態正常")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
