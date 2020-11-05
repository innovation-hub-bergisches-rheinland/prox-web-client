export interface PageableOptions {
  notPaged?: boolean;
  size?: number;
  sort?: {
    path: string;
    order: 'DESC' | 'ASC';
  }[];
  params?: {
    key: string;
    value: string | number | boolean;
  }[];
}
