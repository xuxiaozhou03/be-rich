import { formatNumber } from "@/lib/utils";
import { IKline } from "../data/kline";
import { ISignal } from "../strategy/base";

export interface IBacktestConfig {
  // 初始资金
  initialCapital: number;
  // 计算手续费的函数
  calculateFee: (price: number, quantity: number) => number;
}

interface ILog {
  // k 线数据
  kline: IKline;
  // 信号数据
  signal?: ISignal;
  // 备注
  remark?: string;

  // 当前现金
  cash: number;
  // 当前持股数
  stock: number;
  // 当前总资产： 现金 + 当前持股市值
  totalAsset: number;
  // 当前总盈亏： 当前总资产： - 初始资金
  totalProfitAmount: number;
  // 当前总盈亏率： 当前总盈亏 / 初始资金
  totalProfitAmountRate: number;
  // 当前持股投入资金
  stockInvestment: number;
  // 成本价： 当前持股投入资金 / 当前持股数
  costPrice: number;
  // 当前持股市值： 当前持股数 * 当前价格
  stockMarketValue: number;
  // 当前持股盈亏： 当前持股市值 - 当前持股投入资金
  stockProfitAmount: number;
  // 当前持股盈亏率： 当前持股盈亏 / 当前持股投入资金
  stockProfitAmountRate: number;
  // 手续费
  fee?: number;
}
/**
 * 回测结果接口
 */
export interface BacktestResult {
  // 初始资金
  initialCapital: number;
  // 最终资金
  finalCapital: number;
  // 总回报率
  totalReturn: number;
  // 年化回报率
  annualReturn: number;
  // 夏普比率
  sharpeRatio: number;
  // 最大回撤
  maxDrawdown: number;
  // 交易次数
  totalTrades: number;
  // 盈利交易次数
  winningTrades: number;
  // 亏损交易次数
  losingTrades: number;
  // 胜率
  winRate: number;
  // 盈亏比
  profitFactor: number;
  // 所有交易记录
  trades: ILog[];
}

class Account {
  // 现金
  cash: number;

  // 持股数
  stock: number = 0;

  // 持有股票投入资金
  // 计算公式：购买股票价格 * 购买股票数量 + 购买股票手续费 - 卖出股票价格 * 卖出股票数量 + 卖出股票手续费
  stockInvestment: number = 0;

  config: IBacktestConfig;

  // 日志
  logs: ILog[] = [];

  constructor(config: IBacktestConfig) {
    this.cash = config.initialCapital;
    this.config = {
      ...config,
      calculateFee: (price: number, quantity: number) =>
        formatNumber(config.calculateFee(price, quantity)),
    };
  }

  canBuy(price: number, quantity: number) {
    const { calculateFee } = this.config;
    const buyFee = calculateFee(price, quantity);
    const totalCost = price * quantity + buyFee;

    if (this.cash >= totalCost) {
      return {
        canBuy: true,
      };
    }

    return {
      canBuy: false,
      remark: "现金不足，无法购买股票",
    };
  }

  buy(kline: IKline, signal: ISignal) {
    const { calculateFee } = this.config;
    const { price, quantity } = signal;

    // 是否足够现金购买
    const { canBuy, remark } = this.canBuy(price, quantity);
    if (!canBuy) {
      this.calculateDailyResult({
        kline,
        remark,
      });
      return;
    }

    const buyFee = calculateFee(price, quantity);
    const totalCost = formatNumber(price * quantity + buyFee);

    this.cash = formatNumber(this.cash - totalCost);
    this.stock += quantity;
    this.stockInvestment = formatNumber(this.stockInvestment + totalCost);

    this.calculateDailyResult({
      kline,
      signal,
      fee: buyFee,
    });
  }

  canSell(quantity: number) {
    if (this.stock >= quantity) {
      return {
        canSell: true,
        remark: undefined,
      };
    }

    return {
      canSell: false,
      remark: "持股不足，无法卖出股票",
    };
  }

  sell(kline: IKline, signal: ISignal) {
    const { calculateFee } = this.config;
    const { price, quantity } = signal;

    // 是否足够股票卖出
    const { canSell, remark } = this.canSell(quantity);
    if (!canSell) {
      this.calculateDailyResult({
        kline,
        remark,
      });
      return;
    }

    const sellFee = calculateFee(price, quantity);
    const totalIncome = formatNumber(price * quantity - sellFee);
    this.cash = formatNumber(this.cash + totalIncome);
    this.stock -= quantity;
    this.stockInvestment = formatNumber(this.stockInvestment - totalIncome);
    this.calculateDailyResult({
      kline,
      signal,
      fee: sellFee,
    });
  }

  // 计算每一天的回测结果
  calculateDailyResult(opts: {
    kline: IKline;
    signal?: ISignal;
    remark?: string;
    fee?: number;
  }) {
    const { kline, signal, remark, fee } = opts;
    // 计算当前持股市值
    const stockMarketValue = formatNumber(this.stock * kline.close);
    // 计算当前持股盈亏
    const stockProfitAmount = formatNumber(
      stockMarketValue - this.stockInvestment
    );
    // 计算当前持股盈亏率
    const stockProfitAmountRate = formatNumber(
      stockProfitAmount / (this.stockInvestment || 1)
    );
    // 计算当前总资产
    const totalAsset = formatNumber(this.cash + stockMarketValue);
    // 计算当前总盈亏
    const totalProfitAmount = formatNumber(
      totalAsset - this.config.initialCapital
    );
    // 计算当前总盈亏率
    const totalProfitAmountRate = formatNumber(
      (totalProfitAmount / this.config.initialCapital) * 100
    );
    // 计算当前持股成本价
    const costPrice = formatNumber(this.stockInvestment / (this.stock || 1));

    this.logs.push({
      kline,
      signal,
      remark,
      cash: this.cash,
      stock: this.stock,
      totalAsset,
      totalProfitAmount,
      totalProfitAmountRate,
      stockInvestment: this.stockInvestment,
      costPrice,
      stockMarketValue,
      stockProfitAmount,
      stockProfitAmountRate,
      fee,
    });
  }

  // 计算回测结果
  get result(): BacktestResult {
    const log = this.logs[this.logs.length - 1];
    const totalTrades = this.logs.filter((log) => log.signal).length;

    // 计算盈利交易次数
    const winningTrades = this.logs.filter(
      (log) => log.signal && log.totalProfitAmount > 0
    ).length;
    // 计算亏损交易次数
    const losingTrades = this.logs.filter(
      (log) => log.signal && log.totalProfitAmount < 0
    ).length;
    // 计算胜率
    const winRate = (winningTrades / totalTrades) * 100 || 0;
    // 计算盈亏比
    const profitFactor =
      this.logs
        .filter((log) => log.signal && log.totalProfitAmount > 0)
        .reduce((acc, log) => acc + log.totalProfitAmount, 0) /
      Math.abs(
        this.logs
          .filter((log) => log.signal && log.totalProfitAmount < 0)
          .reduce((acc, log) => acc + log.totalProfitAmount, 0)
      );
    // 计算年化回报率
    const annualReturn =
      ((log.totalAsset - this.config.initialCapital) /
        this.config.initialCapital) *
      100;

    // 计算最大回撤
    const maxDrawdown =
      Math.max(...this.logs.map((log) => log.totalProfitAmount)) -
      Math.min(...this.logs.map((log) => log.totalProfitAmount));

    // 计算夏普比率
    const sharpeRatio =
      (log.totalAsset - this.config.initialCapital) /
      Math.sqrt(
        this.logs.reduce((acc, log) => {
          const dailyReturn =
            (log.totalAsset - this.config.initialCapital) /
            this.config.initialCapital;
          return acc + Math.pow(dailyReturn, 2);
        }, 0) / this.logs.length
      );

    // 回报率
    const totalReturn =
      ((log.totalAsset - this.config.initialCapital) /
        this.config.initialCapital) *
      100;

    return {
      initialCapital: this.config.initialCapital,
      finalCapital: log.totalAsset,
      totalReturn,
      trades: this.logs,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,

      profitFactor,
      annualReturn,
      sharpeRatio,
      maxDrawdown,
    };
  }
}

export default Account;
