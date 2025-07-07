'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Table, Tag, Space, Button, Statistic, Row, Col, Switch, message, Typography } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { useMarketStore } from '@/stores';
import type { MarketData, ETFData, ConvertibleBondData, REITData } from '@/lib/types';
import styles from './RealTimeData.module.css';

const { Title, Text } = Typography;

interface RealTimeDataProps {
  refreshInterval?: number;
  autoRefresh?: boolean;
}

const RealTimeData: React.FC<RealTimeDataProps> = ({ 
  refreshInterval = 5000, 
  autoRefresh = true 
}) => {
  const { marketData, etfData, convertibleBondData, reitData, loading, fetchMarketData } = useMarketStore();
  const [isStreaming, setIsStreaming] = useState(autoRefresh);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // 数据更新函数
  const updateData = useCallback(async () => {
    try {
      await fetchMarketData();
      setLastUpdate(new Date());
    } catch (error) {
      console.error('数据更新失败:', error);
      message.error('数据更新失败');
    }
  }, [fetchMarketData]);

  // 启动/停止实时数据流
  const toggleStreaming = () => {
    if (isStreaming) {
      // 停止流
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsStreaming(false);
      message.info('实时数据流已停止');
    } else {
      // 启动流
      const id = setInterval(updateData, refreshInterval);
      setIntervalId(id);
      setIsStreaming(true);
      updateData(); // 立即更新一次
      message.success('实时数据流已启动');
    }
  };

  // 手动刷新
  const handleRefresh = () => {
    updateData();
  };

  // 组件挂载时启动数据流
  useEffect(() => {
    if (autoRefresh) {
      updateData();
      const id = setInterval(updateData, refreshInterval);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // 格式化变化百分比
  const formatChangePercent = (value: number) => {
    const color = value >= 0 ? '#52c41a' : '#f5222d';
    const prefix = value >= 0 ? '+' : '';
    return <span style={{ color }}>{prefix}{value.toFixed(2)}%</span>;
  };

  // 格式化价格变化
  const formatChange = (value: number) => {
    const color = value >= 0 ? '#52c41a' : '#f5222d';
    const prefix = value >= 0 ? '+' : '';
    return <span style={{ color }}>{prefix}{value.toFixed(3)}</span>;
  };

  // ETF 表格列
  const etfColumns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 80,
      render: formatChange,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 80,
      render: formatChangePercent,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      render: (volume: number) => `${(volume / 10000).toFixed(0)}万`,
    },
    {
      title: '净值',
      dataIndex: 'nav',
      key: 'nav',
      width: 80,
      render: (nav: number) => `¥${nav.toFixed(4)}`,
    },
    {
      title: '溢价率',
      dataIndex: 'premium',
      key: 'premium',
      width: 80,
      render: (premium: number) => formatChangePercent(premium),
    },
  ];

  // 可转债表格列
  const bondColumns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 80,
      render: formatChange,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 80,
      render: formatChangePercent,
    },
    {
      title: '转股溢价率',
      dataIndex: 'conversionPremium',
      key: 'conversionPremium',
      width: 100,
      render: (premium: number) => formatChangePercent(premium),
    },
    {
      title: '信用评级',
      dataIndex: 'creditRating',
      key: 'creditRating',
      width: 80,
      render: (rating: string) => <Tag color="blue">{rating}</Tag>,
    },
  ];

  // REIT 表格列
  const reitColumns = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 80,
      render: formatChange,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 80,
      render: formatChangePercent,
    },
    {
      title: '分派收益率',
      dataIndex: 'dividendYield',
      key: 'dividendYield',
      width: 100,
      render: (dividendYield: number) => `${dividendYield.toFixed(2)}%`,
    },
    {
      title: '物业类型',
      dataIndex: 'propertyType',
      key: 'propertyType',
      width: 100,
      render: (type: string) => <Tag color="purple">{type}</Tag>,
    },
  ];

  // 统计数据
  const totalCount = etfData.length + convertibleBondData.length + reitData.length;
  const risingCount = [...etfData, ...convertibleBondData, ...reitData].filter(item => item.changePercent > 0).length;
  const fallingCount = [...etfData, ...convertibleBondData, ...reitData].filter(item => item.changePercent < 0).length;
  const avgChange = totalCount > 0 ? [...etfData, ...convertibleBondData, ...reitData].reduce((sum, item) => sum + item.changePercent, 0) / totalCount : 0;

  return (
    <div className={styles.container}>
      {/* 控制面板 */}
      <Card className={styles.controlPanel}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>实时行情数据</Title>
            <Text type="secondary">
              {lastUpdate ? `最后更新: ${lastUpdate.toLocaleTimeString()}` : '正在加载数据...'}
            </Text>
          </Col>
          <Col>
            <Space>
              <Switch
                checked={isStreaming}
                onChange={toggleStreaming}
                checkedChildren="实时"
                unCheckedChildren="停止"
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={loading}
              >
                刷新
              </Button>
              <Button icon={<SettingOutlined />}>
                设置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 市场概览 */}
      <Card title="市场概览" className={styles.marketOverview}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总品种数" value={totalCount} />
          </Col>
          <Col span={6}>
            <Statistic 
              title="上涨品种" 
              value={risingCount} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="下跌品种" 
              value={fallingCount} 
              valueStyle={{ color: '#f5222d' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="平均涨跌幅" 
              value={avgChange}
              precision={2}
              suffix="%"
              valueStyle={{ color: avgChange >= 0 ? '#52c41a' : '#f5222d' }}
            />
          </Col>
        </Row>
      </Card>

      {/* ETF 数据 */}
      <Card title="ETF 行情" className={styles.dataTable}>
        <Table
          columns={etfColumns}
          dataSource={etfData}
          rowKey="symbol"
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>

      {/* 可转债数据 */}
      <Card title="可转债行情" className={styles.dataTable}>
        <Table
          columns={bondColumns}
          dataSource={convertibleBondData}
          rowKey="symbol"
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>

      {/* REIT 数据 */}
      <Card title="REIT 行情" className={styles.dataTable}>
        <Table
          columns={reitColumns}
          dataSource={reitData}
          rowKey="symbol"
          pagination={false}
          scroll={{ x: 800 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default RealTimeData;
