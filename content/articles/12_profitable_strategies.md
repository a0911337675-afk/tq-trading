---
published_at: "2026-06-29 09:12:00"
title: "第十二章｜真正長期存在的策略：趨勢、均值、套利與做市"
description: "整理 Momentum、Trend Following、Mean Reversion、Carry、Volatility、Market Making、Pairs Trading 等長期存在的交易型態。"
slug: "profitable-strategy-types"
chapter: 12
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第十二章｜真正長期存在的策略：趨勢、均值、套利與做市

> 整理 Momentum、Trend Following、Mean Reversion、Carry、Volatility、Market Making、Pairs Trading 等長期存在的交易型態。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 最賺錢的不是單一指標，而是策略型態

市場歷史中，真正長期存在的不是某個神奇參數，而是幾種反覆出現的獲利來源。

## 2. 趨勢追蹤 Trend Following

核心假設：漲的可能繼續漲，跌的可能繼續跌。

常見規則：

- 突破前高買入。
- 跌破前低放空。
- 均線多頭排列做多。
- 均線空頭排列做空。

優點：大行情時收益明顯。  
缺點：盤整時容易連續假突破。

## 3. 動能 Momentum

Momentum 偏向相對強弱。買入近期表現強的資產，賣出近期表現弱的資產。

公式：

\[
Momentum=P_t-P_{t-n}
\]

或

\[
Momentum=\frac{P_t}{P_{t-n}}-1
\]

## 4. 均值回歸 Mean Reversion

核心假設：價格偏離平均後，可能回到平均。

常見工具：

- Z-score。
- Bollinger Bands。
- RSI。
- 價格乖離率。

風險：遇到強趨勢時，逆勢加碼可能造成巨大虧損。

## 5. Carry Trade

Carry 的本質是持有某種資產或部位以獲取持有收益，例如利差、資金費率、期貨期限結構收益。

## 6. 波動率交易

波動率交易不是只看方向，而是交易市場未來波動大小。

常見於選擇權市場，也可用於加密市場的波動結構。

## 7. 做市 Market Making

做市商同時掛買賣單，賺取 Spread。

\[
Spread=Ask-Bid
\]

但需要管理庫存風險與價格單邊移動風險。

## 8. 統計套利

透過多資產關係建立市場中性策略，例如配對交易、ETF 與成分股套利、跨交易所套利。

:::note
🔔 深度提示｜一個策略是否能長期存在，取決於它背後是否有「風險溢酬」或「市場結構原因」。如果只是歷史剛好有效，沒有合理邏輯支撐，很可能只是過度擬合。
:::

## 9. 如何判斷策略是否值得研究？

問自己六個問題：

1. 它賺的是什麼錢？
2. 誰會虧這個錢？
3. 這個優勢是否會被競爭吃掉？
4. 交易成本後是否仍有效？
5. 極端行情會怎麼死？
6. 是否能和其他策略互補？

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
