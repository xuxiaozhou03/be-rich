import type { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "仪表盘 | ETF交易系统",
  description: "ETF交易系统仪表盘",
};

export default async function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
        </div>
        <Content />
      </div>
    </div>
  );
}
