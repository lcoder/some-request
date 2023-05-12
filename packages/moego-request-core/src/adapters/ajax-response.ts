import type { ReqConfig } from '../config-type';
import { AjaxResponseType } from './types';
import { getXHRResponse } from './xhr/xhr-response';

/**
 * Ajax请求的响应对象
 *
 */
export class AjaxResponse<T, ExtConf extends Record<string, any> = {}> {
  /** 提供给插件使用 */
  readonly extend: any = {};
  /** http状态码 */
  readonly status: number;
  /** 经过处理的响应体 */
  readonly response: T;
  /** 响应体的类型 */
  readonly responseType: XMLHttpRequestResponseType;
  /** 已经下载了多少字节的内容 */
  readonly loaded: number;
  /** 要加载的全部内容大小 */
  readonly total: number;
  /** 响应头部 */
  readonly responseHeaders: Record<string, string>;
  /**
   * 格式话过的响应对象
   * @param originalEvent xhr onload的事件对象
   * @param xhr 发送请求的xhr对象
   * @param request 发送的请求配置项
   * @param type 由ajax Observable发出的事件类型
   */
  constructor(
    // 原始事件，不标准，提取需要的传出去
    originalEvent: ProgressEvent,
    // xhr存储起来容易造成内存泄漏，毕竟挂了很多事件在上面
    xhr: XMLHttpRequest,
    /** 原始请求配置项 */
    public readonly request: ReqConfig & ExtConf,
    /** 响应类型 */
    public readonly type: AjaxResponseType = 'download_load'
  ) {
    const {
      status,
      responseType,
    } = xhr;
    this.status = status ?? 0;
    this.responseType = responseType ?? '';

    // 响应头部
    const allHeaders = xhr.getAllResponseHeaders();
    this.responseHeaders = allHeaders
      ? allHeaders
        .split('\n')
        .reduce((headers: Record<string, string>, line) => {
          const index = line.indexOf(': ');
          const name = line.slice(0, index);
          const value = line.slice(index + 2)
          if (
            name.trim() === ''
          ) {
            return headers;
          }
          headers[name] = value.trim();
          return headers;
        }, {})
      : {};

    this.response = getXHRResponse(xhr);
    const { loaded, total } = originalEvent;
    this.loaded = loaded;
    this.total = total;
  }
}
