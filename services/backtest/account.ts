import { IKline } from "../data/kline";
import { ISignal } from "../strategy/base";
import Record from "./record";
import Result, { IResult } from "./result";
import { IBacktestConfig } from "./engine";
import { formatNumber } from "../helper/tool";

class Account {
  // 持股数
  stock = 0;

  // 持股投入资金
  // 计算公式：购买股票价格 * 购买股票数量 + 购买股票手续费 - 卖出股票价格 * 卖出股票数量 + 卖出股票手续费
  stockInvestment = 0;

  // 初始资金
  initialCapital: number = 0;

  // 现金
  cash: number;

  records: Record[] = [];

  // 计算手续费
  calculateFee: IBacktestConfig["calculateFee"];

  constructor(config: IBacktestConfig) {
    this.initialCapital = config.initialCapital;
    this.cash = config.initialCapital;
    this.calculateFee = (price: number, quantity: number) =>
      formatNumber(config.calculateFee(price, quantity));
  }

  canBuy(price: number, quantity: number) {
    const { calculateFee } = this;
    // 计算手续费
    const buyFee = calculateFee(price, quantity);
    // 需要的现金
    const requiredCash = formatNumber(price * quantity + buyFee);

    if (this.cash >= requiredCash) {
      return {
        canBuy: true,
        buyFee,
        requiredCash,
      };
    }

    return {
      canBuy: false,
      remark: "现金不足，无法购买股票",
    };
  }

  buy(kline: IKline, signal: ISignal) {
    const { canBuy, remark, ...rest } = this.canBuy(
      signal.price,
      signal.quantity
    );

    if (!canBuy) {
      this.record(kline, remark);
      return;
    }

    const { buyFee = 0, requiredCash = 0 } = rest;
    this.stock += signal.quantity;
    this.cash = formatNumber(this.cash - requiredCash);
    this.stockInvestment = formatNumber(this.stockInvestment + requiredCash, 2);

    // 记录买入
    this.records.push(
      new Record({
        kline,
        signal,
        cash: this.cash,
        stock: this.stock,
        stockInvestment: this.stockInvestment,
        fee: buyFee,
        initialCapital: this.initialCapital,
      })
    );
  }

  canSell(quantity: number) {
    if (this.stock >= quantity) {
      return {
        canSell: true,
      };
    }
    return {
      canSell: false,
      remark: "持股不足，无法卖出股票",
    };
  }

  sell(kline: IKline, signal: ISignal) {
    const { canSell, remark } = this.canSell(signal.quantity);
    if (!canSell) {
      this.record(kline, remark);
      return;
    }

    const sellFee = this.calculateFee(kline.close, signal.quantity);
    const totalCost = formatNumber(kline.close * signal.quantity - sellFee);

    this.cash = formatNumber(this.cash + totalCost);
    this.stock -= signal.quantity;
    this.stockInvestment =
      this.stock === 0 ? 0 : formatNumber(this.stockInvestment - totalCost, 2);

    // 记录卖出
    this.records.push(
      new Record({
        kline,
        signal,
        cash: this.cash,
        stock: this.stock,
        stockInvestment: this.stockInvestment,
        fee: sellFee,
        initialCapital: this.initialCapital,
      })
    );
  }

  record(kline: IKline, remark?: string) {
    this.records.push(
      new Record({
        kline,
        cash: this.cash,
        stock: this.stock,
        stockInvestment: this.stockInvestment,
        initialCapital: this.initialCapital,
        remark,
      })
    );
  }

  get result(): IResult {
    return new Result(this.records, this.initialCapital).toJSON();
  }
}

export default Account;
