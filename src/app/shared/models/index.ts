export interface IResponse<T> {
  data: T;
  meta?: IMeta;
}

export interface IMeta {
  currentPage: number;
  itemsPerPage: number;
  message: string;
  status: number;
  totalItems: number;
}
