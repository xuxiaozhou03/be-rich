'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import RiskAnalyzer from '@/components/risk/RiskAnalyzer';
import { Card, Row, Col, Statistic, Progress, Table, Alert, Button, Space, Select, DatePicker, Tabs, Typography } from 'antd';
import { ExclamationCircleOutlined, LineChartOutlined, RiseOutlined, FallOutlined, SafetyOutlined, DashboardOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '@/stores';
import LightWeightChart from '@/components/charts/LightWeightChart';
import { RiskMetrics } from '@/lib/types';
import styles from './page.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const RiskManagementPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1m');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { positions, totalValue, totalPnL, totalPnLPercent, fetchPositions } = usePortfolioStore();

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

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

  // 风险监控告警
  const riskAlerts = [
    {
      type: 'warning',
      message: '组合波动率较高',
      description: '当前组合波动率为18.5%，建议适当分散投资',
      action: '查看详情',
    },
    {
      type: 'error',
      message: '最大回撤超过预警线',
      description: '组合最大回撤已达6.5%，超过5%预警线',
      action: '立即处理',
    },
  ];

  // 头寸风险分析
  const positionRiskColumns = [
    {
      title: '标的代码',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '标的名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '持仓比例',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `${weight.toFixed(2)}%`,
    },
    {
      title: '风险贡献',
      key: 'riskContribution',
      render: (record: any) => {
        const contribution = (record.weight / 100) * Math.abs(riskMetrics.volatility);
        return `${(contribution * 100).toFixed(2)}%`;
      },
    },
    {
      title: '未实现盈亏',
      dataIndex: 'unrealizedPnL',
      key: 'unrealizedPnL',
      render: (pnl: number) => (
        <Text type={pnl >= 0 ? 'success' : 'danger'}>
          {pnl >= 0 ? '+' : ''}¥{pnl.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '风险等级',
      key: 'riskLevel',
      render: (record: any) => {
        const level = record.weight > 30 ? 'high' : record.weight > 15 ? 'medium' : 'low';
        return (
          <span style={{ color: getRiskLevelColor(level) }}>
            {level === 'high' ? '高' : level === 'medium' ? '中' : '低'}
          </span>
        );
      },
    },
  ];

  // 生成模拟图表数据
  const generateChartData = () => {
    const days = 30;
    const data = [];
    let currentPrice = 100;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 4;
      currentPrice += change;
      data.push({
        time: Date.now() / 1000 - (days - i) * 24 * 60 * 60,
        open: currentPrice,
        high: currentPrice + Math.random() * 2,
        low: currentPrice - Math.random() * 2,
        close: currentPrice,
        volume: Math.floor(Math.random() * 1000000),
      });
    }
    
    return data;
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>风险管理</Title>
            <Text type="secondary">风险监控 · 风险分析 · 风险控制 · 压力测试</Text>
          </div>
          <Space>
            <Select
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              style={{ width: 120 }}
            >
              <Option value="1d">1天</Option>
              <Option value="1w">1周</Option>
              <Option value="1m">1个月</Option>
              <Option value="3m">3个月</Option>
              <Option value="1y">1年</Option>
            </Select>
            <Button type="primary" icon={<DashboardOutlined />}>
              生成风险报告
            </Button>
          </Space>
        </div>

        {/* 风险告警 */}
        <div className={styles.alertSection}>
          {riskAlerts.map((alert, index) => (
            <Alert
              key={index}
              message={alert.message}
              description={alert.description}
              type={alert.type as any}
              showIcon
              action={
                <Button size="small" danger={alert.type === 'error'}>
                  {alert.action}
                </Button>
              }
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>

        {/* 风险概览 */}
        <Card className={styles.riskOverview}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="当前风险等级"
                value={currentRiskLevel === 'high' ? '高风险' : currentRiskLevel === 'medium' ? '中风险' : '低风险'}
                valueStyle={{ color: getRiskLevelColor(currentRiskLevel) }}
                prefix={<SafetyOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="组合总价值"
                value={totalValue}
                precision={2}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总盈亏"
                value={totalPnL}
                precision={2}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                valueStyle={{ color: totalPnL >= 0 ? '#52c41a' : '#ff4d4f' }}
                prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="盈亏比例"
                value={totalPnLPercent}
                precision={2}
                suffix="%"
                valueStyle={{ color: totalPnLPercent >= 0 ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 风险管理主内容 */}
        <Card>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'overview',
                label: (
                  <span>
                    <DashboardOutlined />
                    风险概览
                  </span>
                ),
                children: (
                  <div className={styles.overviewTab}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title="风险指标" size="small">
                          <Row gutter={16}>
                            <Col span={12}>
                              <Statistic
                                title="95% VaR"
                                value={Math.abs(riskMetrics.var95) * 100}
                                precision={2}
                                suffix="%"
                                valueStyle={{ color: '#fa8c16' }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="最大回撤"
                                value={Math.abs(riskMetrics.maxDrawdown) * 100}
                                precision={2}
                                suffix="%"
                                valueStyle={{ color: '#f5222d' }}
                              />
                            </Col>
                          </Row>
                          <Row gutter={16} style={{ marginTop: 16 }}>
                            <Col span={12}>
                              <Statistic
                                title="波动率"
                                value={riskMetrics.volatility * 100}
                                precision={2}
                                suffix="%"
                                valueStyle={{ color: '#722ed1' }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Beta系数"
                                value={riskMetrics.beta}
                                precision={2}
                                valueStyle={{ color: '#1890ff' }}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="风险趋势" size="small">
                          <div style={{ height: 200 }}>
                            <LightWeightChart data={generateChartData()} />
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                ),
              },
              {
                key: 'analyzer',
                label: (
                  <span>
                    <LineChartOutlined />
                    详细分析
                  </span>
                ),
                children: (
                  <RiskAnalyzer 
                    portfolioValue={totalValue}
                    positions={positions}
                  />
                ),
              },
              {
                key: 'positions',
                label: (
                  <span>
                    <ExclamationCircleOutlined />
                    头寸风险
                  </span>
                ),
                children: (
                  <div className={styles.positionsTab}>
                    <Table
                      columns={positionRiskColumns}
                      dataSource={positions}
                      rowKey="symbol"
                      pagination={{ pageSize: 10 }}
                      scroll={{ x: 800 }}
                    />
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </AppLayout>
  );
};

export default RiskManagementPage;
