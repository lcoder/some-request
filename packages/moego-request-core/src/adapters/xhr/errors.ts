import { AjaxRequest } from '../types';
import { getXHRResponse } from './xhr-response';
import { createErrorClass } from './create-erro-class';

/**
 * Ajax错误接口
 *
 * @see {@link ajax}
 *
 * @class AjaxError
 */
export interface AjaxError<T = any> extends Error {
  /**
   * 跟错误相关的xhr对象
   */
  xhr: XMLHttpRequest;

  /**
   * 跟错误相关的，请求配置
   */
  request: AjaxRequest & T;

  /**
   * 如果请求已经完成，是http状态码；如果未完成，则是0
   */
  status: number;

  /**
   * http响应的内容类型
   */
  responseType: XMLHttpRequestResponseType;

  /**
   * 响应的内容
   */
  response: any;
}

export interface AjaxErrorCtor<T = any> {
  /**
   * https://github.com/ReactiveX/rxjs/issues/6269
   */
  new (message: string, xhr: XMLHttpRequest, request: AjaxRequest & T): AjaxError;
}

/**
 * ajax过程中，生成的错误
 * 方便判断是否是 AjaxError 错误。instanceof AjaxError
 * 不要自行调用这个class创建实例，仅公内部使用
 * @class AjaxError
 * @see {@link ajax}
 */
export const AjaxError: AjaxErrorCtor = createErrorClass(
  (_super) =>
    function AjaxErrorImpl(this: any, message: string, xhr: XMLHttpRequest, request: AjaxRequest) {
      _super(this);
      this.message = message;
      this.name = 'AjaxError';
      this.xhr = xhr;
      this.request = request;
      this.status = xhr.status;
      this.responseType = xhr.responseType;
      let response: any;
      try {
        // IE 中可能会异常
        response = getXHRResponse(xhr);
      } catch (err) {
        response = xhr.responseText;
      }
      this.response = response;
    }
);

export interface AjaxTimeoutError extends AjaxError {}

export interface AjaxTimeoutErrorCtor {
  new (xhr: XMLHttpRequest, request: AjaxRequest): AjaxTimeoutError;
}

/**
 *  判断一个错误，是否是 instanceof AjaxTimeoutError 实例
 * @class AjaxTimeoutError
 */
export const AjaxTimeoutError: AjaxTimeoutErrorCtor = (() => {
  function AjaxTimeoutErrorImpl(this: any, xhr: XMLHttpRequest, request: AjaxRequest) {
    AjaxError.call(this, 'ajax timeout', xhr, request);
    this.name = 'AjaxTimeoutError';
    return this;
  }
  AjaxTimeoutErrorImpl.prototype = Object.create(AjaxError.prototype);
  return AjaxTimeoutErrorImpl;
})() as any;
