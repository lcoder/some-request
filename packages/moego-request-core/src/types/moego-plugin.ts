import type { Observable, OperatorFunction } from 'rxjs';
import type { MeogoRequest } from '../moego-request';
import type { ReqConfig } from '../config-type';

/**
 * 注册的插件项
 */
export type Plugin<T extends Record<string, any> = {}> = [PluginConstruct<T>, ...any] | PluginConstruct<T>;

export interface FnPre<T extends Record<string, any> = {}> {
  (config: ReqConfig & T):
  | ReqConfig & T
  | Promise<ReqConfig & T>
  | Observable<ReqConfig & T>;
}

export type FnDone<T = any, R = any> = OperatorFunction<T, R>;

/** 插件构造函数 */
export interface PluginConstruct<T extends Record<string, any> = {}> {
  new (
    /**
     * 注意s
     * 初始化的时候还不能访问MeogoRequest的实例方法，因为插件先于MeogoRequest实例化
     */
    yoyo: MeogoRequest<T>,
    ...arg: any[]
  ): MoegoPlugin<T>;
}

/** 插件钩子 */
export interface MoegoPlugin<
  // 插件自定义的配置项
  ExtConf extends Record<string, any> = {},
> {
  /**
   * 前置插件, 处理config
   * 1.可以直接修复config
   * 2.返回可以是Promise或者Observable类型
   * */
  pre?: FnPre<ExtConf>;

  /**
   * 兜底的插件
   * 比如，可以处理错误等
   * 就是Rxjs的UnaryFunction<T, R>
  */
  done?: FnDone;

  /** 
   * 插件卸载 回调
   * 可以清理一些副作用函数，事件取消订阅等
   * */
  destroy?(): void;
}
