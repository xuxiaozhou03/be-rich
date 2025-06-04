export type Etf = {
  symbol: string; // ETF代码
  market: 0 | 1; // 0: 深市，1: 沪市
  name: string; // ETF名称
  benchmark: string; // 基准指数
  trackingTarget: string; // 跟踪标的
  scale: number; // 规模（单位：亿元）
};
