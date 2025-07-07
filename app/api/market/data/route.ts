import { NextRequest, NextResponse } from 'next/server';
import type { MarketData, ApiResponse } from '@/lib/types';

// 模拟市场数据
const mockMarketData: MarketData[] = [
  {
    symbol: '159915',
    name: '创业板ETF',
    price: 2.156,
    change: 0.023,
    changePercent: 1.08,
    volume: 28945600,
    timestamp: Date.now(),
  },
  {
    symbol: '159919',
    name: '沪深300ETF',
    price: 4.231,
    change: -0.012,
    changePercent: -0.28,
    volume: 15632400,
    timestamp: Date.now(),
  },
  {
    symbol: '113050',
    name: '南银转债',
    price: 125.6,
    change: -0.8,
    changePercent: -0.63,
    volume: 3264800,
    timestamp: Date.now(),
  },
  {
    symbol: '113505',
    name: '杭银转债',
    price: 102.3,
    change: 0.45,
    changePercent: 0.44,
    volume: 1845600,
    timestamp: Date.now(),
  },
  {
    symbol: '508056',
    name: '中金REIT',
    price: 3.45,
    change: 0.05,
    changePercent: 1.47,
    volume: 856400,
    timestamp: Date.now(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const type = searchParams.get('type');
    
    let filteredData = [...mockMarketData];
    
    // 根据symbol过滤
    if (symbol) {
      filteredData = filteredData.filter(item => 
        item.symbol === symbol || item.name.includes(symbol)
      );
    }
    
    // 根据type过滤（简单映射）
    if (type) {
      switch (type.toLowerCase()) {
        case 'etf':
          filteredData = filteredData.filter(item => item.symbol.startsWith('159'));
          break;
        case 'convertiblebond':
          filteredData = filteredData.filter(item => item.symbol.startsWith('113'));
          break;
        case 'reit':
          filteredData = filteredData.filter(item => item.symbol.startsWith('508'));
          break;
      }
    }
    
    const response: ApiResponse<MarketData[]> = {
      success: true,
      data: filteredData,
      timestamp: Date.now(),
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '获取市场数据失败',
      timestamp: Date.now(),
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
