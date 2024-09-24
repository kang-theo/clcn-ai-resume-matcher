import { SwapRightOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popover,
  Row,
  Select,
  notification,
  theme,
} from "antd";
import { Filter, X } from "lucide-react";
import React, { useState } from "react";

export interface IFilter {
  type: "Input" | "Select" | "DatePicker" | "Range";
  name: string;
  label: string;
  placeholder?: string;
  defaultVal?: string | number[];
  min?: number;
  max?: number;
  unit?: string;
  selectMode?: "multiple" | "tags" | undefined;
  maxTagCount?: number | undefined;
  options?: SelectProps["options"];
  dateFromName?: string;
  dateToName?: string;
}

interface IProps {
  onSearch: (filter: any) => void;
  filters: IFilter[][];
  active: boolean;
}

const formItemStyle = {
  marginBottom: "8px",
  height: "64px",
};

export const SearchPanel: React.FC<IProps> = ({
  onSearch,
  filters,
  active,
}) => {
  const { token } = theme.useToken();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  // sider with range config
  const [rangeParams, setRangeParams] = useState<Record<string, number | null>>(
    {}
  );

  // useEffect(() => {
  //   filters.forEach((filterGroup) => {
  //     filterGroup.forEach((filterItem) => {
  //       if (filterItem.type === 'Range') {
  //         setRangeParams({ ...rangeParams, [filterItem.name]: false });
  //       }
  //     });
  //   });
  // }, []);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleChangeRange = (name: string, value: number | null) => {
    setRangeParams({ ...rangeParams, [name]: value });
  };

  const renderFormItem = (filterGroup: IFilter[]) => {
    const FormItems: React.ReactNode[] = [];
    filterGroup?.forEach((item) => {
      switch (item.type) {
        case "Input":
          FormItems.push(
            <Form.Item
              key={`form_item_${item.name}`}
              label={item.label}
              name={item.name}
              style={formItemStyle}
            >
              <Input placeholder={item.placeholder ?? ""} allowClear />
            </Form.Item>
          );
          break;
        case "Select":
          FormItems.push(
            <Form.Item
              label={item.label}
              name={item.name}
              key={`form_item_${item.name}`}
              style={formItemStyle}
            >
              <Select
                mode={item.selectMode}
                maxTagTextLength={70}
                maxTagCount={item.maxTagCount ?? 4}
                placeholder={item.placeholder ?? ""}
                options={item.options}
                allowClear
              ></Select>
            </Form.Item>
          );
          break;
        case "DatePicker":
          FormItems.push(
            <Form.Item
              key={`form_item_${item.name}`}
              label={item.label}
              name={item.name}
              style={formItemStyle}
            >
              <DatePicker.RangePicker
                placeholder={["Start Date", "End Date"]}
                allowEmpty={[true, true]}
                style={{ width: "100%" }}
                allowClear
              />
            </Form.Item>
          );
          break;
        case "Range":
          FormItems.push(
            <Form.Item
              label={item.label}
              key={`form_item_${item.name}`}
              style={formItemStyle}
            >
              <div className='flex flex-row items-center justify-between space-x-4'>
                <InputNumber
                  min={item.min ?? undefined}
                  max={item.max ?? undefined}
                  style={{ width: "48%" }}
                  value={rangeParams[`${item.name}_min`]}
                  onChange={(value) =>
                    handleChangeRange(`${item.name}_min`, value)
                  }
                />
                <SwapRightOutlined />
                <InputNumber
                  min={item.min ?? undefined}
                  max={item.max ?? undefined}
                  style={{ width: "48%" }}
                  value={rangeParams[`${item.name}_max`]}
                  onChange={(value) =>
                    handleChangeRange(`${item.name}_max`, value)
                  }
                />
              </div>
            </Form.Item>
          );
          break;
      }
    });
    return FormItems;
  };

  const handleReset = () => {
    form.resetFields();
    setRangeParams({});
  };

  const handleSearch = () => {
    form
      .validateFields()
      .then((values) => {
        const filteredVals: Record<string, string | number | boolean> = {};
        Object.entries(values).forEach(([key, value]) => {
          if (value) {
            filteredVals[key] =
              typeof value === "string" ? value.trim() : (value as any);
          }
        });

        onSearch({ ...filteredVals, ...rangeParams });
      })
      .catch(() => {
        api["warning"]({
          message: "Please check the input",
        });
      });
  };

  return (
    <>
      <Popover
        arrow={false}
        overlayInnerStyle={{ padding: 0, minWidth: 360 * filters.length }}
        content={
          <div className='flex flex-col'>
            <div className='flex flex-row p-3'>
              <Form
                form={form}
                layout='vertical'
                style={{ width: "100%" }}
                // onValuesChange={onRequiredTypeChange}
              >
                <Row gutter={24}>
                  {filters.map((filterGroup, index) => {
                    return (
                      <Col
                        span={24 / filters.length}
                        key={`filter-group-${index}`}
                      >
                        {renderFormItem(filterGroup)}
                      </Col>
                    );
                  })}
                </Row>
              </Form>
            </div>

            <div className='flex flex-row p-3  justify-end space-x-4 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.04)]'>
              <div>
                <Button onClick={handleReset}>Reset</Button>
              </div>
              <div>
                <Button type='primary' onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        }
        title={
          <div className='flex flex-row items-center justify-between p-3 bg-[rgba(0,0,0,0.02)] dark:bg-[rgba(255,255,255,0.04)]'>
            <div>Search</div>
            <div>
              <Button onClick={hide} type='text'>
                <X />
              </Button>
            </div>
          </div>
        }
        trigger='click'
        open={open}
        onOpenChange={handleOpenChange}
        placement='bottomRight'
      >
        <Button
          style={{ borderColor: active ? token.colorPrimary : undefined }}
        >
          <Filter size={16} color={active ? token.colorPrimary : undefined} />
          {active}
        </Button>
      </Popover>
      {contextHolder}
    </>
  );
};
