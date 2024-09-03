import { theme } from "antd";
import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  // token: {
  //   colorPrimary: "#1890ff",
  //   // colorInfo: "#1890ff",
  //   colorBgBase: "#ffffff",
  //   colorBgContainer: "#ffffff",
  // },
  token: {
    colorPrimary: "#1890ff",
    colorBgBase: "#ffffff",
    colorInfo: "#1890ff",
    colorSplit: "rgba(5,5,5,0.06)",
  },
  // components: {
  //   Button: {
  //     algorithm: true,
  //   },
  // },
  algorithm: theme.defaultAlgorithm, // 'light
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1890ff",
    colorBgBase: "#252525", //"#010101",
    colorInfo: "#1890ff",
    colorTextBase: "#ffffff",
    colorSplit: "rgba(254,254,254,0.12)",
    colorTextDescription: "rgba(255,255,255,0.45)",
    // colorFillAlter: "rgba(255,255,255,0.04)",
  },
  // components: {
  //   Layout: {
  //     colorBgHeader: "#010101",
  //   },
  //   // Menu: {
  //   //   colorItemBg: "#010101",
  //   //   colorItemTextSelected: token.colorText,
  //   //   colorItemBgSelected: token.colorPrimaryBgHover,
  //   // },
  //   Button: {
  //     algorithm: true,
  //   },
  // },
  algorithm: theme.darkAlgorithm,
  // token: {
  //   colorPrimary: "#1890ff",
  //   // colorInfo: "#1890ff",
  //   colorBgBase: "#010101",
  //   colorBgContainer: "#161618",
  //   colorPrimaryBg: "#1c182a",
  // },
  // algorithm: theme.darkAlgorithm, // 'dark'
};
