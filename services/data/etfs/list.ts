import list from "@/public/etfs.json";
import { Etf } from "../etf/type";
import { categoriesMap } from "./target";

interface EtfCategory {
  category: string; // 行业，大盘，策略等
  trackingTarget: string; // 跟踪标的
  list: Etf[]; // ETF列表
}

export const etfs = list as unknown as Etf[];

// 去重
const _originEtfCategories: Record<string, EtfCategory> = {};

const categories = Object.entries(categoriesMap);

etfs
  .filter((etf) => etf.scale > 2)
  .forEach((etf) => {
    const { trackingTarget } = etf;
    const categoryItem = categories.find(([_, c]) =>
      c.includes(trackingTarget)
    );
    const category = categoryItem ? categoryItem[0] : "其他";
    const key = `${category}-${trackingTarget}`;

    if (!_originEtfCategories[key]) {
      _originEtfCategories[key] = {
        category: category,
        trackingTarget,
        list: [],
      };
    }
    _originEtfCategories[key]!.list.push(etf);
  });

const originEtfCategories: Record<string, Omit<EtfCategory, "category">[]> = {};
Object.entries(_originEtfCategories).forEach(([key, value]) => {
  if (!originEtfCategories[value.category]) {
    originEtfCategories[value.category] = [];
  }
  originEtfCategories[value.category].push({
    trackingTarget: value.trackingTarget,
    list: value.list.sort((a, b) => b.scale - a.scale),
  });
});
export const etfCategories = Object.entries(originEtfCategories).map(
  ([key, value]) => {
    return {
      category: key,
      children: value,
    };
  }
);
