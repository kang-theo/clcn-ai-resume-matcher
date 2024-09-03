"use client";
import React, { useState, useCallback, useEffect } from "react";
import type { MenuProps } from "antd";
import { Divider, Layout, Menu, theme, ConfigProvider } from "antd";
import Profile from "../common/Profile";
import Languages from "../common/Languages";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import ToggleTheme from "../common/ToggleTheme";
import { Icons } from "@/components/common/Icons";
import { ThemeProvider, useTheme } from "next-themes";
import { SiderTheme } from "antd/es/layout/Sider";
import { lightTheme, darkTheme } from "@/lib/theme";
import { items } from "./menu";
import dynamic from "next/dynamic";
// Antd config
import zhCN from "antd/locale/zh_CN";
// for date-picker i18n
import "dayjs/locale/zh-cn";
const Collapse = dynamic(() => import("./Collapse"), { ssr: false });
const { Header, Content, Footer, Sider } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
  appName: string;
}

export function AdminLayout({ children, appName }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  // const {
  //   token: { colorPrimaryBg, colorBgContainer, borderRadiusLG },
  // } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [themeTokens, setThemeTokens] = useState(lightTheme.token);

  // change antd theme tokens
  useEffect(() => {
    // const storedTheme = localStorage.getItem("theme");
    if (theme === "dark") {
      setThemeTokens(darkTheme.token);
    } else {
      setThemeTokens(lightTheme.token);
    }
  }, [theme]);

  const handleMenuClick: MenuProps["onClick"] = useCallback(
    ({ key }: { key: string }) => {
      router.push(key);
    },
    [router]
  );

  return (
    <ConfigProvider theme={{ token: themeTokens }} locale={zhCN}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          style={{
            borderRight: `1px solid ${themeTokens?.colorSplit}`,
            background: themeTokens?.colorBgBase,
          }}
          className='relative'
          theme={theme as SiderTheme}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
        >
          <div className='relative h-[56px] flex items-center justify-center border-b border-[rgba(5,5,5,0.06)] dark:border-[rgba(254,254,254,0.12)]'>
            <div className='mx-auto logo h-full text-2xl flex items-center justify-center pt-5'>
              <Icons.Logo
                fill={themeTokens?.colorPrimary}
                style={{ textAlign: "center" }}
              />
            </div>

            <Collapse
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              theme={theme}
            />
          </div>

          <Menu
            className='!bg-transparent'
            theme={theme as SiderTheme}
            defaultSelectedKeys={[pathname.split("/").slice(0, 2).join("/")]}
            mode='inline'
            items={items}
            style={{
              border: "none",
              background: themeTokens?.colorBgBase,
            }}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              height: "56px",
              color: themeTokens?.colorTextBase,
              background: themeTokens?.colorBgBase,
              borderBottom: `1px solid ${themeTokens?.colorSplit}`,
            }}
            className=' flex items-center justify-end !px-5 space-x-2'
          >
            <ToggleTheme />
            <Divider type='vertical' />
            <Profile />
          </Header>

          <Content className='flex flex-col mx-4'>
            <div className='flex-1'>{children}</div>
            <Footer className='text-center text-sm'>
              {appName} ©{new Date().getFullYear()}
            </Footer>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
