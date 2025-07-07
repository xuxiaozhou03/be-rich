'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Progress,
  Tag,
  Button,
  Space,
} from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  DashboardOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { usePortfolioStore, useMarketStore, useStrategyStore } from '@/stores';
import LightWeightChart from '@/components/charts/LightWeightChart';
import type { CandleData } from '@/lib/types';
import styles from './Dashboard.module.css';

const { Title, Text } = Typography;

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const { positions, totalValue, totalPnL, totalPnLPercent, fetchPositions } = usePortfolioStore();
  const { etfData, convertibleBondData, reitData, fetchMarketData } = useMarketStore();
  const { strategies } = useStrategyStore();

  useEffect(() => {
    fetchPositions();
    fetchMarketData();
  }, [fetchPositions, fetchMarketData]);

  // 计算活跃策略数量
  const activeStrategies = strategies.filter(s => s.status === 'active').length;

  // 生成模拟图表数据
  const generateChartData = (): CandleData[] => {
    const data: CandleData[] = [];
    let basePrice = 100;
    const days = 30;
    
    for (let i = 0; i < days; i++) {
      const change = (Math.random() - 0.5) * 4;
      basePrice += change;
      const high = basePrice + Math.random() * 2;
      const low = basePrice - Math.random() * 2;
      
      data.push({
        time: Date.now() / 1000 - (days - i) * 24 * 60 * 60,
        open: basePrice,
        high,
        low,
        close: basePrice,
        volume: Math.floor(Math.random() * 1000000),
      });
    }
    
    return data;
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchPositions(), fetchMarketData()]);
    } catch (error) {
      console.error('刷新数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 持仓概览表格列
  const columns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const color = type === 'ETF' ? 'blue' : type === 'ConvertibleBond' ? 'green' : 'purple';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => quantity.toLocaleString(),
    },
    {
      title: '现价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '盈亏',
      dataIndex: 'unrealizedPnL',
      key: 'unrealizedPnL',
      render: (pnl: number) => (
        <Text type={pnl >= 0 ? 'success' : 'danger'}>
          {pnl >= 0 ? '+' : ''}¥{pnl.toLocaleString()}
        </Text>
      ),
    },
    {
      title: '盈亏比例',
      dataIndex: 'unrealizedPnLPercent',
      key: 'unrealizedPnLPercent',
      render: (percent: number) => (
        <Text type={percent >= 0 ? 'success' : 'danger'}>
          {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
  ];

  return (
    <AppLayout>
      <div className={styles.dashboardContent}>
        {/* 页面标题 */}
        <div className={styles.pageHeader}>
          <div>
            <Title level={2}>仪表盘</Title>
            <Text type="secondary">实时监控 · 快速操作</Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
              刷新数据
            </Button>
          </Space>
        </div>

        {/* 关键指标 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总资产"
                value={totalValue}
                precision={2}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DashboardOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总盈亏"
                value={totalPnL}
                precision={2}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
                valueStyle={{ color: totalPnL >= 0 ? '#3f8600' : '#cf1322' }}
                prefix={totalPnL >= 0 ? <RiseOutlined /> : <FallOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="收益率"
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
                title="活跃策略"
                value={activeStrategies}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 市场概览 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card title="ETF 概览" size="small">
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic title="总数" value={etfData.length} />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="上涨数量" 
                    value={etfData.filter(item => item.changePercent > 0).length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="可转债概览" size="small">
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic title="总数" value={convertibleBondData.length} />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="上涨数量" 
                    value={convertibleBondData.filter(item => item.changePercent > 0).length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="REIT 概览" size="small">
              <Row gutter={8}>
                <Col span={12}>
                  <Statistic title="总数" value={reitData.length} />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="上涨数量" 
                    value={reitData.filter(item => item.changePercent > 0).length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* 持仓概览 */}
        <Card title="持仓概览" style={{ marginBottom: 24 }} 
              extra={<Text type="secondary">共 {positions.length} 个持仓</Text>}>
          <Table
            columns={columns}
            dataSource={positions}
            rowKey="symbol"
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
          />
        </Card>

        {/* 图表区域 */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="收益曲线" extra={<Text type="secondary">近30天</Text>}>
              <div style={{ height: 300 }}>
                <LightWeightChart data={generateChartData()} />
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="风险监控">
              <div className={styles.riskMetrics}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div className={styles.riskItem}>
                      <Text type="secondary">组合波动率</Text>
                      <div>
                        <Text strong>15.8%</Text>
                        <Progress 
                          percent={15.8} 
                          size="small" 
                          status="normal"
                          strokeColor="#1890ff"
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.riskItem}>
                      <Text type="secondary">最大回撤</Text>
                      <div>
                        <Text strong type="danger">-5.2%</Text>
                        <Progress 
                          percent={5.2} 
                          size="small" 
                          status="exception"
                          strokeColor="#f5222d"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <div className={styles.riskItem}>
                      <Text type="secondary">夏普比率</Text>
                      <div>
                        <Text strong>1.35</Text>
                        <Progress 
                          percent={67.5} 
                          size="small" 
                          status="success"
                          strokeColor="#52c41a"
                        />
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.riskItem}>
                      <Text type="secondary">Beta系数</Text>
                      <div>
                        <Text strong>0.89</Text>
                        <Progress 
                          percent={89} 
                          size="small" 
                          status="normal"
                          strokeColor="#722ed1"
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </AppLayout>
  );
}
