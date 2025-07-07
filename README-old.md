# Be Rich - 量化交易系统

A股ETF、可转债、REIT量化交易平台

## 🚀 技术栈

- **前端**: Next.js 15 + TypeScript + Ant Design + CSS Modules
- **图表**: LightWeight Charts (TradingView开源版)
- **状态管理**: Zustand
- **数据获取**: SWR
- **技术指标**: indicatorts
- **数学计算**: simple-statistics + ml-matrix
- **数据处理**: D3.js

## 📦 安装依赖

```bash
# 安装依赖
npm install

# 或使用yarn
yarn install

# 或使用pnpm
pnpm install
```

## 🛠️ 开发

```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🏗️ 构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 📁 项目结构

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
│   ├── api/              # API Routes
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
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

## 🔧 核心功能

### 1. 数据管理模块
- **行情数据**: 实时和历史价格数据
- **ETF数据**: 净值、申赎清单、跟踪误差
- **可转债数据**: 转股价、转股溢价率、信用评级
- **REIT数据**: NAV、分派收益率、FFO/AFFO

### 2. 策略开发平台
- **技术指标**: MA、EMA、RSI、MACD、布林带等
- **因子库**: 基本面、技术面、宏观因子
- **策略模板**: 趋势、均值回归、套利策略
- **回测引擎**: 向量化和事件驱动回测

### 3. 投资组合管理
- **多策略管理**: 权重分配、动态调整
- **风险预算**: VaR计算、压力测试
- **组合优化**: 马科维茨模型、风险平价
- **再平衡**: 定期和阈值触发再平衡

### 4. 风险管理系统
- **实时监控**: 持仓、集中度、流动性风险
- **风险指标**: VaR、CVaR、最大回撤
- **压力测试**: 历史情景、蒙特卡洛模拟
- **合规检查**: 投资限制、监管要求

### 5. 数据可视化
- **金融图表**: K线图、技术指标图
- **仪表盘**: 实时监控面板
- **报表系统**: 日报、周报、月报
- **交互分析**: 多维度数据钻取

## 📈 计算引擎示例

```typescript
import { calculateMA, calculateRSI, calculateMACD } from '@/lib/calculations/indicators';

// 计算移动平均线
const ma20 = calculateMA(prices, 20);

// 计算RSI
const rsi = calculateRSI(prices, 14);

// 计算MACD
const macd = calculateMACD(prices, 12, 26, 9);
```

## 🎨 样式开发

项目使用CSS Modules进行样式管理：

```css
/* Component.module.css */
.container {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.chart {
  width: 100%;
  height: 400px;
}
```

```tsx
// Component.tsx
import styles from './Component.module.css';

export default function Component() {
  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {/* 图表内容 */}
      </div>
    </div>
  );
}
```

## 🔌 API使用

```typescript
// 获取市场数据
const response = await fetch('/api/market?symbol=159915&type=ETF');
const { data } = await response.json();

// 使用状态管理
import { useMarketStore } from '@/stores';

const { marketData, fetchMarketData } = useMarketStore();
```

## 🧪 开发规范

### TypeScript
- 严格模式开发
- 完整的类型定义
- 接口优先设计

### 组件开发
- 函数式组件 + Hooks
- CSS Modules样式隔离
- 可复用组件设计

### 状态管理
- Zustand全局状态
- 模块化Store设计
- 类型安全的状态更新

## 📝 待办事项

- [ ] 集成真实数据源API
- [ ] 完善技术指标库
- [ ] 实现策略回测功能
- [ ] 添加更多图表类型
- [ ] 完善风险管理模块
- [ ] 添加用户认证
- [ ] 移动端适配

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进项目。

## 📄 许可证

MIT License
