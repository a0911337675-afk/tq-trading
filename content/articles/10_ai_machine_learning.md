---
title: "第十章｜AI 如何改變交易：從機器學習到大型語言模型"
description: "介紹 Random Forest、XGBoost、LightGBM、LSTM、Transformer、強化學習與 LLM 在交易中的角色。"
slug: "ai-machine-learning-trading"
chapter: 10
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第十章｜AI 如何改變交易：從機器學習到大型語言模型

> 介紹 Random Forest、XGBoost、LightGBM、LSTM、Transformer、強化學習與 LLM 在交易中的角色。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. AI 不是保證獲利的魔法

AI 在金融市場的價值，不是讓人百分之百預測漲跌，而是幫助交易者從大量資料中找出人眼難以發現的模式。

它常見用途包括：

- 市場狀態分類。
- 波動率預測。
- 特徵篩選。
- 訊號過濾。
- 風險預警。
- 新聞情緒分析。
- 策略參數調整。

## 2. Logistic Regression

\[
P(y=1)=\frac{1}{1+e^{-z}}
\]

用途：預測某事件發生機率，例如下一根 K 線上漲機率。

## 3. Decision Tree 與 Random Forest

Decision Tree 透過條件分支做分類；Random Forest 則使用多棵樹降低單一模型不穩定問題。

## 4. XGBoost 與 LightGBM

這類梯度提升樹模型在金融資料中非常常見，原因是：

- 對表格資料效果好。
- 訓練速度快。
- 可處理非線性。
- 對特徵重要性有解釋能力。

## 5. LSTM

LSTM 適合處理時間序列，曾被大量用於價格、成交量、波動率預測。

但金融市場噪音很高，LSTM 並不一定比簡單模型穩定。

## 6. Transformer

Transformer 可以處理長序列，也可用於新聞、社群文字與多模態資料。

在交易中，它更常被用於：

- 文字情緒分析。
- 長期市場特徵提取。
- 多資產關係建模。
- 研究報告摘要。

## 7. Reinforcement Learning

強化學習把交易視為連續決策問題：

- 狀態：市場資料。
- 行動：買、賣、空手。
- 獎勵：報酬與風險調整後收益。

但強化學習在實盤上很難，因為市場環境會變，且試錯成本高。

:::note
🔔 深度提示｜AI 交易最大的風險是過度擬合。模型可能在歷史資料中看似很神，但其實只是記住過去噪音。真正可靠的 AI 交易需要嚴格切分訓練集、驗證集、測試集，並做 Walk-forward 測試。
:::

## 8. LLM 對交易的影響

大型語言模型不一定直接下單，但可以協助：

- 閱讀財報。
- 摘要新聞。
- 整理研究報告。
- 產生策略想法。
- 檢查程式碼。
- 建立交易日誌。
- 協助風控監控。

未來 AI 更可能成為交易研究助理，而不是單純的買賣機器。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
