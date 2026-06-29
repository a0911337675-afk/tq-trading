---
title: "第五章｜程式交易的誕生：國外何時開始自動化交易"
description: "介紹 1970–1990 年代電子報價、程式交易、Portfolio Insurance 與自動下單的發展。"
slug: "program-trading-birth"
chapter: 5
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第五章｜程式交易的誕生：國外何時開始自動化交易

> 介紹 1970–1990 年代電子報價、程式交易、Portfolio Insurance 與自動下單的發展。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 程式交易不是近十年才出現

許多人以為程式交易是 Python 興起後才開始，但國外大型機構早在 1970–1980 年代就已經開始使用電腦輔助交易與下單。

真正的關鍵不是「寫程式」本身，而是市場基礎建設逐漸電子化。

## 2. 1971 年：NASDAQ 啟動電子報價市場

1971 年，NASDAQ 開始運作，成為電子化報價市場的重要里程碑。這代表市場報價開始大量透過電腦傳遞，而不是完全依賴交易大廳喊價。

一開始它更偏向報價系統，不等於今天完整的電子撮合，但它打開了電子市場的大門。

## 3. 1970–1980 年代：電子下單系統出現

隨著交易所、券商與機構投資人開始導入電腦，訂單可以更快被傳送與回報。

這個階段的自動化主要用於：

- 訂單路由。
- 一籃子股票交易。
- 指數套利。
- 投資組合再平衡。
- 風險控制。

## 4. Program Trading 是什麼？

Program Trading 通常指同時買賣一籃子股票或相關衍生品，並由電腦根據規則執行。

例如：

- 買入 500 檔股票組成指數。
- 同時賣出股指期貨。
- 當現貨與期貨價差偏離時進行套利。

這種交易不靠單一股票判斷，而是靠價格關係、模型與執行速度。

## 5. Portfolio Insurance 與 1987 黑色星期一

1980 年代，Portfolio Insurance 是非常流行的風控方式。概念是當市場下跌時，自動賣出股指期貨以降低投資組合風險。

問題在於：如果很多機構都在下跌時賣出，市場會出現連鎖反應。

1987 年 10 月 19 日，美股發生黑色星期一，道瓊工業指數單日大跌超過 20%。Portfolio Insurance 並非唯一原因，但它讓市場開始嚴肅討論自動化交易的系統性風險。

:::note
🔔 深度提示｜程式交易本身不是問題，問題是「大量相似策略在同一時間做同一件事」。當市場下跌觸發賣出規則，賣出又造成更大跌幅，進一步觸發更多賣出，這就是自動化策略可能放大波動的原因。
:::

## 6. 1990 年代：程式交易進入專業化

到了 1990 年代，大型基金與投資銀行開始更正式地使用：

- C / C++
- MATLAB
- SAS
- 風險模型
- 統計套利
- 自動執行演算法

交易開始從「交易員主導」逐步轉為「模型與系統輔助」。

## 7. 對現代交易者的意義

程式交易的最大價值不是讓人偷懶，而是讓策略可重複、可測試、可監控。

一套真正的程式交易系統至少包含：

- 訊號產生。
- 倉位管理。
- 停損停利。
- 滑價處理。
- 交易紀錄。
- 錯誤處理。
- 風險限制。

如果只有「指標出現就下單」，那只是自動下單，不一定是成熟交易系統。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
