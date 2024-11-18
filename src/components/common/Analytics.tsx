import { useTheme } from "next-themes";
import { HEcharts, ReactEcharts } from "@/lib/echarts";
import { catchClientRequestError, formatDatetime } from "@/lib/utils";
import { Card, Empty, Skeleton, Tag, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const numberFormatter = new Intl.NumberFormat();

interface IColor {
  start: string;
  end: string;
}

interface IProps {
  // Fetch data url
  url?: string;
  // yAxix value unit
  unit?: string;
  // Visualization card title
  title?: string;
  // legend item colors, from left to right sequence
  // for example: ['#0099FF', '#F2637B', '#E8B900']
  colors?: IColor[];
}

interface IChartData {
  xAxis: string[];
  yAxis: number[];
}

interface IChartInfo {
  name: string;
  result: IChartData;
}

interface ILegend {
  name: string;
  itemStyle: {
    color: string;
  };
  lineStyle: {
    color: string;
  };
}

const generateOptions = ({
  title,
  unit,
  legends,
  xAxis,
  series,
  colors,
}: {
  title: string;
  latest: number;
  legends: ILegend[];
  unit: string;
  xAxis: string[];
  series: Record<string, any>[];
  colors: IColor[];
}) => {
  let options: Record<string, any> = {
    grid: {
      show: false,
      containLabel: false,
      top: "10%",
      left: "7%",
      right: "1%",
      bottom: "0%",
      height: "75%",
    },
    legend: {
      top: "0%",
      data: legends,
    },
    // toolbox: {
    //   feature: {
    //     dataZoom: {
    //       yAxisIndex: 'none',
    //     },
    //     restore: {},
    //     magicType: { type: ['line', 'bar'] },
    //   },
    // },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
      formatter: (params: Record<string, any>[]) => {
        let dom = `<div style="text-align: left">
                     <div style="text-align: center;font-weight: 600">${params[0].axisValue}</div>
                     <div style="text-align: center;font-weight: 600">${title}</div>`;
        let item, value;

        for (let i = 0; i < params.length; i++) {
          item = params[i];
          // value = Number.parseInt(item.data);
          value = `${numberFormatter.format(item.data)}${unit}`;
          if (item.seriesName !== "Shadow") {
            dom += `<div style="color: #fff">
                      <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colors[i].end};"></span>
                      <span style="text-align:left; color: rgba(0, 0, 0, 0.85);">${item.seriesName}:</span> 
                      <span style="color: rgba(0, 0, 0, 0.85);">${value}</span>
                    </div>`;
          }
        }
        return dom + "</div>";
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxis,
      // axisLabel: {
      //   inside: true,
      //   color: '#fff',
      // },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#999",
        formatter: function (value: number | string) {
          if (Number.isInteger(value)) {
            return `${value}${unit}`;
          }
          return null;
        },
      },
    },
    series: series,
  };

  return options;
};

const Analytics: React.FC<IProps> = ({
  title = "Analytics",
  url = "/api/admin/analytics",
  unit = "",
  colors = [
    { start: "#fffee6", end: "#1890ff" },
    { start: "#e6f9ff", end: "#52C41A" },
    { start: "#fffee6", end: "#E8B900" },
  ],
}) => {
  const theme = useTheme();
  const [api, contextHolder] = notification.useNotification();
  const [currLifeCycle, setCurrLifeCycle] = useState(1);
  const [loading, setLoading] = useState(true);
  const [xAxis, setXAxis] = useState<string[]>([]);
  const [legends, setLegends] = useState<ILegend[]>([]);
  const [series, setSeries] = useState<Record<string, any>[]>([]);

  const generateSeries = (res: Record<string, IChartInfo>) => {
    let _series: any = [],
      names: ILegend[] = [],
      _xAxis: string[] = [],
      index: number = 0;

    // eslint-disable-next-line guard-for-in
    for (let key in res) {
      names.push({
        name: res[key].name,
        itemStyle: { color: colors[index].end },
        lineStyle: { color: colors[index].end },
      });

      _series.push({
        name: res[key].name,
        // lineStyle: {
        //   width: 3,
        // },
        itemStyle: {
          color: colors[index].end,
        },
        smooth: true,
        type: "line",
        areaStyle: {
          color: new HEcharts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[index].end }, // 0% color
            { offset: 1, color: colors[index].start }, // 100% color
          ]),
        },
        emphasis: {
          focus: "series",
        },
        showSymbol: false,
        data: res[key].result.yAxis,
      });

      _xAxis = res[key].result.xAxis;
      // if (!_xAxis.length) {
      //   _xAxis = res[key].result.xAxis.map((tick: string) =>
      //     formatDatetime(tick)
      //   );
      // }

      index++;
    }
    return [names, _xAxis, _series];
  };

  const fetchData = () => {
    axios
      .get(url)
      .then(({ data }) => {
        setLoading(false);
        if (!data.code) {
          const result = generateSeries(data.result);
          setLegends(result[0]);
          setXAxis(result[1]);
          setSeries(result[2]);
        } else {
          api.warning({
            message: title,
            description:
              data.message || "Failed to fetch data, please try again later",
          });
        }
      })
      .catch((error: API.AxiosError) => {
        setLoading(false);
        api.error(catchClientRequestError(error));
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const onChartReadyCallback = (e: any) => {};
  // const onChartClick = (e: any) => {};
  // const onEvents = {
  //   click: onChartClick,
  //   'legendselectchanged': onChartLegendselectchanged
  // };

  if (loading) {
    return <Skeleton />;
  } else {
    return (
      <Card style={{ width: "100%" }}>
        <>{contextHolder}</>
        <div className='flex w-full items-center justify-start mb-4 space-x-2'>
          <div className='text-xl'>{title}</div>
        </div>
        <div>
          {series.length > 0 ? (
            <ReactEcharts
              echarts={HEcharts}
              option={generateOptions({
                title,
                unit,
                legends,
                xAxis,
                series,
                latest: currLifeCycle,
                colors,
              })}
              showLoading={loading}
              loadingOption={{
                color: "#16a34a",
              }}
              notMerge={true}
              lazyUpdate={true}
              style={{ width: "100%", height: "460px" }}
              theme={theme}
              // onChartReady={onChartReadyCallback}
              // onEvents={onEvents}
              // opts={}
            />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </Card>
    );
  }
};

export default React.memo(Analytics);
