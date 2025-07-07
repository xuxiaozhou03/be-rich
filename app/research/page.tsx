'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, Tabs, Table, Input, Button, Space, Tag, Row, Col, Select, DatePicker, Modal, Form, InputNumber, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined, BarChartOutlined, LineChartOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import LightWeightChart from '@/components/charts/LightWeightChart';
import { calculateMA, calculateRSI, calculateBollingerBands } from '@/lib/calculations/indicators';
import styles from './page.module.css';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ResearchReport {
  id: string;
  title: string;
  type: 'market' | 'individual' | 'sector' | 'strategy';
  target: string;
  conclusion: 'buy' | 'hold' | 'sell';
  rating: number;
  analyst: string;
  publishDate: string;
  tags: string[];
  summary: string;
}

const ResearchPlatformPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ResearchReport | null>(null);
  const [form] = Form.useForm();

  // 模拟研究报告数据
  const mockReports: ResearchReport[] = [
    {
      id: '1',
      title: '沪深300ETF投资价值分析',
      type: 'individual',
      target: '510300',
      conclusion: 'buy',
      rating: 4.5,
      analyst: '张三',
      publishDate: '2024-01-15',
      tags: ['ETF', '大盘', '价值投资'],
      summary: '基于当前市场估值和宏观经济环境，沪深300ETF具有较好的投资价值...',
    },
    {
      id: '2',
      title: '可转债市场2024年展望',
      type: 'market',
      target: '可转债',
      conclusion: 'hold',
      rating: 3.8,
      analyst: '李四',
      publishDate: '2024-01-12',
      tags: ['可转债', '市场分析', '2024展望'],
      summary: '2024年可转债市场预计将呈现结构性机会，建议关注优质标的...',
    },
    {
      id: '3',
      title: 'REITs投资机会深度解析',
      type: 'sector',
      target: 'REITs',
      conclusion: 'buy',
      rating: 4.2,
      analyst: '王五',
      publishDate: '2024-01-10',
      tags: ['REITs', '房地产', '分红收益'],
      summary: '随着REITs市场的不断成熟，基础设施REITs展现出良好的投资价值...',
    },
    {
      id: '4',
      title: '量化策略表现回顾与优化',
      type: 'strategy',
      target: '趋势策略',
      conclusion: 'hold',
      rating: 3.5,
      analyst: '赵六',
      publishDate: '2024-01-08',
      tags: ['量化', '策略优化', '回测'],
      summary: '对现有趋势策略进行深度回顾，发现在震荡市中表现有待提升...',
    },
    {
      id: '5',
      title: '新能源ETF行业分析',
      type: 'sector',
      target: '516160',
      conclusion: 'hold',
      rating: 3.7,
      analyst: '钱七',
      publishDate: '2024-01-05',
      tags: ['新能源', 'ETF', '行业分析'],
      summary: '新能源行业基本面依然良好，但短期内可能面临调整压力...',
    },
  ];

  const getConclusionColor = (conclusion: string) => {
    switch (conclusion) {
      case 'buy': return 'green';
      case 'hold': return 'blue';
      case 'sell': return 'red';
      default: return 'default';
    }
  };

  const getConclusionText = (conclusion: string) => {
    switch (conclusion) {
      case 'buy': return '买入';
      case 'hold': return '持有';
      case 'sell': return '卖出';
      default: return '未知';
    }
  };

  const reportColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: ResearchReport) => (
        <div>
          <a 
            href="#" 
            onClick={() => {
              setSelectedReport(record);
              setIsModalVisible(true);
            }}
            className={styles.reportTitle}
          >
            {text}
          </a>
          <div className={styles.reportMeta}>
            {record.analyst} · {record.publishDate}
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          'market': '市场',
          'individual': '个股',
          'sector': '行业',
          'strategy': '策略',
        };
        return <Tag>{typeMap[type as keyof typeof typeMap]}</Tag>;
      },
    },
    {
      title: '标的',
      dataIndex: 'target',
      key: 'target',
      render: (target: string) => <Tag color="blue">{target}</Tag>,
    },
    {
      title: '结论',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (conclusion: string) => (
        <Tag color={getConclusionColor(conclusion)}>
          {getConclusionText(conclusion)}
        </Tag>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className={styles.rating}>
          {'★'.repeat(Math.floor(rating))}
          {'☆'.repeat(5 - Math.floor(rating))}
          <span className={styles.ratingNumber}>{rating}</span>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className={styles.tags}>
          {tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ResearchReport) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedReport(record);
              setIsModalVisible(true);
            }}
          >
            查看
          </Button>
          <Button type="link" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" icon={<DeleteOutlined />} danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 过滤报告数据
  const filteredReports = mockReports.filter(report => {
    const matchesKeyword = !searchKeyword || 
      report.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      report.target.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      report.analyst.toLowerCase().includes(searchKeyword.toLowerCase());
    
    const matchesType = selectedType === 'all' || report.type === selectedType;
    
    return matchesKeyword && matchesType;
  });

  // 模拟K线数据用于技术分析
  const mockKLineData = [
    { time: Date.now() - 30 * 24 * 3600 * 1000, open: 4.8, high: 4.95, low: 4.75, close: 4.85, volume: 1000000 },
    { time: Date.now() - 25 * 24 * 3600 * 1000, open: 4.85, high: 4.92, low: 4.78, close: 4.88, volume: 1200000 },
    { time: Date.now() - 20 * 24 * 3600 * 1000, open: 4.88, high: 4.98, low: 4.82, close: 4.92, volume: 1100000 },
    { time: Date.now() - 15 * 24 * 3600 * 1000, open: 4.92, high: 5.05, low: 4.87, close: 4.95, volume: 1300000 },
    { time: Date.now() - 10 * 24 * 3600 * 1000, open: 4.95, high: 5.08, low: 4.91, close: 5.02, volume: 1050000 },
    { time: Date.now() - 5 * 24 * 3600 * 1000, open: 5.02, high: 5.12, low: 4.98, close: 5.08, volume: 1150000 },
    { time: Date.now(), open: 5.08, high: 5.15, low: 5.05, close: 5.12, volume: 1000000 },
  ];

  const handleCreateReport = () => {
    form.validateFields().then(values => {
      console.log('创建报告:', values);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <AppLayout>
      <div className={styles.researchPlatform}>
        <div className={styles.header}>
        <h1>研究平台</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          新建报告
        </Button>
      </div>

      <Card className={styles.mainContent}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab="研究报告" key="reports">
            <div className={styles.filterSection}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Search
                    placeholder="搜索报告标题、标的或分析师"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onSearch={setSearchKeyword}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    value={selectedType}
                    onChange={setSelectedType}
                    style={{ width: '100%' }}
                  >
                    <Option value="all">全部类型</Option>
                    <Option value="market">市场分析</Option>
                    <Option value="individual">个股分析</Option>
                    <Option value="sector">行业分析</Option>
                    <Option value="strategy">策略分析</Option>
                  </Select>
                </Col>
                <Col span={6}>
                  <RangePicker style={{ width: '100%' }} />
                </Col>
                <Col span={6}>
                  <Space>
                    <Button icon={<BarChartOutlined />}>
                      统计分析
                    </Button>
                    <Button icon={<LineChartOutlined />}>
                      趋势分析
                    </Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Table
              columns={reportColumns}
              dataSource={filteredReports}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="技术分析" key="technical">
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Card title="价格走势" extra={<Button type="link">更多指标</Button>}>
                  <LightWeightChart
                    data={mockKLineData}
                    height={400}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="技术指标" size="small">
                  <div className={styles.technicalIndicators}>
                    <div className={styles.indicator}>
                      <span className={styles.indicatorName}>MA5:</span>
                      <span className={styles.indicatorValue}>4.95</span>
                    </div>
                    <div className={styles.indicator}>
                      <span className={styles.indicatorName}>MA10:</span>
                      <span className={styles.indicatorValue}>4.92</span>
                    </div>
                    <div className={styles.indicator}>
                      <span className={styles.indicatorName}>MA20:</span>
                      <span className={styles.indicatorValue}>4.88</span>
                    </div>
                    <div className={styles.indicator}>
                      <span className={styles.indicatorName}>RSI:</span>
                      <span className={styles.indicatorValue}>68.5</span>
                    </div>
                    <div className={styles.indicator}>
                      <span className={styles.indicatorName}>MACD:</span>
                      <span className={styles.indicatorValue}>0.025</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="策略回测" key="backtest">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="回测配置">
                  <Form layout="vertical">
                    <Form.Item label="策略名称">
                      <Input placeholder="请输入策略名称" />
                    </Form.Item>
                    <Form.Item label="回测期间">
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="初始资金">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入初始资金"
                        formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\¥\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                    <Form.Item label="手续费率">
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="请输入手续费率"
                        min={0}
                        max={1}
                        step={0.0001}
                        addonAfter="%"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" block>
                        开始回测
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="回测结果">
                  <div className={styles.backtestResults}>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>总收益率:</span>
                      <span className={styles.resultValue}>+15.6%</span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>年化收益率:</span>
                      <span className={styles.resultValue}>+12.3%</span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>最大回撤:</span>
                      <span className={styles.resultValue}>-8.2%</span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>夏普比率:</span>
                      <span className={styles.resultValue}>1.45</span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>胜率:</span>
                      <span className={styles.resultValue}>68.5%</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* 报告详情Modal */}
      <Modal
        title={selectedReport ? `${selectedReport.title}` : '新建报告'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedReport(null);
          form.resetFields();
        }}
        footer={selectedReport ? null : [
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleCreateReport}>
            创建
          </Button>,
        ]}
        width={800}
      >
        {selectedReport ? (
          <div className={styles.reportDetail}>
            <div className={styles.reportHeader}>
              <Tag color={getConclusionColor(selectedReport.conclusion)}>
                {getConclusionText(selectedReport.conclusion)}
              </Tag>
              <div className={styles.rating}>
                {'★'.repeat(Math.floor(selectedReport.rating))}
                {'☆'.repeat(5 - Math.floor(selectedReport.rating))}
                <span className={styles.ratingNumber}>{selectedReport.rating}</span>
              </div>
            </div>
            <div className={styles.reportMeta}>
              <span>分析师: {selectedReport.analyst}</span>
              <span>发布日期: {selectedReport.publishDate}</span>
              <span>标的: {selectedReport.target}</span>
            </div>
            <div className={styles.reportTags}>
              {selectedReport.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className={styles.reportContent}>
              <h4>摘要</h4>
              <p>{selectedReport.summary}</p>
            </div>
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item label="报告标题" name="title" rules={[{ required: true, message: '请输入报告标题' }]}>
              <Input placeholder="请输入报告标题" />
            </Form.Item>
            <Form.Item label="报告类型" name="type" rules={[{ required: true, message: '请选择报告类型' }]}>
              <Select placeholder="请选择报告类型">
                <Option value="market">市场分析</Option>
                <Option value="individual">个股分析</Option>
                <Option value="sector">行业分析</Option>
                <Option value="strategy">策略分析</Option>
              </Select>
            </Form.Item>
            <Form.Item label="分析标的" name="target" rules={[{ required: true, message: '请输入分析标的' }]}>
              <Input placeholder="请输入分析标的" />
            </Form.Item>
            <Form.Item label="投资建议" name="conclusion" rules={[{ required: true, message: '请选择投资建议' }]}>
              <Select placeholder="请选择投资建议">
                <Option value="buy">买入</Option>
                <Option value="hold">持有</Option>
                <Option value="sell">卖出</Option>
              </Select>
            </Form.Item>
            <Form.Item label="评分" name="rating" rules={[{ required: true, message: '请输入评分' }]}>
              <InputNumber min={1} max={5} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="标签" name="tags">
              <Select mode="tags" placeholder="请输入标签">
                <Option value="ETF">ETF</Option>
                <Option value="可转债">可转债</Option>
                <Option value="REIT">REIT</Option>
                <Option value="量化">量化</Option>
                <Option value="价值投资">价值投资</Option>
              </Select>
            </Form.Item>
            <Form.Item label="报告摘要" name="summary">
              <Input.TextArea rows={4} placeholder="请输入报告摘要" />
            </Form.Item>
          </Form>
        )}
      </Modal>
      </div>
    </AppLayout>
  );
};

export default ResearchPlatformPage;
