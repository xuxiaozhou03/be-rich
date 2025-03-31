from data.etf_kline import get_etf_kline

def analyze_kline_data(kline_data):
    """
    对 K 线数据进行数据分析，包括统计摘要、可视化和相关性分析。
    :param kline_data: 包含 K 线数据的 Pandas DataFrame
    """
    # 统计摘要
    print("统计摘要:")
    stats = kline_data.describe()
    print(stats)

    # 保存统计摘要为 CSV 文件
    # stats.to_csv("kline_statistics.csv", encoding="utf-8")
    # print("统计摘要已保存为 kline_statistics.csv")

    # # 可视化收盘价趋势并保存为 HTML
    # fig = px.line(kline_data, x='日期', y='收盘', title="收盘价趋势", labels={'收盘': '收盘价', '日期': '日期'})
    # fig.write_html("kline_visualization.html")
    # print("可视化结果已保存为 kline_visualization.html")

    # 相关性分析
    if '成交量' in kline_data.columns:
        print("相关性分析:")
        correlation_matrix = kline_data[['收盘', '成交量']].corr()
        print(correlation_matrix)

if __name__ == "__main__":
    # 示例：通过 get_etf_kline 获取 ETF 的 K 线数据并进行分析
    example_etf_code = "159822"  # 示例 ETF 代码
    start_date = "20220101"  # 开始日期
    end_date = "20221231"  # 结束日期
    try:
        kline_data = get_etf_kline(symbol=example_etf_code, start_date=start_date, end_date=end_date)
        if kline_data is not None:
            analyze_kline_data(kline_data)
    except Exception as e:
        print(f"加载或分析数据失败: {e}")
