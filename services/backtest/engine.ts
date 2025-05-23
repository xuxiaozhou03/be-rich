import { IKline } from "../data/kline";
import { IStrategy } from "../strategy/base";
import Account from "./account";
import { IResult } from "./result";

export interface IBacktestConfig {
  // 初始资金
  initialCapital: number;
  // 计算手续费的函数
  calculateFee: (price: number, quantity: number) => number;
}
const runBacktestEngine = (
  config: IBacktestConfig,
  klines: IKline[],
  strategy: IStrategy
): IResult => {
  if (!klines) {
    throw new Error("请先加载数据");
  }
  if (!strategy) {
    throw new Error("请先加载策略");
  }

  const account = new Account(config);

  // 初始化策略
  strategy.initialize();

  // 遍历数据
  klines.forEach((kline, index) => {
    const prevKlines = klines.slice(0, index);
    const signal = strategy.onData(kline, {
      prevKlines,
      canBuy: account.canBuy.bind(account),
      canSell: account.canSell.bind(account),
    });

    if (!signal) {
      account.record(kline);
      return;
    }

    if (signal.type === "buy") {
      account.buy(kline, signal);
      return;
    }

    if (signal.type === "sell") {
      account.sell(kline, signal);
    }
  });

  // 计算回测的结果
  return account.result;
};

export default runBacktestEngine;
