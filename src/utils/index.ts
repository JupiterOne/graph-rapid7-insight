import { URLSearchParams, URL } from 'url';

export function buildQueryParams(params: { [key: string]: string }) {
  return `?${new URLSearchParams(params)}`;
}

export function isUrl(string: string): boolean {
  try {
    new URL(string);

    return true;
  } catch (_) {
    return false;
  }
}
