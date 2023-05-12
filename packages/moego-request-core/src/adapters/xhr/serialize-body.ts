import {
  isFormData,
  isURLSearchParams,
  isArrayBuffer,
  isFile,
  isBlob,
  isReadableStream,
  isArrayBufferView,
} from '@/helper';

/**
 * 序列化body
 * @param body 
 * @param headers 
 * @returns 
 */
export function extractContentTypeAndMaybeSerializeBody(body: any, headers: Record<string, string>) {
  if (
    !body ||
    typeof body === 'string' ||
    isFormData(body) ||
    isURLSearchParams(body) ||
    isArrayBuffer(body) ||
    isFile(body) ||
    isBlob(body) ||
    isReadableStream(body)
  ) {
    // 以上的类型，xhr会默认帮我们做序列化，且自动添加对应的content-type头部，不需要做特别处理
    return body;
  }

  if (isArrayBufferView(body)) {
    // https://fetch.spec.whatwg.org/#concept-bodyinit-extract
    return body.buffer;
  }

  if (typeof body === 'object') {
    // 对象，尝试序列化。用户也可以自行序列化（比如自行解决循环引用）成字符串。
    // 异常的话直接抛出
    headers['content-type'] = headers['content-type'] ?? 'application/json;charset=utf-8';
    return JSON.stringify(body);
  }

  throw new TypeError('Unknown body type');
}
