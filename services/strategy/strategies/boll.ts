import { BaseStrategy } from "../base";
import { bollingerBands } from "indicatorts";

class Boll extends BaseStrategy {
  constructor() {
    super("Bollinger Bands", "Bollinger Bands Strategy", {
      period: 20,
      numStdDev: 2,
    });
  }

  onData: BaseStrategy["onData"] = (kline, ctx) => {
    const result = bollingerBands(ctx.prevKlines.map((item) => item.close));

    const upperBand = result.upper[result.upper.length - 1];
    const lowerBand = result.lower[result.lower.length - 1];
    // const middleBand = result.middle[result.middle.length - 1];

    const lastClose = kline.close;

    // Buy signal: when the price crosses below the lower band
    if (lastClose < lowerBand) {
      const quantity = 100;
      const result = ctx.canBuy(lastClose, quantity);
      if (result.canBuy) {
        return {
          type: "buy",
          price: lastClose,
          quantity,
          description: "Buy signal from Bollinger Bands",
        };
      }
    }
    // Sell signal: when the price crosses above the upper band
    if (lastClose > upperBand) {
      const quantity = 100;
      const result = ctx.canSell(lastClose);
      if (result.canSell) {
        return {
          type: "sell",
          price: lastClose,
          quantity,
          description: "Sell signal from Bollinger Bands",
        };
      }
    }

    return null;
  };
}
export default Boll;
