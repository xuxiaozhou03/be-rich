"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BacktestingStats } from "./BacktestingStats";
import { useBacktestResult } from "./context";
import { BacktestingTrades } from "./backtesting-trades";

const BacktestingResults = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const ctx = useBacktestResult();

  if (!ctx.result) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>回测结果</CardTitle>
          <CardDescription>策略性能分析</CardDescription>
        </CardHeader>
        <CardContent>
          <p>请先运行回测</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>回测结果</CardTitle>
        <CardDescription>策略性能分析</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="performance"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="performance">性能</TabsTrigger>
            <TabsTrigger value="stats">统计</TabsTrigger>
            <TabsTrigger value="trades">交易</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            {/* <BacktestingChart result={result} /> */}
          </TabsContent>

          <TabsContent value="stats">
            <BacktestingStats result={ctx.result} />
          </TabsContent>

          <TabsContent value="trades">
            <BacktestingTrades result={ctx.result} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
export default BacktestingResults;
