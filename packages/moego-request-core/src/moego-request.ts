import { AjaxResponse } from './adapters/ajax-response';
import { of, isObservable, concatMap, Observable, from, OperatorFunction } from 'rxjs';
import { isReqConfig, RequestConfig } from './config';
import type { ReqConfig } from './config-type';
import type { Plugin, PluginConstruct } from './types/moego-plugin';
import { isPromise } from './helper';
import compose from './helper/compose';
import { PluginConfig, RequestPluginBase } from './moego-plugin-base';
import { ShortcutMethods } from './config-default';

type MeogoRequestMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

interface MethodRequest<ExtConf extends Record<string, any> = {}> {
  <T>(url: string, config?: Partial<ReqConfig & ExtConf>): Observable<T>;
}


/**
 * MeogoRequest请求类
 * 使用方法可以找@leo，手把手配置
 */
export class MeogoRequest<ExtConf extends Record<string, any> = {}> extends RequestPluginBase {
  /** 对外暴露的简写方法 */
  public get!: MethodRequest<ExtConf>;
  public post!: MethodRequest<ExtConf>;
  public delete!: MethodRequest<ExtConf>;
  public put!: MethodRequest<ExtConf>;
  public patch!: MethodRequest<ExtConf>;

  public constructor(
    config?: Partial<PluginConfig>
  ) {
    super(config ?? {});
    this.initShortcut();
  }

  /**
   * 生成发送请求的快捷方式
   */
  private initShortcut() {
    for(let method of ShortcutMethods) {
      const key = method.toLowerCase() as MeogoRequestMethod;
      this[key] = (url: string, config?: Partial<ExtConf & ReqConfig>) => this.request(
        {
          ...config!,
          url,
          method
        }
      );
    }
  }

  /**
   * 批量注册插件
   */
   public use(plugins?: Plugin[]): void {
    if (
      !plugins
    ) {
      return;
    }
    this.install(plugins);
  }

  /**
   * 卸载插件
   */
  public uninstall(key: PluginConstruct | PluginConstruct[]) {
    if (
      Array.isArray(key)
    ) {
      for (const cls of key) {
        this.eject(cls);
      }
    } else {
      this.eject(key);
    }
  }

  /** 发送请求 */
  public request = <R>(
    p: string | Partial<ReqConfig & ExtConf>
  ) => {
    let config: RequestConfig | null = null;
    if (
      isReqConfig(p)
    ) {
      config = new RequestConfig(p);
    } else if (
      typeof p === 'string'
    ) {
      config = new RequestConfig({ url: p });
    } else {
      throw new Error('参数错误，应该为url地址，或者ReqConfig配置');
    }
    const list: OperatorFunction<any, any>[] = [
        this.preProcess,
        this.process,
        ...this.doneFns,
      ];
    return of(config).pipe(...(list as [])) as unknown as Observable<R>;
  }

  /**
   * 执行 前置插件
   * 只能处理config
   */
  private preProcess = (source$: Observable<any>): Observable<any> => (
    this
      .preFns
      .reduce(
        (
          pre$,
          preFn
        ) => (
          pre$
            .pipe(
              concatMap((config) => {
                const result = preFn && preFn.call(this, config);
                const isAsync = (
                  isObservable(result)
                  || isPromise(result)
                )
                return isAsync ? from(result) : of(result);
              }),
            )
        ),
      source$
    )
  );

  /**
   * 使用adapter分发请求
   */
   private process = concatMap((config: ReqConfig) => (
    compose<Observable<AjaxResponse<any>>>(
      ...config.beforeSends,
      config.adapter
    )(config)
  ));
}
