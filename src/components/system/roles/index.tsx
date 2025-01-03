"use client";
import React, { useEffect, useState } from "react";
import type { GetProp, MenuProps, TableProps } from "antd";
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
} from "antd";
import axios from "axios";
import { EllipsisVertical, Info, RefreshCw, TriangleAlert } from "lucide-react";
import { formatDatetime } from "@/lib/utils";
import { IFilter, SearchPanel } from "@/components/common/SearchPanel";
import RoleForm from "./RoleForm";

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

function RoleList({
  title = "Roles",
  size = "small",
  url,
  filters = defaultFilters,
}: IProps) {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState<API.Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      hideOnSinglePage: true,
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedItem, setselectedItem] = useState<API.Role | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [roleFormVisible, setRoleFormVisible] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
        },
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
            message: "Roles",
            description:
              data.message ||
              "Failed to get roles, please contact administrator",
          });
        }
      })
      .catch((error: API.AxiosError) => {
        setLoading(false);
        api["error"]({
          message: "Roles",
          description:
            error.response.data.message ||
            "Failed to get roles, please contact administrator",
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    JSON.stringify(tableParams.filters),
  ]);

  const handleDelete = (ids: React.Key[]) => {
    confirm({
      title: "Are you sure to delete selected roles",
      icon: <TriangleAlert color='#ff4d4f' className='mr-2' />,
      content: "Delete role will make assigned roles lose access to this role",
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
                message: "Delete roles successfully",
              });
              setSelectedRowKeys([]);
            } else {
              api["warning"]({
                message: "Roles",
                description:
                  data.message ||
                  "Failed to delete roles, please contact the administrator.",
              });
            }
          })
          .catch((error: API.AxiosError) => {
            api["error"]({
              message: "Roles",
              description:
                error.response.data.message ||
                "Failed to delete roles, please contact the administrator.",
            });
          });
      },
    });
  };

  const handleItemAction = ({ key }: { key: string }) => {
    const [action, id] = key.split("|");
    setselectedItem(data?.find((item) => item.id === id) ?? null);
    switch (action) {
      case "edit":
        setRoleFormVisible(true);
        break;
      case "delete":
        handleDelete([id]);
        break;
    }
  };

  const columns: ColumnsType<API.Role> = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: 200,
    },
    {
      title: "Assigned users",
      dataIndex: "assigned_users",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: 160,
      sorter: true,
      render: formatDatetime,
    },
    {
      title: "Action",
      width: 120,
      render: (_, record) => {
        return (
          <div className='flex items-center'>
            <Dropdown
              menu={{
                items: [
                  {
                    label: <span>Edit</span>,
                    key: `edit|${record.id}`,
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

  const handleTableChange: TableProps<API.Role>["onChange"] = (
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
      case "add":
        setRoleFormVisible(true);
        break;
      case "delete-selections":
        handleDelete(selectedRowKeys);
        break;
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<API.Role> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "System" },
          { title: "Roles" },
        ]}
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
                              <span className='mr-2'>New</span>
                              <Tooltip title={"Create new role by manual"}>
                                <Info size={16} />
                              </Tooltip>
                            </div>
                          ),
                          key: "add",
                        },
                        {
                          label: (
                            <div className='flex items-center justify-between'>
                              <span
                                className={`mr-2 ${
                                  selectedRowKeys.length && "text-[#ff4d4f]"
                                }`}
                              >
                                Delete
                              </span>
                              <Tooltip
                                title={"Deleted roles can not be restored"}
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
            width={680}
            closable
            destroyOnClose
            title={
              selectedItem ? `Edit role: ${selectedItem.name}` : "New role"
            }
            placement='right'
            open={roleFormVisible}
            onClose={() => setRoleFormVisible(false)}
            styles={{ body: { padding: 0 } }}
          >
            <RoleForm
              roleId={selectedItem?.id}
              headless
              onComplete={() => {
                fetchData();
                setRoleFormVisible(false);
              }}
            />
          </Drawer>
        </Card>
        {contextHolder}
      </div>
    </div>
  );
}

export default RoleList;
