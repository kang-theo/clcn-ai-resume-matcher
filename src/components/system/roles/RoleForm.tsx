"use client";
import useRoles from "@/hooks/useRoles";
import { Button, Card, Form, Input, notification } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface IProps {
  headless?: boolean;
  onComplete?: () => void;
  roleId?: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 24 },
};

export function RoleForm({ headless = false, onComplete, roleId }: IProps) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, fetchRolesError] = useRoles({ roleId });

  useEffect(() => {
    if (fetchRolesError) {
      api.error({
        message: fetchRolesError.message,
      });
    }
    if (roles) form.setFieldsValue(roles[0]);
  }, [roles]);

  const handleSave = async () => {
    form
      .validateFields()
      .then((values) => {
        if (!roleId) {
          return axios.post("/api/admin/system/roles", values);
        } else {
          return axios.put(`/api/admin/system/roles/${roleId}`, values);
        }
      })
      .then(({ data }) => {
        setLoading(false);
        if (data.meta.code === "OK") {
          api.success({
            message: roleId
              ? "Update role successfully"
              : "Create role successfully",
          });
          form.resetFields();
          if (onComplete) onComplete();
        } else {
          api.error({
            message: "Failed to operate, please contact admin",
          });
        }
      })
      .catch(() => {
        setLoading(false);
        api.error({
          message: "Please check input",
        });
      });
  };

  const handleReset = () => {};

  return (
    <div>
      <div className='space-y-2'>
        {contextHolder}
        <Card bordered={false} style={{ boxShadow: headless ? "none" : "" }}>
          {!headless && <div className='text-xl mb-4'>New Role</div>}
          <div className='flex items-center justify-center space-x-2 mb-2'>
            <Form
              form={form}
              layout='vertical'
              {...layout}
              onFinish={handleSave}
              style={{ width: 600 }}
            >
              <Form.Item
                name={"name"}
                label='Name'
                rules={[{ required: true, message: "Please input role name" }]}
              >
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
    </div>
  );
}

export default RoleForm;
