import requests
import json
import re

# 获取 A 股 ETF 基金列表及其基本信息
def get_etf_list():
    url = "https://push2.eastmoney.com/api/qt/clist/get"
    all_etfs = []
    page = 1
    page_size = 100

    while True:
        params = {
            "np": 1,
            "fltt": 1,
            "invt": 2,
            "cb": "callback",
            "fs": "b:MK0021,b:MK0022,b:MK0023,b:MK0024,b:MK0827",
            "fields": "f12,f13,f14,f1,f2,f4,f3,f152,f5,f6,f17,f18,f15,f16",
            "fid": "f3",
            "pn": page,
            "pz": page_size,
            "po": 1,
            "dect": 1,
            "ut": "fa5fd1943c7b386f172d6893dbfba10b",
            "wbp2u": "|0|0|0|web",
            "_": 1743408794493,
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.text

        # 提取 JSON 数据
        match = re.search(r"callback\((.*)\)", data)
        if not match:
            raise ValueError("未能提取有效的 JSON 数据")
        json_data = json.loads(match.group(1))

        # 检查是否有数据
        if "data" not in json_data or "diff" not in json_data["data"]:
            break

        # 遍历 page_data，提取 symbol 和 name
        page_data = json_data["data"]["diff"]
        for item in page_data:
            # 获取 ETF 的详细信息
            all_etfs.append({"symbol": item.get("f12"), "name": item.get("f14")})

        print(f"已获取第 {page} 页，共 {len(page_data)} 条数据")

        # 如果当前页数据少于 page_size，则说明已到最后一页
        if len(page_data) < page_size:
            break

        page += 1

    return all_etfs
