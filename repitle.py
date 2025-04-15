from data.etf_list import get_etf_list
from data.etf_details import get_etf_details
import json

# 主函数
if __name__ == "__main__":
    # 获取 ETF 列表
    etf_list = get_etf_list()
    print(f"总计 {len(etf_list)} 只基金")

    # 获取所有 ETF 的详细信息
    etf_details_list = []
    for etf in etf_list:
        etf_code = etf.get("f12")
        etf_name = etf.get("f14")

        print(f"正在获取 ETF {etf_code} ({etf_name}) 的详细信息...")
        details = get_etf_details(etf_code)

        etf_details_list.append([
            etf_code,
            etf_name,
            details.get("establishment_date", ""),
            details.get("asset_size", ""),
            details.get("share_size", ""),
            details.get("performance_benchmark", ""),
            details.get("tracking_target", "")
        ])

    # 保存结果到 JSON 文件
    output_file = "etf_details.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(etf_details_list, f, ensure_ascii=False, indent=4)

    print(f"ETF 详细信息已保存到 {output_file}")

