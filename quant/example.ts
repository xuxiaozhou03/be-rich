import {
  QuantBacktestFramework,
  SimpleMAStrategy,
  BacktestConfig,
} from './backtest-framework';

/**
 * 量化回测框架使用示例
 */

async function runBacktestExample() {
  try {
    // 1. 配置回测参数
    const config: BacktestConfig = {
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      initialCapital: 100000, // 10万初始资金
      commission: 0.0003, // 万三手续费
      slippage: 0.0005, // 万五滑点
      benchmark: '000300', // 沪深300基准
    };

    // 2. 创建回测框架实例
    const backtest = new QuantBacktestFramework(config);

    console.log('🚀 开始量化回测...\n');

    // 3. 获取可交易标的列表
    console.log('📊 获取ETF列表...');
    const etfList = await backtest.getETFList();
    console.log(`发现 ${etfList.length} 只ETF产品`);
    etfList.slice(0, 5).forEach(etf => {
      console.log(
        `  ${etf.code} - ${etf.name}: ¥${etf.price} (${etf.changePercent > 0 ? '+' : ''}${etf.changePercent}%)`
      );
    });
    console.log('');

    // 4. 创建策略实例
    const strategy = new SimpleMAStrategy(5, 20); // 5日、20日移动平均线策略
    console.log(`📈 使用策略: ${strategy.name} (5日MA vs 20日MA)`);

    // 5. 运行回测 (以创业板ETF为例)
    const symbol = '1.159915'; // 创业板ETF
    console.log(`🎯 回测标的: ${symbol}\n`);

    console.log('⏳ 正在加载历史数据并运行回测...');
    const result = await backtest.runBacktest(strategy, symbol);

    // 6. 输出回测结果
    console.log('\n📈 ========== 回测结果 ==========\n');

    // 基本信息
    console.log('📊 基本信息:');
    console.log(`  交易标的: ${symbol}`);
    console.log(
      `  回测期间: ${config.startDate.toDateString()} - ${config.endDate.toDateString()}`
    );
    console.log(`  初始资金: ¥${config.initialCapital.toLocaleString()}`);
    console.log(`  最终资产: ¥${result.portfolio.totalValue.toLocaleString()}`);
    console.log('');

    // 业绩指标
    console.log('💰 业绩指标:');
    console.log(
      `  总收益率: ${(result.performance.totalReturn * 100).toFixed(2)}%`
    );
    console.log(
      `  年化收益率: ${(result.performance.annualizedReturn * 100).toFixed(2)}%`
    );
    console.log(
      `  最大回撤: ${(result.performance.maxDrawdown * 100).toFixed(2)}%`
    );
    console.log(`  夏普比率: ${result.performance.sharpeRatio.toFixed(3)}`);
    console.log(
      `  波动率: ${(result.performance.volatility * 100).toFixed(2)}%`
    );
    console.log('');

    // 交易统计
    console.log('📋 交易统计:');
    console.log(`  总交易次数: ${result.trades.length}`);
    console.log(`  胜率: ${(result.performance.winRate * 100).toFixed(2)}%`);
    console.log(`  盈亏比: ${result.performance.profitLossRatio.toFixed(3)}`);
    console.log('');

    // 持仓信息
    console.log('💼 当前持仓:');
    if (result.portfolio.positions.length > 0) {
      result.portfolio.positions.forEach(position => {
        console.log(
          `  ${position.symbol}: ${position.quantity}股, 成本价¥${position.averagePrice.toFixed(2)}, 市值¥${position.marketValue.toLocaleString()}, 浮盈¥${position.unrealizedPnL.toFixed(2)}`
        );
      });
    } else {
      console.log('  无持仓');
    }
    console.log(`  现金: ¥${result.portfolio.cash.toLocaleString()}`);
    console.log('');

    // 最近交易记录
    console.log('📝 最近10笔交易:');
    const recentTrades = result.trades.slice(-10);
    recentTrades.forEach(trade => {
      const side = trade.side === 'BUY' ? '买入' : '卖出';
      const pnl = trade.pnl ? `盈亏¥${trade.pnl.toFixed(2)}` : '';
      console.log(
        `  ${trade.timestamp.toDateString()} ${side} ${trade.symbol} ${trade.quantity}股 @¥${trade.price.toFixed(2)} ${pnl}`
      );
    });

    // 7. 风险提示
    console.log('\n⚠️  风险提示:');
    console.log('   以上回测结果仅供参考，不构成投资建议');
    console.log('   历史业绩不代表未来表现');
    console.log('   投资有风险，入市需谨慎');
  } catch (error) {
    console.error('❌ 回测过程中发生错误:', error);
  }
}

/**
 * 数据接口测试示例
 */
async function testDataAPIs() {
  try {
    const backtest = new QuantBacktestFramework({
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      initialCapital: 100000,
      commission: 0.0003,
      slippage: 0.0005,
    });

    console.log('🧪 测试数据接口...\n');

    // 测试K线数据获取
    console.log('📈 获取K线数据 (创业板ETF 159915)...');
    const klineData = await backtest.loadMarketData('1.159915', 101, 10); // 日K线，最近10条
    console.log(`获取到 ${klineData.length} 条K线数据:`);
    klineData.slice(0, 3).forEach(item => {
      console.log(
        `  ${item.timestamp}: 开盘¥${item.open}, 收盘¥${item.close}, 涨跌幅${item.changePercent}%`
      );
    });
    console.log('');

    // 测试REIT列表
    console.log('🏢 获取REIT列表...');
    const reitList = await backtest.getREITList();
    console.log(`发现 ${reitList.length} 只REIT产品:`);
    reitList.slice(0, 3).forEach(reit => {
      console.log(`  ${reit.code} - ${reit.name}: ¥${reit.price}`);
    });
    console.log('');

    // 测试可转债列表
    console.log('💰 获取可转债列表...');
    const bondList = await backtest.getConvertibleBondList();
    console.log(`发现 ${bondList.length} 只可转债:`);
    bondList.slice(0, 3).forEach(bond => {
      console.log(`  ${bond.code} - ${bond.name}: ¥${bond.price}`);
    });

    console.log('\n✅ 数据接口测试完成!');
  } catch (error) {
    console.error('❌ 数据接口测试失败:', error);
  }
}

/**
 * 多策略对比示例
 */
async function compareStrategies() {
  try {
    const config: BacktestConfig = {
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      initialCapital: 100000,
      commission: 0.0003,
      slippage: 0.0005,
    };

    const backtest = new QuantBacktestFramework(config);
    const symbol = '1.159915';

    console.log('🔬 多策略对比测试...\n');

    // 策略1: 5日-20日MA
    const strategy1 = new SimpleMAStrategy(5, 20);
    const result1 = await backtest.runBacktest(strategy1, symbol);

    // 策略2: 10日-30日MA (需要重新初始化框架)
    const backtest2 = new QuantBacktestFramework(config);
    const strategy2 = new SimpleMAStrategy(10, 30);
    const result2 = await backtest2.runBacktest(strategy2, symbol);

    // 对比结果
    console.log('📊 策略对比结果:');
    console.log('');
    console.log('策略1 (5日-20日MA):');
    console.log(
      `  总收益率: ${(result1.performance.totalReturn * 100).toFixed(2)}%`
    );
    console.log(
      `  最大回撤: ${(result1.performance.maxDrawdown * 100).toFixed(2)}%`
    );
    console.log(`  夏普比率: ${result1.performance.sharpeRatio.toFixed(3)}`);
    console.log(`  交易次数: ${result1.trades.length}`);
    console.log('');

    console.log('策略2 (10日-30日MA):');
    console.log(
      `  总收益率: ${(result2.performance.totalReturn * 100).toFixed(2)}%`
    );
    console.log(
      `  最大回撤: ${(result2.performance.maxDrawdown * 100).toFixed(2)}%`
    );
    console.log(`  夏普比率: ${result2.performance.sharpeRatio.toFixed(3)}`);
    console.log(`  交易次数: ${result2.trades.length}`);
    console.log('');

    // 判断优劣
    const better =
      result1.performance.sharpeRatio > result2.performance.sharpeRatio
        ? '策略1'
        : '策略2';
    console.log(`🏆 综合表现更优: ${better}`);
  } catch (error) {
    console.error('❌ 策略对比测试失败:', error);
  }
}

// 主函数
async function main() {
  console.log('🎯 量化交易回测框架演示\n');
  console.log('==========================\n');

  // 选择要运行的示例
  const examples = [
    { name: '完整回测示例', func: runBacktestExample },
    { name: '数据接口测试', func: testDataAPIs },
    { name: '多策略对比', func: compareStrategies },
  ];

  // 运行所有示例 (可以根据需要选择性运行)
  for (const example of examples) {
    console.log(`\n🔥 运行: ${example.name}`);
    console.log('='.repeat(30));
    await example.func();
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

// 运行演示
if (require.main === module) {
  main().catch(console.error);
}

export { runBacktestExample, testDataAPIs, compareStrategies };
