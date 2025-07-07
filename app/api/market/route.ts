import { NextRequest, NextResponse } from 'next/server';
import type { MarketData, ApiResponse, ETFData, ConvertibleBondData, REITData } from '@/lib/types';

// 模拟ETF数据
const mockETFData: ETFData[] = [
  {
    symbol: '510300',
    code: '510300',
    name: '沪深300ETF',
    type: 'ETF',
    price: 4.856,
    change: 0.12,
    changePercent: 2.53,
    volume: 15420000,
    timestamp: Date.now(),
    nav: 4.8542,
    premium: 0.037,
    trackingError: 0.0012,
    aum: 35400000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: '510050',
    code: '510050',
    name: '上证50ETF',
    type: 'ETF',
    price: 2.847,
    change: -0.05,
    changePercent: -1.73,
    volume: 8520000,
    timestamp: Date.now(),
    nav: 2.8463,
    premium: 0.025,
    trackingError: 0.0008,
    aum: 25600000000,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: '159919',
    code: '159919',
    name: '沪深300ETF',
    type: 'ETF',
    price: 4.025,
    change: 0.08,
    changePercent: 2.03,
    volume: 12800000,
    timestamp: Date.now(),
    nav: 4.0241,
    premium: 0.022,
    trackingError: 0.0015,
    aum: 18900000000,
    lastUpdated: new Date().toISOString(),
  },
];

// 模拟可转债数据
const mockConvertibleBondData: ConvertibleBondData[] = [
  {
    symbol: '113050',
    code: '113050',
    name: '南银转债',
    type: 'ConvertibleBond',
    price: 108.50,
    change: 1.25,
    changePercent: 1.16,
    volume: 450000,
    timestamp: Date.now(),
    conversionPrice: 12.85,
    conversionValue: 102.30,
    bondValue: 95.60,
    conversionPremium: 6.06,
    creditRating: 'AA',
    yieldToMaturity: 2.85,
  },
  {
    symbol: '113616',
    code: '113616',
    name: '韦尔转债',
    type: 'ConvertibleBond',
    price: 135.80,
    change: -2.80,
    changePercent: -2.02,
    volume: 680000,
    timestamp: Date.now(),
    conversionPrice: 85.20,
    conversionValue: 128.50,
    bondValue: 98.40,
    conversionPremium: 5.68,
    creditRating: 'AA-',
    yieldToMaturity: 1.95,
  },
];

// 模拟REIT数据
const mockREITData: REITData[] = [
  {
    symbol: '508056',
    code: '508056',
    name: '博时蛇口产园REIT',
    type: 'REIT',
    price: 3.486,
    change: 0.08,
    changePercent: 2.35,
    volume: 1200000,
    timestamp: Date.now(),
    nav: 3.502,
    dividendYield: 4.82,
    ffo: 0.168,
    affo: 0.142,
    occupancyRate: 94.5,
    premium: -0.46,
    propertyType: '产业园区',
  },
  {
    symbol: '508077',
    code: '508077',
    name: '平安广州广河REIT',
    type: 'REIT',
    price: 3.825,
    change: -0.12,
    changePercent: -3.05,
    volume: 850000,
    timestamp: Date.now(),
    nav: 3.890,
    dividendYield: 5.25,
    ffo: 0.195,
    affo: 0.175,
    occupancyRate: 96.2,
    premium: -1.67,
    propertyType: '高速公路',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const symbol = searchParams.get('symbol');

    // 根据类型过滤数据
    let filteredData = {
      etfData: mockETFData,
      convertibleBondData: mockConvertibleBondData,
      reitData: mockREITData,
    };

    if (type) {
      switch (type.toLowerCase()) {
        case 'etf':
          filteredData = {
            etfData: mockETFData,
            convertibleBondData: [],
            reitData: [],
          };
          break;
        case 'convertiblebond':
          filteredData = {
            etfData: [],
            convertibleBondData: mockConvertibleBondData,
            reitData: [],
          };
          break;
        case 'reit':
          filteredData = {
            etfData: [],
            convertibleBondData: [],
            reitData: mockREITData,
          };
          break;
      }
    }

    // 根据symbol过滤
    if (symbol) {
      filteredData = {
        etfData: filteredData.etfData.filter(item => item.symbol === symbol),
        convertibleBondData: filteredData.convertibleBondData.filter(item => item.symbol === symbol),
        reitData: filteredData.reitData.filter(item => item.symbol === symbol),
      };
    }

    // 合并所有数据
    const allData = [
      ...filteredData.etfData,
      ...filteredData.convertibleBondData,
      ...filteredData.reitData,
    ];

    return NextResponse.json({
      success: true,
      data: allData,
      etfData: filteredData.etfData,
      convertibleBondData: filteredData.convertibleBondData,
      reitData: filteredData.reitData,
      total: allData.length,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('获取市场数据失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取市场数据失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
