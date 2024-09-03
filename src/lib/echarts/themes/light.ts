// const contrastColor = "#B9B8CE";
// const backgroundColor = "#100C2A";
// const colorPalette = [
//   "#4992ff",
//   "#7cffb2",
//   "#fddd60",
//   "#ff6e76",
//   "#58d9f9",
//   "#05c091",
//   "#ff8a45",
//   "#8d48e3",
//   "#dd79ff",
// ];

// const axisCommon = () => ({
//   axisLine: {
//     lineStyle: {
//       color: contrastColor,
//     },
//   },
//   splitLine: {
//     lineStyle: {
//       color: "#484753",
//     },
//   },
//   splitArea: {
//     areaStyle: {
//       color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"],
//     },
//   },
//   minorSplitLine: {
//     lineStyle: {
//       color: "#20203B",
//     },
//   },
// });

// export const lightTheme = {
//   darkMode: true,

//   color: colorPalette,
//   backgroundColor: backgroundColor,
//   axisPointer: {
//     lineStyle: {
//       color: "#817f91",
//     },
//     crossStyle: {
//       color: "#817f91",
//     },
//     label: {
//       // TODO Contrast of label backgorundColor
//       color: "#fff",
//     },
//   },
//   legend: {
//     textStyle: {
//       color: contrastColor,
//     },
//   },
//   textStyle: {
//     color: contrastColor,
//   },
//   title: {
//     textStyle: {
//       color: "#EEF1FA",
//     },
//     subtextStyle: {
//       color: "#B9B8CE",
//     },
//   },
//   toolbox: {
//     iconStyle: {
//       borderColor: contrastColor,
//     },
//   },
//   dataZoom: {
//     borderColor: "#71708A",
//     textStyle: {
//       color: contrastColor,
//     },
//     brushStyle: {
//       color: "rgba(135,163,206,0.3)",
//     },
//     handleStyle: {
//       color: "#353450",
//       borderColor: "#C5CBE3",
//     },
//     moveHandleStyle: {
//       color: "#B0B6C3",
//       opacity: 0.3,
//     },
//     fillerColor: "rgba(135,163,206,0.2)",
//     emphasis: {
//       handleStyle: {
//         borderColor: "#91B7F2",
//         color: "#4D587D",
//       },
//       moveHandleStyle: {
//         color: "#636D9A",
//         opacity: 0.7,
//       },
//     },
//     dataBackground: {
//       lineStyle: {
//         color: "#71708A",
//         width: 1,
//       },
//       areaStyle: {
//         color: "#71708A",
//       },
//     },
//     selectedDataBackground: {
//       lineStyle: {
//         color: "#87A3CE",
//       },
//       areaStyle: {
//         color: "#87A3CE",
//       },
//     },
//   },
//   visualMap: {
//     textStyle: {
//       color: contrastColor,
//     },
//   },
//   timeline: {
//     lineStyle: {
//       color: contrastColor,
//     },
//     label: {
//       color: contrastColor,
//     },
//     controlStyle: {
//       color: contrastColor,
//       borderColor: contrastColor,
//     },
//   },
//   calendar: {
//     itemStyle: {
//       color: backgroundColor,
//     },
//     dayLabel: {
//       color: contrastColor,
//     },
//     monthLabel: {
//       color: contrastColor,
//     },
//     yearLabel: {
//       color: contrastColor,
//     },
//   },
//   timeAxis: axisCommon(),
//   logAxis: axisCommon(),
//   valueAxis: axisCommon(),
//   categoryAxis: axisCommon(),

//   line: {
//     symbol: "circle",
//   },
//   graph: {
//     color: colorPalette,
//   },
//   gauge: {
//     title: {
//       color: contrastColor,
//     },
//   },
//   candlestick: {
//     itemStyle: {
//       color: "#FD1050",
//       color0: "#0CF49B",
//       borderColor: "#FD1050",
//       borderColor0: "#0CF49B",
//     },
//   },
// };

export const lightTheme = {
  color: ['#6be6c1', '#3fb1e3', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
  backgroundColor: 'rgba(252,252,252,0)',
  textStyle: {},
  title: {
    textStyle: {
      color: '#666666',
    },
    subtextStyle: {
      color: '#999999',
    },
  },
  line: {
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      normal: {
        width: '3',
      },
    },
    symbolSize: '8',
    symbol: 'emptyCircle',
    smooth: false,
  },
  radar: {
    itemStyle: {
      normal: {
        borderWidth: '2',
      },
    },
    lineStyle: {
      normal: {
        width: '3',
      },
    },
    symbolSize: '8',
    symbol: 'emptyCircle',
    smooth: false,
  },
  bar: {
    itemStyle: {
      normal: {
        barBorderWidth: 0,
        barBorderColor: '#ccc',
      },
      emphasis: {
        barBorderWidth: 0,
        barBorderColor: '#ccc',
      },
    },
  },
  pie: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  scatter: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  boxplot: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  parallel: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  sankey: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  funnel: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  gauge: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
      emphasis: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: '#e6a0d2',
        color0: 'transparent',
        borderColor: '#e6a0d2',
        borderColor0: '#3fb1e3',
        borderWidth: '2',
      },
    },
  },
  graph: {
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#ccc',
      },
    },
    lineStyle: {
      normal: {
        width: '1',
        color: '#cccccc',
      },
    },
    symbolSize: '8',
    symbol: 'emptyCircle',
    smooth: false,
    color: ['#6be6c1', '#3fb1e3', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
    },
  },
  map: {
    itemStyle: {
      normal: {
        areaColor: '#eeeeee',
        borderColor: '#aaaaaa',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(63,177,227,0.25)',
        borderColor: '#3fb1e3',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
      emphasis: {
        textStyle: {
          color: 'rgb(63,177,227)',
        },
      },
    },
  },
  geo: {
    itemStyle: {
      normal: {
        areaColor: '#eeeeee',
        borderColor: '#aaaaaa',
        borderWidth: 0.5,
      },
      emphasis: {
        areaColor: 'rgba(63,177,227,0.25)',
        borderColor: '#3fb1e3',
        borderWidth: 1,
      },
    },
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
      emphasis: {
        textStyle: {
          color: 'rgb(63,177,227)',
        },
      },
    },
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#999999',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  valueAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#999999',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  logAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#999999',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  timeAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#cccccc',
      },
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#333',
      },
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#999999',
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#eeeeee'],
      },
    },
    splitArea: {
      show: false,
      areaStyle: {
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: '#999999',
      },
      emphasis: {
        borderColor: '#666666',
      },
    },
  },
  legend: {
    textStyle: {
      color: '#999999',
    },
  },
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: '#cccccc',
        width: 1,
      },
      crossStyle: {
        color: '#cccccc',
        width: 1,
      },
    },
  },
  timeline: {
    lineStyle: {
      color: '#626c91',
      width: 1,
    },
    itemStyle: {
      normal: {
        color: '#626c91',
        borderWidth: 1,
      },
      emphasis: {
        color: '#626c91',
      },
    },
    controlStyle: {
      normal: {
        color: '#626c91',
        borderColor: '#626c91',
        borderWidth: 0.5,
      },
      emphasis: {
        color: '#626c91',
        borderColor: '#626c91',
        borderWidth: 0.5,
      },
    },
    checkpointStyle: {
      color: '#3fb1e3',
      borderColor: 'rgba(63,177,227,0.15)',
    },
    label: {
      normal: {
        textStyle: {
          color: '#626c91',
        },
      },
      emphasis: {
        textStyle: {
          color: '#626c91',
        },
      },
    },
  },
  visualMap: {
    color: ['#2a99c9', '#afe8ff'],
  },
  dataZoom: {
    backgroundColor: 'rgba(255,255,255,0)',
    dataBackgroundColor: 'rgba(222,222,222,1)',
    fillerColor: 'rgba(114,230,212,0.25)',
    handleColor: '#cccccc',
    handleSize: '100%',
    textStyle: {
      color: '#999999',
    },
  },
  markPoint: {
    label: {
      normal: {
        textStyle: {
          color: '#ffffff',
        },
      },
      emphasis: {
        textStyle: {
          color: '#ffffff',
        },
      },
    },
  },
};
