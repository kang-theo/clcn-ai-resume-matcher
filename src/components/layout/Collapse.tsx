import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React from "react";

interface IProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  theme: string | undefined;
}

export default function Collapse({ collapsed, setCollapsed, theme }: IProps) {
  if (!theme) return null;

  return (
    <div
      className={
        collapsed
          ? "absolute left-[70px] hover:cursor-pointer"
          : "absolute left-[190px] hover:cursor-pointer"
      }
      onClick={() => setCollapsed(!collapsed)}
    >
      {collapsed ? (
        <CircleChevronRight
          size={20}
          strokeWidth={1.5}
          fill={theme === "light" ? "#FFFFFF" : "#252525"}
          color={theme === "light" ? "#CCC" : "rgba(254,254,254,0.6)"}
        />
      ) : (
        <CircleChevronLeft
          size={20}
          strokeWidth={1.5}
          fill={theme === "light" ? "#FFFFFF" : "#252525"}
          color={theme === "light" ? "#CCC" : "rgba(254,254,254,0.6)"}
        />
      )}
    </div>
  );
}
