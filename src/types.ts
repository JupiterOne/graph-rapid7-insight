export enum ProductCode {
  INSIGHT_VM = 'IVM',
  INSIGHT_APP_SEC = 'AS',
}

export type Link = {
  rel: string;
  href: string;
};

export type Rapid7ApiCallback<T> = (
  data: T[],
) => boolean | void | Promise<boolean | void>;

export type Product = {
  product_token: string;
  product_code: string;
  organization_id: string;
  organization_name: string;
};

export type SeachBody = {
  query: string;
  type: string;
};
