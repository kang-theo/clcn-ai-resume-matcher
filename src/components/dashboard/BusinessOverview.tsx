import {
  Card,
  Col,
  Empty,
  Row,
  Skeleton,
  Tooltip,
  notification,
  theme,
} from "antd";
import axios from "axios";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import React, { useState, useEffect } from "react";

const cardResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 4,
  style: {
    marginBottom: 24,
  },
};

export type BusinessOverviewDataType = {
  // analysis item title
  title: string;
  // analysis item unit
  unit: string;
  // analysis item value
  value: number;
  // analysis item trend: positive or negative
  trend?: number;
  // item description
  info?: string;
};

interface IProps {
  // title of the card
  title?: string;
  // server side rendered data
  items?: BusinessOverviewDataType[];
  // skeleton number of cards
  cardsNum: number;
  // client side fetches data by API
  url?: string;
}

const renderSkeleton = (
  cardsNum: number,
  CardStyle: { body: Record<string, string> }
) => {
  const result = [];
  for (let i = 0; i < cardsNum; i++) {
    result.push(
      <Col key={`cluster-indicator-${i}`} {...cardResponsiveProps}>
        <Card hoverable bordered={false} styles={CardStyle}>
          <Skeleton title={false} paragraph={{ rows: 2 }} active />
        </Card>
      </Col>
    );
  }
  return result;
};

function BusinessOverview({
  title = "Business Overview",
  items,
  cardsNum,
  url,
}: IProps) {
  const [api, contextHolder] = notification.useNotification();
  const { token } = theme.useToken();
  const [dataInfo, setDataInfo] = useState<BusinessOverviewDataType[]>(
    items ?? []
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!dataInfo.length && url) {
      axios
        .get(url)
        .then(({ data }) => {
          setLoading(false);
          // {code: 0, message: ..., result: ...}
          if (!data.code) {
            setDataInfo(data.result);
          } else {
            api["warning"]({
              message: "Business Overview",
              description:
                data.message || "Failed to fetch business overview data",
            });
          }
        })
        .catch((error: API.AxiosError) => {
          setLoading(false);
          api["error"]({
            message: "Business Overview",
            description:
              error.response.data.message ||
              "Failed to fetch business overview data",
          });
        });
    } else {
      setLoading(false);
    }
  }, [url]);

  const CardStyle = {
    body: {
      borderRadius: "8px",
      // color: token.colorText,
      // height: "100px",
      padding: "16px",
      background: token.colorFillAlter,
      // borderRadius: '8px',
    },
  };

  if (loading) {
    return (
      <Card className='w-full'>
        <div className='text-xl mb-4'>{title}</div>
        <Row gutter={24}>{renderSkeleton(cardsNum, CardStyle)}</Row>
      </Card>
    );
  }

  if (!dataInfo.length) {
    return (
      <Card className='w-full'>
        <div className='text-xl mb-4'>{title}</div>
        <div className='text-center'>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {contextHolder}
      <div className='text-xl mb-4 flex items-center justify-start space-x-2'>
        <span>{title} </span>
        <Tooltip
          title={
            "YoY% Year on Year, is compared to the same period last year, as the selected date range period for this year."
          }
        >
          <Info size={16} />
        </Tooltip>
      </div>
      <Row gutter={24}>
        {dataInfo.map((card) => (
          <Col key={card.title} {...cardResponsiveProps}>
            <Card hoverable bordered={false} styles={CardStyle}>
              <div className='flex items-center justify-between'>
                <div
                  className={`flex items-center text-sm text-[rgba(0,0,0,.65)] dark:text-[rgba(255,255,255,.55)] space-x-1`}
                >
                  <span className='text-base'>{card.title}</span>
                </div>
                {card.info && (
                  <Tooltip title={card.info}>
                    <Info size={16} />
                  </Tooltip>
                )}
              </div>
              <div className='mt-1 py-2'>
                <span className='text-3xl'>
                  {card.value}
                  {card.unit}
                </span>
              </div>
              <div className='h-2 mb-2 flex flex-row items-center justify-start'>
                {card.trend ? (
                  card.trend > 0 ? (
                    <>
                      <ArrowUp size={16} color='#52c41a' />
                      <span className='text-base' style={{ color: "#52c41a" }}>
                        {card.trend}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown size={16} color='#ff4d4f' />
                      <span className='text-base' style={{ color: "#ff4d4f" }}>
                        {card.trend}%
                      </span>
                    </>
                  )
                ) : null}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}

export default BusinessOverview;
