import { request } from "@/services/helper/request";
import evalCode from "node-eval"; // 引入 node-eval 包
import { StockFieldKeys } from "../constant";

type OriginData = Record<StockFieldKeys, string | number>;
interface OriginalResponse {
  data: {
    diff: Array<OriginData>;
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

/**
 * 获取分页的 ETF 列表
 */
const getStockListFn =
  (requestParams: Record<string, string>) =>
  async (page = 1, pageSize = 100) => {
    const url = "https://push2.eastmoney.com/api/qt/clist/get";
    const params = {
      np: 1,
      fltt: 1,
      invt: 2,
      cb: "callback",
      pn: page,
      pz: pageSize,
      po: 1,
      dect: 1,
      ut: "fa5fd1943c7b386f172d6893dbfba10b",
      wbp2u: "|0|0|0|web",
      _: Date.now(),
      ...requestParams,
    };

    try {
      const response = await request<string>({
        url,
        params,
        method: "GET",
      });
      const text = response.replace(/^callback\(/, "").replace(/\);$/, "");
      const parsedResponse = evalCode(`(${text})`) as OriginalResponse; // 包装字符串为对象字面量格式后解析
      return parsedResponse.data.diff; // 返回解析后的对象
    } catch (error) {
      console.error("Error fetching ETF list:", error);
      throw error;
    }
  };

// 获取所有 ETF
const loopGet = async (params: Record<string, string>) => {
  const etfs: OriginData[] = [];
  let page = 1;
  const pageSize = 100;
  const getStockList = getStockListFn(params);

  while (true) {
    const etfList = await getStockList(page, pageSize);
    etfs.push(...etfList);

    if (etfList.length === 0 || etfList.length < pageSize) {
      break;
    }
    page++;
  }
  return etfs;
};


// 获取所有可转债
// https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=jQuery371014170607516427247_1748423468561&fs=b%3AMK0354&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152%2Cf232%2Cf233%2Cf234%2Cf229%2Cf230%2Cf231%2Cf235%2Cf236%2Cf154%2Cf237%2Cf238%2Cf239%2Cf240%2Cf241%2Cf227%2Cf242%2Cf26%2Cf243&fid=f3&pn=1&pz=50&po=1&dect=1&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&_=1748423468562
export const getConvertibleBonds = async () => {
  const params = {
    fid: "f243",
    fs: "b:MK0025", // 可转债的市场标识
    fields:
      "f12,f13,f14,f1,f2,f4,f3,f152,f232,f233,f234,f229,f230,f231,f235,f236,f154,f237,f238,f239,f240,f241,f227,f242,f26,f243",
  };
  const list = await loopGet(params);
  return list;
};

// 获取所有 REITs
// https://push2.eastmoney.com/api/qt/clist/get?np=1&fltt=1&invt=2&cb=jQuery371040923216023144515_1748425442556&fs=m%3A1%2Bt%3A9%2Be%3A97%2Cm%3A0%2Bt%3A10%2Be%3A97&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152%2Cf5%2Cf6%2Cf17%2Cf18%2Cf15%2Cf16&fid=f3&pn=1&pz=20&po=1&dect=1&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=%7C0%7C0%7C0%7Cweb&_=1748425442560
export const getReits = async () => {
  const params = {
    fid: "f3",
    fields: "f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16",
    fs: "m:1+t:9+e:97,m:0+t:10+e:97",
  };
  const list = await loopGet(params);
  return list;
};
