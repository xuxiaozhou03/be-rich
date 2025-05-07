import { request } from "@/utils/request";

// k 线图数据
export interface IKline {
  // 日期
  date: string;
  // 开盘价
  open: number;
  // 收盘价
  close: number;
  // 最高价
  high: number;
  // 最低价
  low: number;
  // 成交量
  volume: number;
  // 成交额
  amount: number;
  // 振幅
  amplitude: number;
  // 涨跌幅
  changePercent: number;
  // 涨跌额
  changeAmount: number;
  // 换手率
  turnoverRate: number;
}

interface FundEtfHistParams {
  symbol: string;
  period: "daily" | "weekly" | "monthly";
  start_date: string;
  end_date: string;
  adjust: "none" | "qfq" | "hfq";
}

const getMarket = (symbol: string) => {
  if (symbol.startsWith("56")) {
    return "1"; // 上海
  }
  if (symbol.startsWith("15")) {
    return "0"; // 深圳
  }
  return "0";
};
const adjustDict: { [key: string]: string } = {
  qfq: "1",
  hfq: "2",
  none: "0",
};
const periodDict: { [key: string]: string } = {
  daily: "101",
  weekly: "102",
  monthly: "103",
};

export const getEtfKline = async ({
  symbol = "159707",
  period = "daily",
  start_date = "19700101",
  end_date = "20500101",
  adjust = "none",
}: Partial<FundEtfHistParams>): Promise<IKline[]> => {
  const url = "https://push2his.eastmoney.com/api/qt/stock/kline/get";
  const params = {
    fields1: "f1,f2,f3,f4,f5,f6",
    fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f116",
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    klt: periodDict[period],
    fqt: adjustDict[adjust],
    beg: start_date,
    end: end_date,
    secid: `${getMarket(symbol)}.${symbol}`,
  };

  try {
    const response = await request({ url, params, format: "json" });
    const dataJson = response.data;

    if (!dataJson.data || !dataJson.data.klines) {
      return [];
    }

    const klines = dataJson.data.klines;
    const result: IKline[] = klines.map((item: string) => {
      const [
        date,
        open,
        close,
        high,
        low,
        volume,
        amount,
        amplitude,
        changePercent,
        changeAmount,
        turnoverRate,
      ] = item.split(",");

      return {
        date,
        open: parseFloat(open),
        close: parseFloat(close),
        high: parseFloat(high),
        low: parseFloat(low),
        volume: parseFloat(volume),
        amount: parseFloat(amount),
        amplitude: parseFloat(amplitude),
        changePercent: parseFloat(changePercent),
        changeAmount: parseFloat(changeAmount),
        turnoverRate: parseFloat(turnoverRate),
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
