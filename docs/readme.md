# 量化交易系统核心功能模块

## 🛠️ 技术架构与实现

### 前端技术栈 (Frontend Stack)
- **框架**：Next.js 15+ (App Router)
- **UI组件库**：
  - Ant Design：基础组件库
  - 图表可视化：
    - Recharts：基础图表库
    - TradingView Charting Library：专业金融图表（商业许可）
    - LightWeight Charts：轻量级金融图表（开源免费）
    - Highcharts Stock：企业级股票图表（商业许可）
    - Chart.js + Financial插件：基础金融图表（开源免费）
    - D3.js：高度自定义图表（开源免费）
- **状态管理**：
  - Zustand / Redux Toolkit：全局状态管理
  - SWR / TanStack Query：数据获取和缓存
- **样式方案**：
  - CSS Modules：组件级样式隔离、类名自动哈希、样式模块化

### 后端技术栈 (Backend Stack)
- **API层**：Next.js API Routes / tRPC
- **数据获取**：
  - 第三方数据接口：同花顺、东方财富、聚宽、Wind、彭博
  - 数据处理：TypeScript原生计算
- **计算引擎**：
  - Node.js计算服务：策略计算、回测引擎
  - Web Workers：浏览器端并行计算
- **部署方案**：
  - Vercel / Netlify：无服务器部署
  - Docker容器化：自建服务器部署

### 数据流架构 (Data Flow)
```
数据源 → API网关 → 数据标准化 → 前端展示
  ↓
TypeScript计算引擎 → 交易信号 → 风险管理 → 执行引擎
```

### 页面结构设计 (Page Structure)
- **首页 (Dashboard)**：总览、实时监控、快速操作
- **策略管理 (/strategies)**：策略列表、策略详情、策略回测
- **投资组合 (/portfolio)**：持仓管理、组合分析、再平衡
- **数据中心 (/data)**：行情数据、基础数据、数据可视化
- **风险管理 (/risk)**：风险监控、压力测试、合规检查
- **研究平台 (/research)**：因子研究、模型验证、回测分析
- **交易执行 (/trading)**：算法交易、订单管理、执行监控
- **设置中心 (/settings)**：系统配置、用户管理、API配置

---

## ✨ 核心功能模块

### 1. 数据管理模块 (Data Management)
- **行情数据**：股票、期货、期权、数字货币等多资产实时和历史数据
- **基础数据**：财务数据、公司基本面、宏观经济数据
- **A股专项数据**：
  - **ETF数据**：基金净值、申赎清单、跟踪指数成分股、基金规模、申赎费率
  - **可转债数据**：转股价、转股价值、纯债价值、转股溢价率、赎回条件、下修条件
  - **REIT数据**：基础资产信息、租金收入、NAV、分派收益率、FFO、AFFO
- **参考数据**：
  - 指数数据：各类指数实时行情、成分股权重、指数编制规则
  - 利率数据：国债收益率曲线、银行间拆借利率、央行政策利率
  - 宏观数据：GDP、CPI、PPI、PMI等宏观经济指标
- **投资标的覆盖**：
  - **ETF (Exchange Traded Fund)**：宽基ETF、行业ETF、主题ETF、债券ETF、海外ETF
  - **可转债 (Convertible Bond)**：转债特性、关键指标、投资策略、风险管理
  - **REIT (Real Estate Investment Trust)**：基础设施REITs、商业地产REITs、关键指标、投资价值
- **数据接口与标准化**：
  - 数据接口：Next.js API Routes、RESTful API
  - 历史数据接口：GraphQL、SWR数据获取、批量查询
  - 统一数据结构：TypeScript类型定义、数据验证、格式转换
  - 接口管理：API版本控制、接口文档、性能监控
  - 前端数据层：数据缓存策略、状态同步、错误处理

### 2. 策略开发平台 (Strategy Development)
- **策略框架**：
  - 策略基类设计：initialize、on_data、on_order、on_trade
  - 事件驱动架构：市场事件、交易事件、时间事件
  - 策略生命周期管理：启动、运行、暂停、停止
  - 策略参数管理：动态参数调整、参数优化
- **技术指标库**：
  - 趋势指标：MA、EMA、MACD、Bollinger Bands、ADX（基于indicatorts）
  - 震荡指标：RSI、Stochastic、Williams %R、CCI（基于indicatorts）
  - 量价指标：OBV、Chaikin Money Flow、Volume Profile（基于indicatorts）
  - 自定义指标：指标构建器、指标回测验证
- **因子库**：
  - 基本面因子：PE、PB、ROE、ROA、财务比率
  - 技术面因子：动量、反转、波动率、流动性
  - 另类数据因子：情绪因子、新闻因子、社交媒体因子
  - 因子合成：多因子模型、因子权重分配
- **策略模板**：
  - 量价策略：均线策略、突破策略、网格策略
  - 基本面策略：价值投资、成长投资、质量投资
  - 事件驱动策略：公告事件、业绩事件、分红事件
  - 套利策略：统计套利、配对交易、期现套利
- **针对性策略**：
  - ETF策略：行业轮动、风格轮动、ETF套利、指数增强
  - 可转债策略：转债轮动、下修博弈、正股联动、转股套利
  - REIT策略：收益率策略、NAV折价策略、分红策略、利率敏感策略
- **开发环境**：
  - 在线代码编辑器：Monaco Editor集成、语法高亮、代码补全
  - 可视化策略构建器：拖拽式策略设计、可视化流程图
  - 实时预览：策略参数调整、实时回测结果
  - 策略模板市场：策略分享、策略评级、一键导入
- **前端集成**：
  - 策略编辑页面：/strategies/editor
  - 策略列表页面：/strategies，支持筛选、排序、搜索
  - 策略详情页面：/strategies/[id]，展示策略表现和参数
  - 回测结果展示：交互式图表、详细报告、对比分析
- **策略回测**：
  - 向量化回测：快速批量测试、矩阵运算优化
  - 事件驱动回测：逐笔回测、实时模拟、延迟建模

### 3. 回测引擎 (Backtesting Engine)
- **历史模拟**：
  - 时间序列回测：按时间顺序回放历史数据
  - 多频率回测：支持分钟、小时、日级别数据
  - 多标的回测：同时回测多个投资标的
  - 基准对比：与指数基准进行对比分析
- **交易成本建模**：
  - 手续费模型：固定费用、比例费用、阶梯费用
  - 滑点模型：线性滑点、平方根滑点、动态滑点
  - 市场冲击成本：临时冲击、永久冲击、流动性成本
  - 融资成本：融资利率、融券费用、保证金成本
- **标的特性建模**：
  - ETF特性：跟踪误差计算、申赎机制模拟、流动性分析、溢价折价
  - 可转债特性：转股概率建模、赎回概率建模、下修概率建模、债券价值
  - REIT特性：分红时间建模、NAV波动建模、利率敏感性、现金流分析
- **风险管理**：
  - 仓位管理：固定比例、动态调整、风险预算、杠杆控制
  - 止损止盈：固定止损、追踪止损、时间止损、波动率止损
  - 风险预算：VaR限制、最大回撤控制、集中度限制
  - 资金管理：可用资金、保证金、风险敞口
- **性能分析**：
  - 收益指标：总收益、年化收益、月度收益、日均收益
  - 风险指标：波动率、夏普比率、索提诺比率、卡玛比率
  - 回撤指标：最大回撤、平均回撤、回撤持续时间、回撤恢复时间
  - 交易指标：胜率、盈亏比、平均持仓时间、交易频率
- **归因分析**：
  - 收益归因：Alpha收益、Beta收益、选股收益、择时收益
  - 风险归因：系统性风险、特异性风险、因子风险
  - 业绩归因：行业归因、风格归因、个股归因
  - 成本归因：交易成本、融资成本、机会成本

### 4. 投资组合管理 (Portfolio Management)
- **多策略管理**：
  - 策略配置：权重分配、动态调整、策略切换
  - 资金分配：按策略分配、按风险分配、按收益分配
  - 策略监控：实时监控、性能评估、风险预警
  - 策略优化：参数优化、权重优化、时机优化
- **多标的配置**：
  - ETF配置：行业配置（科技、医疗、消费）、风格配置（价值、成长）、主题配置（新能源、5G）
  - 可转债配置：信用等级配置（AAA、AA+、AA）、到期时间配置（1年内、1-3年、3年以上）、转股溢价率配置（-10%~10%、10%~30%、30%以上）
  - REIT配置：地产类型配置（产业园区、物流仓储、基础设施）、地区配置（一线城市、二线城市）、收益率配置（3-5%、5-7%、7%以上）
- **风险预算**：
  - VaR计算：历史模拟法、蒙特卡洛模拟、参数法
  - 压力测试：历史情景、假设情景、极端情景
  - 敏感性分析：利率敏感性、汇率敏感性、市场敏感性
  - 风险限额：总体风险限额、单一标的限额、行业限额
- **组合优化**：
  - 均值方差优化：马科维茨模型、有效前沿、最优权重
  - 风险平价：等权重、等风险贡献、风险预算
  - Black-Litterman模型：市场均衡、投资者观点、后验分布
  - 因子模型：多因子模型、因子暴露、因子收益
- **再平衡**：
  - 定期再平衡：月度、季度、年度再平衡
  - 阈值再平衡：权重偏离阈值、风险偏离阈值
  - 风险驱动再平衡：VaR超限、波动率异常、相关性变化
  - 成本优化再平衡：交易成本最小化、税收优化
- **业绩归因**：
  - 因子归因：规模因子、价值因子、盈利因子、质量因子
  - 行业归因：行业选择、行业配置、行业轮动
  - 风格归因：价值风格、成长风格、质量风格
  - 选股归因：个股选择、择时能力、交互效应

### 5. 风险管理系统 (Risk Management)
- **实时监控**：
  - 持仓风险：实时持仓、未实现盈亏、持仓集中度、持仓期限
  - 集中度风险：单一标的集中度、行业集中度、地区集中度
  - 流动性风险：流动性评估、流动性缺口、流动性成本
  - 信用风险：交易对手风险、发行人风险、信用评级变化
- **标的特定风险**：
  - ETF风险：跟踪误差风险（日均跟踪误差>0.5%）、申赎风险（大额申赎冲击）、基金清盘风险（规模<5000万）
  - 可转债风险：信用风险（信用评级下调）、强赎风险（正股价格>130%转股价）、下修风险（正股价格<85%转股价）、流动性风险（日均成交额<100万）
  - REIT风险：利率风险（利率上升影响）、物业价值风险（评估价值下降）、租金收入风险（空置率上升）
- **风险指标**：
  - VaR指标：1日VaR、5日VaR、10日VaR，置信度95%、99%
  - CVaR指标：条件VaR、尾部期望损失、极端损失
  - 最大回撤：历史最大回撤、滚动最大回撤、回撤持续时间
  - 跟踪误差：与基准的偏离程度、信息比率
- **压力测试**：
  - 历史情景：2008金融危机、2015股灾、2020疫情
  - 蒙特卡洛模拟：随机情景生成、概率分布、置信区间
  - 极端情景：市场崩盘、流动性危机、信用违约
  - 敏感性测试：利率+/-100bp、汇率+/-10%、波动率+/-20%
- **风险预警**：
  - 风险阈值设置：VaR阈值、回撤阈值、集中度阈值
  - 实时预警：邮件预警、短信预警、系统推送
  - 自动止损：价格止损、时间止损、波动率止损
  - 风险报告：日报、周报、月报、专项报告
- **合规检查**：
  - 投资限制：单一标的限制、行业限制、杠杆限制
  - 监管要求：资管新规、理财新规、券商风控
  - 内控制度：交易授权、审批流程、风险报告
  - 合规监控：实时监控、事后检查、违规处理

### 6. 数据可视化 (Data Visualization)
- **图表组件**：
  - K线图：日K、周K、月K、分钟K，支持技术指标叠加
  - 时间序列图：价格走势、收益率曲线、波动率曲线
  - 热力图：相关性热力图、行业热力图、因子热力图
  - 散点图：收益风险散点图、因子散点图、回归分析图
- **专业图表**：
  - ETF图表：净值走势图、跟踪误差图、申赎数据图、溢价率图
  - 可转债图表：转股价值图、纯债价值图、转股溢价率图、到期收益率图
  - REIT图表：分派收益率图、NAV走势图、现金流分析图、利率敏感性图
- **仪表盘**：
  - 实时监控面板：持仓概览、盈亏统计、风险指标、市场概况
  - 策略表现：收益曲线、回撤曲线、胜率统计、交易明细
  - 风险指标：VaR监控、集中度监控、流动性监控
  - 市场数据：实时行情、涨跌幅榜、成交量榜、资金流向
- **报表系统**：
  - 日报：当日收益、持仓变化、风险指标、市场回顾
  - 周报：周度收益、策略表现、风险分析、市场展望
  - 月报：月度总结、业绩归因、风险评估、投资建议
  - 年报：年度回顾、策略优化、风险管理、未来规划
- **交互分析**：
  - 多维度分析：时间维度、标的维度、策略维度、风险维度
  - 钻取分析：从总体到细节、从组合到个股、从策略到交易
  - 对比分析：策略对比、基准对比、历史对比
  - 自定义分析：自定义指标、自定义图表、自定义报表
- **前端实现**：
  - React组件库：可复用图表组件、主题定制、响应式布局
  - 数据展示：静态数据展示、定时刷新、性能优化
  - 交互体验：图表缩放、数据钻取、工具提示、导出功能
  - 页面路由：/dashboard（仪表盘）、/charts（图表中心）、/reports（报表中心）
- **技术实现**：
  - Next.js SSR：服务端渲染、SEO优化、首屏加载优化
  - 数据获取：SWR定时更新、错误重试、离线支持
  - 状态管理：Zustand全局状态、本地存储、用户偏好设置
  - 性能优化：虚拟滚动、懒加载、代码分割

### 7. 算法交易引擎 (Algorithmic Trading)
- **执行算法**：
  - TWAP（时间加权平均价格）：分时段执行、均匀分配、时间优化
  - VWAP（成交量加权平均价格）：跟踪历史成交量、动态调整、成交量预测
  - Implementation Shortfall：市场冲击最小化、时机成本优化、执行效率
  - POV（参与率）：跟踪市场成交量、控制市场影响、参与率调整
- **标的特定算法**：
  - ETF交易：申赎套利（一二级市场价差）、折溢价套利（净值价差）、跨市场套利（A/H股价差）
  - 可转债交易：转股套利（转股价值>可转债价格）、债券-股票套利（正股联动）、波动率套利（隐含波动率差异）
  - REIT交易：分红前后交易（除权除息）、NAV套利（净值折溢价）、利率敏感交易（利率变化套利）
- **做市策略**：
  - 双边报价：买卖价差管理、库存管理、风险对冲
  - 流动性提供：深度提供、价格改善、成交概率优化
  - 价差套利：买卖价差捕获、订单流分析、市场微观结构
- **高频交易**：
  - 延迟优化：网络延迟、系统延迟、数据延迟优化
  - 事件驱动：新闻事件、公告事件、价格事件响应
  - 统计套利：价格回归、协整关系、配对交易
  - 市场微观结构：订单簿分析、成交量分析、价格发现
- **智能路由**：
  - 最优执行：多市场选择、执行成本最小化、流动性聚合
  - 流动性聚合：多个交易所、多个做市商、智能分单
  - 成本优化：交易成本、市场冲击、时机成本综合优化
  - 执行监控：实时监控、执行报告、绩效评估
- **量化信号**：
  - Alpha信号：超额收益信号、多因子模型、机器学习信号
  - 择时信号：买入信号、卖出信号、持有信号
  - 选股信号：个股排名、行业轮动、风格轮动
  - 风险信号：风险预警、止损信号、减仓信号

### 8. 量化研究平台 (Quantitative Research)
- **数据挖掘**：
  - 特征工程：特征选择、特征变换、特征组合、特征降维
  - 因子挖掘：基本面因子、技术面因子、宏观因子、另类因子
  - 信号提取：价格信号、成交量信号、情绪信号、事件信号
  - 数据预处理：缺失值处理、异常值处理、数据标准化
- **专项研究**：
  - ETF研究：跟踪误差分析（日均跟踪误差、年化跟踪误差）、申赎机制研究（申赎成本、申赎效率）、行业轮动研究（行业动量、行业均值回归）
  - 可转债研究：转债定价模型（二叉树模型、蒙特卡洛模拟）、下修概率模型（历史下修概率、触发条件）、转股时机研究（最优转股时机、转股价值分析）
  - REIT研究：NAV估值模型（资产评估、收益法估值）、分红可持续性分析（现金流覆盖率、分红政策）、利率敏感性研究（利率弹性、久期分析）
- **机器学习**：
  - 监督学习：线性回归、决策树、随机森林、梯度提升、支持向量机
  - 无监督学习：K-means聚类、层次聚类、主成分分析、因子分析
  - 强化学习：Q-learning、策略梯度、Actor-Critic、深度强化学习
  - 深度学习：神经网络、CNN、RNN、LSTM、Transformer
- **模型验证**：
  - 交叉验证：K折交叉验证、时间序列交叉验证、留一交叉验证
  - 样本外测试：训练集、验证集、测试集分割、前向验证
  - 模型评估：准确率、精确率、召回率、F1分数、AUC、IC值
  - 过拟合检测：学习曲线、验证曲线、正则化、早停法
- **研究工具**：
  - 在线计算平台：Observable、CodePen、JSFiddle
  - TypeScript数学库：ML-Matrix、D3.js、Simple-statistics
  - 技术指标库：indicatorts
  - 数据分析库：Observable Plot、Arquero、Vega-Lite
  - API集成：RESTful、GraphQL
- **知识管理**：
  - 研究文档：研究报告、策略说明、模型文档、API文档
  - 模型库：预训练模型、自定义模型、模型版本管理
  - 策略库：策略模板、策略实例、策略分类、策略评估
  - 团队协作：代码共享、知识分享、版本控制、项目管理

---

*最后更新时间：2025年7月7日*

## 🚀 开发指南

### 项目结构 (Project Structure)
```
be-rich/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 仪表盘页面
│   ├── strategies/        # 策略管理页面
│   ├── portfolio/         # 投资组合页面
│   ├── data/             # 数据中心页面
│   ├── risk/             # 风险管理页面
│   ├── research/         # 研究平台页面
│   ├── trading/          # 交易执行页面
│   └── api/              # API Routes
├── components/           # 可复用组件
│   ├── ui/              # 基础UI组件
│   ├── charts/          # 图表组件
│   ├── forms/           # 表单组件
│   └── layouts/         # 布局组件
├── lib/                 # 工具库
│   ├── data/           # 数据获取和处理
│   ├── calculations/   # 计算引擎
│   ├── utils/          # 工具函数
│   └── types/          # TypeScript类型定义
├── stores/             # 状态管理
├── styles/             # 样式文件
└── public/             # 静态资源
```

### 核心依赖 (Dependencies)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "antd": "^5.0.0",
    "recharts": "^2.8.0",
    "zustand": "^4.4.0",
    "swr": "^2.2.0",
    "axios": "^1.5.0",
    "ml-matrix": "^6.10.0",
    "simple-statistics": "^7.8.0",
    "d3": "^7.8.0",
    "indicatorts": "^3.0.0",
    "lightweight-charts": "^4.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/d3": "^7.4.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 环境配置 (Environment Setup)
```bash
# 开发环境启动
npm run dev

# 生产环境构建
npm run build

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

### API集成示例 (API Integration)
```typescript
// lib/api/market-data.ts
export async function getMarketData(symbol: string) {
  const response = await fetch(`/api/market/${symbol}`);
  return response.json();
}

// app/api/market/[symbol]/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  // 获取实时行情数据
  const data = await fetchMarketData(symbol);
  
  return Response.json(data);
}
```

### TypeScript计算引擎示例 (Calculation Engine)
```typescript
// lib/calculations/indicators.ts
import { mean, standardDeviation } from 'simple-statistics';
import { sma, ema, rsi, macd, bollinger } from 'indicatorts';

// 计算移动平均线
export function calculateMA(prices: number[], period: number): number[] {
  return sma(prices, period);
}

// 计算指数移动平均线
export function calculateEMA(prices: number[], period: number): number[] {
  return ema(prices, period);
}

// 计算RSI
export function calculateRSI(prices: number[], period: number = 14): number[] {
  return rsi(prices, period);
}

// 计算MACD
export function calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  return macd(prices, fastPeriod, slowPeriod, signalPeriod);
}

// 计算布林带
export function calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2) {
  return bollinger(prices, period, stdDev);
}

// 计算波动率
export function calculateVolatility(returns: number[]): number {
  return standardDeviation(returns) * Math.sqrt(252); // 年化波动率
}

// 计算夏普比率
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.03): number {
  const excessReturns = returns.map(r => r - riskFreeRate / 252);
  const avgExcessReturn = mean(excessReturns);
  const volatility = standardDeviation(excessReturns);
  return avgExcessReturn / volatility * Math.sqrt(252);
}
```

### 专业金融图表选择与集成 (Financial Chart Libraries)

#### 1. **TradingView Charting Library** (推荐 - 专业级)
```typescript
// 商业许可，功能最全面
// components/charts/TradingViewChart.tsx
import { useEffect, useRef } from 'react';
import { widget } from 'charting_library';

export function TradingViewChart({ symbol, interval = '1D' }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const widgetOptions = {
      symbol,
      interval,
      container: chartContainerRef.current!,
      library_path: '/charting_library/',
      locale: 'zh',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      theme: 'light',
      toolbar_bg: '#f1f3f6',
      overrides: {
        'paneProperties.background': '#ffffff',
        'paneProperties.vertGridProperties.color': '#e1e3e6',
        'paneProperties.horzGridProperties.color': '#e1e3e6',
      },
    };
    
    const tvWidget = new widget(widgetOptions);
    
    return () => {
      tvWidget.remove();
    };
  }, [symbol, interval]);
  
  return <div ref={chartContainerRef} className="trading-view-chart" />;
}
```

#### 2. **LightWeight Charts** (推荐 - 开源免费)
```typescript
// 开源免费，轻量级高性能
// components/charts/LightWeightChart.tsx
import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';

export function LightWeightChart({ data, type = 'candlestick' }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  
  useEffect(() => {
    const chart = createChart(chartContainerRef.current!, {
      layout: {
        background: { type: ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#e1e3e6' },
        horzLines: { color: '#e1e3e6' },
      },
      width: chartContainerRef.current!.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    // 添加K线图
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    
    // 添加成交量
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    });
    
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    candlestickSeries.setData(data.kline);
    volumeSeries.setData(data.volume);
    
    chartRef.current = chart;
    
    return () => {
      chart.remove();
    };
  }, [data]);
  
  return <div ref={chartContainerRef} className="lightweight-chart" />;
}
```

#### 3. **Chart.js + Financial Plugin** (基础选择)
```typescript
// 开源免费，适合基础需求
// components/charts/ChartJsFinancial.tsx
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement
);

export function ChartJsFinancial({ data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '金融图表',
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };
  
  const chartData = {
    datasets: [
      {
        type: 'candlestick' as const,
        label: 'K线图',
        data: data.map(item => ({
          t: item.time,
          o: item.open,
          h: item.high,
          l: item.low,
          c: item.close,
        })),
        borderColor: '#26a69a',
        backgroundColor: '#26a69a',
      },
    ],
  };
  
  return <Chart type="candlestick" data={chartData} options={options} />;
}
```

#### 4. **D3.js 自定义金融图表** (高度定制)
```typescript
// 完全自定义，适合特殊需求
// components/charts/D3FinancialChart.tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function D3FinancialChart({ data, width = 800, height = 400 }) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.time)) as [Date, Date])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.high) as [number, number])
      .range([innerHeight, 0]);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // 绘制K线
    g.selectAll('.candle')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'candle')
      .attr('transform', d => `translate(${xScale(new Date(d.time))},0)`)
      .each(function(d) {
        const candle = d3.select(this);
        const color = d.close > d.open ? '#26a69a' : '#ef5350';
        
        // 影线
        candle.append('line')
          .attr('y1', yScale(d.high))
          .attr('y2', yScale(d.low))
          .attr('stroke', color)
          .attr('stroke-width', 1);
        
        // 实体
        candle.append('rect')
          .attr('y', yScale(Math.max(d.open, d.close)))
          .attr('height', Math.abs(yScale(d.open) - yScale(d.close)))
          .attr('width', 4)
          .attr('x', -2)
          .attr('fill', color);
      });
    
    // 添加坐标轴
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    
    g.append('g')
      .call(d3.axisLeft(yScale));
    
  }, [data, width, height]);
  
  return <svg ref={svgRef} width={width} height={height} />;
}
```

#### 图表库选择建议

| 图表库 | 许可 | 复杂度 | 功能性 | 适用场景 |
|--------|------|--------|--------|----------|
| TradingView | 商业 | 低 | 最全面 | 专业交易平台 |
| LightWeight Charts | 免费 | 低 | 较全面 | 中小型项目 |
| Chart.js + Financial | 免费 | 中 | 基础 | 基础金融图表 |
| D3.js | 免费 | 高 | 完全自定义 | 特殊定制需求 |
| Highcharts Stock | 商业 | 低 | 全面 | 企业级应用 |

#### 推荐组合方案
1. **专业级**：TradingView Charting Library + LightWeight Charts
2. **开源级**：LightWeight Charts + D3.js
3. **基础级**：Chart.js + Recharts