'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Card, Tabs, Form, Input, InputNumber, Switch, Button, Select, Upload, Divider, Space, Alert, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined, ReloadOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons';
import styles from './page.module.css';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('保存设置:', values);
      // 这里处理保存逻辑
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <AppLayout>
      <div className={styles.settings}>
        <div className={styles.header}>
          <h1>设置中心</h1>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave}>
              保存设置
            </Button>
          </Space>
        </div>

        <Card className={styles.mainContent}>
          <Tabs defaultActiveKey="general" type="card">
            <TabPane tab="通用设置" key="general">
              <Form form={form} layout="vertical">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Card title="基本配置" size="small">
                      <Form.Item label="系统名称" name="systemName">
                        <Input placeholder="Be Rich 量化交易系统" />
                      </Form.Item>
                      <Form.Item label="默认语言" name="language">
                        <Select placeholder="选择语言">
                          <Option value="zh-CN">中文(简体)</Option>
                          <Option value="zh-TW">中文(繁體)</Option>
                          <Option value="en-US">English</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="时区" name="timezone">
                        <Select placeholder="选择时区">
                          <Option value="Asia/Shanghai">北京时间 (UTC+8)</Option>
                          <Option value="Asia/Hong_Kong">香港时间 (UTC+8)</Option>
                          <Option value="America/New_York">纽约时间 (UTC-5)</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="主题模式" name="theme">
                        <Select placeholder="选择主题">
                          <Option value="light">浅色模式</Option>
                          <Option value="dark">深色模式</Option>
                          <Option value="auto">跟随系统</Option>
                        </Select>
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="显示设置" size="small">
                      <Form.Item label="数据刷新间隔" name="refreshInterval">
                        <Select placeholder="选择刷新间隔">
                          <Option value={1000}>1秒</Option>
                          <Option value={5000}>5秒</Option>
                          <Option value={10000}>10秒</Option>
                          <Option value={30000}>30秒</Option>
                          <Option value={60000}>1分钟</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="小数位精度" name="decimalPlaces">
                        <InputNumber min={2} max={6} placeholder="2" />
                      </Form.Item>
                      <Form.Item label="启用动画效果" name="enableAnimation" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="启用声音提醒" name="enableSound" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="交易设置" key="trading">
              <Form form={form} layout="vertical">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Card title="交易参数" size="small">
                      <Form.Item label="默认交易数量" name="defaultQuantity">
                        <InputNumber min={1} style={{ width: '100%' }} placeholder="1000" />
                      </Form.Item>
                      <Form.Item label="止损比例 (%)" name="stopLossPercent">
                        <InputNumber min={0} max={50} step={0.1} style={{ width: '100%' }} placeholder="5.0" />
                      </Form.Item>
                      <Form.Item label="止盈比例 (%)" name="takeProfitPercent">
                        <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} placeholder="10.0" />
                      </Form.Item>
                      <Form.Item label="最大仓位比例 (%)" name="maxPositionPercent">
                        <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} placeholder="20" />
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="风险控制" size="small">
                      <Form.Item label="启用风险控制" name="enableRiskControl" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="最大回撤限制 (%)" name="maxDrawdownLimit">
                        <InputNumber min={0} max={50} step={0.1} style={{ width: '100%' }} placeholder="10.0" />
                      </Form.Item>
                      <Form.Item label="单日亏损限制 (%)" name="dailyLossLimit">
                        <InputNumber min={0} max={20} step={0.1} style={{ width: '100%' }} placeholder="5.0" />
                      </Form.Item>
                      <Form.Item label="启用下单确认" name="enableOrderConfirm" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="数据源" key="datasource">
              <Form form={form} layout="vertical">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Card title="行情数据源" size="small">
                      <Form.Item label="主数据源" name="primaryDataSource">
                        <Select placeholder="选择主数据源">
                          <Option value="tushare">Tushare</Option>
                          <Option value="jqdata">聚宽数据</Option>
                          <Option value="wind">万得数据</Option>
                          <Option value="choice">东方财富</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="备用数据源" name="backupDataSource">
                        <Select placeholder="选择备用数据源">
                          <Option value="tushare">Tushare</Option>
                          <Option value="jqdata">聚宽数据</Option>
                          <Option value="wind">万得数据</Option>
                          <Option value="choice">东方财富</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item label="API密钥" name="apiKey">
                        <Input.Password placeholder="请输入API密钥" />
                      </Form.Item>
                      <Form.Item label="连接超时 (秒)" name="connectionTimeout">
                        <InputNumber min={1} max={60} style={{ width: '100%' }} placeholder="10" />
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="数据缓存" size="small">
                      <Form.Item label="启用数据缓存" name="enableCache" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="缓存过期时间 (分钟)" name="cacheExpiry">
                        <InputNumber min={1} max={1440} style={{ width: '100%' }} placeholder="5" />
                      </Form.Item>
                      <Form.Item label="历史数据天数" name="historyDays">
                        <InputNumber min={1} max={365} style={{ width: '100%' }} placeholder="252" />
                      </Form.Item>
                      <Form.Item label="自动清理缓存" name="autoCleanCache" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="通知设置" key="notifications">
              <Form form={form} layout="vertical">
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Card title="消息通知" size="small">
                      <Form.Item label="启用桌面通知" name="enableDesktopNotification" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="启用邮件通知" name="enableEmailNotification" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="邮箱地址" name="emailAddress">
                        <Input type="email" placeholder="your@email.com" />
                      </Form.Item>
                      <Form.Item label="启用微信通知" name="enableWechatNotification" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="通知条件" size="small">
                      <Form.Item label="交易成交通知" name="notifyOnTrade" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="止损触发通知" name="notifyOnStopLoss" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="风险警告通知" name="notifyOnRiskWarning" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                      <Form.Item label="系统异常通知" name="notifyOnSystemError" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="数据管理" key="data">
              <div className={styles.dataManagement}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="数据导入" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Upload>
                          <Button icon={<UploadOutlined />}>导入策略配置</Button>
                        </Upload>
                        <Upload>
                          <Button icon={<UploadOutlined />}>导入持仓数据</Button>
                        </Upload>
                        <Upload>
                          <Button icon={<UploadOutlined />}>导入历史数据</Button>
                        </Upload>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="数据导出" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button icon={<ExportOutlined />} type="primary" ghost>
                          导出交易记录
                        </Button>
                        <Button icon={<ExportOutlined />} type="primary" ghost>
                          导出策略配置
                        </Button>
                        <Button icon={<ExportOutlined />} type="primary" ghost>
                          导出系统设置
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                </Row>
                
                <Divider />
                
                <Alert
                  message="数据备份建议"
                  description="建议定期备份交易数据和系统配置，确保数据安全。系统会自动进行日备份，您也可以手动导出重要数据。"
                  type="info"
                  showIcon
                />
              </div>
            </TabPane>

            <TabPane tab="系统信息" key="system">
              <div className={styles.systemInfo}>
                <Row gutter={[24, 24]}>
                  <Col span={12}>
                    <Card title="版本信息" size="small">
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>系统版本:</span>
                        <span className={styles.infoValue}>v1.0.0</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>构建时间:</span>
                        <span className={styles.infoValue}>2024-01-15 10:30:00</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Node.js版本:</span>
                        <span className={styles.infoValue}>v18.17.0</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>运行时间:</span>
                        <span className={styles.infoValue}>2天 3小时 45分钟</span>
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="系统状态" size="small">
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>CPU使用率:</span>
                        <span className={styles.infoValue}>15%</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>内存使用:</span>
                        <span className={styles.infoValue}>256MB / 2GB</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>磁盘空间:</span>
                        <span className={styles.infoValue}>2.5GB / 100GB</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>网络状态:</span>
                        <span className={styles.infoValue} style={{ color: '#52c41a' }}>正常</span>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
