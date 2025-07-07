import { NextRequest, NextResponse } from 'next/server';
import type { BacktestRequest, BacktestResult, BacktestMetrics } from '@/lib/types';

// 模拟回测引擎
class BacktestEngine {
  private generateRandomReturns(days: number, volatility: number = 0.02): number[] {
    const returns = [];
    for (let i = 0; i < days; i++) {
      const randomReturn = (Math.random() - 0.5) * volatility * 2;
      returns.push(randomReturn);
    }
    return returns;
  }

  private calculateCumulativeReturns(returns: number[]): number[] {
    const cumulative = [];
    let totalReturn = 1;
    
    for (const ret of returns) {
      totalReturn *= (1 + ret);
      cumulative.push(totalReturn - 1);
    }
    
    return cumulative;
  }

  private calculateDrawdowns(cumulativeReturns: number[]): number[] {
    const drawdowns = [];
    let peak = 0;
    
    for (const cumRet of cumulativeReturns) {
      if (cumRet > peak) {
        peak = cumRet;
      }
      const drawdown = (cumRet - peak) / (1 + peak);
      drawdowns.push(drawdown);
    }
    
    return drawdowns;
  }

  private calculateMetrics(returns: number[]): BacktestMetrics {
    const totalReturn = returns.reduce((acc, ret) => acc * (1 + ret), 1) - 1;
    const annualizedReturn = Math.pow(1 + totalReturn, 252 / returns.length) - 1;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance) * Math.sqrt(252);
    
    const sharpeRatio = volatility > 0 ? annualizedReturn / volatility : 0;
    
    const cumulativeReturns = this.calculateCumulativeReturns(returns);
    const drawdowns = this.calculateDrawdowns(cumulativeReturns);
    const maxDrawdown = Math.min(...drawdowns);
    
    const winningTrades = returns.filter(ret => ret > 0).length;
    const winRate = winningTrades / returns.length;
    
    return {
      totalReturn,
      annualizedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      winRate,
      totalTrades: returns.length,
      winningTrades,
      losingTrades: returns.length - winningTrades,
    };
  }

  async runBacktest(request: BacktestRequest): Promise<BacktestResult> {
    const { strategyId, symbols, startDate, endDate, initialCapital, parameters } = request;
    
    // 计算交易天数
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // 生成模拟回测数据
    const returns = this.generateRandomReturns(days, parameters?.volatility || 0.02);
    const cumulativeReturns = this.calculateCumulativeReturns(returns);
    const drawdowns = this.calculateDrawdowns(cumulativeReturns);
    
    // 生成日期序列
    const dates: Date[] = [];
    const currentDate = new Date(start);
    for (let i = 0; i < days; i++) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // 生成交易记录
    const trades = [];
    for (let i = 0; i < Math.min(20, days); i += Math.floor(days / 20)) {
      const tradeDate = dates[i];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const quantity = Math.floor(Math.random() * 1000) + 100;
      const price = 100 + Math.random() * 50;
      const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      
      trades.push({
        id: `trade_${i}`,
        symbol,
        side,
        quantity,
        price,
        timestamp: tradeDate.getTime(),
        pnl: (Math.random() - 0.5) * 1000,
      });
    }
    
    // 计算指标
    const metrics = this.calculateMetrics(returns);
    
    // 生成每日组合价值
    const portfolioValues = cumulativeReturns.map((cumRet, index) => ({
      date: dates[index].toISOString(),
      value: initialCapital * (1 + cumRet),
      returns: cumRet,
      drawdown: drawdowns[index],
    }));
    
    return {
      strategyId,
      startDate,
      endDate,
      initialCapital,
      finalCapital: initialCapital * (1 + metrics.totalReturn),
      metrics,
      portfolioValues,
      trades,
      benchmark: {
        totalReturn: 0.08, // 8% 基准收益
        sharpeRatio: 0.6,
        maxDrawdown: -0.15,
      },
      createdAt: new Date().toISOString(),
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BacktestRequest = await request.json();
    
    // 验证请求参数
    if (!body.strategyId || !body.symbols || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      );
    }
    
    const engine = new BacktestEngine();
    const result = await engine.runBacktest(body);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: '回测完成',
    });
  } catch (error) {
    console.error('回测失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '回测失败' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const strategyId = searchParams.get('strategyId');
    
    if (!strategyId) {
      return NextResponse.json(
        { success: false, message: '缺少策略ID' },
        { status: 400 }
      );
    }
    
    // 返回历史回测结果
    const mockHistoricalBacktests = [
      {
        id: 'backtest_1',
        strategyId,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        initialCapital: 100000,
        finalCapital: 115600,
        metrics: {
          totalReturn: 0.156,
          annualizedReturn: 0.156,
          volatility: 0.18,
          sharpeRatio: 0.867,
          maxDrawdown: -0.08,
          winRate: 0.65,
          totalTrades: 48,
          winningTrades: 31,
          losingTrades: 17,
        },
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
    ];
    
    return NextResponse.json({
      success: true,
      data: mockHistoricalBacktests,
      total: mockHistoricalBacktests.length,
    });
  } catch (error) {
    console.error('获取回测历史失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '获取回测历史失败' 
      },
      { status: 500 }
    );
  }
}
