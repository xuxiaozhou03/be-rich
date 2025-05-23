import { request } from "@/lib/request";
import _ from "lodash";
import evalCode from "node-eval"; // 引入 node-eval 包

interface OriginalResponse {
  data: {
    diff: Array<{
      f12: string;
      f13: number;
      f14: string;
      f1: number;
      f2: number;
      f4: number;
      f3: number;
      f152: number;
      f5: number;
      f6: number;
      f17: number;
      f18: number;
      f15: number;
      f16: number;
    }>;
  };
}

export interface Etf {
  symbol: string; // 股票代码
  market: number; // 市场： 0: 深市，1: 沪市
  name: string; // etf 名称
  currentPrice: number; // 最新价
  changePercent: number; // 涨跌幅
  changeAmount: number; // 涨跌额
  volume: number; // 成交量
  amount: number; // 成交额
  high: number; // 最高价
  low: number; // 最低价
  open: number; // 开盘价
  previousClose: number; // 昨收价
}

// 数值除以1000
const divideBy1000 = (value: number) => {
  if (value === undefined || value === null) {
    return 0;
  }
  return _.divide(value, 1000);
};

/**
 * 获取分页的 ETF 列表
 */
export const getPaginationEtf = async (page = 1, pageSize = 100) => {
  const url = "https://push2.eastmoney.com/api/qt/clist/get";
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: "callback",
    fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827",
    fields: "f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16",
    fid: "f3",
    pn: page,
    pz: pageSize,
    po: 1,
    dect: 1,
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    wbp2u: "|0|0|0|web",
    _: Date.now(),
  };

  try {
    const response = await request<string>({
      url,
      params,
      method: "GET",
    });
    const text = response.replace(/^callback\(/, "").replace(/\);$/, "");
    const parsedResponse = evalCode(`(${text})`) as OriginalResponse; // 包装字符串为对象字面量格式后解析
    return parsedResponse.data.diff.map<Etf>((item) => {
      const etf: Etf = {
        symbol: item.f12,
        market: item.f13,
        name: item.f14,
        currentPrice: divideBy1000(item.f2),
        changePercent: divideBy1000(item.f3),
        changeAmount: divideBy1000(item.f4),
        volume: item.f5,
        amount: item.f6,
        high: divideBy1000(item.f15),
        low: divideBy1000(item.f16),
        open: divideBy1000(item.f17),
        previousClose: divideBy1000(item.f18),
      };
      return etf;
    }); // 返回解析后的对象
  } catch (error) {
    console.error("Error fetching ETF list:", error);
    throw error;
  }
};

export const getEtfs = async () => {
  const etfs: Etf[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const etfList = await getPaginationEtf(page, pageSize);
    etfs.push(...etfList);

    if (etfList.length === 0 || etfList.length < pageSize) {
      break;
    }
    page++;
  }
  return etfs;
};
