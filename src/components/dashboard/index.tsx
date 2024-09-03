"use client";
import React, { useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Collapse,
  Dropdown,
  Row,
  Spin,
  Tooltip,
  notification,
  theme,
} from "antd";
import { Info } from "lucide-react";
import { useTheme } from "next-themes";
import Analytics from "@/components/common/Analytics";
import BusinessOverview, { BusinessOverviewDataType } from "./BusinessOverview";

interface IProps {
  basePath?: string;
  businessOverviewItems: BusinessOverviewDataType[];
  style?: React.CSSProperties | undefined;
  className?: string;
}

export function Dashboard({
  basePath = "",
  className = "",
  style,
  businessOverviewItems,
}: IProps) {
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();
  const [spinning, setSpinning] = useState(false);

  const CardStyle = {
    body: {
      borderRadius: "8px",
      // color: token.colorText,
      height: "100px",
      padding: "16px",
      background: token.colorFillAlter,
      // borderRadius: '8px',
    },
  };

  return (
    <div>
      <Breadcrumb
        items={[{ title: "ARM" }, { title: "Dashboard" }]}
        style={{ margin: "8px 0" }}
      ></Breadcrumb>
      <Card
        className={`${className} main-content-h`}
        style={style ?? undefined}
      >
        {contextHolder}
        <div className='space-y-2'>
          {/* Business Overview */}
          <BusinessOverview items={businessOverviewItems} cardsNum={6} />
          <Analytics />
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
