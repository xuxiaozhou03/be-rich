import { mean, standardDeviation } from 'simple-statistics';

// 计算移动平均线
export function calculateMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    result.push(mean(slice));
  }
  return result;
}

// 计算指数移动平均线
export function calculateEMA(prices: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  if (prices.length === 0) return result;
  
  result[0] = prices[0];
  
  for (let i = 1; i < prices.length; i++) {
    result[i] = (prices[i] * multiplier) + (result[i - 1] * (1 - multiplier));
  }
  
  return result;
}

// 计算RSI
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  // 计算价格变化
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  // 计算初始平均收益和损失
  if (gains.length < period) return result;
  
  let avgGain = mean(gains.slice(0, period));
  let avgLoss = mean(losses.slice(0, period));
  
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    result.push(rsi);
  }
  
  return result;
}

// 计算MACD
export function calculateMACD(
  prices: number[], 
  fastPeriod: number = 12, 
  slowPeriod: number = 26, 
  signalPeriod: number = 9
) {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  const macdLine: number[] = [];
  const minLength = Math.min(fastEMA.length, slowEMA.length);
  
  for (let i = 0; i < minLength; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i]);
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod);
  const histogram: number[] = [];
  
  for (let i = 0; i < Math.min(macdLine.length, signalLine.length); i++) {
    histogram.push(macdLine[i] - signalLine[i]);
  }
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
}

// 计算布林带
export function calculateBollingerBands(
  prices: number[], 
  period: number = 20, 
  stdDev: number = 2
) {
  const sma = calculateMA(prices, period);
  const upperBand: number[] = [];
  const lowerBand: number[] = [];
  
  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1);
    const std = standardDeviation(slice);
    const smaValue = sma[i - period + 1];
    
    upperBand.push(smaValue + (std * stdDev));
    lowerBand.push(smaValue - (std * stdDev));
  }
  
  return {
    middle: sma,
    upper: upperBand,
    lower: lowerBand
  };
}

// 计算波动率
export function calculateVolatility(returns: number[]): number {
  return standardDeviation(returns) * Math.sqrt(252); // 年化波动率
}

// 计算夏普比率
export function calculateSharpeRatio(
  returns: number[], 
  riskFreeRate: number = 0.03
): number {
  const excessReturns = returns.map(r => r - riskFreeRate / 252);
  const avgExcessReturn = mean(excessReturns);
  const volatility = standardDeviation(excessReturns);
  return avgExcessReturn / volatility * Math.sqrt(252);
}

// 计算最大回撤
export function calculateMaxDrawdown(equity: number[]): number {
  let maxDrawdown = 0;
  let peak = equity[0];
  
  for (let i = 1; i < equity.length; i++) {
    if (equity[i] > peak) {
      peak = equity[i];
    } else {
      const drawdown = (peak - equity[i]) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
}

// 计算VaR (Value at Risk)
export function calculateVaR(
  returns: number[], 
  confidenceLevel: number = 0.95
): number {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel) * sortedReturns.length);
  return sortedReturns[index];
}

// 计算Beta值
export function calculateBeta(
  assetReturns: number[], 
  marketReturns: number[]
): number {
  if (assetReturns.length !== marketReturns.length) {
    throw new Error('Asset and market returns must have the same length');
  }
  
  const assetMean = mean(assetReturns);
  const marketMean = mean(marketReturns);
  
  let covariance = 0;
  let marketVariance = 0;
  
  for (let i = 0; i < assetReturns.length; i++) {
    covariance += (assetReturns[i] - assetMean) * (marketReturns[i] - marketMean);
    marketVariance += Math.pow(marketReturns[i] - marketMean, 2);
  }
  
  covariance /= assetReturns.length - 1;
  marketVariance /= marketReturns.length - 1;
  
  return covariance / marketVariance;
}
