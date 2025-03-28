import akshare as ak

def fetch_stock_data(stock_code: str, start_date: str, end_date: str):
    """
    Fetch historical stock data using akshare.

    :param stock_code: The stock code (e.g., 'sh600000' for Shanghai Pudong Development Bank).
    :param start_date: The start date in 'YYYYMMDD' format.
    :param end_date: The end date in 'YYYYMMDD' format.
    :return: A pandas DataFrame containing the stock data.
    """
    try:
        stock_data = ak.stock_zh_a_hist(
            symbol=stock_code, 
            period="daily", 
            start_date=start_date, 
            end_date=end_date, 
            adjust="qfq"
        )
        return stock_data
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

# Example usage
if __name__ == "__main__":
    stock_code = "sh600000"
    start_date = "20220101"
    end_date = "20221231"
    data = fetch_stock_data(stock_code, start_date, end_date)
    if data is not None:
        print(data.head())
