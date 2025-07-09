/**
 * 东方财富数据服务接口实现
 */

export interface KLineData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
  amplitude: number;
  change: number;
  changePercent: number;
  turnover: number;
}

export interface ETFInfo {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  amount: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface APIResponse<T> {
  rc: number;
  rt: number;
  svr: number;
  lt: number;
  full: number;
  data: T;
}

export interface KLineResponse {
  code: string;
  market: number;
  name: string;
  decimal: number;
  dktotal: number;
  preKPrice: number;
  klines: string[];
}

export interface ETFListResponse {
  total: number;
  diff: any[];
}

export class EastMoneyDataService {
  private baseUrl = 'https://push2his.eastmoney.com/api/qt/stock/kline/get';
  private listUrl = 'https://push2.eastmoney.com/api/qt/clist/get';
  private trendsUrl = 'https://push2his.eastmoney.com/api/qt/stock/trends2/get';

  /**
   * 获取K线数据
   * @param secid 证券代码 (如: 0.159864)
   * @param klt K线类型 (101=日K, 102=周K, 103=月K, 5=5分钟, 15=15分钟, 30=30分钟, 60=60分钟)
   * @param lmt 限制数量
   * @param fqt 复权类型 (0=不复权, 1=前复权, 2=后复权)
   */
  async getKLineData(
    secid: string,
    klt: number = 101,
    lmt: number = 66,
    fqt: number = 1
  ): Promise<KLineData[]> {
    const params = new URLSearchParams({
      secid,
      klt: klt.toString(),
      fqt: fqt.toString(),
      lmt: lmt.toString(),
      end: '20500000',
      iscca: '1',
      fields1: 'f1,f2,f3,f4,f5,f6,f7,f8',
      fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64',
      ut: 'f057cbcbce2a86e2866ab8877db1d059',
      forcect: '1',
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      const data: APIResponse<KLineResponse> = await response.json();

      if (data.rc !== 0 || !data.data?.klines) {
        throw new Error('Failed to fetch K-line data');
      }

      return this.parseKLineData(data.data.klines);
    } catch (error) {
      console.error('Error fetching K-line data:', error);
      throw error;
    }
  }

  /**
   * 获取分时数据（5日内）
   * @param secid 证券代码
   * @param ndays 天数 (默认5天)
   */
  async getTrendsData(secid: string, ndays: number = 5): Promise<any[]> {
    const params = new URLSearchParams({
      secid,
      fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f17',
      fields2: 'f51,f53,f54,f55,f56,f57,f58',
      iscr: '0',
      iscca: '0',
      ut: 'f057cbcbce2a86e2866ab8877db1d059',
      ndays: ndays.toString(),
      cb: 'quotepushdata1',
    });

    try {
      const response = await fetch(`${this.trendsUrl}?${params}`);
      const text = await response.text();

      // 处理JSONP格式响应
      const jsonStr = text.replace(/^quotepushdata1\(/, '').replace(/\)$/, '');
      const data = JSON.parse(jsonStr);

      return data.data?.trends || [];
    } catch (error) {
      console.error('Error fetching trends data:', error);
      throw error;
    }
  }

  /**
   * 获取ETF列表
   */
  async getETFList(): Promise<ETFInfo[]> {
    const params = new URLSearchParams({
      np: '1',
      fltt: '1',
      invt: '2',
      fs: 'b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827',
      fields: 'f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16',
      fid: 'f3',
      pn: '1',
      pz: '20',
      po: '1',
      dect: '1',
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      wbp2u: '|0|0|0|web',
    });

    try {
      const response = await fetch(`${this.listUrl}?${params}`);
      const data: APIResponse<ETFListResponse> = await response.json();

      if (data.rc !== 0 || !data.data?.diff) {
        throw new Error('Failed to fetch ETF list');
      }

      return this.parseETFList(data.data.diff);
    } catch (error) {
      console.error('Error fetching ETF list:', error);
      throw error;
    }
  }

  /**
   * 获取REIT列表
   */
  async getREITList(): Promise<ETFInfo[]> {
    const params = new URLSearchParams({
      np: '1',
      fltt: '1',
      invt: '2',
      fs: 'm:1+t:9+e:97,m:0+t:10+e:97',
      fields: 'f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16',
      fid: 'f3',
      pn: '1',
      pz: '20',
      po: '1',
      dect: '1',
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      wbp2u: '|0|0|0|web',
    });

    try {
      const response = await fetch(`${this.listUrl}?${params}`);
      const data: APIResponse<ETFListResponse> = await response.json();

      if (data.rc !== 0 || !data.data?.diff) {
        throw new Error('Failed to fetch REIT list');
      }

      return this.parseETFList(data.data.diff);
    } catch (error) {
      console.error('Error fetching REIT list:', error);
      throw error;
    }
  }

  /**
   * 获取可转债列表
   */
  async getConvertibleBondList(): Promise<ETFInfo[]> {
    const params = new URLSearchParams({
      np: '1',
      fltt: '1',
      invt: '2',
      fs: 'b:MK0354',
      fields:
        'f12,f13,f14,f1,f2,f4,f3,f152,f232,f233,f234,f229,f230,f231,f235,f236,f154,f237,f238,f239,f240,f241,f227,f242,f26,f243',
      fid: 'f243',
      pn: '1',
      pz: '50',
      po: '1',
      dect: '1',
      ut: 'fa5fd1943c7b386f172d6893dbfba10b',
      wbp2u: '|0|0|0|web',
    });

    try {
      const response = await fetch(`${this.listUrl}?${params}`);
      const data: APIResponse<ETFListResponse> = await response.json();

      if (data.rc !== 0 || !data.data?.diff) {
        throw new Error('Failed to fetch convertible bond list');
      }

      return this.parseETFList(data.data.diff);
    } catch (error) {
      console.error('Error fetching convertible bond list:', error);
      throw error;
    }
  }

  /**
   * 解析K线数据
   * K线数据格式: 日期,开盘,收盘,最高,最低,成交量,成交额,振幅,涨跌幅,涨跌额,换手率
   */
  private parseKLineData(klines: string[]): KLineData[] {
    return klines.map(line => {
      const [
        timestamp,
        open,
        close,
        high,
        low,
        volume,
        amount,
        amplitude,
        changePercent,
        change,
        turnover,
      ] = line.split(',');

      return {
        timestamp,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
        amount: parseFloat(amount),
        amplitude: parseFloat(amplitude),
        change: parseFloat(change),
        changePercent: parseFloat(changePercent),
        turnover: parseFloat(turnover),
      };
    });
  }

  /**
   * 解析ETF/REIT/可转债列表数据
   */
  private parseETFList(diff: any[]): ETFInfo[] {
    return diff.map(item => ({
      code: item.f12,
      name: item.f14,
      price: item.f2,
      change: item.f4,
      changePercent: item.f3,
      volume: item.f5,
      amount: item.f6,
      high: item.f15,
      low: item.f16,
      open: item.f17,
      close: item.f18,
    }));
  }
}

// 便捷方法
export const dataService = new EastMoneyDataService();

// 使用示例
export async function example() {
  try {
    // 获取ETF日K线数据
    const dailyData = await dataService.getKLineData('0.159864', 101, 100);
    console.log('日K线数据:', dailyData);

    // 获取5分钟K线数据
    const fiveMinData = await dataService.getKLineData('0.159864', 5, 100);
    console.log('5分钟K线数据:', fiveMinData);

    // 获取ETF列表
    const etfList = await dataService.getETFList();
    console.log('ETF列表:', etfList);

    // 获取REIT列表
    const reitList = await dataService.getREITList();
    console.log('REIT列表:', reitList);

    // 获取可转债列表
    const bondList = await dataService.getConvertibleBondList();
    console.log('可转债列表:', bondList);
  } catch (error) {
    console.error('Error:', error);
  }
}
