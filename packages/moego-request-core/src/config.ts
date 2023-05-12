import { Observable } from 'rxjs';
import { getDefaultAdapter } from './adapters';
import {
  defaultValidateStatus,
  defaultSerializer,
} from './config-default';
import { ReqConfig } from './config-type';
import { isObject } from './helper';
import { Method, ResponseType } from './type';

/**
 * 判断是否是RequestConfig
 * @param val 
 * @returns 
 */
export const isReqConfig = (val: any): val is ReqConfig => {
  if (
    isObject(val)
    && val.url !== undefined
    && val.method !== undefined
  ) {
    return true;
  }
  return false;
}

export class RequestConfig implements ReqConfig {
  public baseURL = '';

  public async = true;

  public method = Method.GET;

  public url = '';

  public adapter = getDefaultAdapter()!;

  public beforeSends = [];

  public createXHR = () => new XMLHttpRequest();

  public validateStatus = defaultValidateStatus;

  public headers = {};

  public query = '';

  public body = null;

  public querySerializer = defaultSerializer;

  public timeout = 0;

  public responseType = ResponseType.Json;

  public withCredentials = false;

  public xsrfCookieName = '';

  public xsrfHeaderName = '';

  public crossDomain = false;

  public includeDownloadProgress = false;

  public includeUploadProgress = false;

  constructor(config?: Partial<ReqConfig>) {
    Object.assign(this, config);
  }
}
