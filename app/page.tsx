import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "仪表盘 | ETF交易系统",
  description: "ETF交易系统仪表盘",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">仪表盘</h2>
          <div className="flex items-center space-x-2">
            <Link
              href="/strategies/new"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              创建策略
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
