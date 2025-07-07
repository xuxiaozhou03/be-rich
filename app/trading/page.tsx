'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, Table, Button, Space, Tag, Row, Col, Select, Input, Form, Modal, InputNumber, Radio, Alert, Tabs, Progress } from 'antd';
import { PlusOutlined, SendOutlined, StopOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '@/stores';
import styles from './page.module.css';

const { TabPane } = Tabs;
const { Option } = Select;

interface Order {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  filledQuantity: number;
  averagePrice?: number;
  commission: number;
  timestamp: number;
  estimatedTotal: number;
}

interface Position {
  symbol: string;
  name: string;
  quantity: number;
  availableQuantity: number;
  averagePrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

const TradingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [tradeType, setTradeType] = useState('buy');

  const { positions } = usePortfolioStore();

  // 模拟订单数据
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      symbol: '510300',
      name: '沪深300ETF',
      type: 'buy',
      orderType: 'limit',
      quantity: 1000,
      price: 4.850,
      status: 'filled',
      filledQuantity: 1000,
      averagePrice: 4.848,
      commission: 4.85,
      timestamp: Date.now() - 3600000,
      estimatedTotal: 4850,
    },
    {
      id: '2',
      symbol: '113050',
      name: '南银转债',
      type: 'sell',
      orderType: 'market',
      quantity: 100,
      status: 'pending',
      filledQuantity: 0,
      commission: 0,
      timestamp: Date.now() - 1800000,
      estimatedTotal: 10850,
    },
    {
      id: '3',
      symbol: '508056',
      name: '博时蛇口产园REIT',
      type: 'buy',
      orderType: 'limit',
      quantity: 500,
      price: 3.480,
      status: 'partial',
      filledQuantity: 200,
      averagePrice: 3.482,
      commission: 1.74,
      timestamp: Date.now() - 900000,
      estimatedTotal: 1740,
    },
  ]);

  // 模拟持仓数据
  const mockPositions: Position[] = [
    {
      symbol: '510300',
      name: '沪深300ETF',
      quantity: 2000,
      availableQuantity: 2000,
      averagePrice: 4.825,
      currentPrice: 4.856,
      unrealizedPnL: 62,
      unrealizedPnLPercent: 0.64,
    },
    {
      symbol: '113050',
      name: '南银转债',
      quantity: 10,
      availableQuantity: 10,
      averagePrice: 108.50,
      currentPrice: 109.20,
      unrealizedPnL: 7,
      unrealizedPnLPercent: 0.65,
    },
    {
      symbol: '508056',
      name: '博时蛇口产园REIT',
      quantity: 200,
      availableQuantity: 200,
      averagePrice: 3.482,
      currentPrice: 3.486,
      unrealizedPnL: 0.8,
      unrealizedPnLPercent: 0.11,
    },
  ];

  // 获取订单状态颜色
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'filled': return 'green';
      case 'pending': return 'blue';
      case 'partial': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  // 获取订单状态文本
  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'filled': return '已成交';
      case 'pending': return '待成交';
      case 'partial': return '部分成交';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  // 获取交易类型颜色
  const getTradeTypeColor = (type: string) => {
    return type === 'buy' ? 'green' : 'red';
  };

  // 获取交易类型文本
  const getTradeTypeText = (type: string) => {
    return type === 'buy' ? '买入' : '卖出';
  };

  // 订单表格列定义
  const orderColumns = [
    {
      title: '标的',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string, record: Order) => (
        <div>
          <div className={styles.symbolCode}>{symbol}</div>
          <div className={styles.symbolName}>{record.name}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTradeTypeColor(type)}>
          {getTradeTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (orderType: string) => {
        const typeMap = {
          market: '市价单',
          limit: '限价单',
          stop: '止损单',
        };
        return <Tag>{typeMap[orderType as keyof typeof typeMap]}</Tag>;
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: Order) => (
        <div>
          <div>{quantity.toLocaleString()}</div>
          {record.filledQuantity > 0 && (
            <div className={styles.filledQuantity}>
              已成交: {record.filledQuantity.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Order) => (
        <div>
          {price ? `¥${price.toFixed(3)}` : '市价'}
          {record.averagePrice && (
            <div className={styles.averagePrice}>
              成交均价: ¥{record.averagePrice.toFixed(3)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Order) => (
        <div>
          <Tag color={getOrderStatusColor(status)}>
            {getOrderStatusText(status)}
          </Tag>
          {status === 'partial' && (
            <Progress
              percent={Math.round((record.filledQuantity / record.quantity) * 100)}
              size="small"
              showInfo={false}
              style={{ marginTop: 4 }}
            />
          )}
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'estimatedTotal',
      key: 'estimatedTotal',
      render: (total: number, record: Order) => (
        <div>
          <div>¥{total.toFixed(2)}</div>
          {record.commission > 0 && (
            <div className={styles.commission}>
              手续费: ¥{record.commission.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Order) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <Button
              type="link"
              icon={<StopOutlined />}
              onClick={() => handleCancelOrder(record.id)}
              danger
            >
              撤单
            </Button>
          )}
          {record.status === 'partial' && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleModifyOrder(record)}
            >
              修改
            </Button>
          )}
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOrder(record.id)}
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 持仓表格列定义
  const positionColumns = [
    {
      title: '标的',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol: string, record: Position) => (
        <div>
          <div className={styles.symbolCode}>{symbol}</div>
          <div className={styles.symbolName}>{record.name}</div>
        </div>
      ),
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: Position) => (
        <div>
          <div>{quantity.toLocaleString()}</div>
          <div className={styles.availableQuantity}>
            可用: {record.availableQuantity.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: '成本价',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '现价',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `¥${price.toFixed(3)}`,
    },
    {
      title: '市值',
      key: 'marketValue',
      render: (record: Position) => `¥${(record.quantity * record.currentPrice).toFixed(2)}`,
    },
    {
      title: '浮动盈亏',
      key: 'unrealizedPnL',
      render: (record: Position) => (
        <div>
          <div className={record.unrealizedPnL >= 0 ? styles.profit : styles.loss}>
            ¥{record.unrealizedPnL.toFixed(2)}
          </div>
          <div className={record.unrealizedPnLPercent >= 0 ? styles.profit : styles.loss}>
            {record.unrealizedPnLPercent >= 0 ? '+' : ''}{record.unrealizedPnLPercent.toFixed(2)}%
          </div>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Position) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            onClick={() => handleTrade(record.symbol, 'buy')}
          >
            买入
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => handleTrade(record.symbol, 'sell')}
          >
            卖出
          </Button>
        </Space>
      ),
    },
  ];

  // 处理下单
  const handleSubmitOrder = () => {
    form.validateFields().then(values => {
      const newOrder: Order = {
        id: Date.now().toString(),
        symbol: values.symbol,
        name: values.name,
        type: tradeType as 'buy' | 'sell',
        orderType: orderType as 'market' | 'limit' | 'stop',
        quantity: values.quantity,
        price: values.price,
        stopPrice: values.stopPrice,
        status: 'pending',
        filledQuantity: 0,
        commission: 0,
        timestamp: Date.now(),
        estimatedTotal: values.quantity * (values.price || 0),
      };
      
      setOrders([...orders, newOrder]);
      setIsOrderModalVisible(false);
      form.resetFields();
    });
  };

  // 处理撤单
  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' } : order
    ));
  };

  // 处理修改订单
  const handleModifyOrder = (order: Order) => {
    // 打开修改订单模态框
    setIsOrderModalVisible(true);
    form.setFieldsValue(order);
  };

  // 处理删除订单
  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // 处理交易
  const handleTrade = (symbol: string, type: 'buy' | 'sell') => {
    setSelectedSymbol(symbol);
    setTradeType(type);
    setIsOrderModalVisible(true);
    form.setFieldsValue({ symbol, type });
  };

  // 计算订单统计
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    filled: orders.filter(o => o.status === 'filled').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <AppLayout>
      <div className={styles.trading}>
        <div className={styles.header}>
        <h1>交易执行</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsOrderModalVisible(true)}
        >
          新建订单
        </Button>
      </div>

      {/* 交易统计 */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col span={6}>
          <Card>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{orderStats.total}</div>
              <div className={styles.statLabel}>总订单数</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#1890ff' }}>
                {orderStats.pending}
              </div>
              <div className={styles.statLabel}>待成交</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#52c41a' }}>
                {orderStats.filled}
              </div>
              <div className={styles.statLabel}>已成交</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.statCard}>
              <div className={styles.statValue} style={{ color: '#ff4d4f' }}>
                {orderStats.cancelled}
              </div>
              <div className={styles.statLabel}>已撤单</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容 */}
      <Card className={styles.mainContent}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
          <TabPane tab={`订单管理 (${orders.length})`} key="orders">
            <Table
              columns={orderColumns}
              dataSource={orders}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab={`持仓管理 (${mockPositions.length})`} key="positions">
            <Table
              columns={positionColumns}
              dataSource={mockPositions}
              rowKey="symbol"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
            />
          </TabPane>

          <TabPane tab="交易记录" key="trades">
            <Alert
              message="交易记录"
              description="这里显示所有已完成的交易记录，包括成交价格、数量、手续费等详细信息。"
              type="info"
              showIcon
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 下单Modal */}
      <Modal
        title="新建订单"
        visible={isOrderModalVisible}
        onOk={handleSubmitOrder}
        onCancel={() => {
          setIsOrderModalVisible(false);
          form.resetFields();
        }}
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="标的代码" 
                name="symbol" 
                rules={[{ required: true, message: '请输入标的代码' }]}
              >
                <Input placeholder="请输入标的代码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="标的名称" 
                name="name" 
                rules={[{ required: true, message: '请输入标的名称' }]}
              >
                <Input placeholder="请输入标的名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="交易类型" name="type">
            <Radio.Group 
              value={tradeType} 
              onChange={(e) => setTradeType(e.target.value)}
            >
              <Radio.Button value="buy">买入</Radio.Button>
              <Radio.Button value="sell">卖出</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="订单类型" name="orderType">
            <Radio.Group 
              value={orderType} 
              onChange={(e) => setOrderType(e.target.value)}
            >
              <Radio.Button value="market">市价单</Radio.Button>
              <Radio.Button value="limit">限价单</Radio.Button>
              <Radio.Button value="stop">止损单</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="数量" 
                name="quantity" 
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="请输入数量"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              {(orderType === 'limit' || orderType === 'stop') && (
                <Form.Item 
                  label="价格" 
                  name="price"
                  rules={[{ required: true, message: '请输入价格' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="请输入价格"
                    min={0}
                    step={0.001}
                    precision={3}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {orderType === 'stop' && (
            <Form.Item 
              label="止损价格" 
              name="stopPrice"
              rules={[{ required: true, message: '请输入止损价格' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入止损价格"
                min={0}
                step={0.001}
                precision={3}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
      </div>
    </AppLayout>
  );
};

export default TradingPage;
