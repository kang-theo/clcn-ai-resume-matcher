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
  Tag,
  message,
} from "antd";
import axios from "axios";
import {
  EllipsisVertical,
  Info,
  RefreshCw,
  TriangleAlert,
  User,
} from "lucide-react";
import { formatDatetime } from "@/lib/utils";
import { IFilter, SearchPanel } from "@/components/common/SearchPanel";
import UserForm from "./UserForm";

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
      label: "Username",
      name: "username",
    },
    {
      type: "Input",
      label: "Email",
      name: "email",
    },
    {
      type: "Select",
      label: "Status",
      name: "status",
      options: [
        {
          label: "Active",
          value: 1,
        },
        {
          label: "Inactive",
          value: 0,
        },
      ],
    },
    {
      type: "DatePicker",
      label: "Created At",
      name: "created_at",
    },
  ],
];

const renderStatus = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return <Tag color='green'>Active</Tag>;
    case "INACTIVE":
      return <Tag color='red'>Inactive</Tag>;
    default:
      // DELETED
      return <Tag color='blue'>DELETED</Tag>;
  }
};

const renderRoles = (
  roles: { assigned_at: string; assigned_by: string; role: { name: string } }[]
) => {
  return roles.map((role) => (
    <Tag key={role.role.name} color='purple'>
      {role.role.name}
    </Tag>
  ));
};

function UserList({
  title = "Users",
  size = "small",
  url,
  filters = defaultFilters,
}: IProps) {
  const [api, contextHolder] = notification.useNotification();
  const [data, setData] = useState<API.User[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      hideOnSinglePage: true,
      current: 1,
      pageSize: 10,
    },
  });

  const [selectedItem, setselectedItem] = useState<API.User | null>(null);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [userFormVisible, setUserFormVisible] = useState<boolean>(false);
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
            message: "Users",
            description:
              data.message ||
              "Failed to get users, please contact administrator",
          });
        }
      })
      .catch((error: API.AxiosError) => {
        setLoading(false);
        api["error"]({
          message: "Users",
          description:
            error.response.data.message ||
            "Failed to get users, please contact administrator",
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
      title: "Are you sure to delete selected users",
      icon: <TriangleAlert color='#ff4d4f' className='mr-2' />,
      content: "Deleted users will not be able to recover",
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
                message: "Delete users successfully",
              });
              setSelectedRowKeys([]);
            } else {
              api["warning"]({
                message: "Users",
                description:
                  data.message ||
                  "Failed to delete users, please contact the administrator.",
              });
            }
          })
          .catch((error: API.AxiosError) => {
            api["error"]({
              message: "Users",
              description:
                error.response.data.message ||
                "Failed to delete users, please contact the administrator.",
            });
          });
      },
    });
  };

  const handleItemAction = ({ key }: { key: string }) => {
    const [action, id] = key.split("|");
    setselectedItem(data?.find((item) => item.id === id) ?? null);
    switch (action) {
      case "view":
        message.warning("User detail is in progress");
        setDetailVisible(true);
        break;
      case "edit":
        setUserFormVisible(true);
        break;
      case "delete":
        handleDelete([id]);
        break;
    }
  };

  const columns: ColumnsType<API.User> = [
    {
      title: "Username",
      dataIndex: "username",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "Roles",
      dataIndex: "roles",
      width: 200,
      ellipsis: true,
      render: renderRoles,
    },
    {
      title: "LinkedIn",
      dataIndex: "linkedin",
      width: 200,
      ellipsis: true,
      render: (linkedin) => linkedin ?? "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      render: renderStatus,
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
                    label: "Show",
                    key: `view|${record.id}`,
                  },
                  {
                    label: "Edit",
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

  const handleTableChange: TableProps<API.User>["onChange"] = (
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
        setUserFormVisible(true);
        break;
      case "delete-selections":
        handleDelete(selectedRowKeys);
        break;
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<API.User> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          { title: "System" },
          { title: "Users" },
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
                              <Tooltip title={"Create new user by manual"}>
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
                                title={"Deleted users can not be restored"}
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
            width={480}
            closable
            destroyOnClose
            title={selectedItem ? "Edit User" : "Add User"}
            placement='right'
            open={userFormVisible}
            onClose={() => {
              setUserFormVisible(false);
              setselectedItem(null);
            }}
            styles={{ body: { padding: 0 } }}
          >
            <UserForm
              headless
              userId={selectedItem?.id}
              onComplete={() => fetchData()}
            />
          </Drawer>
        </Card>
        {contextHolder}
      </div>
    </div>
  );
}

export default UserList;
