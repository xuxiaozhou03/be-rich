import requests
from bs4 import BeautifulSoup

# 获取指定 ETF 的详情
def get_etf_details(etf_code):
    try:
        url = f"https://fundf10.eastmoney.com/jbgk_{etf_code}.html"
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # 提取指定的 ETF 信息
        details = {}
        table = soup.find("table", class_="info w790")
        if table:
            rows = table.find_all("tr")
            for row in rows:
                ths = row.find_all("th")
                tds = row.find_all("td")
                for th, td in zip(ths, tds):
                    key = th.get_text(strip=True)
                    value = td.get_text(strip=True)

                    # 只提取指定字段并转换为英文名
                    if key == "成立日期/规模":
                        # 拆分 "成立日期/规模" 为两个字段
                        if "/" in value:
                            establishment_date, scale = map(str.strip, value.split("/", 1))
                            details["establishment_date"] = establishment_date
                            # details["scale"] = scale
                        else:
                            # details["establishment_date_and_scale"] = value
                            pass
                    elif key == "资产规模":
                        # 拆分 "资产规模" 和 "份额规模"
                        if "份额规模" in value:
                            asset_size, share_size = map(str.strip, value.split("份额规模", 1))
                            # 去除括号及其内容
                            asset_size = asset_size.split("（")[0].strip()
                            share_size = share_size.split("（")[0].strip()
                            details["asset_size"] = asset_size
                            details["share_size"] = share_size
                        else:
                            details["asset_size"] = value.split("（")[0].strip()
                    elif key == "业绩比较基准":
                        details["performance_benchmark"] = value
                    elif key == "跟踪标的":
                        details["tracking_target"] = value

        print(f"已获取 ETF {etf_code} 的详情")
        return details

    except requests.RequestException as e:
        print(f"网络请求错误: {e}")
    except Exception as e:
        print(f"解析错误: {e}")
        return {}

# 主函数
if __name__ == "__main__":
    # 示例：获取某个 ETF 的详情
    example_etf_code = "159822"  # 示例代码
    etf_details = get_etf_details(example_etf_code)
    print(f"ETF {example_etf_code} 的详情:")
    print(etf_details)

