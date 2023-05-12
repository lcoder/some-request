import type { Observable } from 'rxjs';
import xhrAdapter from "./xhr";
import { ReqConfig } from '../config-type';
import fetchAdapter from "./fetch";
import { AjaxResponse } from "./ajax-response";

export { AjaxResponse };

export function getDefaultAdapter() {
  let adapter: <T>(config: ReqConfig) => Observable<AjaxResponse<T>>;
  if (typeof XMLHttpRequest !== 'undefined') {
    // 浏览器 XHR 环境
    adapter = xhrAdapter;
  } else if (
    typeof fetch !== 'undefined'
  ) {
    adapter = fetchAdapter;
    throw new Error('暂未实现fetchAdapter');
  } else {
    adapter = xhrAdapter
  }
  return adapter;
}
