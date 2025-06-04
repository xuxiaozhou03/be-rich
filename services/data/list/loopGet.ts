import { request } from "@/services/helper/request";
import evalCode from "node-eval"; // 引入 node-eval 包

type OriginData = {
  f12: string; // 股票代码
  f13: 0 | 1; // 市场
  f14: string; // 股票名称
};
interface OriginalResponse {
  data: {
    diff: Array<OriginData>;
  };
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

export default loopGet;
