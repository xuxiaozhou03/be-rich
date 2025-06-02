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
});
const Content: React.FC = () => {
  return (
    <div className="">
      {groupList.map((group) => (
        <Group key={group.trackingTarget} group={group} />
      ))}
    </div>
  );
};

export default Content;
