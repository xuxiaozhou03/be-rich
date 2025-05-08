import Record from "./record";

class Result {
  records: Record[];
  initialCapital: number;

  constructor(records: Record[], initialCapital: number) {
    this.records = records;
    this.initialCapital = initialCapital;
  }

  /**
   * 总交易次数。
   * 公式：统计 signal 为 true 的记录数量。
   */
  get totalTrades() {
    return this.records.filter((record) => record.signal).length;
  }

  /**
   * 盈利交易次数。
   * 公式：统计 signal 为 true 且 totalProfitAmount > 0 的记录数量。
   */
  get winningTrades() {
    return this.records.filter(
      (record) => record.signal && record.totalProfitAmount > 0
    ).length;
  }

  /**
   * 亏损交易次数。
   * 公式：统计 signal 为 true 且 totalProfitAmount < 0 的记录数量。
   */
  get losingTrades() {
    return this.records.filter(
      (record) => record.signal && record.totalProfitAmount < 0
    ).length;
  }

  /**
   * 胜率（百分比）。
   * 公式： (winningTrades / totalTrades) * 100。
   */
  get winRate() {
    return (this.winningTrades / this.totalTrades) * 100 || 0;
  }

  /**
   * 盈亏比。
   * 公式：盈利交易的 totalProfitAmount 总和 / 亏损交易的 totalProfitAmount 绝对值总和。
   */
  get profitFactor() {
    const totalProfit = this.records
      .filter((record) => record.signal && record.totalProfitAmount > 0)
      .reduce((acc, record) => acc + record.totalProfitAmount, 0);

    const totalLoss = Math.abs(
      this.records
        .filter((record) => record.signal && record.totalProfitAmount < 0)
        .reduce((acc, record) => acc + record.totalProfitAmount, 0)
    );

    return totalProfit / totalLoss;
  }

  /**
   * 最终资金。
   * 公式：最后一条记录的 totalAsset。
   */
  get finalCapital() {
    return this.records[this.records.length - 1].totalAsset;
  }

  /**
   * 年化回报率（百分比）。
   * 公式：((finalCapital - initialCapital) / initialCapital) * 100。
   */
  get annualReturn() {
    return (
      ((this.finalCapital - this.initialCapital) / this.initialCapital) * 100
    );
  }

  /**
   * 最大回撤。
   * 公式：所有记录中最大利润 - 最小利润。
   */
  get maxDrawdown() {
    const profits = this.records.map((record) => record.totalProfitAmount);
    return Math.max(...profits) - Math.min(...profits);
  }

  /**
   * 夏普比率。
   * 公式：平均回报 / 回报的标准差。
   */
  get sharpeRatio() {
    const meanReturn =
      (this.finalCapital - this.initialCapital) / this.initialCapital;

    const variance =
      this.records.reduce((acc, record) => {
        const dailyReturn =
          (record.totalAsset - this.initialCapital) / this.initialCapital;
        return acc + Math.pow(dailyReturn, 2);
      }, 0) / this.records.length;

    return meanReturn / Math.sqrt(variance);
  }

  /**
   * 总回报率（百分比）。
   * 公式：((finalCapital - initialCapital) / initialCapital) * 100。
   */
  get totalReturn() {
    return (
      ((this.finalCapital - this.initialCapital) / this.initialCapital) * 100
    );
  }

  toJSON() {
    return {
      totalTrades: this.totalTrades,
      winningTrades: this.winningTrades,
      losingTrades: this.losingTrades,
      winRate: this.winRate,
      profitFactor: this.profitFactor,
      finalCapital: this.finalCapital,
      annualReturn: this.annualReturn,
      maxDrawdown: this.maxDrawdown,
      sharpeRatio: this.sharpeRatio,
      totalReturn: this.totalReturn,
      initialCapital: this.initialCapital,
      records: this.records.map((record) => record.toJSON()),
    };
  }
}

export type IResult = ReturnType<Result["toJSON"]>;
export default Result;
