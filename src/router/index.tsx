/**
 * @author: 张静静/GW00236918
 * @date: 2024/08/05 14:51:32
 * @description: 路由信息配置
 * Copyright (c) 2024 GWM.Co.Ltd. All rights reserved.
 */
import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  redirect,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Spin } from "antd";
import Home from "@/pages/Home";
import Defalt from "@/pages/defalt";
const Map = React.lazy(() => import("@/pages/Map"));

/** 路由 */
const routes = [
  {
    path: "/",
    element: () => <Home />,
    isLogin: true,
    children: [
      {
        path: "/map",
        element: () => <Map />,
        isLogin: true,
      },
    ],
  },
  {
    path: "*",
    element: () => <Defalt />,
    isLogin: false,
  },
];

const Loading = () => {
  return (
    <Spin spinning={true}>
      <div style={{ height: "100vh", width: "100%" }}></div>
    </Spin>
  );
};

const renderRouter = (routes: any[]) => {
  const render = routes?.map((e: any) => {
    // ==================== 此处进行路由拦截 =====================
    return (
      <Route key={e.path} path={e.path} element={e.element()}>
        {e.children ? renderRouter(e.children) : <></>}
      </Route>
    );
  });
  return render;
};

const Router = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>{renderRouter(routes)}</Routes>
    </Suspense>
  );
};

export { Router };
