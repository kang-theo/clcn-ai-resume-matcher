"use client";
import useRoles from "@/hooks/useRoles";
import { Button, Card, Form, Input, Select, Spin, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { USER_STATUS } from "@/lib/constant";

interface IProps {
  headless?: boolean;
  onComplete?: () => void;
  userId?: string | undefined;
}

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 24 },
};

export function UserForm({ headless = false, onComplete, userId }: IProps) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, fetchRolesError] = useRoles({});
  const [selectedUser, setSelectedUser] = useState<API.User | null>(null);

  useEffect(() => {
    if (fetchRolesError) {
      api.error({
        message: fetchRolesError.message,
      });
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`/api/system/users/${userId}`)
        .then(({ data }) => {
          if (data.meta.code === "OK") {
            setSelectedUser(data.result);
            form.setFieldsValue(data.result);
          } else {
            api.error({
              message: "Failed to fetch user",
            });
          }
          setLoading(false);
        })
        .catch((error: API.AxiosError) => {
          api.error({
            message: error.response.data.message || "Failed to fetch user",
          });
          setLoading(false);
        });
    }
  }, [userId]);

  const handleSave = async () => {
    form
      .validateFields()
      .then((values) => {
        if (
          values.password &&
          values.password_confirmation &&
          values.password !== values.password_confirmation
        ) {
          throw new Error("Password and password confirmation do not match");
        }

        if (!userId) {
          return axios.post("/api/system/users", {
            ...values,
            password_confirmation: undefined,
          });
        } else {
          return axios.put(`/api/system/users/${userId}`, values);
        }
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.meta.code === "OK") {
          api.success({
            message: "Create user successfully",
          });
          form.resetFields();
          if (onComplete) onComplete();
        } else {
          api.error({
            message: "Failed to create user, please contact admin",
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        api.error({
          message: error.message || "Please check input",
        });
      });
  };

  const handleReset = () => {};

  return (
    <Spin spinning={loading}>
      <div className='space-y-2'>
        {contextHolder}
        <Card bordered={false} style={{ boxShadow: headless ? "none" : "" }}>
          {!headless && <div className='text-xl mb-4'>New User</div>}
          <div className='flex items-center justify-center space-x-2 mb-2'>
            <Form
              form={form}
              layout='vertical'
              {...layout}
              onFinish={handleSave}
              style={{ width: 600 }}
            >
              <Form.Item
                name={"email"}
                label='Email'
                rules={[{ required: true, message: "Please input email" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"username"}
                label='Username'
                rules={[{ required: true, message: "Please input user name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={"password"}
                label='Password'
                rules={[{ required: true, message: "Please input password" }]}
              >
                <Input.Password disabled={userId ? true : false} />
              </Form.Item>
              <Form.Item
                name={"password_confirmation"}
                label='Password Confirmation'
                rules={[
                  { required: true, message: "Please repeat above password" },
                ]}
              >
                <Input.Password disabled={userId ? true : false} />
              </Form.Item>
              <Form.Item
                name={"roles"}
                label='Roles'
                rules={[
                  {
                    required: true,
                    message: "Please select at least one role",
                  },
                ]}
              >
                <Select
                  mode='multiple'
                  maxTagTextLength={70}
                  maxTagCount={3}
                  options={roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                    key: role.id,
                  }))}
                  allowClear
                ></Select>
              </Form.Item>
              <Form.Item
                name={"status"}
                label='Status'
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select
                  options={Object.entries(USER_STATUS).map(
                    ([label, value]) => ({
                      value,
                      label,
                      key: label,
                    })
                  )}
                  allowClear
                ></Select>
              </Form.Item>
              <Form.Item name={"linkedin"} label='LinkedIn'>
                <Input />
              </Form.Item>
              <div className='mt-5 space-x-4 text-center'>
                <Button onClick={handleReset}>Reset</Button>
                <Button
                  type='primary'
                  loading={loading}
                  htmlType='submit'
                  className='!shadow-none'
                >
                  Save
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </Spin>
  );
}

export default UserForm;
