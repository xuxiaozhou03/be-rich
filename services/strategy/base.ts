import Account from "../backtest/account";
import { IKline } from "../data/kline";

export interface ISignal {
  // 信号类型： 买入、卖出、无操作
  type: "buy" | "sell";
  // 操作股票价格
  price: number;
  // 操作股票数量
  quantity: number;
  // 信号描述
  description?: string;
}

interface IStrategyCtx extends Pick<Account, "canBuy" | "canSell"> {
  prevKlines: IKline[];
}

export interface IStrategy {
  // 策略名称
  name: string;
  // 策略描述
  description: string;
  // 策略参数
  params: Record<string, any>;

  // 初始化策略
  initialize(): void;

  // 处理新数据
  onData(kline: IKline, ctx: IStrategyCtx): ISignal | null;

  // 策略退出时调用
  onExit(): void;
}

export abstract class BaseStrategy implements IStrategy {
  name: string;
  description: string;
  params: IStrategy["params"];

  constructor(name: string, description: string, params: IStrategy["params"]) {
    this.name = name;
    this.description = description;
    this.params = params;
  }

  initialize(): void {
    console.log(`Initializing strategy: ${this.name}`);
  }

  abstract onData: IStrategy["onData"];

  onExit(): void {
    console.log(`Exiting strategy: ${this.name}`);
  }
}
