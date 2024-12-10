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

  interface IJob {
    id: number;
    title: string;
    company: {
      name: string;
      logo: string;
      about: string;
      size: string;
      industry: string;
      website?: string;
      location: string;
    };
    employment: {
      type: string; // "Full-time" | "Part-time" | "Contract"
      location_type: string; // "Remote" | "Hybrid" | "On-site"
      experience_level: string;
    };
    salary: {
      min: number;
      max: number;
      currency: string;
      period: string; // "yearly" | "monthly" | "hourly"
    };
    description: string;
    requirements: {
      must_have: string[];
      nice_to_have?: string[];
    };
    responsibilities: string[];
    benefits?: string[];
    skills: string[];
    posted_at: string;
    deadline?: string;
    applicants_count: number;
  }

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
