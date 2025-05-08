import { getEtfKline } from "@/services/data/kline";
import Boll from "@/services/strategy/strategies/boll";
import { success } from "@/lib/utils";
import runBacktestEngine from "@/services/backtest/engine";

export const GET = async () => {
  const klines = await getEtfKline({});

  const result = runBacktestEngine(
    {
      initialCapital: 100000,
      calculateFee: (price, quantity) => {
        return price * quantity * 0.001;
      },
    },
    klines,
    new Boll()
  );

  return success(result);
};
