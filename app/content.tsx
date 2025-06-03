"use client";

import list from "@/public/etfs.json";
import { Etf } from "@/services/data/etf/type";
import React from "react";

const Card: React.FC<{ etf: Etf }> = ({ etf }) => {
  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-xl font-semibold">{etf.name}</h3>
      <p>基准: {etf.benchmark}</p>
      <p>跟踪目标: {etf.trackingTarget}</p>
      <p>规模: {etf.scale}</p>
    </div>
  );
};

const Group: React.FC<{ group: EtfGroup }> = ({ group }) => {
  return (
    <div className="">
      <div className="">{group.trackingTarget}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {group.list.map((etf) => (
          <Card key={etf.symbol} etf={etf} />
        ))}
      </div>
    </div>
  );
};

type EtfGroup = {
  trackingTarget: string;
  list: Etf[];
};
const orginGroup = (list as unknown as Etf[]).reduce((acc, etf) => {
  if (!acc[etf.trackingTarget]) {
    acc[etf.trackingTarget] = { trackingTarget: etf.trackingTarget, list: [] };
  }
  acc[etf.trackingTarget].list.push(etf);

  return acc;
}, {} as Record<string, EtfGroup>);
const groupList = Object.values(orginGroup).map((group) => {
  group.list.sort((a, b) => b.scale - a.scale);
  return group;
}).filter((group) => group.list[0].scale > 2);
const Content: React.FC = () => {
  return (
    <table className="border border-slate-200 w-full">
      {/* {groupList.map((group) => (
        <Group key={group.trackingTarget} group={group} />
      ))} */}
      <thead>
        <tr className="border-b border-slate-200">
          <th className="border-r border-slate-200">跟踪指数</th>
          <th className="border-r border-slate-200">基准</th>
          <th className="border-r border-slate-200">ETF名称</th>
          <th className="border-r border-slate-200">代码</th>
          <th className="border-r border-slate-200">规模</th>
        </tr>
      </thead>
      <tbody>
        {groupList.map((group) => (
          <React.Fragment key={group.trackingTarget}>
            <tr className="border-b border-slate-200">
              <td className="border-r border-slate-200">{group.trackingTarget}</td>
              <td className="border-r border-slate-200">{group.list[0].benchmark}</td>
              <td className="border-r border-slate-200">{group.list[0].name}</td>
              <td className="border-r border-slate-200">{group.list[0].symbol}</td>
              <td>{group.list[0].scale}</td>
            </tr>
            {/* {group.list.slice(1).map((etf) => (
              <tr key={etf.symbol} className="border-b border-slate-200">
                <td className="border-r border-slate-200">{etf.name}</td>
                <td className="border-r border-slate-200">{etf.scale}</td>
              </tr>
            ))} */}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Content;
