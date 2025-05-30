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
    fullName: ".info.w790 tr:eq(0) td:eq(0)",
    shortName: ".info.w790 tr:eq(0) td:eq(1)",
    // 业绩比较基准
    benchmark: ".info.w790 tr:eq(9) td:eq(0)",
    // 跟踪标的
    trackingTarget: ".info.w790 tr:eq(9) td:eq(1)",
    // 成立日期/规模
    established: ".info.w790 tr:eq(2) td:eq(1)",
  });

  return data;
};

export default getEtfDetail;
