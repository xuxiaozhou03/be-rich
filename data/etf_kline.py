import akshare as ak
import pandas as pd

# 获取指定 ETF 的 K 线数据
def get_etf_kline(
    symbol: str = "159707",
    period: str = "daily",
    start_date: str = "19700101",
    end_date: str = "20500101",
    adjust: str = "qfq"
):
    """
    获取 ETF 的 K 线数据
    :param symbol: ETF 基金代码
    :param period: 时间周期 (daily, weekly, monthly)
    :param start_date: 开始日期 (格式: YYYYMMDD)
    :param end_date: 结束日期 (格式: YYYYMMDD)
    :param adjust: 复权类型 (前复权: qfq, 后复权: hfq, 不复权: "")
    :return: 包含 K 线数据的 Pandas DataFrame
    """
    try:
        # 使用 fund_etf_hist_em 获取 ETF 历史数据
        kline_data = ak.fund_etf_hist_em(
            symbol=symbol,
            period=period,
            start_date=start_date,
            end_date=end_date,
            adjust=adjust
        )
        kline_data['日期'] = pd.to_datetime(kline_data['日期'])
        print(f"已获取 ETF {symbol} 的 K 线数据")
        return kline_data
    except Exception as e:
        print(f"获取 ETF {symbol} 的 K 线数据失败: {e}")
        return None

# 主函数
if __name__ == "__main__":
    # 示例：获取某个 ETF 的 K 线数据
    example_etf_code = "159822"  # 示例代码
    start_date = "20220101"  # 开始日期
    end_date = "20221231"  # 结束日期
    kline_data = get_etf_kline(symbol=example_etf_code, start_date=start_date, end_date=end_date)
    if kline_data is not None:
        print(kline_data.head())
