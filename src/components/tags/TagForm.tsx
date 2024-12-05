import {
  Col,
  ColorPicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
  Spin,
  Upload,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import axios from "axios";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

// import { DataType } from ".";
// import type { GetProp, UploadProps } from "antd";

// type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Search } = Input;

interface IProps {
  url: string;
  onComplete: () => void;
  onError: (error?: any) => void;
  method: "post" | "put";
  tagId?: string | undefined;
}

export type TagFormHandlers = {
  reset: () => void;
  executeOperation: () => void;
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const TagForm = forwardRef<TagFormHandlers, IProps>((props, ref) => {
  // const { token } = theme.useToken();
  // const context = useContext(TagContext);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  // Destructure the props if needed
  const { url, onComplete, onError, tagId, method } = props;
  const [tag, setTag] = useState<API.Tag | null>(null);

  useEffect(() => {
    if (method === "put") {
      // fetch the tag detail
      setLoading(true);
      axios
        .get(`${url}/${tagId}`)
        .then(({ data }) => {
          setLoading(false);
          if (data.meta.code === "OK") {
            form.setFieldsValue(data.result);
            setTag(data.result);
          } else {
            api["error"]({
              message: "Fetch tag info",
              description: data.message || "Failed to get tag info",
            });
          }
        })
        .catch((error: API.AxiosError) => {
          setLoading(false);
          api["error"]({
            message: "Fetch tag info",
            description:
              error.response.data.message || "Failed to get tag info",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, method, tagId]);

  useImperativeHandle(ref, () => ({
    reset() {
      form.resetFields();
    },
    executeOperation() {
      const title = method === "post" ? "Add tag" : "Update tag";
      form
        .validateFields()
        .then((values) => {
          return axios({
            method,
            url:
              method === "post"
                ? "/api/admin/tags"
                : `/api/admin/tags/${tagId}`,
            data: values,
          });
        })
        .then(({ data }) => {
          if (data.meta.code === "OK") {
            onComplete();
            form.resetFields();
          } else {
            onError();
            api["warning"]({
              message: title,
              description:
                data.meta.message ||
                "Failed to execute operation, please contact admin。",
            });
          }
        })
        .catch(() => {
          onError();
          api.error({
            message: title,
            description: "Failed to execute operation, please contact admin。",
          });
        });
    },
  }));

  if (loading) {
    return <Skeleton active />;
  }

  return (
    <>
      {contextHolder}
      <Spin spinning={spinning}>
        <Form
          form={form}
          layout='vertical'
          {...layout}
          initialValues={{ ...tag || {}, status: "Draft" }}
          // style={{ width: 600 }}
        >
          <Form.Item
            name={"name"}
            label='Name'
            rules={[{ required: true, message: "Please input tag title" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
});

TagForm.displayName = "TagForm";

export default TagForm;
