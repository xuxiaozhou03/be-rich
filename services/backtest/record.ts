import { IKline } from "../data/kline";
import { formatNumber } from "../helper/tool";
import { ISignal } from "../strategy/base";

class Record {
  kline: IKline;
  signal: ISignal | undefined;
  remark: string | undefined;

  cash: number;
  stock: number;
  stockInvestment: number;

  fee: number | undefined;
  initialCapital: number;

  constructor(opt: {
    kline: IKline;
    signal?: ISignal;
    remark?: string;
    cash: number;
    stock: number;
    stockInvestment: number;
    fee?: number;
    initialCapital: number;
  }) {
    this.kline = opt.kline;
    this.signal = opt.signal;
    this.remark = opt.remark;
    this.cash = opt.cash;
    this.stock = opt.stock;
    this.stockInvestment = opt.stockInvestment;
    this.fee = opt.fee;
    this.initialCapital = opt.initialCapital;
  }

  // 成本价: 当前持股投入资金 / 当前持股数
  // 如果没有持股，则成本价为 0
  get costPrice() {
    if (this.stock === 0) {
      return 0;
    }
    return formatNumber(this.stockInvestment / this.stock); // 持股投入资金均摊到每股的成本
  }

  // 股票市值：持股数 * 当前价格
  // 表示当前持有股票的总市值
  get stockMarketValue() {
    return formatNumber(this.stock * this.kline.close); // 当前价格乘以持股数量
  }

  // 持股盈亏：股票市值 - 持股投入资金
  // 表示当前持股的浮动盈亏金额
  get stockProfitAmount() {
    return formatNumber(this.stockMarketValue - this.stockInvestment); // 市值减去投入资金
  }

  // 持股盈亏率：持股盈亏 / 持股投入资金
  // 表示当前持股的浮动盈亏比例
  get stockProfitAmountRate() {
    if (this.stockInvestment === 0) {
      return 0;
    }
    return formatNumber(this.stockProfitAmount / this.stockInvestment, 5); // 盈亏金额除以投入资金
  }

  // 总资产：股票市值 + 现金
  // 表示当前账户的总资产
  get totalAsset() {
    return formatNumber(this.cash + this.stockMarketValue); // 现金加上股票市值
  }

  // 总盈亏：总资产 - 初始资金
  // 表示账户整体的浮动盈亏金额
  get totalProfitAmount() {
    return formatNumber(this.totalAsset - this.initialCapital); // 总资产减去初始资金
  }

  // 总盈亏率：总盈亏 / 初始资金
  // 表示账户整体的浮动盈亏比例
  get totalProfitAmountRate() {
    if (this.initialCapital === 0) {
      return 0;
    }
    return formatNumber(this.totalProfitAmount / this.initialCapital); // 盈亏金额除以初始资金
  }

  toJSON() {
    return {
      kline: this.kline,
      signal: this.signal,
      remark: this.remark,
      cash: this.cash,
      stock: this.stock,
      stockInvestment: this.stockInvestment,
      fee: this.fee,
      initialCapital: this.initialCapital,
      costPrice: this.costPrice,
      stockMarketValue: this.stockMarketValue,
      stockProfitAmount: this.stockProfitAmount,
      stockProfitAmountRate: this.stockProfitAmountRate,
      totalAsset: this.totalAsset,
      totalProfitAmount: this.totalProfitAmount,
      totalProfitAmountRate: this.totalProfitAmountRate,
    };
  }
}

export type IRecord = ReturnType<Record["toJSON"]>;
export default Record;
