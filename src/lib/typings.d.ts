declare namespace API {
  interface AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string;
    response?: AxiosResponse;
    request?: any;
    stack?: string;
  }

  // define types from here...
  type Role = {
    id: string;
    name: string;
    created_at: string;
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
    "created_at" | "updated_at"
  > & {
    questionaire_item_ids?: string[];
  };
}
