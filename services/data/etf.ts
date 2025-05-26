// 单个 ETF 的详细数据
// 引入 cheerio, 解析html的数据
import * as cheerio from "cheerio";

// 通过获取地址的html页面，解析要的数据
// https://fundf10.eastmoney.com/jbgk_159822.html

const getEtfDetail = async (symbol: string) => {
  const url = `https://fundf10.eastmoney.com/jbgk_${symbol}.html`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ETF detail for ${symbol}`);
  }
  const html = await response.text();
  const $ = cheerio.load(html);

  const map = {
    fullName: ".info.w790 tr:nth-child(1) td:nth-child(1)",
    shortName: ".info.w790 tr:nth-child(1) td:nth-child(2)",
    // 业绩比较基准
    benchmark: ".info.w790 tr:nth-child(10) td:nth-child(1)",
    // 跟踪标的
    trackingTarget: ".info.w790 tr:nth-child(10) td:nth-child(2)",
  };

  const data = Object.entries(map).reduce((acc, [key, selector]) => {
    acc[key] = $(selector).text().trim();
    return acc;
  }, {} as Record<string, string>);

  return data;
};

export default getEtfDetail;
