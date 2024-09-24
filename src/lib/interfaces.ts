// ?pageNo=1&pageSize=10&search[name]=foobar&search[age]=38&sort
export interface ITableParams {
  page: number;
  pageSize: number;
  search?: Record<string, any>;
  sortField: string;
  sortOrder: string;
}
