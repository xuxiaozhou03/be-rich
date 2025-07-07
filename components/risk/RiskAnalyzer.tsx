'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Alert, Table, Tag, Button, Space, Slider, InputNumber, Form, Select, Typography, Tooltip } from 'antd';
import { WarningOutlined, SafetyOutlined, DashboardOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { usePortfolioStore } from '@/stores';
import type { RiskMetrics, Position } from '@/lib/types';
import styles from './RiskAnalyzer.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface RiskAnalyzerProps {
  portfolioValue?: number;
  positions?: Position[];
}

const RiskAnalyzer: React.FC<RiskAnalyzerProps> = ({ portfolioValue = 0, positions = [] }) => {
  const { positions: storePositions, totalValue } = usePortfolioStore();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [riskTolerance, setRiskTolerance] = useState(5); // 1-10 scale
  const [stressTestResults, setStressTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const currentPositions = positions.length > 0 ? positions : storePositions;
  const currentValue = portfolioValue > 0 ? portfolioValue : totalValue;

  // 计算风险指标
  const calculateRiskMetrics = () => {
    if (!currentPositions.length) return null;

    // 模拟风险计算
    const weights = currentPositions.map(p => p.weight / 100);
    const returns = currentPositions.map(p => p.unrealizedPnLPercent / 100);
    
    // 计算组合波动率
    const portfolioReturn = returns.reduce((sum, ret, i) => sum + ret * weights[i], 0);
    const variance = returns.reduce((sum, ret, i) => sum + Math.pow(ret - portfolioReturn, 2) * weights[i], 0);
    const volatility = Math.sqrt(variance) * Math.sqrt(252); // 年化波动率

    // 计算VaR (95% 和 99%)
    const var95 = portfolioReturn - 1.645 * Math.sqrt(variance);
    const var99 = portfolioReturn - 2.326 * Math.sqrt(variance);
    const cvar95 = var95 * 1.3; // 简化的CVaR计算

    // 计算最大回撤
    const maxDrawdown = Math.min(...returns) || 0;

    // 计算Beta值（相对于市场）
    const beta = 0.8 + Math.random() * 0.4; // 模拟Beta值

    // 计算跟踪误差
    const trackingError = volatility * 0.3; // 简化计算

    return {
      var95: var95 * currentValue,
      var99: var99 * currentValue,
      cvar95: cvar95 * currentValue,
      maxDrawdown: maxDrawdown * currentValue,
      volatility,
      beta,
      trackingError,
    };
  };

  // 压力测试场景
  const performStressTest = () => {
    const scenarios = [
      { name: '股市暴跌', change: -0.3, probability: 0.05 },
      { name: '利率上升', change: -0.15, probability: 0.2 },
      { name: '流动性紧张', change: -0.25, probability: 0.1 },
      { name: '市场震荡', change: -0.1, probability: 0.3 },
      { name: '正常波动', change: 0.05, probability: 0.35 },
    ];

    const results = scenarios.map(scenario => ({
      ...scenario,
      impact: currentValue * scenario.change,
      finalValue: currentValue * (1 + scenario.change),
    }));

    setStressTestResults(results);
  };

  useEffect(() => {
    if (currentPositions.length > 0) {
      const metrics = calculateRiskMetrics();
      setRiskMetrics(metrics);
      performStressTest();
    }
  }, [currentPositions, currentValue]);

  // 获取风险等级
  const getRiskLevel = () => {
    if (!riskMetrics) return { level: 'unknown', color: '#d9d9d9' };
    
    const volatility = riskMetrics.volatility;
    if (volatility < 0.1) return { level: '低风险', color: '#52c41a' };
    if (volatility < 0.2) return { level: '中等风险', color: '#faad14' };
    if (volatility < 0.3) return { level: '高风险', color: '#fa8c16' };
    return { level: '极高风险', color: '#f5222d' };
  };

  // 风险建议
  const getRiskAdvice = () => {
    if (!riskMetrics) return [];
    
    const advice = [];
    const riskLevel = getRiskLevel();
    
    if (riskLevel.level === '极高风险') {
      advice.push('建议降低仓位，增加现金比例');
      advice.push('考虑增加债券类资产配置');
    } else if (riskLevel.level === '高风险') {
      advice.push('建议分散投资，降低集中度风险');
      advice.push('考虑设置止损点位');
    } else if (riskLevel.level === '中等风险') {
      advice.push('风险水平适中，建议定期监控');
      advice.push('可以考虑适当增加配置');
    } else {
      advice.push('风险较低，可以考虑适当增加收益型资产');
      advice.push('建议关注流动性管理');
    }
    
    return advice;
  };

  const riskLevel = getRiskLevel();

  // 压力测试表格列
  const stressTestColumns = [
    {
      title: '压力场景',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '发生概率',
      dataIndex: 'probability',
      key: 'probability',
      render: (prob: number) => `${(prob * 100).toFixed(1)}%`,
    },
    {
      title: '预期变化',
      dataIndex: 'change',
      key: 'change',
      render: (change: number) => (
        <Text type={change < 0 ? 'danger' : 'success'}>
          {change >= 0 ? '+' : ''}{(change * 100).toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '影响金额',
      dataIndex: 'impact',
      key: 'impact',
      render: (impact: number) => (
        <Text type={impact < 0 ? 'danger' : 'success'}>
          {impact >= 0 ? '+' : ''}¥{Math.abs(impact).toLocaleString()}
        </Text>
      ),
    },
    {
      title: '最终价值',
      dataIndex: 'finalValue',
      key: 'finalValue',
      render: (value: number) => `¥${value.toLocaleString()}`,
    },
  ];

  if (!riskMetrics) {
    return (
      <div className={styles.container}>
        <Alert
          message="暂无风险数据"
          description="请先添加投资组合持仓数据"
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 风险概览 */}
      <Card title="风险概览" className={styles.riskOverview}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="风险等级"
              value={riskLevel.level}
              valueStyle={{ color: riskLevel.color }}
              prefix={<SafetyOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="组合波动率"
              value={riskMetrics.volatility * 100}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<RiseOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Beta系数"
              value={riskMetrics.beta}
              precision={2}
              valueStyle={{ color: '#1890ff' }}
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="最大回撤"
              value={Math.abs(riskMetrics.maxDrawdown)}
              precision={0}
              formatter={(value) => `¥${Number(value).toLocaleString()}`}
              valueStyle={{ color: '#f5222d' }}
              prefix={<FallOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* VaR风险度量 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="VaR风险度量" className={styles.varCard}>
            <div className={styles.varMetrics}>
              <Row gutter={16}>
                <Col span={12}>
                  <Tooltip title="95%置信度下的最大损失">
                    <Statistic
                      title="VaR (95%)"
                      value={Math.abs(riskMetrics.var95)}
                      precision={0}
                      formatter={(value) => `¥${Number(value).toLocaleString()}`}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Tooltip>
                </Col>
                <Col span={12}>
                  <Tooltip title="99%置信度下的最大损失">
                    <Statistic
                      title="VaR (99%)"
                      value={Math.abs(riskMetrics.var99)}
                      precision={0}
                      formatter={(value) => `¥${Number(value).toLocaleString()}`}
                      valueStyle={{ color: '#f5222d' }}
                    />
                  </Tooltip>
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <Tooltip title="条件VaR，超过VaR时的平均损失">
                  <Statistic
                    title="CVaR (95%)"
                    value={Math.abs(riskMetrics.cvar95)}
                    precision={0}
                    formatter={(value) => `¥${Number(value).toLocaleString()}`}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Tooltip>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="风险承受能力" className={styles.riskToleranceCard}>
            <div className={styles.riskToleranceContent}>
              <Text>当前风险承受能力评级：</Text>
              <div className={styles.riskToleranceSlider}>
                <Slider
                  min={1}
                  max={10}
                  value={riskTolerance}
                  onChange={setRiskTolerance}
                  marks={{
                    1: '保守',
                    5: '平衡',
                    10: '激进',
                  }}
                />
              </div>
              <div className={styles.riskToleranceAdvice}>
                <Text type="secondary">
                  {riskTolerance <= 3 && '建议投资低风险产品，如货币基金、债券基金'}
                  {riskTolerance > 3 && riskTolerance <= 7 && '建议平衡配置，股债混合投资'}
                  {riskTolerance > 7 && '可以投资高风险高收益产品，如成长股、科技股'}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 压力测试 */}
      <Card title="压力测试" className={styles.stressTestCard}>
        <Table
          columns={stressTestColumns}
          dataSource={stressTestResults}
          rowKey="name"
          pagination={false}
          size="small"
        />
      </Card>

      {/* 风险建议 */}
      <Card title="风险建议" className={styles.riskAdviceCard}>
        <div className={styles.riskAdviceContent}>
          {getRiskAdvice().map((advice, index) => (
            <Alert
              key={index}
              message={advice}
              type="warning"
              showIcon
              style={{ marginBottom: 8 }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RiskAnalyzer;
