'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import {
  Card,
  Table,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Progress,
  Tag,
  Typography,
  Tabs,
  Select,
  DatePicker,
} from 'antd';
import {
  PieChartOutlined,
  LineChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { usePortfolioStore } from '@/stores';
import LightWeightChart from '@/components/charts/LightWeightChart';
import type { Position, CandleData } from '@/lib/types';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function PortfolioPage() {
  const {
    positions,
    totalValue,
    totalPnL,
    totalPnLPercent,
    loading,
    fetchPositions,
    calculateTotals,
  } = usePortfolioStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // 模拟K线数据
  const generateMockChartData = (): CandleData[] => {
    const data: CandleData[] = [];
    let basePrice = 100;
    const now = Date.now();
    
    for (let i = 30; i >= 0; i--) {
      const time = now - i * 24 * 60 * 60 * 1000;
      const open = basePrice;
      const change = (Math.random() - 0.5) * 4;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      data.push({
        time,
        open,
        high,
        low,
        close,
        volume,
      });
      
      basePrice = close;
    }
    
    return data;
  };

  const [chartData] = useState(generateMockChartData());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ETF':
        return 'blue';
      case 'ConvertibleBond':
        return 'orange';
      case 'REIT':
        return 'green';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'ETF':
        return 'ETF基金';
      case 'ConvertibleBond':
        return '可转债';
      case 'REIT':
        return 'REITs';
      default:
        return '其他';
    }
  };

  const positionColumns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{getTypeText(type)}</Tag>
      ),
    },
    {
      title: '持仓',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number) => quantity.toLocaleString(),
    },
    {
      title: '成本价',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '现价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      width: 100,
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 120,
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
    {
      title: '盈亏',
      dataIndex: 'unrealizedPnL',
      key: 'unrealizedPnL',
      width: 120,
      render: (pnl: number, record: Position) => (
        <div>
          <Text type={pnl >= 0 ? 'success' : 'danger'}>
            ¥{pnl.toLocaleString()}
          </Text>
          <br />
          <Text type={record.unrealizedPnLPercent >= 0 ? 'success' : 'danger'} className={styles.pnlPercent}>
            {record.unrealizedPnLPercent >= 0 ? '+' : ''}{record.unrealizedPnLPercent.toFixed(2)}%
          </Text>
        </div>
      ),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight: number) => (
        <div>
          <Progress
            percent={weight}
            size="small"
            showInfo={false}
            strokeColor="#1890ff"
          />
          <Text className={styles.weightText}>{weight.toFixed(1)}%</Text>
        </div>
      ),
    },
  ];

  // 按类型分组统计
  const groupByType = positions.reduce((acc, position) => {
    const type = position.type;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        totalValue: 0,
        totalPnL: 0,
      };
    }
    acc[type].count++;
    acc[type].totalValue += position.marketValue;
    acc[type].totalPnL += position.unrealizedPnL;
    return acc;
  }, {} as Record<string, { count: number; totalValue: number; totalPnL: number }>);

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>投资组合</Title>
            <Text type="secondary">持仓管理 · 组合分析 · 再平衡</Text>
          </div>
          <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchPositions}>
            刷新
          </Button>
          <Button icon={<DownloadOutlined />}>
            导出
          </Button>
        </Space>
      </div>

      {/* 总览统计 */}
      <Row gutter={16} className={styles.metrics}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总资产"
              value={totalValue}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总盈亏"
              value={totalPnL}
              precision={0}
              prefix="¥"
              valueStyle={{ color: totalPnL >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="盈亏比例"
              value={totalPnLPercent}
              precision={2}
              suffix="%"
              valueStyle={{ color: totalPnLPercent >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="持仓数量"
              value={positions.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="组合概览" key="overview">
            <Row gutter={16}>
              {/* 持仓列表 */}
              <Col span={24}>
                <Card title="持仓明细" className={styles.positionCard}>
                  <Table
                    columns={positionColumns}
                    dataSource={positions}
                    rowKey="symbol"
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 1000 }}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="收益分析" key="performance">
            <Row gutter={16}>
              <Col span={16}>
                <Card title="收益曲线">
                  <LightWeightChart data={chartData} height={350} />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="类型分布">
                  {Object.entries(groupByType).map(([type, data]) => (
                    <div key={type} className={styles.typeItem}>
                      <div className={styles.typeHeader}>
                        <Tag color={getTypeColor(type)}>{getTypeText(type)}</Tag>
                        <Text>{data.count}只</Text>
                      </div>
                      <div className={styles.typeStats}>
                        <Text>市值: ¥{data.totalValue.toLocaleString()}</Text>
                        <Text type={data.totalPnL >= 0 ? 'success' : 'danger'}>
                          盈亏: ¥{data.totalPnL.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  ))}
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="风险分析" key="risk">
            <Row gutter={16}>
              <Col span={12}>
                <Card title="风险指标">
                  <div className={styles.riskMetrics}>
                    <div className={styles.riskItem}>
                      <Text strong>VaR (95%)</Text>
                      <Text type="danger">-2.5%</Text>
                    </div>
                    <div className={styles.riskItem}>
                      <Text strong>最大回撤</Text>
                      <Text type="danger">-8.2%</Text>
                    </div>
                    <div className={styles.riskItem}>
                      <Text strong>波动率</Text>
                      <Text>15.6%</Text>
                    </div>
                    <div className={styles.riskItem}>
                      <Text strong>夏普比率</Text>
                      <Text type="success">1.45</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="集中度分析">
                  <div className={styles.concentrationAnalysis}>
                    <Text>持仓集中度分析将在此显示</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="再平衡" key="rebalance">
            <Row gutter={16}>
              <Col span={24}>
                <Card title="组合再平衡">
                  <div className={styles.rebalanceSection}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>再平衡设置</Text>
                      </div>
                      <Space>
                        <Select defaultValue="monthly" style={{ width: 120 }}>
                          <Option value="daily">每日</Option>
                          <Option value="weekly">每周</Option>
                          <Option value="monthly">每月</Option>
                          <Option value="quarterly">每季度</Option>
                        </Select>
                        <RangePicker />
                        <Button type="primary">执行再平衡</Button>
                      </Space>
                      <div className={styles.rebalanceResult}>
                        <Text type="secondary">再平衡建议将在此显示</Text>
                      </div>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
      </div>
    </AppLayout>
  );
}
