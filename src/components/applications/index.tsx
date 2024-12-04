"use client";
import React, { useEffect, useRef, useState } from "react";
import type { GetProp, MenuProps, TableProps } from "antd";
import DOMPurify from "dompurify";
import {
  Button,
  Card,
  Drawer,
  Dropdown,
  Modal,
  Spin,
  Table,
  Tooltip,
  notification,
  Breadcrumb,
  message,
  Space,
} from "antd";
import axios from "axios";
import { EllipsisVertical, Info, RefreshCw, TriangleAlert } from "lucide-react";
import { IFilter, SearchPanel } from "@/components/common/SearchPanel";
// import ApplicationDetail, { ApplicationDetailHandlers } from "./Detail";

type ColumnsType<T> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;
type SizeType = TableProps["size"];
type TableRowSelection<T> = TableProps<T>["rowSelection"];

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

interface DataType {
  id: string;
  name: string;
}

interface IProps {
  title?: string;
  size?: SizeType;
  url: string;
  onSave?: (ids: React.Key[]) => void;
  filters?: IFilter[][];
}

const { confirm } = Modal;

const defaultFilters: IFilter[][] = [
  [
    {
      type: "Input",
      label: "Name",
      name: "name",
    },
  ],
];

function ApplicationList({
  title = "Applications",
  size = "small",
  url,
  filters = defaultFilters,
}: IProps) {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      hideOnSinglePage: true,
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedItem, setselectedItem] = useState<DataType | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [ApplicationFormVisible, setApplicationFormVisible] =
    useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [operating, setOperating] = useState(false);
  // const ApplicationDetailRef = useRef<ApplicationDetailHandlers>(null);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(url, {
        params: {
          page: tableParams.pagination?.current,
          pageSize: tableParams.pagination?.pageSize,
          search: tableParams.filters,
          sortField: tableParams.sortField,
          sortOrder: tableParams.sortOrder,
          // single sorter
          // { [tableParams.sortField as string]: tableParams.sortOrder },
          // multiple sorters
          // sort: [{ [tableParams.sortField as string]: tableParams.sortOrder }],
        },
        // {
        //   page: tableParams.pagination?.current,
        //   pageSize: tableParams.pagination?.pageSize,
        //   filters: tableParams.filters,
        //   sorter: tableParams.sorter,
        // },
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.meta.code === "OK") {
          setData(data.result.records);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              current: data.result.pagination.page,
              total: data.result.pagination.total,
            },
          });
        } else {
          api["warning"]({
            message: "Application",
            description:
              data.message ||
              "Failed to get applications, please contact administrator",
          });
        }
      })
      .catch((error: API.AxiosError) => {
        setLoading(false);
        api["error"]({
          message: "Applications",
          description:
            error.response.data.message ||
            "Failed to get applications, please contact administrator",
        });
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(tableParams.filters),
  ]);

  const handleDelete = (ids: React.Key[]) => {
    confirm({
      title: "Are you sure to delete selected applications",
      icon: <TriangleAlert color='#ff4d4f' className='mr-2' />,
      content: "Deleted applications will not be able to recover",
      okType: "danger",
      onOk() {
        return axios
          .delete(url, {
            data: {
              ids,
            },
          })
          .then(({ data }) => {
            if (!data.code) {
              fetchData();
              api["success"]({
                message: "Delete applications successfully",
              });
              setSelectedRowKeys([]);
            } else {
              api["warning"]({
                message: "Applications",
                description:
                  data.message ||
                  "Failed to delete applications, please contact the administrator.",
              });
            }
          })
          .catch((error: API.AxiosError) => {
            api["error"]({
              message: "Applications",
              description:
                error.response.data.message ||
                "Failed to delete applications, please contact the administrator.",
            });
          });
      },
    });
  };

  const handleItemAction = ({ key }: { key: string }) => {
    const [action, id] = key.split("|");
    setselectedItem(data?.find((item) => item.id === id) ?? null);
    switch (action) {
      case "show":
        setApplicationFormVisible(true);
        break;
      case "delete":
        handleDelete([id]);
        break;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Job Title",
      dataIndex: "title",
      width: 280,
      ellipsis: true,
    },
    {
      title: "Applicant",
      dataIndex: "email",
      width: 280,
      ellipsis: true,
    },
    {
      title: "Resume",
      dataIndex: "content",
      width: 280,
      ellipsis: true,
    },
    {
      title: "Action",
      width: 60,
      render: (_, record) => {
        return (
          <div className='flex items-center'>
            <Dropdown
              menu={{
                items: [
                  {
                    label: "show",
                    key: `show|${record.id}`,
                  },
                  {
                    label: <span className='text-red-500'>Delete</span>,
                    key: `delete|${record.id}`,
                  },
                ],
                onClick: handleItemAction,
              }}
              trigger={["click"]}
              className='flex items-center'
            >
              <div>
                <EllipsisVertical size={16} />
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter: any
  ) => {
    setTableParams({
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters: {
        ...tableParams.filters,
        ...filters,
      },
      // single column sorter
      sortField: sorter.field,
      sortOrder: sorter.order,
      // ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleActions: MenuProps["onClick"] = (e: { key: string }) => {
    switch (e.key) {
      case "delete-selections":
        handleDelete(selectedRowKeys);
        break;
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Breadcrumb
        items={[{ title: "Dashboard" }, { title: "Applications" }]}
        style={{ margin: "8px 0" }}
      ></Breadcrumb>

      <div className='space-y-2'>
        <Card className='main-content-h'>
          {contextHolder}
          <Spin spinning={spinning}>
            <div className='text-xl mb-4'>{title}</div>
            <div className='flex items-center justify-end space-x-2 mb-2'>
              <Button onClick={() => fetchData()}>
                <RefreshCw size={16} />
              </Button>
              <SearchPanel
                onSearch={(values: any) => {
                  setTableParams({
                    ...tableParams,
                    filters: values,
                    // {
                    //   ...tableParams.filters,
                    //   ...values,
                    // },
                  });
                }}
                filters={filters ?? defaultFilters}
                active={
                  tableParams.filters
                    ? Object.values(tableParams.filters).length > 0
                    : false
                }
              />
              <div>
                <Button>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          label: (
                            <div className='flex items-center justify-between'>
                              <span
                                className={`mr-2 ${selectedRowKeys.length && "text-[#ff4d4f]"
                                  }`}
                              >
                                Delete
                              </span>
                              <Tooltip
                                title={
                                  "Deleted applications can not be restored"
                                }
                              >
                                <Info size={16} />
                              </Tooltip>
                            </div>
                          ),
                          key: "delete-selections",
                          disabled: !selectedRowKeys.length,
                        },
                      ],
                      onClick: handleActions,
                    }}
                    trigger={["click"]}
                    className='flex items-center'
                  >
                    <div>
                      <EllipsisVertical size={16} />
                    </div>
                  </Dropdown>
                </Button>
              </div>
            </div>
            <div>
              <Table
                size={size}
                columns={columns}
                rowKey={"id"}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                onChange={handleTableChange}
                rowSelection={rowSelection}
              />
            </div>
          </Spin>
          <Drawer
            width={800}
            closable
            destroyOnClose
            title={selectedItem ? "Show Application" : "Add Application"}
            placement='right'
            open={ApplicationFormVisible}
            onClose={() => {
              setApplicationFormVisible(false);
              setselectedItem(null);
            }}
            // styles={{ body: { padding: 0 } }}
            extra={
              <Space>
                <Button
                  type='primary'
                  loading={operating}
                  onClick={() => {
                    setOperating(true);
                    // ApplicationFormRef?.current?.executeOperation();
                  }}
                >
                  {selectedItem ? "Update" : "Create"}
                </Button>
              </Space>
            }
          >
            Application Detail
          </Drawer>
        </Card>
        {contextHolder}
      </div>
    </div>
  );
}

export default ApplicationList;
