---
published_at: "2026-06-29 09:04:00"
title: "第四章｜技術分析黃金年代：大眾最常用的交易公式"
description: "整理 SMA、EMA、RSI、MACD、KD、布林通道、ATR、VWAP 等最普及指標。"
slug: "technical-analysis-formulas"
chapter: 4
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第四章｜技術分析黃金年代：大眾最常用的交易公式

> 整理 SMA、EMA、RSI、MACD、KD、布林通道、ATR、VWAP 等最普及指標。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 技術分析為什麼會流行？

技術分析之所以普及，是因為它把複雜市場變成可視化規則。一般投資人不需要理解公司財報或總經數據，也能透過價格與成交量做決策。

在個人電腦與看盤軟體普及後，技術分析快速成為大眾最熟悉的交易語言。

## 2. 移動平均線 SMA

\[
SMA_n=\frac{P_1+P_2+\cdots+P_n}{n}
\]

常見用法：

- 價格站上均線：偏多。
- 價格跌破均線：偏空。
- 短均線上穿長均線：黃金交叉。
- 短均線下穿長均線：死亡交叉。

## 3. 指數移動平均 EMA

\[
EMA_t=\alpha P_t+(1-\alpha)EMA_{t-1}
\]

\[
\alpha=\frac{2}{n+1}
\]

EMA 對近期價格反應更快，因此常用於短線交易、MACD、趨勢追蹤。

## 4. RSI

\[
RSI=100-\frac{100}{1+RS}
\]

\[
RS=\frac{Average\ Gain}{Average\ Loss}
\]

大眾常見判斷：

- RSI > 70：可能過熱。
- RSI < 30：可能超賣。

但專業上不能只看 70/30，因為強趨勢中 RSI 可以長時間維持高檔或低檔。

:::note
🔔 深度提示｜RSI 最大的誤用是「看到超買就空、看到超賣就多」。在趨勢市場中，超買可能代表強勢延續，超賣可能代表弱勢延續。因此 RSI 更適合搭配趨勢濾網、成交量與停損，而不是單獨使用。
:::

## 5. MACD

\[
MACD=EMA_{12}-EMA_{26}
\]

Signal Line：

\[
Signal=EMA_9(MACD)
\]

Histogram：

\[
Hist=MACD-Signal
\]

MACD 常用來判斷趨勢動能變化。

## 6. KD 隨機指標

\[
K=\frac{Close-Low_n}{High_n-Low_n}\times100
\]

D 通常是 K 的移動平均。

用途：判斷價格在最近區間中的相對位置。

## 7. Bollinger Bands

中軌：

\[
Middle=SMA_n
\]

上軌：

\[
Upper=SMA_n+k\sigma
\]

下軌：

\[
Lower=SMA_n-k\sigma
\]

布林通道用標準差描述價格波動範圍，常用於盤整、突破與波動收縮判斷。

## 8. ATR

True Range：

\[
TR=max(High-Low, |High-Close_{prev}|, |Low-Close_{prev}|)
\]

ATR：

\[
ATR=SMA(TR,n)
\]

ATR 不判斷方向，只衡量波動大小。它常用於：

- 動態停損。
- 倉位大小。
- 波動等級。
- 止盈距離。

## 9. VWAP

\[
VWAP=\frac{\sum Price\times Volume}{\sum Volume}
\]

大型機構常用 VWAP 衡量執行品質。若買入均價低於 VWAP，代表執行成本較好。

## 10. OBV

\[
OBV_t=OBV_{t-1}+Volume
\]

若收盤價上漲，成交量加上去；若收盤價下跌，成交量扣掉。

用途：觀察量能是否支持價格方向。

## 11. 為什麼這些公式大眾最喜歡？

因為它們有三個特點：

1. 容易理解。
2. 容易畫在圖上。
3. 容易形成買賣規則。

但越多人使用的公式，越容易失去單獨優勢。真正關鍵不是公式本身，而是市場環境、參數、風控與執行。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
