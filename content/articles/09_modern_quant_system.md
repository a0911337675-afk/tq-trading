---
published_at: "2026-06-29 09:09:00"
title: "第九章｜現代量化交易系統：從 Python 到 API 自動下單"
description: "介紹現代量化系統架構、資料、回測、風控、實盤執行與監控。"
slug: "modern-quant-system"
chapter: 9
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第九章｜現代量化交易系統：從 Python 到 API 自動下單

> 介紹現代量化系統架構、資料、回測、風控、實盤執行與監控。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 現代量化交易不是一個指標

很多人以為量化交易就是把 RSI、MACD 寫成程式。這只是最基礎的自動化，並不等於完整量化系統。

真正的量化交易至少包含：

- 資料取得。
- 資料清洗。
- 特徵計算。
- 訊號生成。
- 回測驗證。
- 倉位管理。
- 風險控制。
- 實盤下單。
- 日誌記錄。
- 監控與警報。
- 策略迭代。

## 2. 現代常用技術

### Python

Python 成為量化交易普及的重要原因：

- 語法簡單。
- 資料分析套件完整。
- 機器學習生態成熟。
- API 串接方便。

常見套件：

- pandas
- numpy
- scipy
- scikit-learn
- statsmodels
- lightgbm
- pytorch

### C++

在高頻交易中，C++ 仍然重要，因為速度與記憶體控制能力強。

### Cloud 與 Docker

雲端讓策略可以 24 小時運行，Docker 則讓環境更容易部署與維護。

## 3. 回測系統

回測不是看策略賺多少，而是要找出策略在什麼情況會死。

至少要檢查：

- 勝率。
- 盈虧比。
- 最大回撤。
- 連續虧損。
- 交易成本。
- 滑價。
- 不同年份表現。
- 不同市場狀態表現。

## 4. 期望值

\[
Expectancy = WinRate\times AvgWin - LossRate\times AvgLoss
\]

只要期望值為正，策略才有長期討論價值。

:::note
🔔 深度提示｜高勝率不等於賺錢。若勝率 80%，但每次賺 1、輸一次賠 10，長期仍可能虧損。真正要看的是期望值與風險暴露。
:::

## 5. 倉位管理

固定金額下單很簡單，但不一定合理。更常見的是根據波動調整倉位：

\[
PositionSize=\frac{RiskAmount}{StopLossDistance}
\]

如果停損距離越大，倉位應該越小；如果停損距離越小，倉位可以較大。

## 6. 風控模組

完整系統需要：

- 單筆最大虧損。
- 每日最大虧損。
- 最大持倉數。
- 最大槓桿。
- 黑名單。
- 冷卻時間。
- 異常行情停止交易。
- API 錯誤保護。

## 7. 實盤與回測的差距

回測賺錢不代表實盤賺錢，原因包括：

- 滑價。
- 延遲。
- 流動性不足。
- K 線資料偏差。
- 交易所 API 錯誤。
- 手續費。
- 訊號重繪。
- 過度擬合。

## 8. 現代量化的真正價值

量化不是追求神奇指標，而是建立一套可驗證、可追蹤、可修正的交易流程。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
