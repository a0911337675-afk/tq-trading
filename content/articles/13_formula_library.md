---
title: "第十三章｜大眾最常用金融數學公式總整理"
description: "整理交易者、量化研究員與基金最常見的公式，包含統計、技術分析、風控、績效與機器學習。"
slug: "trading-formula-library"
chapter: 13
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第十三章｜大眾最常用金融數學公式總整理

> 整理交易者、量化研究員與基金最常見的公式，包含統計、技術分析、風控、績效與機器學習。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 基礎統計公式

### 平均數

\[
\mu=\frac{1}{n}\sum_{i=1}^{n}x_i
\]

### 標準差

\[
\sigma=\sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i-\mu)^2}
\]

### Z-score

\[
Z=\frac{x-\mu}{\sigma}
\]

## 2. 報酬與風險

### 簡單報酬

\[
R_t=\frac{P_t-P_{t-1}}{P_{t-1}}
\]

### 對數報酬

\[
r_t=\ln\left(\frac{P_t}{P_{t-1}}\right)
\]

### 最大回撤

\[
MDD=\frac{Peak-Trough}{Peak}
\]

## 3. 技術分析

### SMA

\[
SMA_n=\frac{1}{n}\sum_{i=1}^{n}P_i
\]

### EMA

\[
EMA_t=\alpha P_t+(1-\alpha)EMA_{t-1}
\]

### RSI

\[
RSI=100-\frac{100}{1+RS}
\]

### MACD

\[
MACD=EMA_{12}-EMA_{26}
\]

### Bollinger Bands

\[
Upper=SMA+k\sigma
\]

\[
Lower=SMA-k\sigma
\]

### ATR

\[
TR=max(High-Low, |High-Close_{prev}|, |Low-Close_{prev}|)
\]

## 4. 投資組合公式

### 投資組合報酬

\[
E(R_p)=\sum w_iE(R_i)
\]

### 投資組合變異數

\[
\sigma_p^2=\sum_i\sum_j w_iw_jCov(R_i,R_j)
\]

### Sharpe Ratio

\[
Sharpe=\frac{R_p-R_f}{\sigma_p}
\]

### Beta

\[
\beta=\frac{Cov(R_i,R_m)}{Var(R_m)}
\]

## 5. 交易系統公式

### 期望值

\[
Expectancy=WinRate\times AvgWin-LossRate\times AvgLoss
\]

### 盈虧比

\[
PayoffRatio=\frac{AvgWin}{AvgLoss}
\]

### 勝率

\[
WinRate=\frac{WinningTrades}{TotalTrades}
\]

### Kelly Formula

\[
f^*=\frac{bp-q}{b}
\]

其中：

- \(b\)：盈虧比
- \(p\)：勝率
- \(q=1-p\)

:::note
🔔 深度提示｜Kelly 公式理論上可以最大化長期資本成長，但實務上波動非常大。交易者通常會使用 1/2 Kelly 或更低比例，避免回撤過深。
:::

## 6. 高頻與執行公式

### VWAP

\[
VWAP=\frac{\sum Price\times Volume}{\sum Volume}
\]

### Order Book Imbalance

\[
OBI=\frac{BidVolume-AskVolume}{BidVolume+AskVolume}
\]

### 滑價

\[
Slippage=ExecutionPrice-ExpectedPrice
\]

## 7. 機器學習公式

### Logistic Regression

\[
P(y=1)=\frac{1}{1+e^{-z}}
\]

### 均方誤差 MSE

\[
MSE=\frac{1}{n}\sum_{i=1}^{n}(y_i-\hat{y_i})^2
\]

### 交叉熵

\[
L=-\sum y\log(\hat{y})
\]

## 8. 公式使用原則

公式不是答案，公式只是工具。真正重要的是：

- 是否適用目前市場？
- 是否考慮交易成本？
- 是否能抵抗極端行情？
- 是否經過樣本外測試？
- 是否有風控配合？

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
