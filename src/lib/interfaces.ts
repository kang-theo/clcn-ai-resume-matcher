// ?pageNo=1&pageSize=10&search[name]=foobar&search[age]=38&sort
export interface ITableParams {
  page: number;
  pageSize: number;
  search?: Record<string, any>;
  // full text search
  q?: string;
  sortField: string;
  sortOrder: string;
}
