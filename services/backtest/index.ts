import { IKline } from "../data/kline";
import { IStrategy } from "../strategy/base";
import Account, { IBacktestConfig } from "./account";

class Backtest {
  klines?: IKline[];

  config: IBacktestConfig;

  strategy?: IStrategy;

  account: Account;

  constructor(config: IBacktestConfig) {
    this.config = config;
    this.account = new Account(config);
  }

  // 加载数据
  loadData(klines: IKline[]) {
    this.klines = klines;
  }

  // 加载回测策略
  loadStrategy(strategy: IStrategy) {
    this.strategy = strategy;
  }

  // 运行回测
  run() {
    if (!this.klines) {
      throw new Error("请先加载数据");
    }
    if (!this.strategy) {
      throw new Error("请先加载策略");
    }

    // 初始化策略
    this.strategy.initialize();

    // 遍历数据
    this.klines.forEach((kline, index) => {
      const prevKlines = this.klines!.slice(0, index);
      const signal = this.strategy!.onData(kline, {
        prevKlines,
        canBuy: this.account.canBuy.bind(this.account),
        canSell: this.account.canSell.bind(this.account),
      });

      if (!signal) {
        this.account.calculateDailyResult(kline);
        return;
      }

      if (signal.type === "buy") {
        this.account.buy(kline, signal);
        return;
      }

      if (signal.type === "sell") {
        this.account.sell(kline, signal);
      }
    });

    // 计算回测的结果
    return this.account.calculateResult();
  }
}

export default Backtest;
