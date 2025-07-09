import { EastMoneyDataService, KLineData, ETFInfo } from './data-service';

/**
 * 量化回测框架实现
 */

export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number;
  slippage: number;
  benchmark?: string;
}

export interface Signal {
  symbol: string;
  timestamp: Date;
  type: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  confidence: number;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  commission: number;
  pnl?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  unrealizedPnL: number;
}

export interface Portfolio {
  cash: number;
  positions: Position[];
  totalValue: number;
  totalPnL: number;
}

export interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitLossRatio: number;
  volatility: number;
}

export interface BacktestResult {
  trades: Trade[];
  portfolio: Portfolio;
  performance: PerformanceMetrics;
  dailyReturns: number[];
  equityCurve: number[];
}

export abstract class Strategy {
  abstract name: string;
  abstract generateSignals(data: KLineData[]): Signal[];
  abstract riskControl(signal: Signal, portfolio: Portfolio): Signal;
}

export class QuantBacktestFramework {
  private dataService: EastMoneyDataService;
  private config: BacktestConfig;
  private trades: Trade[] = [];
  private portfolio: Portfolio;
  private dailyReturns: number[] = [];
  private equityCurve: number[] = [];

  constructor(config: BacktestConfig) {
    this.config = config;
    this.dataService = new EastMoneyDataService();
    this.portfolio = {
      cash: config.initialCapital,
      positions: [],
      totalValue: config.initialCapital,
      totalPnL: 0,
    };
    this.equityCurve.push(config.initialCapital);
  }

  /**
   * 加载市场数据
   */
  async loadMarketData(
    symbol: string,
    klt: number = 101,
    lmt: number = 1000
  ): Promise<KLineData[]> {
    try {
      const data = await this.dataService.getKLineData(symbol, klt, lmt);
      return data.filter(item => {
        const date = new Date(item.timestamp);
        return date >= this.config.startDate && date <= this.config.endDate;
      });
    } catch (error) {
      console.error('Error loading market data:', error);
      throw error;
    }
  }

  /**
   * 运行回测
   */
  async runBacktest(
    strategy: Strategy,
    symbol: string
  ): Promise<BacktestResult> {
    // 加载历史数据
    const marketData = await this.loadMarketData(symbol);

    if (marketData.length === 0) {
      throw new Error('No market data available for the specified period');
    }

    // 重置状态
    this.trades = [];
    this.portfolio = {
      cash: this.config.initialCapital,
      positions: [],
      totalValue: this.config.initialCapital,
      totalPnL: 0,
    };
    this.dailyReturns = [];
    this.equityCurve = [this.config.initialCapital];

    // 逐日回测
    for (let i = 1; i < marketData.length; i++) {
      const currentData = marketData.slice(0, i + 1);
      const currentPrice = marketData[i];

      // 生成信号
      const signals = strategy.generateSignals(currentData);

      // 处理信号
      for (const signal of signals) {
        const controlledSignal = strategy.riskControl(signal, this.portfolio);
        if (controlledSignal) {
          await this.executeSignal(controlledSignal, currentPrice);
        }
      }

      // 更新组合价值
      this.updatePortfolio(currentPrice);

      // 记录每日收益
      const dailyReturn = this.calculateDailyReturn();
      this.dailyReturns.push(dailyReturn);
      this.equityCurve.push(this.portfolio.totalValue);
    }

    // 计算业绩指标
    const performance = this.calculatePerformanceMetrics();

    return {
      trades: this.trades,
      portfolio: this.portfolio,
      performance,
      dailyReturns: this.dailyReturns,
      equityCurve: this.equityCurve,
    };
  }

  /**
   * 执行交易信号
   */
  private async executeSignal(
    signal: Signal,
    priceData: KLineData
  ): Promise<void> {
    const price = signal.price || priceData.close;
    const commission = price * signal.quantity * this.config.commission;
    const slippage = price * signal.quantity * this.config.slippage;
    const totalCost = commission + slippage;

    if (signal.type === 'BUY') {
      const totalAmount = price * signal.quantity + totalCost;
      if (this.portfolio.cash >= totalAmount) {
        // 执行买入
        this.portfolio.cash -= totalAmount;

        // 更新持仓
        const existingPosition = this.portfolio.positions.find(
          p => p.symbol === signal.symbol
        );
        if (existingPosition) {
          const totalQuantity = existingPosition.quantity + signal.quantity;
          const totalValue =
            existingPosition.averagePrice * existingPosition.quantity +
            price * signal.quantity;
          existingPosition.averagePrice = totalValue / totalQuantity;
          existingPosition.quantity = totalQuantity;
        } else {
          this.portfolio.positions.push({
            symbol: signal.symbol,
            quantity: signal.quantity,
            averagePrice: price,
            marketValue: price * signal.quantity,
            unrealizedPnL: 0,
          });
        }

        // 记录交易
        this.trades.push({
          id: `${Date.now()}-${Math.random()}`,
          symbol: signal.symbol,
          side: 'BUY',
          quantity: signal.quantity,
          price,
          timestamp: new Date(priceData.timestamp),
          commission: totalCost,
          pnl: 0,
        });
      }
    } else if (signal.type === 'SELL') {
      const position = this.portfolio.positions.find(
        p => p.symbol === signal.symbol
      );
      if (position && position.quantity >= signal.quantity) {
        // 执行卖出
        const totalAmount = price * signal.quantity - totalCost;
        this.portfolio.cash += totalAmount;

        // 计算盈亏
        const pnl =
          (price - position.averagePrice) * signal.quantity - totalCost;

        // 更新持仓
        position.quantity -= signal.quantity;
        if (position.quantity === 0) {
          this.portfolio.positions = this.portfolio.positions.filter(
            p => p.symbol !== signal.symbol
          );
        }

        // 记录交易
        this.trades.push({
          id: `${Date.now()}-${Math.random()}`,
          symbol: signal.symbol,
          side: 'SELL',
          quantity: signal.quantity,
          price,
          timestamp: new Date(priceData.timestamp),
          commission: totalCost,
          pnl,
        });
      }
    }
  }

  /**
   * 更新组合价值
   */
  private updatePortfolio(priceData: KLineData): void {
    let totalPositionValue = 0;

    for (const position of this.portfolio.positions) {
      position.marketValue = position.quantity * priceData.close;
      position.unrealizedPnL =
        (priceData.close - position.averagePrice) * position.quantity;
      totalPositionValue += position.marketValue;
    }

    this.portfolio.totalValue = this.portfolio.cash + totalPositionValue;
    this.portfolio.totalPnL =
      this.portfolio.totalValue - this.config.initialCapital;
  }

  /**
   * 计算每日收益率
   */
  private calculateDailyReturn(): number {
    if (this.equityCurve.length < 2) return 0;
    const previousValue = this.equityCurve[this.equityCurve.length - 1];
    const currentValue = this.portfolio.totalValue;
    return (currentValue - previousValue) / previousValue;
  }

  /**
   * 计算业绩指标
   */
  private calculatePerformanceMetrics(): PerformanceMetrics {
    const totalReturn =
      (this.portfolio.totalValue - this.config.initialCapital) /
      this.config.initialCapital;
    const annualizedReturn = this.calculateAnnualizedReturn();
    const sharpeRatio = this.calculateSharpeRatio();
    const maxDrawdown = this.calculateMaxDrawdown();
    const winRate = this.calculateWinRate();
    const profitLossRatio = this.calculateProfitLossRatio();
    const volatility = this.calculateVolatility();

    return {
      totalReturn,
      annualizedReturn,
      sharpeRatio,
      maxDrawdown,
      winRate,
      profitLossRatio,
      volatility,
    };
  }

  private calculateAnnualizedReturn(): number {
    if (this.dailyReturns.length === 0) return 0;
    const totalReturn =
      (this.portfolio.totalValue - this.config.initialCapital) /
      this.config.initialCapital;
    const days = this.dailyReturns.length;
    return Math.pow(1 + totalReturn, 252 / days) - 1;
  }

  private calculateSharpeRatio(): number {
    if (this.dailyReturns.length === 0) return 0;
    const avgReturn =
      this.dailyReturns.reduce((sum, ret) => sum + ret, 0) /
      this.dailyReturns.length;
    const volatility = this.calculateVolatility();
    return volatility !== 0
      ? (avgReturn * 252) / (volatility * Math.sqrt(252))
      : 0;
  }

  private calculateMaxDrawdown(): number {
    let maxDrawdown = 0;
    let peak = this.config.initialCapital;

    for (const value of this.equityCurve) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  private calculateWinRate(): number {
    const profitableTrades = this.trades.filter(
      trade => trade.pnl && trade.pnl > 0
    );
    return this.trades.length > 0
      ? profitableTrades.length / this.trades.length
      : 0;
  }

  private calculateProfitLossRatio(): number {
    const profitableTrades = this.trades.filter(
      trade => trade.pnl && trade.pnl > 0
    );
    const losingTrades = this.trades.filter(
      trade => trade.pnl && trade.pnl < 0
    );

    if (profitableTrades.length === 0 || losingTrades.length === 0) return 0;

    const avgProfit =
      profitableTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) /
      profitableTrades.length;
    const avgLoss = Math.abs(
      losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) /
        losingTrades.length
    );

    return avgLoss !== 0 ? avgProfit / avgLoss : 0;
  }

  private calculateVolatility(): number {
    if (this.dailyReturns.length === 0) return 0;
    const avgReturn =
      this.dailyReturns.reduce((sum, ret) => sum + ret, 0) /
      this.dailyReturns.length;
    const variance =
      this.dailyReturns.reduce(
        (sum, ret) => sum + Math.pow(ret - avgReturn, 2),
        0
      ) / this.dailyReturns.length;
    return Math.sqrt(variance);
  }

  /**
   * 获取ETF列表
   */
  async getETFList(): Promise<ETFInfo[]> {
    return await this.dataService.getETFList();
  }

  /**
   * 获取REIT列表
   */
  async getREITList(): Promise<ETFInfo[]> {
    return await this.dataService.getREITList();
  }

  /**
   * 获取可转债列表
   */
  async getConvertibleBondList(): Promise<ETFInfo[]> {
    return await this.dataService.getConvertibleBondList();
  }
}

// 示例策略：简单移动平均线交叉策略
export class SimpleMAStrategy extends Strategy {
  name = 'SimpleMA';
  private shortPeriod: number;
  private longPeriod: number;

  constructor(shortPeriod: number = 5, longPeriod: number = 20) {
    super();
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
  }

  generateSignals(data: KLineData[]): Signal[] {
    if (data.length < this.longPeriod) return [];

    const signals: Signal[] = [];
    const shortMA = this.calculateMA(data, this.shortPeriod);
    const longMA = this.calculateMA(data, this.longPeriod);

    const currentShortMA = shortMA[shortMA.length - 1];
    const currentLongMA = longMA[longMA.length - 1];
    const prevShortMA = shortMA[shortMA.length - 2];
    const prevLongMA = longMA[longMA.length - 2];

    // 金叉买入信号
    if (prevShortMA <= prevLongMA && currentShortMA > currentLongMA) {
      signals.push({
        symbol: '0.159864', // 示例符号
        timestamp: new Date(data[data.length - 1].timestamp),
        type: 'BUY',
        quantity: 1000,
        confidence: 0.8,
      });
    }

    // 死叉卖出信号
    if (prevShortMA >= prevLongMA && currentShortMA < currentLongMA) {
      signals.push({
        symbol: '0.159864',
        timestamp: new Date(data[data.length - 1].timestamp),
        type: 'SELL',
        quantity: 1000,
        confidence: 0.8,
      });
    }

    return signals;
  }

  riskControl(signal: Signal, portfolio: Portfolio): Signal {
    // 简单风控：限制单笔交易不超过总资产的10%
    const maxPosition = portfolio.totalValue * 0.1;
    const signalValue = signal.quantity * (signal.price || 0);

    if (signalValue > maxPosition) {
      signal.quantity = Math.floor(maxPosition / (signal.price || 1));
    }

    return signal;
  }

  private calculateMA(data: KLineData[], period: number): number[] {
    const ma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data
        .slice(i - period + 1, i + 1)
        .reduce((acc, item) => acc + item.close, 0);
      ma.push(sum / period);
    }
    return ma;
  }
}
