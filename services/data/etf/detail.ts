// 单个 ETF 的详细数据
// 引入 cheerio, 解析html的数据
import pickDataFromString from "@/services/helper/pickDataFromString";
import { request } from "@/services/helper/request";

// 通过获取地址的html页面，解析要的数据
// https://fundf10.eastmoney.com/jbgk_159822.html

const getEtfDetail = async (symbol: string) => {
  const url = `https://fundf10.eastmoney.com/jbgk_${symbol}.html`;

  const html = await request<string>({
    url,
    format: "text",
  });

  const data = pickDataFromString(html, {
    // 业绩比较基准
    benchmark: ".info.w790 tr:eq(9) td:eq(0)",
    // 跟踪标的
    trackingTarget: ".info.w790 tr:eq(9) td:eq(1)",
    // 资产规模
    scale: ".info.w790 tr:eq(3) td:eq(0)",
  });

  const result = {
    benchmark: data.benchmark || "",
    trackingTarget: data.trackingTarget || "",
    scale: parseFloat(data.scale),
  };

  return result;
};

export default getEtfDetail;
