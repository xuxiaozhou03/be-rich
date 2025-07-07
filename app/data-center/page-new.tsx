'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import RealTimeData from '@/components/data/RealTimeData';
import { Card, Tabs, Button, Space, DatePicker, Select, Statistic, Row, Col, Tag, Typography } from 'antd';
import { ReloadOutlined, DownloadOutlined, SyncOutlined, CloudSyncOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useMarketStore } from '@/stores';
import styles from './page.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const DataCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1d');
  const [syncStatus, setSyncStatus] = useState('success');
  
  const { etfData, convertibleBondData, reitData, fetchMarketData } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const handleRefreshData = async () => {
    setLoading(true);
    setSyncStatus('loading');
    try {
      await fetchMarketData();
      setSyncStatus('success');
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // 实现数据导出功能
    const allData = {
      etfData,
      convertibleBondData,
      reitData,
      exportTime: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'loading':
        return <SyncOutlined spin />;
      case 'success':
        return <CloudSyncOutlined style={{ color: '#52c41a' }} />;
      case 'error':
        return <CloudSyncOutlined style={{ color: '#f5222d' }} />;
      default:
        return <CloudSyncOutlined />;
    }
  };

  const dataStats = {
    etfCount: etfData.length,
    bondCount: convertibleBondData.length,
    reitCount: reitData.length,
    totalCount: etfData.length + convertibleBondData.length + reitData.length,
  };

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>数据中心</Title>
            <Text type="secondary">实时行情 · 历史数据 · 数据分析 · 数据导出</Text>
          </div>
          <Space>
            <Button 
              icon={getSyncStatusIcon()} 
              onClick={handleRefreshData}
              loading={loading}
            >
              同步数据
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportData}>
              导出数据
            </Button>
          </Space>
        </div>

        {/* 数据概览 */}
        <Card className={styles.overview}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic 
                title="ETF 数量" 
                value={dataStats.etfCount}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="可转债数量" 
                value={dataStats.bondCount}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="REIT 数量" 
                value={dataStats.reitCount}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col span={6}>
              <Statistic 
                title="总数据量" 
                value={dataStats.totalCount}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 数据模块 */}
        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'realtime',
                label: (
                  <span>
                    <SyncOutlined />
                    实时行情
                  </span>
                ),
                children: (
                  <RealTimeData 
                    refreshInterval={5000}
                    autoRefresh={true}
                  />
                ),
              },
              {
                key: 'historical',
                label: (
                  <span>
                    <DatabaseOutlined />
                    历史数据
                  </span>
                ),
                children: (
                  <div className={styles.historicalData}>
                    <Card title="历史数据查询">
                      <Row gutter={16}>
                        <Col span={8}>
                          <Select
                            placeholder="选择数据类型"
                            style={{ width: '100%' }}
                            defaultValue="all"
                          >
                            <Option value="all">全部数据</Option>
                            <Option value="etf">ETF数据</Option>
                            <Option value="bond">可转债数据</Option>
                            <Option value="reit">REIT数据</Option>
                          </Select>
                        </Col>
                        <Col span={8}>
                          <RangePicker style={{ width: '100%' }} />
                        </Col>
                        <Col span={8}>
                          <Button type="primary" style={{ width: '100%' }}>
                            查询历史数据
                          </Button>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16, padding: 20, background: '#f5f5f5', borderRadius: 6 }}>
                        <Text type="secondary">
                          历史数据功能正在开发中，敬请期待...
                        </Text>
                      </div>
                    </Card>
                  </div>
                ),
              },
              {
                key: 'analytics',
                label: (
                  <span>
                    <DatabaseOutlined />
                    数据分析
                  </span>
                ),
                children: (
                  <div className={styles.analyticsData}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Card title="数据质量分析">
                          <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 6 }}>
                            <Text type="secondary">
                              数据质量分析功能正在开发中...
                            </Text>
                          </div>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="数据趋势分析">
                          <div style={{ padding: 20, background: '#f5f5f5', borderRadius: 6 }}>
                            <Text type="secondary">
                              数据趋势分析功能正在开发中...
                            </Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
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

export default DataCenterPage;
