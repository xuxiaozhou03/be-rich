'use client';

import React, { useState, useEffect } from 'react';
import { Card, Form, DatePicker, Select, InputNumber, Button, Table, Spin, message, Row, Col, Statistic, Progress } from 'antd';
import { PlayCircleOutlined, DownloadOutlined, BarChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { BacktestRequest, BacktestResult, BacktestMetrics, Strategy } from '@/lib/types';
import LightWeightChart from '@/components/charts/LightWeightChart';
import styles from './BacktestPanel.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BacktestPanelProps {
  strategy: Strategy;
  onBacktestComplete?: (result: BacktestResult) => void;
}

const BacktestPanel: React.FC<BacktestPanelProps> = ({ strategy, onBacktestComplete }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [historicalResults, setHistoricalResults] = useState<BacktestResult[]>([]);

  // 可选择的交易标的
  const availableSymbols = [
    { value: '510300', label: '沪深300ETF (510300)' },
    { value: '510050', label: '上证50ETF (510050)' },
    { value: '159915', label: '创业板ETF (159915)' },
    { value: '113050', label: '南银转债 (113050)' },
    { value: '113616', label: '韦尔转债 (113616)' },
    { value: '508056', label: '博时蛇口产园REIT (508056)' },
    { value: '508077', label: '平安广州广河REIT (508077)' },
  ];

  useEffect(() => {
    fetchHistoricalBacktests();
  }, [strategy.id]);

  const fetchHistoricalBacktests = async () => {
    try {
      const response = await fetch(`/api/backtest?strategyId=${strategy.id}`);
      const data = await response.json();
      if (data.success) {
        setHistoricalResults(data.data);
      }
    } catch (error) {
      console.error('获取历史回测失败:', error);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const backtestRequest: BacktestRequest = {
        strategyId: strategy.id,
        symbols: values.symbols,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        initialCapital: values.initialCapital,
        parameters: {
          volatility: values.volatility,
        },
      };

      const response = await fetch('/api/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backtestRequest),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        onBacktestComplete?.(data.data);
        message.success('回测完成！');
        fetchHistoricalBacktests(); // 刷新历史回测结果
      } else {
        message.error(data.message || '回测失败');
      }
    } catch (error) {
      console.error('回测失败:', error);
      message.error('回测失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;
  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  // 绩效指标表格列
  const metricsColumns = [
    { title: '指标', dataIndex: 'name', key: 'name' },
    { title: '策略', dataIndex: 'strategy', key: 'strategy' },
    { title: '基准', dataIndex: 'benchmark', key: 'benchmark' },
  ];

  // 历史回测结果表格列
  const historyColumns = [
    { title: '回测日期', dataIndex: 'createdAt', key: 'createdAt', render: (text: string) => dayjs(text).format('YYYY-MM-DD') },
    { title: '回测期间', key: 'period', render: (record: BacktestResult) => `${record.startDate} 至 ${record.endDate}` },
    { title: '总收益率', dataIndex: ['metrics', 'totalReturn'], key: 'totalReturn', render: formatPercent },
    { title: '年化收益率', dataIndex: ['metrics', 'annualizedReturn'], key: 'annualizedReturn', render: formatPercent },
    { title: '最大回撤', dataIndex: ['metrics', 'maxDrawdown'], key: 'maxDrawdown', render: formatPercent },
    { title: '夏普比率', dataIndex: ['metrics', 'sharpeRatio'], key: 'sharpeRatio', render: (val: number) => val.toFixed(2) },
    { title: '胜率', dataIndex: ['metrics', 'winRate'], key: 'winRate', render: formatPercent },
  ];

  const getMetricsData = (metrics: BacktestMetrics, benchmark: any) => [
    { key: '1', name: '总收益率', strategy: formatPercent(metrics.totalReturn), benchmark: formatPercent(benchmark.totalReturn) },
    { key: '2', name: '年化收益率', strategy: formatPercent(metrics.annualizedReturn), benchmark: formatPercent(benchmark.totalReturn) },
    { key: '3', name: '夏普比率', strategy: metrics.sharpeRatio.toFixed(2), benchmark: benchmark.sharpeRatio.toFixed(2) },
    { key: '4', name: '最大回撤', strategy: formatPercent(metrics.maxDrawdown), benchmark: formatPercent(benchmark.maxDrawdown) },
    { key: '5', name: '胜率', strategy: formatPercent(metrics.winRate), benchmark: '-' },
    { key: '6', name: '总交易次数', strategy: metrics.totalTrades.toString(), benchmark: '-' },
  ];

  // 准备图表数据 - 转换为简单的线图数据
  const chartData = result?.portfolioValues.map(pv => ({
    time: dayjs(pv.date).valueOf() / 1000,
    open: pv.value,
    high: pv.value,
    low: pv.value,
    close: pv.value,
    volume: 0,
  })) || [];

  return (
    <div className={styles.backtestPanel}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="回测配置" extra={<Button type="primary" icon={<PlayCircleOutlined />} loading={loading} onClick={() => form.submit()}>
            开始回测
          </Button>}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                symbols: ['510300', '510050'],
                dateRange: [dayjs().subtract(1, 'year'), dayjs()],
                initialCapital: 100000,
                volatility: 0.02,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="symbols" label="交易标的" rules={[{ required: true, message: '请选择交易标的' }]}>
                    <Select mode="multiple" placeholder="选择交易标的" options={availableSymbols} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="dateRange" label="回测期间" rules={[{ required: true, message: '请选择回测期间' }]}>
                    <RangePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="initialCapital" label="初始资金" rules={[{ required: true, message: '请输入初始资金' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="100000"
                      formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="volatility" label="波动率参数" rules={[{ required: true, message: '请输入波动率参数' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="0.02"
                      step={0.01}
                      min={0.01}
                      max={0.1}
                      formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                      parser={(value) => (Number(value!.replace('%', '')) / 100) as any}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {result && (
          <>
            <Col span={24}>
              <Card title="回测结果概览" extra={<Button icon={<DownloadOutlined />}>导出报告</Button>}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Statistic 
                      title="总收益率" 
                      value={result.metrics.totalReturn * 100} 
                      precision={2} 
                      suffix="%" 
                      valueStyle={{ color: result.metrics.totalReturn > 0 ? '#3f8600' : '#cf1322' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic 
                      title="年化收益率" 
                      value={result.metrics.annualizedReturn * 100} 
                      precision={2} 
                      suffix="%" 
                      valueStyle={{ color: result.metrics.annualizedReturn > 0 ? '#3f8600' : '#cf1322' }}
                    />
                  </Col>
                  <Col span={6}>
                    <Statistic title="夏普比率" value={result.metrics.sharpeRatio} precision={2} />
                  </Col>
                  <Col span={6}>
                    <Statistic 
                      title="最大回撤" 
                      value={Math.abs(result.metrics.maxDrawdown) * 100} 
                      precision={2} 
                      suffix="%" 
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={6}>
                    <Statistic title="胜率" value={result.metrics.winRate * 100} precision={1} suffix="%" />
                  </Col>
                  <Col span={6}>
                    <Statistic title="总交易次数" value={result.metrics.totalTrades} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="盈利交易" value={result.metrics.winningTrades} />
                  </Col>
                  <Col span={6}>
                    <Statistic title="亏损交易" value={result.metrics.losingTrades} />
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="净值曲线" extra={<Button icon={<BarChartOutlined />}>查看详情</Button>}>
                <div style={{ height: 400 }}>
                  <LightWeightChart data={chartData} />
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="绩效对比">
                <Table
                  dataSource={getMetricsData(result.metrics, result.benchmark)}
                  columns={metricsColumns}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
          </>
        )}

        <Col span={24}>
          <Card title="历史回测记录">
            <Table
              dataSource={historicalResults}
              columns={historyColumns}
              pagination={{ pageSize: 10 }}
              size="small"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BacktestPanel;
