import {
  Method,
  ResponseType,
} from '@/type';
import type { Observable } from 'rxjs';
import { AjaxResponse } from './adapters/ajax-response';

/** url查询对象 */
export type QueryParam = 
  | string
  | URLSearchParams
  // 注意undefined或者null 实际传参会被过滤掉
  | Record<string, string | number | boolean | string[] | number[] | boolean[] | undefined | null>
  | [string, string | number | boolean | string[] | number[] | boolean[]][];

/**
 * 请求配置
 * @interface Ext 扩展字段，用于插件配置读取
 */
export interface ReqConfig {
  /** 请求url前缀，比如/api/v1.0 */
  baseURL: string;

  /** 同步发送还是异步发送 */
  async: boolean;

  /** url路径 */
  url: string;

  /** 请求方法 */
  method: Method;

  /** 网络请求适配器。比如用来拦截默认的xhr请求，适用于拦截测试/mock数据场景 */
  adapter: <T = any>(config: ReqConfig) => Observable<AjaxResponse<T>>;

  /** 调用adapter执行后，真正订阅之前的钩子，可用于拦截adapter（缓存场景） */
  beforeSends: (<T = any>(obs$: Observable<T>) => Observable<T>)[];

  /** 使用用于发送请求的xhr对象 */
  createXHR: () => XMLHttpRequest;

  /** 判断http code成功失败的，校验函数，默认 status< 400 是成功 */
  validateStatus: (status: number) => boolean;

  /** 请求头 */
  headers: Record<string, any>;

  /** url问号后面的查询字符串数据 */
  query?: QueryParam

  /** 查询参数，序列化函数 */
  querySerializer: (url: string, params?: QueryParam) => string;

  /** 请求体body参数('PUT', 'POST', 'DELETE 'PATCH') */
  body: any;

  /** 超时时间(单位，毫秒)，默认-1，不设置 */
  timeout: number;

  /** 响应类型 */
  responseType: ResponseType;

  /** 跨域是否发送cookie */
  withCredentials: boolean;

  /** 是否发送跨域请求 */
  crossDomain: boolean;

  /** 跨域cookie存储的请求头名称 */
  xsrfHeaderName: string;

  /** 需要发送的cookie名 */
  xsrfCookieName: string;

  /** 为true，会发送下载进度：AjaxResponse */
  includeDownloadProgress: boolean;

  /** 为true，会发送上传进度：AjaxResponse */
  includeUploadProgress: boolean;

  /** http请求的认证用户名 */
  user?: string;

  /** http请求的认证密码 */
  password?: string;
}
