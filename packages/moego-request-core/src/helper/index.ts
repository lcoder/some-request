
const _toString = Object.prototype.toString;

export function toStringCheck(obj: any, name: string): boolean {
  return _toString.call(obj) === `[object ${name}]`;
}

export function isArrayBuffer(body: any): body is ArrayBuffer {
  return toStringCheck(body, 'ArrayBuffer');
}

export function isFile(body: any): body is File {
  return toStringCheck(body, 'File');
}

export function isBlob(body: any): body is Blob {
  return toStringCheck(body, 'Blob');
}

export function isArrayBufferView(body: any): body is ArrayBufferView {
  return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(body);
}

export function isFormData(body: any): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

/**
 * 是否是函数类型
 * @param value The value to check
 */
export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}

export function isReadableStream(body: any): body is ReadableStream {
  return typeof ReadableStream !== 'undefined' && body instanceof ReadableStream;
}

/**
 * 是否是thennable
 * @param value the object to test
 */
export function isPromise(value: any): value is PromiseLike<any> {
  return isFunction(value?.then);
}

/**
 * 是否是URLSearchParams
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * 是否是Date对象
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
export function isDate(val: any) {
  return _toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
export function isObject(val: any) {
  return _toString.call(val) === '[object Object]';
}

/**
 * 编码
 * @param val 
 * @returns 
 */
export function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}
