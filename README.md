# be-rich

实现一个量化交易项目，包含以下模块：

1. **数据获取**

   - 使用 [akshare](https://github.com/akfamily/akshare) 获取金融市场数据。

2. **策略开发**

   - 实现基于布林带（Bollinger Bands）的技术分析策略。

3. **回测与绩效评估**

   - 使用 [Backtrader](https://www.backtrader.com/) 进行策略回测。
   - 提供详细的绩效评估指标。

4. **结果可视化**
   - 生成交易信号、回测结果的可视化图表，便于分析和展示。

## 投资标的

本项目的投资标的为 **A 股的 ETF 基金**，通过量化策略对 ETF 基金进行交易。

## 安装

1. 克隆项目到本地：

   ```bash
   git clone https://github.com/yourusername/be-rich.git
   cd be-rich
   ```

2. 创建并激活虚拟环境：

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows 用户使用 venv\Scripts\activate
   ```

3. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

## 运行

1. 配置数据获取模块，确保 akshare 可用。

2. 运行主程序：

   ```bash
   python main.py
   ```

3. 查看生成的回测结果和可视化图表。
