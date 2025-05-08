import BacktestingForm from "@/components/backtest/BacktestingForm";
import BacktestingResults from "@/components/backtest/BacktestingResults";
import BacktestContext from "@/components/backtest/context";

const Page = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">回测</h2>
          <p className="text-muted-foreground">使用历史数据测试您的策略</p>
        </div>
      </div>
      <div className="space-y-4">
        <BacktestContext>
          <BacktestingForm />
          <BacktestingResults />
        </BacktestContext>
      </div>
    </div>
  );
};

export default Page;
