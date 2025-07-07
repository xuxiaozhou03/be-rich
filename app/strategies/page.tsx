'use client';

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import BacktestPanel from '@/components/analysis/BacktestPanel';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  LineChartOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useStrategyStore } from '@/stores';
import type { Strategy, BacktestResult } from '@/lib/types';
import styles from './page.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

export default function StrategiesPage() {
  const {
    strategies,
    loading,
    error,
    fetchStrategies,
    addStrategy,
    updateStrategy,
    removeStrategy,
  } = useStrategyStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [backtestModalVisible, setBacktestModalVisible] = useState(false);
  const [backtestStrategy, setBacktestStrategy] = useState<Strategy | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleBacktest = (strategy: Strategy) => {
    setBacktestStrategy(strategy);
    setBacktestModalVisible(true);
  };

  const handleBacktestComplete = (result: BacktestResult) => {
    // 更新策略的回测结果
    if (backtestStrategy) {
      updateStrategy({
        ...backtestStrategy,
        returns: result.metrics.totalReturn * 100,
        maxDrawdown: result.metrics.maxDrawdown * 100,
        sharpeRatio: result.metrics.sharpeRatio,
        winRate: result.metrics.winRate,
        updatedAt: Date.now(),
      });
      message.success('策略回测完成，指标已更新');
    }
  };

  const handleAddStrategy = () => {
    setEditingStrategy(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    form.setFieldsValue(strategy);
    setIsModalVisible(true);
  };

  const handleDeleteStrategy = (strategyId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个策略吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        removeStrategy(strategyId);
        message.success('策略已删除');
      },
    });
  };

  const handleToggleStrategy = (strategy: Strategy) => {
    const newStatus = strategy.status === 'active' ? 'paused' : 'active';
    updateStrategy({
      ...strategy,
      status: newStatus,
      updatedAt: Date.now(),
    });
    message.success(`策略已${newStatus === 'active' ? '启动' : '暂停'}`);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingStrategy) {
        // 更新策略
        updateStrategy({
          ...editingStrategy,
          ...values,
          updatedAt: Date.now(),
        });
        message.success('策略更新成功');
      } else {
        // 新建策略
        const newStrategy: Strategy = {
          id: Date.now().toString(),
          ...values,
          status: 'inactive',
          returns: 0,
          maxDrawdown: 0,
          sharpeRatio: 0,
          winRate: 0,
          positions: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addStrategy(newStrategy);
        message.success('策略创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'paused':
        return 'orange';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '运行中';
      case 'paused':
        return '已暂停';
      case 'inactive':
        return '未启动';
      default:
        return '未知';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'trend':
        return '趋势策略';
      case 'momentum':
        return '动量策略';
      case 'value':
        return '价值策略';
      case 'arbitrage':
        return '套利策略';
      default:
        return '其他';
    }
  };

  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Strategy) => (
        <div>
          <div className={styles.strategyName}>{text}</div>
          <Text type="secondary" className={styles.strategyDesc}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getTypeText(type)}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '收益率',
      dataIndex: 'returns',
      key: 'returns',
      render: (returns: number) => (
        <Text type={returns >= 0 ? 'success' : 'danger'}>
          {returns >= 0 ? '+' : ''}{returns.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '最大回撤',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      render: (drawdown: number) => (
        <Text type="danger">{drawdown.toFixed(2)}%</Text>
      ),
    },
    {
      title: '夏普比率',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      render: (ratio: number) => ratio.toFixed(2),
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      render: (rate: number) => `${(rate * 100).toFixed(1)}%`,
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: Strategy) => (
        <Space size="small">
          <Button
            type="text"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStrategy(record)}
          >
            {record.status === 'active' ? '暂停' : '启动'}
          </Button>
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={() => handleEditStrategy(record)}
          >
            设置
          </Button>
          <Button
            type="text"
            icon={<LineChartOutlined />}
            onClick={() => handleBacktest(record)}
          >
            回测
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteStrategy(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const activeStrategies = strategies.filter(s => s.status === 'active').length;
  const totalReturn = strategies.reduce((sum, s) => sum + s.returns, 0) / strategies.length || 0;
  const avgSharpe = strategies.reduce((sum, s) => sum + s.sharpeRatio, 0) / strategies.length || 0;

  return (
    <AppLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Title level={2}>策略管理</Title>
            <Text type="secondary">策略列表 · 策略详情 · 策略回测</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStrategy}>
            新建策略
          </Button>
        </div>

      {/* 统计指标 */}
      <Row gutter={16} className={styles.metrics}>
        <Col span={6}>
          <Card>
            <Statistic
              title="策略总数"
              value={strategies.length}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中策略"
              value={activeStrategies}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均收益率"
              value={totalReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: totalReturn >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均夏普比率"
              value={avgSharpe}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 策略列表 */}
      <Card title="策略列表">
        <Table
          columns={columns}
          dataSource={strategies}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 新建/编辑策略模态框 */}
      <Modal
        title={editingStrategy ? '编辑策略' : '新建策略'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="策略名称"
            rules={[{ required: true, message: '请输入策略名称' }]}
          >
            <Input placeholder="请输入策略名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="策略描述"
            rules={[{ required: true, message: '请输入策略描述' }]}
          >
            <Input.TextArea placeholder="请输入策略描述" rows={3} />
          </Form.Item>

          <Form.Item
            name="type"
            label="策略类型"
            rules={[{ required: true, message: '请选择策略类型' }]}
          >
            <Select placeholder="请选择策略类型">
              <Option value="trend">趋势策略</Option>
              <Option value="momentum">动量策略</Option>
              <Option value="value">价值策略</Option>
              <Option value="arbitrage">套利策略</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 回测模态框 */}
      <Modal
        title={`策略回测 - ${backtestStrategy?.name}`}
        open={backtestModalVisible}
        onCancel={() => setBacktestModalVisible(false)}
        footer={null}
        width={1200}
        destroyOnClose
      >
        {backtestStrategy && (
          <BacktestPanel
            strategy={backtestStrategy}
            onBacktestComplete={handleBacktestComplete}
          />
        )}
      </Modal>
      </div>
    </AppLayout>
  );
}
