/**
 * @author: 张静静/GW00236918
 * @date: 2024/08/03 18:11:50
 * @description: 页面展示入口文件
 * Copyright (c) 2024 GWM.Co.Ltd. All rights reserved.
 */
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import "antd/dist/reset.css";
import { App, Button, ConfigProvider, Layout, Space, notification } from "antd";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import useStyles from "./index.style";
const { Header, Footer, Sider, Content } = Layout;

// 页面最小宽度
const _minWidth = "calc(100% - 66px)";

// header 容器
const headerStyle: React.CSSProperties = {
  height: "62px",
  backgroundColor: "#fff",
  padding: 0,
  minWidth: _minWidth,
  overflow: "unset",
  zIndex: "1",
};

// 侧边菜单配置
const siderStyle: React.CSSProperties = {
  textAlign: "center",
  backgroundColor: "transparent",
  border: "none",
  zIndex: "2",
  overflow: "auto",
  height: "calc(100vh - 64px)",
};

// content 容器
const contentStyle: React.CSSProperties = {
  height: "calc(100vh - 64px)",
  width: "100%",
  padding: "16px",
  position: "relative",
};

const Main = React.memo((props: any) => {
  useEffect(() => {}, []);
  return (
    <div className="main">
      {/* socket消息通知上下文 */}
      <ConfigProvider
        button={{ autoInsertSpace: false }}
        theme={{
          token: {
            colorPrimary: "#d6000f",
          },
        }}
      >
        <App>
          <Layout>
            <Header style={headerStyle}></Header>
            <Layout>
              <Content style={contentStyle}>
                <Suspense>
                  <Outlet></Outlet>
                </Suspense>
              </Content>
            </Layout>
          </Layout>
        </App>
      </ConfigProvider>
    </div>
  );
});

export default Main;
