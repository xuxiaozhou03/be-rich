'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, Row, Col, Statistic, Progress, Table, Alert, Button, Space, Select, DatePicker, Tabs } from 'antd';
import { ExclamationCircleOutlined, LineChartOutlined, RiseOutlined, FallOutlined, SafetyOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '@/stores';
import LightWeightChart from '@/components/charts/LightWeightChart';
import { RiskMetrics } from '@/lib/types';
import styles from './page.module.css';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const RiskManagementPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1m');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  
  const { positions, totalValue, totalPnL, totalPnLPercent } = usePortfolioStore();

  // 模拟风险指标数据
  const riskMetrics: RiskMetrics = {
    var95: -0.025, // 95% VaR: -2.5%
    var99: -0.048, // 99% VaR: -4.8%
    cvar95: -0.038, // 95% CVaR: -3.8%
    maxDrawdown: -0.065, // 最大回撤: -6.5%
    volatility: 0.185, // 波动率: 18.5%
    beta: 0.95, // Beta值: 0.95
    trackingError: 0.025, // 跟踪误差: 2.5%
  };

  // 风险等级颜色映射
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#52c41a';
      case 'medium': return '#faad14';
      case 'high': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  // 计算风险等级
  const calculateRiskLevel = () => {
    const volatility = Math.abs(riskMetrics.volatility);
    const maxDrawdown = Math.abs(riskMetrics.maxDrawdown);
    
    if (volatility > 0.2 || maxDrawdown > 0.08) return 'high';
    if (volatility > 0.15 || maxDrawdown > 0.05) return 'medium';
    return 'low';
  };

  const currentRiskLevel = calculateRiskLevel();

  // 风险分解数据
  const riskDecomposition = [
    {
      key: '1',
      factor: '市场风险',
      contribution: 65.2,
      value: -0.0163,
      description: '系统性市场波动带来的风险',
    },
    {
      key: '2',
      factor: '行业风险',
      contribution: 18.5,
      value: -0.0046,
      description: '特定行业或板块的风险暴露',
    },
    {
      key: '3',
      factor: '个股风险',
      contribution: 12.8,
      value: -0.0032,
      description: '个别股票或债券的特定风险',
    },
    {
      key: '4',
      factor: '流动性风险',
      contribution: 3.5,
      value: -0.0009,
      description: '资产流动性不足的风险',
    },
  ];

  const riskDecompositionColumns = [
    {
      title: '风险因子',
      dataIndex: 'factor',
      key: 'factor',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: '贡献度',
      dataIndex: 'contribution',
      key: 'contribution',
      render: (value: number) => (
        <div className={styles.contributionCell}>
          <Progress
            percent={value}
            size="small"
            strokeColor={value > 50 ? '#ff4d4f' : value > 30 ? '#faad14' : '#52c41a'}
            showInfo={false}
          />
          <span className={styles.contributionText}>{value.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      title: '风险值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => (
        <span className={styles.riskValue}>
          {(value * 100).toFixed(2)}%
        </span>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // 模拟VaR历史数据
  const varHistoryData = [
    { time: Date.now() - 30 * 24 * 3600 * 1000, open: -0.020, high: -0.015, low: -0.028, close: -0.025, volume: 1000 },
    { time: Date.now() - 25 * 24 * 3600 * 1000, open: -0.025, high: -0.018, low: -0.032, close: -0.022, volume: 1200 },
    { time: Date.now() - 20 * 24 * 3600 * 1000, open: -0.022, high: -0.019, low: -0.029, close: -0.024, volume: 1100 },
    { time: Date.now() - 15 * 24 * 3600 * 1000, open: -0.024, high: -0.020, low: -0.031, close: -0.027, volume: 1300 },
    { time: Date.now() - 10 * 24 * 3600 * 1000, open: -0.027, high: -0.021, low: -0.034, close: -0.023, volume: 1050 },
    { time: Date.now() - 5 * 24 * 3600 * 1000, open: -0.023, high: -0.017, low: -0.028, close: -0.025, volume: 1150 },
    { time: Date.now(), open: -0.025, high: -0.019, low: -0.030, close: -0.025, volume: 1000 },
  ];

  const getRiskAlert = () => {
    const level = currentRiskLevel;
    if (level === 'high') {
      return (
        <Alert
          message="高风险警告"
          description="当前投资组合风险水平偏高，建议适当降低风险敞口或调整资产配置。"
          type="error"
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" type="primary" danger>
              查看建议
            </Button>
          }
          closable
        />
      );
    } else if (level === 'medium') {
      return (
        <Alert
          message="中等风险提示"
          description="当前投资组合风险水平适中，请继续关注市场变化。"
          type="warning"
          icon={<ExclamationCircleOutlined />}
          closable
        />
      );
    } else {
      return (
        <Alert
          message="低风险状态"
          description="当前投资组合风险水平较低，可适当考虑增加收益性资产。"
          type="success"
          icon={<SafetyOutlined />}
          closable
        />
      );
    }
  };

  return (
    <AppLayout>
      <div className={styles.riskManagement}>
        <div className={styles.header}>
        <h1>风险管理</h1>
        <div className={styles.controls}>
          <Space>
            <Select
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              style={{ width: 120 }}
            >
              <Option value="1w">1周</Option>
              <Option value="1m">1月</Option>
              <Option value="3m">3月</Option>
              <Option value="6m">6月</Option>
              <Option value="1y">1年</Option>
            </Select>
            <RangePicker />
            <Button type="primary" icon={<LineChartOutlined />}>
              生成报告
            </Button>
          </Space>
        </div>
      </div>

      {/* 风险警告 */}
      <div className={styles.alertSection}>
        {getRiskAlert()}
      </div>

      {/* 风险指标概览 */}
      <Row gutter={[16, 16]} className={styles.metricsRow}>
        <Col span={6}>
          <Card>
            <Statistic
              title="95% VaR"
              value={Math.abs(riskMetrics.var95 * 100)}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FallOutlined />}
            />
            <div className={styles.subText}>日风险价值</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="最大回撤"
              value={Math.abs(riskMetrics.maxDrawdown * 100)}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<FallOutlined />}
            />
            <div className={styles.subText}>历史最大回撤</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="波动率"
              value={riskMetrics.volatility * 100}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<LineChartOutlined />}
            />
            <div className={styles.subText}>年化波动率</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Beta系数"
              value={riskMetrics.beta}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<RiseOutlined />}
            />
            <div className={styles.subText}>相对市场敏感度</div>
          </Card>
        </Col>
      </Row>

      {/* 风险分解和VaR图表 */}
      <Row gutter={[16, 16]} className={styles.analysisRow}>
        <Col span={12}>
          <Card title="风险因子分解" extra={<Button type="link">详细分析</Button>}>
            <Table
              columns={riskDecompositionColumns}
              dataSource={riskDecomposition}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="VaR历史走势" extra={<Button type="link">更多指标</Button>}>
            <LightWeightChart
              data={varHistoryData}
              height={300}
            />
          </Card>
        </Col>
      </Row>

      {/* 风险详细分析 */}
      <Card className={styles.detailAnalysis}>
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="市场风险" key="1">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="市场Beta"
                    value={riskMetrics.beta}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="系统性风险"
                    value={65.2}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="相关性风险"
                    value={0.85}
                    precision={2}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="流动性风险" key="2">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="流动性覆盖率"
                    value={125.6}
                    suffix="%"
                    precision={1}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="平均成交额"
                    value={2.56}
                    suffix="亿"
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="换手率"
                    value={1.25}
                    suffix="%"
                    precision={2}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="信用风险" key="3">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="信用等级分布"
                    value="AA+"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="违约概率"
                    value={0.15}
                    suffix="%"
                    precision={2}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="信用利差"
                    value={125}
                    suffix="BP"
                    precision={0}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
      </div>
    </AppLayout>
  );
};

export default RiskManagementPage;
