import { create } from 'zustand';
import type { MarketData, Position, Strategy, ETFData, ConvertibleBondData, REITData } from '@/lib/types';

interface MarketStore {
  marketData: MarketData[];
  etfData: ETFData[];
  convertibleBondData: ConvertibleBondData[];
  reitData: REITData[];
  loading: boolean;
  error: string | null;
  fetchMarketData: (params?: { symbol?: string; type?: string }) => Promise<void>;
  updateMarketData: (data: MarketData[]) => void;
  clearError: () => void;
}

interface PortfolioStore {
  positions: Position[];
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  loading: boolean;
  error: string | null;
  fetchPositions: () => Promise<void>;
  updatePosition: (position: Position) => void;
  addPosition: (position: Position) => void;
  removePosition: (symbol: string) => void;
  calculateTotals: () => void;
}

interface StrategyStore {
  strategies: Strategy[];
  activeStrategy: Strategy | null;
  loading: boolean;
  error: string | null;
  fetchStrategies: () => Promise<void>;
  selectStrategy: (strategyId: string) => void;
  addStrategy: (strategy: Strategy) => void;
  updateStrategy: (strategy: Strategy) => void;
  removeStrategy: (strategyId: string) => void;
}

// 市场数据Store
export const useMarketStore = create<MarketStore>((set, get) => ({
  marketData: [],
  etfData: [],
  convertibleBondData: [],
  reitData: [],
  loading: false,
  error: null,
  
  fetchMarketData: async (params) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (params?.symbol) queryParams.append('symbol', params.symbol);
      if (params?.type) queryParams.append('type', params.type);
      
      const response = await fetch(`/api/market?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        set({ 
          marketData: result.data, 
          etfData: result.etfData,
          convertibleBondData: result.convertibleBondData,
          reitData: result.reitData,
          loading: false 
        });
      } else {
        set({ error: result.message || '获取数据失败', loading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '网络错误', 
        loading: false 
      });
    }
  },
  
  updateMarketData: (data) => set({ marketData: data }),
  clearError: () => set({ error: null }),
}));

// 投资组合Store
export const usePortfolioStore = create<PortfolioStore>((set, get) => ({
  positions: [],
  totalValue: 0,
  totalPnL: 0,
  totalPnLPercent: 0,
  loading: false,
  error: null,
  
  fetchPositions: async () => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      const mockPositions: Position[] = [
        {
          symbol: '159915',
          name: '创业板ETF',
          type: 'ETF',
          quantity: 10000,
          averagePrice: 2.100,
          currentPrice: 2.156,
          marketValue: 21560,
          unrealizedPnL: 560,
          unrealizedPnLPercent: 2.67,
          weight: 57.8,
        },
        {
          symbol: '113050',
          name: '南银转债',
          type: 'ConvertibleBond',
          quantity: 100,
          averagePrice: 126.4,
          currentPrice: 125.6,
          marketValue: 12560,
          unrealizedPnL: -80,
          unrealizedPnLPercent: -0.63,
          weight: 33.6,
        },
        {
          symbol: '508056',
          name: '中金REIT',
          type: 'REIT',
          quantity: 1000,
          averagePrice: 3.40,
          currentPrice: 3.45,
          marketValue: 3450,
          unrealizedPnL: 50,
          unrealizedPnLPercent: 1.47,
          weight: 9.2,
        },
      ];
      
      set({ positions: mockPositions, loading: false });
      get().calculateTotals();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取持仓失败', 
        loading: false 
      });
    }
  },
  
  updatePosition: (position) => {
    set(state => ({
      positions: state.positions.map(p => 
        p.symbol === position.symbol ? position : p
      )
    }));
    get().calculateTotals();
  },
  
  addPosition: (position) => {
    set(state => ({
      positions: [...state.positions, position]
    }));
    get().calculateTotals();
  },
  
  removePosition: (symbol) => {
    set(state => ({
      positions: state.positions.filter(p => p.symbol !== symbol)
    }));
    get().calculateTotals();
  },
  
  calculateTotals: () => {
    const { positions } = get();
    const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
    const totalPnL = positions.reduce((sum, p) => sum + p.unrealizedPnL, 0);
    const totalPnLPercent = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;
    
    set({ totalValue, totalPnL, totalPnLPercent });
  },
}));

// 策略Store
export const useStrategyStore = create<StrategyStore>((set, get) => ({
  strategies: [],
  activeStrategy: null,
  loading: false,
  error: null,
  
  fetchStrategies: async () => {
    set({ loading: true, error: null });
    try {
      // 模拟API调用
      const mockStrategies: Strategy[] = [
        {
          id: '1',
          name: 'ETF行业轮动策略',
          description: '基于行业动量的ETF轮动策略',
          type: 'momentum',
          status: 'active',
          returns: 15.6,
          maxDrawdown: -5.2,
          sharpeRatio: 1.85,
          winRate: 0.67,
          positions: [],
          createdAt: Date.now() - 86400000 * 30,
          updatedAt: Date.now(),
        },
        {
          id: '2',
          name: '可转债套利策略',
          description: '基于转股溢价率的套利策略',
          type: 'arbitrage',
          status: 'active',
          returns: 8.9,
          maxDrawdown: -2.1,
          sharpeRatio: 2.34,
          winRate: 0.78,
          positions: [],
          createdAt: Date.now() - 86400000 * 15,
          updatedAt: Date.now(),
        },
      ];
      
      set({ strategies: mockStrategies, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取策略失败', 
        loading: false 
      });
    }
  },
  
  selectStrategy: (strategyId) => {
    const strategy = get().strategies.find(s => s.id === strategyId);
    set({ activeStrategy: strategy || null });
  },
  
  addStrategy: (strategy) => {
    set(state => ({
      strategies: [...state.strategies, strategy]
    }));
  },
  
  updateStrategy: (strategy) => {
    set(state => ({
      strategies: state.strategies.map(s => 
        s.id === strategy.id ? strategy : s
      ),
      activeStrategy: state.activeStrategy?.id === strategy.id ? strategy : state.activeStrategy
    }));
  },
  
  removeStrategy: (strategyId) => {
    set(state => ({
      strategies: state.strategies.filter(s => s.id !== strategyId),
      activeStrategy: state.activeStrategy?.id === strategyId ? null : state.activeStrategy
    }));
  },
}));
