declare namespace API {
  interface AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string;
    response?: AxiosResponse;
    request?: any;
    stack?: string;
  }

  type ModelRes = {
    meta: {
      code: string | number;
      message?: string;
    };
    data?: any;
  };

  // define types from here...
  type Role = {
    id: string;
    name: string;
    created_at: string;
  };

  type User = {
    id: string;
    username: string;
    email: string;
    linkedin?: string;
    status: string;
    roles: Role[];
    created_at: string;
  };

  type UserPayload = {
    username: string;
    email: string;
    password: string;
    roles?: string[];
  };

  type Job = {
    id: string;
    title: string;
    description: string;
    skills: string;
    status: "Draft" | "Open" | "Closed";
    created_by: string;
  };

  type QuestionaireItem = {
    id: string;
    description: string;
    type: string;
    answer?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
  };

  type Questionaire = {
    id: string;
    title: string;
    description: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    standard_scores?: number;
    questionaire_items?: QuestionaireItem[];
  };

  type NewQuestionairePayload = Omit<
    Questionaire,
    "id" | "created_at" | "updated_at" | "questionaire_items"
  > & {
    questionaire_item_ids?: string[];
  };

  type UpdateQuestionarePayload = Omit<
    Questionaire,
    "created_at" | "updated_at" | "questionaire_items"
  > & {
    questionaire_item_ids?: string[];
  };

  export interface Tag {
    id: number;
    name: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
}

type OnlineResume = {
  fullName: string;
  email: string;
  phone: string;
  summary: any;
  experience: any;
  education: any;
  skills: any;
};
