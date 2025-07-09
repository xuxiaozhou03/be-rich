# 量化交易系统核心模块

## 核心模块

### 1. 数据模块 (Data Module)

- **行情数据获取**: 实时价格、成交量、K线数据
- **基本面数据**: 财务数据、宏观经济数据
- **另类数据**: 新闻、社交媒体、卫星数据等
- 接口：
  - etf 日k线数据: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=101&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 周 k线数据: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=102&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 月 k线数据: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=103&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 5 日k线数据: https://push2his.eastmoney.com/api/qt/stock/trends2/get?secid=0.159864&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8%2Cf9%2Cf10%2Cf11%2Cf12%2Cf13%2Cf14%2Cf17&fields2=f51%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58&iscr=0&iscca=0&ut=f057cbcbce2a86e2866ab8877db1d059&ndays=5&cb=quotepushdata1
  - 5分钟: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=5&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 15 分钟: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=15&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 30 分钟: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=30&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 60 分钟: https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.159864&klt=60&fqt=1&lmt=66&end=20500000&iscca=1&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6%2Cf7%2Cf8&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61%2Cf62%2Cf63%2Cf64&ut=f057cbcbce2a86e2866ab8877db1d059&forcect=1
  - 获取etf列表: https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=jQuery37109081177566000933_1751965856067&fs=b%3AMK0021%2Cb%3AMK0022%2Cb%3AMK0023%2Cb%3AMK0024%2Cb%3AMK0827&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152%2Cf5%2Cf6%2Cf17%2Cf18%2Cf15%2Cf16&fid=f3&pn=1&pz=20&po=1&dect=1&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&_=1751965856071
  - 获取 REIT 列表: https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=jQuery37109081177566000933_1751965856067&fs=m%3A1%2Bt%3A9%2Be%3A97%2Cm%3A0%2Bt%3A10%2Be%3A97&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152%2Cf5%2Cf6%2Cf17%2Cf18%2Cf15%2Cf16&fid=f3&pn=1&pz=20&po=1&dect=1&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&_=1751965856073
  - 获取 可转债 列表: https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=jQuery371034554280284114436_1751965945765&fs=b%3AMK0354&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152%2Cf232%2Cf233%2Cf234%2Cf229%2Cf230%2Cf231%2Cf235%2Cf236%2Cf154%2Cf237%2Cf238%2Cf239%2Cf240%2Cf241%2Cf227%2Cf242%2Cf26%2Cf243&fid=f243&pn=1&pz=50&po=1&dect=1&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&_=1751965945766
  - ETF和REIT 基本信息: https://fundf10.eastmoney.com/jbgk_508011.html

### 2. 策略模块 (Strategy Module)

- **信号生成**: 技术指标、统计模型、机器学习模型
- **策略回测**: 历史数据验证、性能评估
- **策略优化**: 参数调优、组合优化
- **风险控制**: 止损止盈、仓位管理、风险预警

### 3. 回测交易模块 (Backtest Trading Module)

- **模拟订单**: 买入卖出信号转换为模拟交易
- **成交模拟**: 基于历史数据的价格撮合
- **交易记录**: 详细的买卖记录、持仓变化
- **滑点模拟**: 交易成本和市场冲击模拟

### 4. 风险管理模块 (Risk Management)

- **回测风险监控**: VaR计算、最大回撤
- **组合风险**: 相关性分析、集中度风险
- **风险指标**: 夏普比率、卡玛比率、波动率
- **风险报告**: 风险指标统计、预警分析

### 5. 业绩分析模块 (Performance Analysis)

- **盈亏统计**: 总收益、年化收益、月度收益
- **业绩指标**: 胜率、盈亏比、最大回撤
- **业绩归因**: 收益分解、因子贡献
- **可视化报告**: 收益曲线、持仓分析图表

## 核心流程

### 1. 数据流程

```
原始数据 → 特征工程 → 策略消费
```

### 2. 策略流程

```
历史数据 → 策略开发 → 回测验证 → 参数优化 → 策略评估
```

### 3. 回测交易流程

```
信号生成 → 风险检查 → 模拟订单 → 成交模拟 → 交易记录
```

### 4. 风险流程

```
回测监控 → 风险计算 → 指标统计 → 风险分析 → 报告生成
```

### 5. 完整回测流程

```
历史数据 → 策略计算 → 信号生成 → 风险控制 → 模拟交易 → 盈亏计算 → 业绩分析
```

## 系统架构特点

- **回测精度**: 高精度历史数据回测，真实市场环境模拟
- **性能分析**: 全面的盈亏统计和业绩指标计算
- **风险评估**: 多维度风险分析和回撤控制
- **可视化**: 直观的图表展示和报告生成
- **扩展性**: 模块化设计，支持多种策略和指标

## 核心类设计

### QuantBacktestFramework

```typescript
class QuantBacktestFramework {
  // 数据模块
  private dataModule: {
    marketData: MarketData; // 行情数据
    fundamentalData: FundamentalData; // 基本面数据
    alternativeData: AlternativeData; // 另类数据
  };

  // 策略模块
  private strategyModule: {
    signalGenerator: SignalGenerator; // 信号生成器
    backtester: Backtester; // 回测引擎
    optimizer: StrategyOptimizer; // 策略优化器
    riskController: RiskController; // 风险控制器
  };

  // 回测交易模块
  private backtestTradingModule: {
    orderSimulator: OrderSimulator; // 订单模拟器
    executionEngine: ExecutionEngine; // 成交引擎
    tradeRecorder: TradeRecorder; // 交易记录器
    slippageSimulator: SlippageSimulator; // 滑点模拟器
  };

  // 风险管理模块
  private riskManagementModule: {
    riskMonitor: RiskMonitor; // 风险监控
    portfolioRisk: PortfolioRisk; // 组合风险
    riskMetrics: RiskMetrics; // 风险指标
    riskReporter: RiskReporter; // 风险报告
  };

  // 业绩分析模块
  private performanceModule: {
    pnlCalculator: PnLCalculator; // 盈亏计算器
    performanceMetrics: PerformanceMetrics; // 业绩指标
    attributionAnalyzer: AttributionAnalyzer; // 业绩归因
    visualizer: Visualizer; // 可视化工具
  };

  /**
   * 构造函数
   * @param config 配置参数
   */
  constructor(config: BacktestConfig) {
    // 初始化各模块
  }

  /**
   * 数据相关方法
   */
  loadMarketData(symbol: string, startDate: Date, endDate: Date): Promise<void>;
  loadFundamentalData(symbol: string): Promise<void>;
  loadAlternativeData(dataType: string): Promise<void>;

  /**
   * 策略相关方法
   */
  addStrategy(strategy: Strategy): void;
  generateSignals(strategy: Strategy): Signal[];
  runBacktest(strategy: Strategy, config: BacktestConfig): BacktestResult;
  optimizeStrategy(
    strategy: Strategy,
    parameters: OptimizationParams
  ): OptimizationResult;

  /**
   * 回测交易相关方法
   */
  simulateOrder(signal: Signal): Order;
  executeOrder(order: Order): Execution;
  recordTrade(execution: Execution): void;
  calculateSlippage(order: Order): number;

  /**
   * 风险管理相关方法
   */
  monitorRisk(portfolio: Portfolio): RiskMetrics;
  calculateVaR(portfolio: Portfolio): number;
  calculateMaxDrawdown(returns: number[]): number;
  generateRiskReport(portfolio: Portfolio): RiskReport;

  /**
   * 业绩分析相关方法
   */
  calculatePnL(trades: Trade[]): PnLSummary;
  calculatePerformanceMetrics(returns: number[]): PerformanceMetrics;
  analyzeAttribution(portfolio: Portfolio): AttributionResult;
  generateVisualReport(backtest: BacktestResult): VisualizationReport;

  /**
   * 主要工作流程方法
   */
  runCompleteBacktest(
    config: CompleteBacktestConfig
  ): Promise<CompleteBacktestResult>;
}
```

### 核心接口定义

```typescript
interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  commission: number;
  slippage: number;
  benchmark?: string;
}

interface BacktestResult {
  trades: Trade[];
  portfolio: Portfolio;
  performance: PerformanceMetrics;
  risk: RiskMetrics;
  visualizations: VisualizationReport;
}

interface Strategy {
  name: string;
  generateSignals(data: MarketData): Signal[];
  riskControl(signal: Signal, portfolio: Portfolio): Signal;
}

interface Signal {
  symbol: string;
  timestamp: Date;
  type: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  confidence: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  timestamp: Date;
  commission: number;
  pnl?: number;
}

interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitLossRatio: number;
  volatility: number;
}

interface RiskMetrics {
  var95: number;
  var99: number;
  expectedShortfall: number;
  beta: number;
  alpha: number;
  correlation: number;
}
```

### 使用示例

```typescript
// 创建回测框架实例
const backtest = new QuantBacktestFramework({
  startDate: new Date('2023-01-01'),
  endDate: new Date('2024-01-01'),
  initialCapital: 1000000,
  commission: 0.0005,
  slippage: 0.001,
});

// 加载数据
await backtest.loadMarketData(
  'AAPL',
  new Date('2023-01-01'),
  new Date('2024-01-01')
);

// 定义策略
const strategy = {
  name: 'MA_CrossOver',
  generateSignals: data => {
    // 移动平均线交叉策略逻辑
    return signals;
  },
  riskControl: (signal, portfolio) => {
    // 风险控制逻辑
    return signal;
  },
};

// 运行完整回测
const result = await backtest.runCompleteBacktest({
  strategy: strategy,
  config: backtestConfig,
});

// 输出结果
console.log('回测结果:', result);
```

---

# 量化交易回测框架实现

基于东方财富数据接口的量化交易回测框架，支持ETF、REIT、可转债等金融产品的策略回测。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行示例

```bash
# 运行完整示例
npm run dev

# 运行测试
npm run test

# 编译TypeScript
npm run build

# 运行编译后的文件
npm start
```

## 📋 功能特性

### 数据模块

- ✅ 支持多种K线周期（日K、周K、月K、分钟K线）
- ✅ ETF产品列表获取
- ✅ REIT产品列表获取
- ✅ 可转债产品列表获取
- ✅ 实时行情数据获取

### 策略模块

- ✅ 策略接口抽象
- ✅ 信号生成
- ✅ 风险控制
- ✅ 内置移动平均线策略

### 回测引擎

- ✅ 历史数据回测
- ✅ 模拟交易执行
- ✅ 交易记录管理
- ✅ 滑点和手续费计算

### 业绩分析

- ✅ 总收益率
- ✅ 年化收益率
- ✅ 最大回撤
- ✅ 夏普比率
- ✅ 胜率和盈亏比
- ✅ 波动率计算

## 🛠️ 使用方法

### 1. 基本回测

```typescript
import { QuantBacktestFramework, SimpleMAStrategy } from './backtest-framework';

// 配置回测参数
const config = {
  startDate: new Date('2023-01-01'),
  endDate: new Date('2024-01-01'),
  initialCapital: 100000,
  commission: 0.0003,
  slippage: 0.0005,
};

// 创建回测实例
const backtest = new QuantBacktestFramework(config);

// 创建策略
const strategy = new SimpleMAStrategy(5, 20);

// 运行回测
const result = await backtest.runBacktest(strategy, '1.159915');
console.log('回测结果:', result);
```

### 2. 自定义策略

```typescript
import { Strategy, Signal, KLineData, Portfolio } from './backtest-framework';

class MyStrategy extends Strategy {
  name = 'MyCustomStrategy';

  generateSignals(data: KLineData[]): Signal[] {
    const signals: Signal[] = [];

    // 实现你的策略逻辑
    // 例如：RSI策略、MACD策略等

    return signals;
  }

  riskControl(signal: Signal, portfolio: Portfolio): Signal {
    // 实现风险控制逻辑
    return signal;
  }
}
```

### 3. 数据获取

```typescript
import { EastMoneyDataService } from './data-service';

const dataService = new EastMoneyDataService();

// 获取K线数据
const klineData = await dataService.getKLineData('1.159915', 101, 100);

// 获取ETF列表
const etfList = await dataService.getETFList();

// 获取REIT列表
const reitList = await dataService.getREITList();
```

## 📊 数据接口说明

### K线数据参数

| 参数  | 说明     | 可选值                                                              |
| ----- | -------- | ------------------------------------------------------------------- |
| secid | 证券代码 | 如：1.159915                                                        |
| klt   | K线类型  | 101=日K, 102=周K, 103=月K, 5=5分钟, 15=15分钟, 30=30分钟, 60=60分钟 |
| fqt   | 复权类型 | 0=不复权, 1=前复权, 2=后复权                                        |
| lmt   | 数据条数 | 数字，如100                                                         |

### 证券代码格式

- ETF: `1.159915` (创业板ETF)
- A股: `1.000001` (平安银行)
- 港股: `116.00700` (腾讯控股)

## 🔧 项目结构

```
quant/
├── data-service.ts      # 数据服务（东方财富API）
├── backtest-framework.ts # 回测框架核心
├── example.ts          # 使用示例
├── test.ts             # 测试文件
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
└── readme.md          # 项目说明
```

## 📈 回测结果示例

```
📈 ========== 回测结果 ==========

📊 基本信息:
  交易标的: 1.159915
  回测期间: 2023-01-01 - 2024-01-01
  初始资金: ¥100,000
  最终资产: ¥108,500

💰 业绩指标:
  总收益率: 8.50%
  年化收益率: 8.50%
  最大回撤: 12.30%
  夏普比率: 0.692
  波动率: 18.50%

📋 交易统计:
  总交易次数: 24
  胜率: 58.33%
  盈亏比: 1.240
```

## ⚠️ 注意事项

1. **数据来源**: 本框架使用东方财富公开API，请遵守相关使用条款
2. **仅供学习**: 此框架仅用于学习和研究，不构成投资建议
3. **历史表现**: 回测结果不代表未来表现，投资有风险
4. **网络依赖**: 需要网络连接获取实时数据

## 🚧 待完善功能

- [ ] 更多内置策略
- [ ] 数据缓存机制
- [ ] 多品种组合回测
- [ ] 可视化图表生成
- [ ] 策略参数优化
- [ ] 风险管理模块增强

## 📞 联系方式

如有问题或建议，请提交Issue或Pull Request。

---

**免责声明**: 本项目仅供学习和研究使用，不构成任何投资建议。投资有风险，入市需谨慎。
