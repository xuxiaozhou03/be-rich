// 阶段涨幅

import { request } from "@/services/helper/request";
import pickDataFromString from "@/services/helper/pickDataFromString";
import evalCode from "node-eval"; // 引入 node-eval 包

interface StageChange {
  yearToDateZf: number; // 今年来涨幅
  yearAvgZf: number; // 近年来 同类平均 涨幅
  yearHushen300Zf: number;
  yearRank: number; // 近年来 同类排名
  yearTotal: number; // 近年来 同类排名总数
  yearRankChange: number;
}

// https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jdzf&code=159822&rt=0.3847953377411011
const getStageChange = async (code: string) => {
  const url = `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jdzf&code=${code}&rt=${Math.random()}`;

  const res = await request({
    url,
    format: "text",
  });
  const content = res.replace(/var apidata=/, "");
  const html = evalCode(content);
  const data = pickDataFromString(html, {
    // 今年来
    yearToDateZf: ".jdzfnew ul:eq(1) li:eq(1)",
    yearAvgZf: ".jdzfnew ul:eq(1) li:eq(2)",
    yearHushen300Zf: ".jdzfnew ul:eq(1) li:eq(3)",
    yearRankAndTotal: ".jdzfnew ul:eq(1) li:eq(4)",
    yearRankChange: ".jdzfnew ul:eq(1) li:eq(5)",
    // 近1周

    // 近1月

    // 近3月

    // 近6月

    // 近1年

    // 近2年

    // 近3年

    // 近5年
  });

  return Object.keys(data).reduce((acc, key) => {
    if (key === "yearRankAndTotal") {
      const [yearRank, yearTotal] = data[key].split("|");
      acc.yearRank = parseInt(yearRank, 10);
      acc.yearTotal = parseInt(yearTotal, 10);
    } else {
      acc[key as keyof StageChange] = parseFloat(
        data[key as keyof typeof data] as string
      );
    }
    return acc;
  }, {} as StageChange);
};

export default getStageChange;
