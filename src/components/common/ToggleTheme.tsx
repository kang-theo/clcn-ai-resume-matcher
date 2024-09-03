"use client";
import React from "react";
import type { MenuProps } from "antd";
import { Button, Dropdown, Space, Switch } from "antd";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const items: MenuProps["items"] = [
  {
    key: "light",
    label: "English",
  },
  {
    key: "dark",
    label: "Dark",
  },
  {
    key: "system",
    label: "System",
  },
];

interface IProps {
  type?: "button" | "switch" | "dropdown";
}

const ToggleTheme: React.FC<IProps> = ({ type = "switch" }) => {
  const { theme, setTheme } = useTheme();

  const handleSwitchTheme = (checked: boolean) => {
    const newTheme = checked ? "light" : "dark";
    setTheme(newTheme);
  };

  const renderTheme = () => {
    switch (type) {
      case "switch":
        return (
          <Switch
            checkedChildren={<Sun size={16} style={{ marginTop: "3px" }} />}
            unCheckedChildren={<Moon size={16} />}
            defaultChecked={theme === "light"}
            onChange={handleSwitchTheme}
          />
        );
      case "button":
        return <Button>Button</Button>;
      case "dropdown":
        return (
          <Space wrap>
            <Dropdown menu={{ items }} placement='bottomRight'>
              <Button
                size='large'
                type='text'
                className='flex justify-center items-center space-x-1'
              >
                xx
              </Button>
            </Dropdown>
          </Space>
        );
    }
  };
  return <Space direction='vertical'>{renderTheme()}</Space>;
};

export default ToggleTheme;
