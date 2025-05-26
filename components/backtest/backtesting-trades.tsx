"use client";

import { cn } from "@/lib/utils";
import { IResult } from "@/services/backtest/result";
import DataTable, { Column } from "../data-table";
import { IRecord } from "@/services/backtest/record";
import { formatNumber } from "@/services/helper/tool";

interface BacktestingTradesProps {
  result: IResult;
}

export function BacktestingTrades({ result }: BacktestingTradesProps) {
  // 过滤出已关闭的交易
  const closedTrades = result.records
    .filter((trade) => trade.signal)
    .map((trade) => ({
      ...trade,
      id: trade.kline.date,
    }));
  const columns: Column<IRecord & { id: string }>[] = [
    {
      key: "date",
      header: "日期",
      cell: (row) => (
        <div className="text-sm font-medium">{row.kline.date}</div>
      ),
    },
    {
      key: "action",
      header: "操作",
      cell: (row) => (
        <div
          className={cn(
            "text-sm font-medium",
            row.signal?.type === "buy" ? "text-green-600" : "text-red-600"
          )}
        >
          以 {row.signal?.price} 元{" "}
          {row.signal?.type === "buy" ? "买入" : "卖出"}
          {row.signal?.quantity} 股
        </div>
      ),
    },
    {
      key: "price",
      header: "收盘价",
      cell: (row) => (
        <div className="text-sm font-medium">{row.kline.close}</div>
      ),
    },
    {
      key: "stock",
      header: "持股数",
      cell: (row) => <div className="text-sm font-medium">{row.stock}</div>,
    },
    {
      key: "costPrice",
      header: "成本价",
      cell: (row) => <div className="text-sm font-medium">{row.costPrice}</div>,
    },
    {
      key: "stockMarketValue",
      header: "股票市值",
      cell: (row) => (
        <div className="text-sm font-medium">{row.stockMarketValue}</div>
      ),
    },
    {
      key: "stockInvestment",
      header: "持股投入资金",
      cell: (row) => (
        <div className="text-sm font-medium">{row.stockInvestment}</div>
      ),
    },
    {
      key: "profit",
      header: "股票盈亏",
      cell: (row) => (
        <div
          className={cn(
            "text-sm font-medium",
            row.stockProfitAmount < 0 && "text-green-600",
            row.stockProfitAmount > 0 && "text-red-600"
          )}
        >
          {row.stockProfitAmount}
        </div>
      ),
    },
    {
      key: "profitRate",
      header: "股票盈亏率",
      cell: (row) => (
        <div
          className={cn(
            "text-sm font-medium",
            row.stockProfitAmountRate < 0 && "text-green-600",
            row.stockProfitAmountRate > 0 && "text-red-600"
          )}
        >
          {formatNumber(row.stockProfitAmountRate * 100, 2)}%
        </div>
      ),
    },
    {
      key: "cash",
      header: "现金",
      cell: (row) => <div className="text-sm font-medium">{row.cash}</div>,
    },
    {
      key: "totalAsset",
      header: "总资产",
      cell: (row) => (
        <div className="text-sm font-medium">{row.totalAsset}</div>
      ),
    },
    {
      key: "totalProfit",
      header: "总盈亏",
      cell: (row) => (
        <div
          className={cn(
            "text-sm font-medium",
            row.totalProfitAmount < 0 && "text-green-600",
            row.totalProfitAmount > 0 && "text-red-600"
          )}
        >
          {row.totalProfitAmount}
        </div>
      ),
    },
    {
      key: "totalProfitRate",
      header: "总盈亏率",
      cell: (row) => (
        <div
          className={cn(
            "text-sm font-medium",
            row.totalProfitAmountRate < 0 && "text-green-600",
            row.totalProfitAmountRate > 0 && "text-red-600"
          )}
        >
          {row.totalProfitAmountRate}
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={closedTrades} />;
}
