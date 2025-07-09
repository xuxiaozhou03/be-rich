import { EastMoneyDataService } from './data-service';
import { QuantBacktestFramework, SimpleMAStrategy } from './backtest-framework';

/**
 * 简单测试文件
 */

async function testDataService() {
  console.log('🧪 测试数据服务...\n');

  const dataService = new EastMoneyDataService();

  try {
    // 测试获取K线数据
    console.log('📈 测试K线数据获取...');
    const klineData = await dataService.getKLineData('1.159915', 101, 5);
    console.log(`✅ 成功获取 ${klineData.length} 条K线数据`);

    if (klineData.length > 0) {
      const latest = klineData[klineData.length - 1];
      console.log(`   最新数据: ${latest.timestamp}, 收盘价: ¥${latest.close}`);
    }

    // 测试获取ETF列表
    console.log('\n📊 测试ETF列表获取...');
    const etfList = await dataService.getETFList();
    console.log(`✅ 成功获取 ${etfList.length} 只ETF`);

    if (etfList.length > 0) {
      console.log(`   示例: ${etfList[0].code} - ${etfList[0].name}`);
    }
  } catch (error) {
    console.error('❌ 数据服务测试失败:', error);
  }
}

async function testBacktestFramework() {
  console.log('\n🔬 测试回测框架...\n');

  try {
    const config = {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-12-31'),
      initialCapital: 50000,
      commission: 0.0003,
      slippage: 0.0005,
    };

    const backtest = new QuantBacktestFramework(config);
    const strategy = new SimpleMAStrategy(5, 10);

    console.log('🚀 运行小规模回测...');
    const result = await backtest.runBacktest(strategy, '1.159915');

    console.log('✅ 回测完成!');
    console.log(
      `   总收益率: ${(result.performance.totalReturn * 100).toFixed(2)}%`
    );
    console.log(`   交易次数: ${result.trades.length}`);
    console.log(
      `   最终资产: ¥${result.portfolio.totalValue.toLocaleString()}`
    );
  } catch (error) {
    console.error('❌ 回测框架测试失败:', error);
  }
}

async function main() {
  console.log('🎯 量化交易框架测试\n');
  console.log('===================\n');

  await testDataService();
  await testBacktestFramework();

  console.log('\n✅ 所有测试完成!');
}

if (require.main === module) {
  main().catch(console.error);
}
