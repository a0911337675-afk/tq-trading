---
published_at: "2026-06-29 09:08:00"
title: "第八章｜統計套利：Z-score、配對交易與均值回歸"
description: "介紹 Pairs Trading、Cointegration、Z-score、Kalman Filter、PCA 等統計套利核心方法。"
slug: "statistical-arbitrage"
chapter: 8
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第八章｜統計套利：Z-score、配對交易與均值回歸

> 介紹 Pairs Trading、Cointegration、Z-score、Kalman Filter、PCA 等統計套利核心方法。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 什麼是統計套利？

統計套利不是預測某個資產一定會漲，而是尋找資產之間的統計關係。當價格關係短暫偏離歷史範圍時，策略押注它會回歸。

核心思想是：市場短期會失衡，但長期可能回到某種均衡。

## 2. Z-score

\[
Z=\frac{x-\mu}{\sigma}
\]

如果 Z-score 很高，代表目前數值高於平均很多；如果很低，代表低於平均很多。

常見規則：

- Z > 2：偏高，考慮做空價差。
- Z < -2：偏低，考慮做多價差。
- Z 回到 0：平倉。

## 3. 配對交易 Pairs Trading

假設 A 與 B 長期高度相關。

價差：

\[
Spread=P_A-\beta P_B
\]

當價差過大時：

- 做空偏貴資產。
- 做多偏便宜資產。

重點不是 A 或 B 會不會漲，而是兩者關係是否回歸。

## 4. Cointegration 共整合

相關係數只能描述短期同向程度，不能保證長期關係穩定。共整合用來檢驗兩個非平穩時間序列是否存在長期均衡關係。

這是統計套利中非常重要的概念。

## 5. Kalman Filter

Kalman Filter 可用來動態估計兩個資產之間的關係，例如動態 Beta。

傳統配對交易可能假設 Beta 固定，但市場關係會變，因此需要動態模型。

## 6. PCA 主成分分析

PCA 可以從大量資產中提取共同因子，例如市場因子、產業因子、風格因子。

用途：

- 降維。
- 找出共同風險。
- 建立市場中性策略。
- 過濾雜訊。

:::note
🔔 深度提示｜統計套利最容易犯的錯，是把「曾經相關」誤認為「未來一定回歸」。真正的難點不在進場公式，而在判斷關係是否已經結構性改變。
:::

## 7. 統計套利風險

- 關係失效。
- 回歸時間過長。
- 槓桿過高。
- 交易成本吃掉利潤。
- 市場危機時相關性突然變化。
- 模型過度擬合。

## 8. 對現代交易者的價值

統計套利提醒我們：交易不一定只看方向，也可以交易「關係」。

例如：

- BTC 與 ETH 價差。
- 現貨與永續合約價差。
- 不同交易所價格差。
- 同產業股票相對強弱。
- 指數與成分股偏離。

這類策略更接近專業量化思維。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
