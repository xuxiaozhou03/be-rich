import Backtest from "@/services/backtest";
import { getEtfKline } from "@/services/data/kline";
import Boll from "@/services/strategy/strategies/boll";
import { success } from "@/utils";

export const GET = async () => {
  const klines = await getEtfKline({});
  const backtest = new Backtest({
    initialCapital: 100000,
    calculateFee: (price, quantity) => {
      return price * quantity * 0.001;
    },
  });
  backtest.loadData(klines);
  backtest.loadStrategy(new Boll());
  const result = backtest.run();
  return success(result);
};
