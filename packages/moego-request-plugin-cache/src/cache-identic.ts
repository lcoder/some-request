import { Method, ReqConfig } from '@moego/moego-request-core';

export const defaultCacheIdentic = (config: ReqConfig) => {
  const Allowed = [
    Method.GET,
    Method.PUT,
    Method.DELETE,
    Method.HEAD,
  ];
  const {
    method,
    url,
    baseURL,
    query,
    querySerializer,
  } = config;
  if (
    Allowed.includes(method)
  ) {
    const lastUrl = querySerializer(baseURL + url, query);
    return lastUrl;
  }
  return '';
}
