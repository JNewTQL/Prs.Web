export interface IPagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
