// import the core library.
import ReactEChartsCore from "echarts-for-react/lib/core";
// Import the echarts core module, which provides the necessary interfaces for using echarts.
import * as echarts from "echarts/core";
// Import charts, all with Chart suffix
import { BarChart, LineChart, PieChart } from "echarts/charts";
// import components, all suffixed with Component
import {
  // AxisPointerComponent,
  // BrushComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  // PolarComponent,
  // RadarComponent,
  // GeoComponent,
  // SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
} from "echarts/components";
// options
// import {
//   // registerTheme,
//   EChartsOption as BaseEChartsOption,
//   DatasetComponentOption,
//   GridComponentOption,
//   LegendComponentOption,
//   SeriesOption,
//   TooltipComponentOption,
//   XAXisComponentOption,
//   YAXisComponentOption,
// } from 'echarts';

// Import renderer, note that introducing the CanvasRenderer or SVGRenderer is a required step
import { CanvasRenderer } from "echarts/renderers";
import { darkTheme, lightTheme } from "./themes";

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
]);

echarts.registerTheme("light", lightTheme);
echarts.registerTheme("dark", darkTheme);

// Henry encapusulated
export const HEcharts = echarts;

export const ReactEcharts = ReactEChartsCore;

// export interface EChartsOption extends BaseEChartsOption {
//   legend: LegendComponentOption[];
//   grid: GridComponentOption[];
//   xAxis: XAXisComponentOption[];
//   yAxis: YAXisComponentOption[];
//   dataset: DatasetComponentOption[];
//   series: SeriesOption[];
//   tooltip: TooltipComponentOption[];
// }

// export function baseChartConfig(): EChartsOption {
//   return {
//     animation: false,
//     textStyle: {
//       fontFamily: '"Roboto", sans-serif',
//     },

//     toolbox: { show: false },
//     dataZoom: [
//       {
//         type: 'inside',
//         disabled: true,
//       },
//     ],

//     legend: [],
//     grid: [],
//     xAxis: [],
//     yAxis: [],
//     dataset: [],
//     series: [],
//     tooltip: [],
//   };
// }

// export function addChartTooltip(
//   cfg: any,
//   tooltipCfg: TooltipComponentOption = {},
// ) {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   // const theme = usePrefersColor();
//   const theme =
//     document.documentElement.getAttribute('data-prefers-color') ||
//     document.documentElement.getAttribute('class') ||
//     'light';

//   cfg.tooltip.push({
//     trigger: 'axis',
//     appendToBody: true,
//     axisPointer: {
//       type: 'cross',
//       link: [{ xAxisIndex: 'all' }],
//     },
//     className: ['echarts-tooltip', `theme--${theme}`].join(' '),
//     ...tooltipCfg,
//   });
// }
