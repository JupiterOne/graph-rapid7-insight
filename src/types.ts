export type Link = {
  rel: string;
  href: string;
};

export type CommonResponse<T> = {
  data: T[];
  metadata: {
    number: number;
    size: number;
    totalResources: number;
    totalPages: number;
    cursor?: number;
  };
  links: Link[];
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

export type Site = {
  name: string;
  type: string;
};
