import type { QueryParam } from '../config-type';
import { forEach } from './for-each';
import { isDate, isObject, encode } from './index';

/**
 * 利用浏览器自带的URLSearchParams序列化
 * @param url 
 * @param query 
 * @returns 
 */
export function standardSerializer(url: string, query?: QueryParam): string {
  if (
    !query
  ) {
    return url;
  }
  if (
    isObject(query)
  ) {
    // 过滤没有值的key
    query = Object
      .entries(query)
      .reduce((obj, [key, value]) => {
        if (
          value === undefined
          || value === null
        ) {
          return obj;
        }
        return Object.assign(obj, {[key]: value});
      }, Object.create(null));
  }
  let searchParams: URLSearchParams;
  if (url.includes('?')) {
    const parts = url.split('?');
    if (2 < parts.length) {
      throw new TypeError('invalid url');
    }
    // 原本就有的查询参数
    searchParams = new URLSearchParams(parts[1]);
    // 跟参数合并查询参数
    new URLSearchParams(query as any)
      .forEach((value, key) => searchParams.set(key, value));
    // 拼接还原
    url = parts[0] + '?' + searchParams;
  } else {
    searchParams = new URLSearchParams(query as any);
    url = url + '?' + searchParams;
  }
  return url;
}

/**
 * 默认的参数序列化工具
 * @param query any
 * @returns string
 */
export function normalSerializer(url: string, query?: QueryParam): string {
  if (
    !query
  ) {
    return url;
  }

  const parts: string[] = [];

  forEach(query, function serialize(val, key) {
    if (val === null || typeof val === 'undefined') {
      return;
    }

    if (Array.isArray(val)) {
      key = key + '[]';
    } else {
      val = [val];
    }

    forEach(val, function parseValue(v) {
      if (isDate(v)) {
        v = v.toISOString();
      } else if (isObject(v)) {
        v = JSON.stringify(v);
      }
      parts.push(encode(key) + '=' + encode(v));
    });
  });
  const serializedParams = parts.join('&');

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
}

/**
 * 先标准的试运行下
 */
export const defaultSerializer = standardSerializer;
