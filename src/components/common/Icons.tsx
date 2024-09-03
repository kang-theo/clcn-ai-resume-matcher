import React from "react";

type IconProps = React.HTMLAttributes<SVGElement>;

// Custom icons
export const Icons = {
  Logo: (
    props: IconProps & {
      fill?: string;
      fontSize?: string;
      width?: string;
      height?: string;
    }
  ) => (
    <svg
      width={props.width ?? "62px"}
      height={props.height ?? "56px"}
      viewBox='0 0 80 80'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
    >
      <text
        x='10'
        y='40'
        fontStyle='italic'
        fontWeight='normal'
        fontFamily='DingTalk-JinBuTi, DingTalk JinBuTi'
        fontSize={props.fontSize ?? "35"}
        fill='#666666'
      >
        ARM
      </text>
    </svg>
  ),
};
