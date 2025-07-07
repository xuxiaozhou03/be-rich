// 市场数据类型定义
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

// K线数据类型
export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 交易记录类型
export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
  pnl: number;
}

// 回测指标类型
export interface BacktestMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

// 回测请求类型
export interface BacktestRequest {
  strategyId: string;
  symbols: string[];
  startDate: string;
  endDate: string;
  initialCapital: number;
  parameters?: {
    volatility?: number;
    [key: string]: any;
  };
}

// 组合价值数据类型
export interface PortfolioValue {
  date: string;
  value: number;
  returns: number;
  drawdown: number;
}

// 基准数据类型
export interface Benchmark {
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

// 回测结果类型（重新定义）
export interface BacktestResult {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  metrics: BacktestMetrics;
  portfolioValues: PortfolioValue[];
  trades: Trade[];
  benchmark: Benchmark;
  createdAt: string;
}

// REIT数据类型
export interface REITData extends MarketData {
  type: 'REIT';
  code: string; // 代码
  nav: number; // NAV
  dividendYield: number; // 分派收益率
  ffo: number; // FFO
  affo: number; // AFFO
  occupancyRate: number; // 出租率
  premium: number; // 折溢价率
  propertyType: string; // 物业类型
}

// 扩展的ETF数据类型
export interface ETFData extends MarketData {
  type: 'ETF';
  nav: number; // 净值
  premium: number; // 溢价率
  trackingError: number; // 跟踪误差
  aum: number; // 规模
  code: string; // 代码
  lastUpdated: string; // 最后更新时间
}

// 扩展的可转债数据类型
export interface ConvertibleBondData extends MarketData {
  type: 'ConvertibleBond';
  conversionPrice: number; // 转股价
  conversionValue: number; // 转股价值
  bondValue: number; // 纯债价值
  conversionPremium: number; // 转股溢价率
  creditRating: string; // 信用评级
  code: string; // 代码
  yieldToMaturity: number; // 到期收益率
}

// 投资组合持仓
export interface Position {
  symbol: string;
  name: string;
  type: 'ETF' | 'ConvertibleBond' | 'REIT';
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  weight: number; // 权重
}

// 策略类型
export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'trend' | 'momentum' | 'value' | 'arbitrage';
  status: 'active' | 'inactive' | 'paused';
  returns: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  positions: Position[];
  createdAt: number;
  updatedAt: number;
}

// 风险指标
export interface RiskMetrics {
  var95: number; // 95% VaR
  var99: number; // 99% VaR
  cvar95: number; // 95% CVaR
  maxDrawdown: number; // 最大回撤
  volatility: number; // 波动率
  beta: number; // Beta值
  trackingError: number; // 跟踪误差
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

// 查询参数
export interface QueryParams {
  symbol?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  pagination?: PaginationParams;
}
