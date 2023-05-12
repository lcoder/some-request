import { isURLSearchParams } from './index';
import { defaultSerializer } from './query-serializer';


/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export function buildURL(url: string, params: any, paramsSerializer?: (p: any) => string) {
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    serializedParams = defaultSerializer(url, params);
  }

  if (serializedParams) {
    var hmarkIndex = url.indexOf('#');
    if (hmarkIndex !== -1) {
      url = url.slice(0, hmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};
