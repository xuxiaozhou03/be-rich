'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  TransactionOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import styles from './AppLayout.module.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/strategies',
      icon: <BarChartOutlined />,
      label: '策略管理',
    },
    {
      key: '/portfolio',
      icon: <PieChartOutlined />,
      label: '投资组合',
    },
    {
      key: '/data-center',
      icon: <DatabaseOutlined />,
      label: '数据中心',
    },
    {
      key: '/risk-management',
      icon: <SafetyCertificateOutlined />,
      label: '风险管理',
    },
    {
      key: '/research',
      icon: <ExperimentOutlined />,
      label: '研究平台',
    },
    {
      key: '/trading',
      icon: <TransactionOutlined />,
      label: '交易执行',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置中心',
    },
  ];

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        width={240}
      >
        <div className={styles.logo}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'BR' : 'Be Rich'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.trigger}
            />
          </div>
          <div className={styles.headerRight}>
            <Space>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    if (key === 'logout') {
                      // 处理退出登录逻辑
                      console.log('退出登录');
                    } else if (key === 'profile') {
                      // 处理个人资料逻辑
                      console.log('个人资料');
                    }
                  },
                }}
                placement="bottomRight"
              >
                <Space className={styles.userInfo}>
                  <Avatar icon={<UserOutlined />} />
                  <span>用户名</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
