/**
 * Valid Ajax direction types. Prefixes the event `type` in the
 * {@link AjaxResponse} object with "upload_" for events related
 * to uploading and "download_" for events related to downloading.
 */
export type AjaxDirection = 'upload' | 'download';

export type ProgressEventType = 'loadstart' | 'progress' | 'load';

export type AjaxResponseType = `${AjaxDirection}_${ProgressEventType}`;

/**
 * 发送http request需要用到的配置数据
 *
 * {@link AjaxError} 出错的对象
 */
export interface AjaxRequest {
  /**
   * 请求url地址
   */
  url: string;

  /**
   * http请求的body
   */
  body?: any;

  /**
   * http请求方法
   */
  method: string;

  /**
   * 同步还是异步
   */
  async: boolean;

  /**
   * 请求头
   */
  headers: Readonly<Record<string, any>>;

  /**
   * 当async为true时，超时时间
   */
  timeout: number;

  /**
   * 用户凭证，用户名
   */
  user?: string;

  /**
   * 用户凭证，密码
   */
  password?: string;

  /**
   * 是否是跨域请求
   */
  crossDomain: boolean;

  /**
   * 跨域请求是否发送凭证（在header中发送跨域的cookie）
   * 设置false的话，也会忽略跨域请求响应中的设置的cookie
   */
  withCredentials: boolean;

  /**
   * 发送前，设置响应类型
   */
  responseType: XMLHttpRequestResponseType;
}

/**
 * 创建ajax的配置
 */
export interface AjaxConfig {
  /** 请求资源的url */
  url: string;

  /**
   * 发送的请求体
   *
   * 经过序列化的请求体
   * application/json，则会被序列化成json
   * application/x-www-form-urlencoded，则会被序列化成url，使用基于对象key和value的key-value键值对
   * 其他情况，传入什么，发送什么
   */
  body?: any;

  /**
   * 是否异步发送请求，默认true；false则会阻塞线程执行
   */
  async?: boolean;

  /**
   * 默认GET
   */
  method?: string;

  /**
   * 发送的http请求头
   *
   * 1. 如果 `"content-type"` header 没有被设置, body类型为：Object
   *    会自动设置类型为：`"content-type"`：`"application/json;charset=utf-8"`
   */
  headers?: Readonly<Record<string, any>>;

  /**
   * 异步等待的超时时间，async为true时才会生效，默认0，相当于永远不会超时
   */
  timeout?: number;

  /** 跟随http请求发送的用户 */
  user?: string;

  /** 跟随http请求发送的密码 */
  password?: string;

  /**
   * 是否发送跨域请求, 默认false。暂时用处不大
   */
  crossDomain?: boolean;

  /**
   * true，跨域时发送用户凭证
   * false，不发送凭证；想要跨域响应response的cookie不生效，设置false
   * 默认 `false`.
   */
  withCredentials?: boolean;

  /**
   * 跨域的cookie名
   */
  xsrfCookieName?: string;

  /**
   * 发送跨域的cookie的请求头
   */
  xsrfHeaderName?: string;

  /**
   * 修改响应内容的类型
   * 有效值是 `"arraybuffer"`, `"blob"`, `"document"`, `"json"`, and `"text"`.
   * 默认值是：`"json"`.
   */
  responseType?: XMLHttpRequestResponseType;

  /**
   * 修改默认的XMLHttpRequest请求对象，当环境中不允许时，很方便
   */
  createXHR?: () => XMLHttpRequest;

  /**
   * true，会发送下载进度
   * 如果这个配置和 {@link includeUploadProgress} 都是 `false`, 结果observable中仅会出现一个 {@link AjaxResponse}
   */
  includeDownloadProgress?: boolean;

  /**
   * true，会发送上传进度 {@link AjaxResponse}
   * 最后的上传完成也发发送 {@link AjaxResponse}.
   *
   * 如果这个配置项 和 {@link includeDownloadProgress} 都是`false`, 结果observable中仅会出现一个 {@link AjaxResponse}
   */
  includeUploadProgress?: boolean;
}
