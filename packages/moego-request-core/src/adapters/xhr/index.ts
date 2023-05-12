import { Observable } from 'rxjs';
import type { Subscriber, TeardownLogic } from 'rxjs';
import type { ReqConfig } from '@/config-type';
import { extractContentTypeAndMaybeSerializeBody } from './serialize-body';
import { AjaxRequest, AjaxDirection, ProgressEventType } from '../types';
import { AjaxResponse } from '../ajax-response';
import { AjaxError, AjaxTimeoutError } from './errors';

const UPLOAD = 'upload';
const DOWNLOAD = 'download';
const LOADSTART = 'loadstart';
const PROGRESS = 'progress';
const LOAD = 'load';

function xhrAdapter<T>(config: ReqConfig): Observable<AjaxResponse<T>> {
  const create = function(
    this: Observable<AjaxResponse<T>>,
    destination: Subscriber<AjaxResponse<T>>,
  ): TeardownLogic {
    const {
      baseURL,
      query,
      body: configuredBody,
      headers: configuredHeaders,
      querySerializer,
      ...remainingConfig
    } = config;
    let {
      url,
    } = remainingConfig;

    if (
      !url
    ) {
      throw new TypeError('url is required');
    }

    url = baseURL + url;

    // 拼查询字符串
    if (query) {
      url = querySerializer(url, query);
    }

    // headers大小写转换
    const headers: Record<string, any> = {};
    if (configuredHeaders) {
      for (const key in configuredHeaders) {
        if (configuredHeaders.hasOwnProperty(key)) {
          headers[key.toLowerCase()] = configuredHeaders[key];
        }
      }
    }


    // 跨域是否携带cookie,是的话，将cookie放入指定的请求头中
    const {
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      crossDomain,
    } = remainingConfig;
    if (
      (
        withCredentials
        || !crossDomain
      )
      && xsrfCookieName
      && xsrfHeaderName
    ) {
      const xsrfCookie = document?.cookie.match(new RegExp(`(^|;\\s*)(${xsrfCookieName})=([^;]*)`))?.pop() ?? '';
      if (xsrfCookie) {
        headers[xsrfHeaderName] = xsrfCookie;
      }
    }

    // 是否序列化body
    const body = extractContentTypeAndMaybeSerializeBody(configuredBody, headers);

    const _request: AjaxRequest = {
      ...remainingConfig,

      url,
      headers,
      body,
    };

    let xhr: XMLHttpRequest;

    xhr = config.createXHR();

    // 挂载事件
    {
      const {
        validateStatus,
        includeDownloadProgress,
        includeUploadProgress,
      } = config;
      
      const addErrorEvent = (type: string, errorFactory: () => any) => {
        xhr.addEventListener(type, () => {
          const error = errorFactory();
          destination.error(error);
        });
      }
      // 超时
      addErrorEvent('timeout', () => new AjaxTimeoutError(xhr, _request));

      // 异常退出
      addErrorEvent('abort', () => new AjaxError('aborted', xhr, _request));

      // 创建响应内容
      const createResponse = (direction: AjaxDirection, event: ProgressEvent) =>
        new AjaxResponse<T>(event, xhr, config, `${direction}_${event.type as ProgressEventType}` as const);

      // 添加进度条 事件
      const addProgressEvent = (target: any, type: string, direction: AjaxDirection) => {
        target.addEventListener(type, (event: ProgressEvent) => {
          destination.next(createResponse(direction, event));
        });
      };

      // 设置上传事件
      if (includeUploadProgress) {
        [LOADSTART, PROGRESS, LOAD].forEach((type) => addProgressEvent(xhr.upload, type, UPLOAD));
      }

      // 设置下载事件
      if (includeDownloadProgress) {
        [LOADSTART, PROGRESS].forEach((type) => addProgressEvent(xhr, type, DOWNLOAD));
      }


      // 发送 ajax错误
      const emitError = (status?: number) => {
        const msg = 'ajax error' + (status ? ' ' + status : '');
        destination.error(new AjaxError(msg, xhr, _request));
      };

      // 绑定ajax错误事件
      xhr.addEventListener('error', (e) => {
        emitError();
      });

      // 加载成功
      xhr.addEventListener(LOAD, (event) => {
        const { status } = xhr;
        const isResolve = validateStatus(status);
        if (isResolve) {
          let response: AjaxResponse<T>;
          try {
            // 某些IE可能会抛出异常，见：getXHRResponse，会有个JSON.parse
            response = createResponse(DOWNLOAD, event);
          } catch (err) {
            destination.error(err);
            return;
          }

          destination.next(response);
          destination.complete();
        } else {
          emitError(status);
        }
      });
    }
    
    const { user, method, async } = _request;
    // XHR open
    if (user) {
      xhr.open(method, url, async, user, _request.password);
    } else {
      xhr.open(method, url, async);
    }

    // 当xhr open时，超时时间，响应类型，withCredentials会被立即设置
    if (async) {
      xhr.timeout = _request.timeout;
      xhr.responseType = _request.responseType;
    }

    if ('withCredentials' in xhr) {
      xhr.withCredentials = _request.withCredentials;
    }

    // 设置http请求头
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }

    // 最后发送请求
    if (body) {
      xhr.send(body);
    } else {
      xhr.send();
    }

    return () => {
      if (
        xhr
        && xhr.readyState !== 4
      ) {
        xhr.abort();
      }
    };
  }
  return new Observable(create);
}

export default xhrAdapter;
