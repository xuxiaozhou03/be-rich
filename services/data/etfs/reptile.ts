import loopGet from "../list/loopGet";
import getEtfDetail from "../etf/detail";
import { Etf } from "../etf/type";

// 获取所有 ETF
export const reptileEtfs = async () => {
  const params = {
    fid: "f3",
    fields: "f12,f13,f14",
    fs: "b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827", // ETF 的市场标识
  };
  const etfs = await loopGet(params);

  const data: Array<Etf> = [];

  while (etfs.length > 0) {
    const etf = etfs.shift();
    if (!etf) break;
    const symbol = etf.f12;
    const market = etf.f13;
    const name = etf.f14;
    // 获取 ETF 的详细信息
    const detail = await getEtfDetail(symbol);
    data.push({
      symbol,
      market,
      name,
      benchmark: detail.benchmark,
      trackingTarget: detail.trackingTarget,
      scale: detail.scale,
    });
  }
  return data;
};
