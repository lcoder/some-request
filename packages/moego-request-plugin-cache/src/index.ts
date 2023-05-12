import type { MoegoPlugin, ReqConfig } from '@moego/moego-request-core';
import { Method } from '@moego/moego-request-core';
import { AsyncSubject, Observable, map } from 'rxjs';
import LRUCache from 'lru-cache';
import { defaultCacheIdentic } from './cache-identic';

const Allowed = [
  Method.GET,
  Method.PUT,
  Method.DELETE,
  Method.HEAD,
];

export interface Cache {
  /**
  * 缓存多长时间,单位：ms
  * 默认：3 * 1000ms
  */
  cacheMaxAge?: number;
  
  /**
   * 默认是否克隆
   */
  cloneResponse?: boolean;
}

const defaultMaxAge = 3 * 1000;

export interface CacheReqConfig {
  /** 
   * 是否开启缓存，仅针幂等的http方法: GET, HEAD, PUT, and DELETE
   * https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
   * */
   cache?: boolean;

   /**
    * 生成缓存的惟一标识
    * cache配置开启true时，才会生效
    */
   cacheIdentic?: (config: ReqConfig) => string;

   /**
    * 缓存多长时间,单位：ms
    * 默认：5 * 1000 ms （按一次页面加载的时间）
    */
   cacheMaxAge?: number;

   /**
    * 是否需要克隆返回结果
    * 针对某些订阅可能会修改原始值的情况
    * 默认：false（不克隆）
    */
   cloneResponse?: boolean;
}

export class MeogoRequestPluginCache implements MoegoPlugin<CacheReqConfig> {
  private cloneResponse: boolean;
  private cacheStore: LRUCache<string, AsyncSubject<any>>;
  constructor(bq: any, config?: Cache) {
    const {
      cacheMaxAge = defaultMaxAge,
      cloneResponse,
    } = config ?? {};
    this.cacheStore = new LRUCache(
      {
        max: 500,
        maxAge: cacheMaxAge,
      },
    );
    this.cloneResponse = cloneResponse ?? false;
  }

  public getCache(key: string) {
    return this.cacheStore.get(key);
  }

  public setCache(key: string, subject: AsyncSubject<any>, maxAge?: number) {
    this.cacheStore.set(key, subject, maxAge);
  }

  beforeSend = (
    config: {
      key: string;
      maxAge?: number;
      clone?: boolean;
    },
  ) => {
    const {
      key,
      maxAge,
      clone,
    } = config;
    return (
      obs$: Observable<any>,
    ): Observable<any> => {
      const subject$ = this.getCache(key);
      const cloneMap = map((res: any) => {
        if (
          clone
          && Object.prototype.toString.call(res?.response) === '[object Object]'
        ) {
          res.response = JSON.parse(
            JSON.stringify(res.response)
          );
        }
        return res;
      });
      if (
        subject$
      ) {
        return subject$.pipe(cloneMap)
      } else {
        const asynSub$ = new AsyncSubject<any>();
        obs$
          .pipe(cloneMap)
          .subscribe(asynSub$);
        this.setCache(key, asynSub$, maxAge);
        return asynSub$;
      }
    }
  }

  pre(config: ReqConfig & CacheReqConfig) {
    const {
      cache,
      cacheMaxAge,
      cloneResponse = this.cloneResponse,
      method,
      cacheIdentic = defaultCacheIdentic,
    } = config;
    const setedCache = cache === true;
    let key: string = '';
    if (
      setedCache
    ) {
      if (
        Allowed.includes(method)
        && (key = cacheIdentic(config))
      ) {
        config.beforeSends.push(this.beforeSend({
          key,
          maxAge: cacheMaxAge,
          clone: cloneResponse
        }));
      } else {
        config.cache = false;
        console.warn(`禁止cache，方法${method}不允许cache或者cacheIdentic方法返回值无效`);
      }
    }
    return config;
  }
}
