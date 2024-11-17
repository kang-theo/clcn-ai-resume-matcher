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
import UserList from "../system/users";
import ResumeEditor from "../common/Editor";
// import { DataType } from ".";
// import type { GetProp, UploadProps } from "antd";

// type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const { Search } = Input;

interface IProps {
  url: string;
  onComplete: () => void;
  onError: (error?: any) => void;
  method: "post" | "put";
  jobId?: string | undefined;
}

export type JobFormHandlers = {
  reset: () => void;
  executeOperation: () => void;
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const JobForm = forwardRef<JobFormHandlers, IProps>((props, ref) => {
  // const { token } = theme.useToken();
  // const context = useContext(JobContext);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState<boolean>(false);
  // Destructure the props if needed
  const { url, onComplete, onError, jobId, method } = props;
  const [job, setJob] = useState<API.Job | null>(null);

  useEffect(() => {
    if (method === "put") {
      // fetch the job detail
      setLoading(true);
      axios
        .get(`${url}/jobs/${jobId}`)
        .then(({ data }) => {
          setLoading(false);
          if (data.meta.code === "OK") {
            form.setFieldsValue(data.result);
            setJob(data.result);
          } else {
            api["error"]({
              message: "Fetch job info",
              description: data.message || "Failed to get job info",
            });
          }
        })
        .catch((error: API.AxiosError) => {
          setLoading(false);
          api["error"]({
            message: "Fetch job info",
            description:
              error.response.data.message || "Failed to get job info",
          });
        });
    }
  }, [url, method, jobId]);

  useImperativeHandle(ref, () => ({
    reset() {
      form.resetFields();
    },
    executeOperation() {
      const title = method === "post" ? "Add job" : "Update job";
      form
        .validateFields()
        .then((values) => {
          return axios({
            method,
            url:
              method === "post"
                ? "/api/admin/jobs"
                : `/api/admin/jobs/${jobId}`,
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
          initialValues={{ ...job, status: "Draft" }}
          // style={{ width: 600 }}
        >
          <Form.Item
            name={"title"}
            label='Title'
            rules={[{ required: true, message: "Please input job title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={"status"}
            label='Status'
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              placeholder='Please select status'
              options={[
                {
                  label: "Draft",
                  value: "Draft",
                },
                {
                  label: "Open",
                  value: "Open",
                },
                {
                  label: "Closed",
                  value: "Closed",
                },
              ]}
              allowClear
            ></Select>
          </Form.Item>
          <Form.Item
            name={"description"}
            label='Description'
            rules={[
              { required: true, message: "Please input job description" },
            ]}
          >
            {/* <Input.TextArea rows={20} /> */}
            <ResumeEditor
              title='Job Description'
              fetching={false}
              url={""}
              value={""}
              saveType='json'
              onSave={(content: string) => console.log({ content })}
              // onComplete={() => noteModal.destroy()}
              onChange={(content: any) =>
                form.setFieldsValue({ description: content })
              }
            />
          </Form.Item>
          <Form.Item
            name={"skills"}
            label='Skills'
            rules={[
              { required: true, message: "Please input job required skills" },
            ]}
          >
            <ResumeEditor
              title='Job Skills'
              fetching={false}
              url={""}
              value={""}
              saveType='json'
              onSave={(content: string) => console.log({ content })}
              // onComplete={() => noteModal.destroy()}
              onChange={(content: any) =>
                form.setFieldsValue({ skills: content })
              }
            />
          </Form.Item>
        </Form>
      </Spin>
      {/* <Modal
        width={680}
        height={600}
        title='Select questionaire'
        open={questionaireModalVis}
        onCancel={() => setQuestionaireModalVis(false)}
        footer={null}
        closable
        destroyOnClose
      >
        <QuestionareList
          title=''
          url='/api/admin/system/users'
          mode='mini'
          onComplete={(questionare: {
            id: string;
            title: string;
          }) => {
            setQuestionaireModalVis(false);
            form.setFieldValue("questionaire", questionare.title);
            setSelectedQuestionare(questionare.id);
          }}
        />
      </Modal> */}
    </>
  );
});

JobForm.displayName = "JobForm";

export default JobForm;
