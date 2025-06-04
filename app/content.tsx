"use client";

import { etfCategories } from "@/services/data/etfs/list";
import React from "react";
console.log("etfs", etfCategories);
const Content: React.FC = () => {
  return (
    <table className="border border-slate-200 w-full">
      <thead>
        <tr className="border-b border-slate-200">
          <th className="border-r border-slate-200">跟踪指数</th>
          {/* <th className="border-r border-slate-200">基准</th> */}
          <th className="border-r border-slate-200">ETF名称</th>
          <th className="border-r border-slate-200">代码</th>
          <th className="border-r border-slate-200">规模</th>
        </tr>
      </thead>
      <tbody>
        {etfCategories.map((category) => (
          <React.Fragment key={category.category}>
            <tr>
              <td
                colSpan={4}
                className="bg-gray-900 font-bold border border-slate-200 text-center"
              >
                {category.category}
              </td>
            </tr>
            {category.children.map((child) => (
              <React.Fragment key={child.trackingTarget}>
                {child.list.map((etf, index) => (
                  <tr key={etf.symbol} className="border-b border-slate-200">
                    {index === 0 && (
                      <td
                        className="border-r border-slate-200"
                        rowSpan={child.list.length}
                      >
                        {etf.trackingTarget}
                      </td>
                    )}
                    {/* <td className="border-r border-slate-200">
                      {etf.benchmark}
                    </td> */}
                    <td className="border-r border-slate-200">{etf.name}</td>
                    <td className="border-r border-slate-200">{etf.symbol}</td>
                    <td className="border-r border-slate-200">
                      {etf.scale.toFixed(2)} 亿元
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Content;
