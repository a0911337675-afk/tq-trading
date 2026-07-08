---
published_at: "2026-06-29 09:03:00"
title: "第三章｜數學正式進入金融：從平均數到投資組合理論"
description: "整理平均數、標準差、共變異數、Markowitz 投資組合理論、CAPM 與 Sharpe Ratio 的金融意義。"
slug: "math-enters-finance"
chapter: 3
category: "交易研究"
tags: ["交易歷史", "量化交易", "程式交易", "金融數學", "AI交易"]
---

# 第三章｜數學正式進入金融：從平均數到投資組合理論

> 整理平均數、標準差、共變異數、Markowitz 投資組合理論、CAPM 與 Sharpe Ratio 的金融意義。

> ⚠️ 風險提醒：本文為交易歷史與研究整理，不構成投資建議。任何策略在不同市場、不同週期、不同執行成本下，結果都可能完全不同。


## 1. 為什麼金融一定會走向數學？

市場每天都在產生價格、成交量、報酬率與風險。只要資料開始被記錄，人們自然會問：

- 平均報酬是多少？
- 波動多大？
- 風險是否值得？
- 不同資產是否一起漲跌？
- 要怎麼分配資金？

這些問題無法只靠感覺回答，因此統計學與機率論成為現代金融的底層語言。

## 2. 最基本但最常用的公式

### 平均數

\[
\mu=\frac{1}{n}\sum_{i=1}^{n}x_i
\]

用途：計算平均價格、平均報酬、平均成交量。

### 變異數

\[
Var(X)=E[(X-\mu)^2]
\]

用途：衡量資料偏離平均值的程度。

### 標準差

\[
\sigma=\sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i-\mu)^2}
\]

用途：衡量波動率。直到今天，標準差仍是交易與風控中最常見的數學工具之一。

## 3. 報酬率

簡單報酬率：

\[
R_t=\frac{P_t-P_{t-1}}{P_{t-1}}
\]

對數報酬率：

\[
r_t=\ln\left(\frac{P_t}{P_{t-1}}\right)
\]

量化交易中常使用對數報酬率，因為它在時間加總上較方便。

## 4. 共變異數與相關係數

共變異數：

\[
Cov(X,Y)=E[(X-\mu_X)(Y-\mu_Y)]
\]

相關係數：

\[
\rho_{XY}=\frac{Cov(X,Y)}{\sigma_X\sigma_Y}
\]

用途：判斷兩個資產是否同向移動。

- \(\rho=1\)：完全正相關
- \(\rho=0\)：幾乎無線性關係
- \(\rho=-1\)：完全負相關

## 5. Markowitz 投資組合理論

1952 年 Harry Markowitz 發表 Portfolio Selection，讓金融從「挑股票」進入「組合管理」。

投資組合期望報酬：

\[
E(R_p)=\sum_{i=1}^{n}w_iE(R_i)
\]

投資組合風險：

\[
\sigma_p^2=\sum_i\sum_j w_iw_jCov(R_i,R_j)
\]

重點是：投資人不應只看單一資產，而應看資產放進整體組合後，對總風險與總報酬的影響。

:::note
🔔 深度提示｜Markowitz 的革命性不在於「分散投資」四個字，而是他用數學證明：一個資產本身風險高，不代表它放進投資組合後一定不好；如果它和其他資產相關性低，反而可能降低整體風險。
:::

## 6. Sharpe Ratio

\[
Sharpe=\frac{R_p-R_f}{\sigma_p}
\]

意思是每承擔一單位風險，獲得多少超額報酬。

這個公式今天仍然是基金、策略、交易系統最常用的績效評估指標之一。

## 7. CAPM

\[
E(R_i)=R_f+\beta_i(E(R_m)-R_f)
\]

其中 Beta：

\[
\beta_i=\frac{Cov(R_i,R_m)}{Var(R_m)}
\]

CAPM 用來衡量一個資產相對整體市場應該有多少預期報酬。

## 8. 對交易者的啟示

很多散戶只問「這筆會不會漲」，但專業交易者會問：

- 這套策略長期期望值是多少？
- 最大回撤是多少？
- 夏普比率是否穩定？
- 報酬是否來自單一行情？
- 策略之間是否高度相關？

交易從感覺走向數學，真正的分水嶺就在這裡。

## 參考來源與延伸閱讀

- NYSE History：Buttonwood Agreement 與紐約證券交易所起源，https://www.nyse.com/history-of-nyse
- Nasdaq History：NASDAQ 於 1971 年啟動電子報價市場，https://www.nasdaq.com/
- Nobel Prize：Black-Scholes-Merton 選擇權定價模型與 1997 經濟學獎，https://www.nobelprize.org/prizes/economic-sciences/1997/press-release/
- Nobel Prize：Harry Markowitz Portfolio Selection 相關資料，https://www.nobelprize.org/uploads/2018/06/markowitz-lecture.pdf
- SEC/CFTC：Findings Regarding the Market Events of May 6, 2010，https://www.sec.gov/files/marketevents-report.pdf
- NBER：Robert Shiller 對 1987 年 Portfolio Insurance 與市場崩跌的討論，https://www.nber.org/system/files/chapters/c10958/c10958.pdf
- Reuters：Jim Simons 與 Renaissance Technologies 報導，https://www.reuters.com/world/us/investor-philanthropist-jim-simons-dies-age-86-2024-05-10/
