"use client";

import { request } from "@/lib/request";
import { Button } from "../ui/button";
import { BacktestResult } from "@/services/backtest/account";
import { useBacktestResult } from "./context";

const BacktestingForm = () => {
  const ctx = useBacktestResult();
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-background p-6 shadow-md">
      <h3 className="text-lg font-semibold">回测设置</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-gray-700"
          >
            开始日期
          </label>
          <input
            type="date"
            id="start-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-700"
          >
            结束日期
          </label>
          <input
            type="date"
            id="end-date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <Button
        onClick={async () => {
          const result = await request<{ data: BacktestResult }>({
            url: "/api/backtest",
            method: "GET",
            format: "json",
          });
          ctx.setResult(result.data);
        }}
        className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        开始回测
      </Button>
    </div>
  );
};

export default BacktestingForm;
