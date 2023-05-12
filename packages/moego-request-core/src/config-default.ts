import { Method } from './type';

/**
 * 快捷访问方法 方便直接get('/api/xx')调用
 */
export const ShortcutMethods = [
  Method.GET,
  Method.POST,
  Method.DELETE,
  Method.PUT,
  Method.PATCH,
]

/**
 * 谓词函数，判断http请求是resolve还是reject
 * 默认小于400，都算成功
 * https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
 * @param status {}
 * @returns 
 */
export const defaultValidateStatus = (status: number) => {
  return status < 400;
}

export { defaultSerializer } from './helper/query-serializer';
