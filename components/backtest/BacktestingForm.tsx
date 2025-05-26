"use client";

import { request } from "@/services/helper/request";
import { Button } from "../ui/button";
import { useBacktestResult } from "./context";
import { IResult } from "@/services/backtest/result";

const BacktestingForm = () => {
  const ctx = useBacktestResult();
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-background p-6 shadow-md">
      <Button
        onClick={async () => {
          const result = await request<{ data: IResult }>({
            url: "/api/backtest",
            method: "GET",
            format: "json",
          });
          console.log(result.data);
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
