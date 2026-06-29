---
title: "第七章｜高頻交易：速度、延遲與市場微結構"
description: "深入介紹 HFT、Latency、Co-location、FPGA、Market Making、Order Book 與 Flash Crash。"
slug: "high-frequency-trading"
chapter: 7
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第七章｜高頻交易：速度、延遲與市場微結構

> 深入介紹 HFT、Latency、Co-location、FPGA、Market Making、Order Book 與 Flash Crash。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 高頻交易是什麼？

高頻交易（High-Frequency Trading, HFT）是使用高速電腦、低延遲網路與自動化演算法，在極短時間內大量送出、修改與取消訂單的交易方式。

它的核心不一定是預測大方向，而是利用市場微小價差與速度優勢。

## 2. HFT 的核心競爭

### 2.1 Latency 延遲

延遲是訊號從資料源到交易系統，再到交易所的時間。

高頻交易競爭的是：

- 微秒。
- 奈秒。
- 網路距離。
- 硬體速度。
- 程式效率。

### 2.2 Co-location

Co-location 指把伺服器放在交易所資料中心附近，縮短傳輸距離。

### 2.3 FPGA

FPGA 是可程式化硬體，可以比一般軟體更快處理特定任務，在部分高頻場景中被使用。

## 3. HFT 常見策略

### 做市 Market Making

同時掛買單與賣單，賺取價差：

\[
Spread=Ask-Bid
\]

### 統計套利

發現相關商品短暫偏離後交易回歸。

### 延遲套利

利用不同市場報價更新速度不一致的瞬間差異。

### 訂單簿訊號

透過買賣盤深度判斷短期壓力。

Order Book Imbalance：

\[
OBI=\frac{BidVolume-AskVolume}{BidVolume+AskVolume}
\]

## 4. 2010 Flash Crash

2010 年 5 月 6 日，美國市場發生 Flash Crash，市場在短時間內急跌又快速反彈。SEC 與 CFTC 後續發布報告，討論自動化交易、流動性消失與市場結構問題。

這起事件讓監管機構更重視：

- 熔斷機制。
- 交易暫停。
- 演算法風控。
- 市場流動性監控。

:::note
🔔 深度提示｜HFT 最可怕的地方不是「它很快」，而是當許多演算法同時撤單時，市場表面看似有流動性，實際上可能瞬間消失。這也是為什麼現代交易系統必須考慮極端滑價與流動性風險。
:::

## 5. 個人交易者是否需要做 HFT？

大多數個人交易者不適合做真正 HFT，因為門檻包含：

- 交易所連線。
- 伺服器位置。
- 低延遲程式語言。
- 市場資料成本。
- 風控系統。
- 大量工程維護。

但個人交易者可以學習 HFT 的幾個概念：

1. 滑價很重要。
2. 掛單簿比 K 線更即時。
3. 流動性不是永遠存在。
4. 訊號有效不代表成交有效。
5. 策略必須包含交易成本。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
