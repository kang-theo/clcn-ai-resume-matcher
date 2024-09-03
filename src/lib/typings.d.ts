declare namespace API {
  interface AxiosError extends Error {
    config: AxiosRequestConfig;
    code?: string;
    response?: AxiosResponse;
    request?: any;
    stack?: string;
  }

  // define types from here...
}
