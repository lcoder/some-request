/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { MeogoRequest, MoegoPlugin, ReqConfig, AjaxResponse } from '@moego/moego-request-core';
import { AjaxError } from '@moego/moego-request-core';
import { EMPTY, catchError, Observable, map } from 'rxjs';

export enum ExcepType {
  /** 静默，吃掉异常 */
  silence = 'silence',
  /** 忽略，不处理（让订阅者单独处理） */
  ignore = 'ignore',
  /** 信息提示 */
  message = 'message',
  /** 页面崩溃(不可用) */
  crash = 'crash',
}

/** 构造函数参数，配置消息提示/页面崩溃的回调 */
export interface AwesomeConfig<T = any> {
  /** 页面崩溃 */
  onCrash?: ErrorHandl<T>;
  /** 消息提示 */
  onMessage?: ErrorHandl<T>;
  /** 检测是否走异常逻辑 */
  checkError?: (i: AjaxResponse<any>) => boolean;
}

/** 请求配置项，exception */
export interface AwesomeReqConfig {
  /**
   * 异常处理方案
   */
  exception?: ExcepType,
}

/** 服务端返回结果(不确定是msg还是message，由用户传入泛型参数决定) */
interface ResError {
  code: number;
}

/** 错误回调函数接口，入参可接受泛型 */
interface ErrorHandl<T = any> {
  (resErr: ResError & T): void;
}

/** Awesome插件 */
export class MeogoRequestPluginAwesome implements MoegoPlugin<AwesomeReqConfig> {
  private onCrash?: ErrorHandl;

  private onMessage?: ErrorHandl;

  private checkError: AwesomeConfig['checkError'] = (i) => i.status !== 200;

  constructor(
    bg: MeogoRequest,
    config?: AwesomeConfig,
  ) {
    Object.assign(this, config);
  }

  pre(config: ReqConfig & AwesomeReqConfig): ReqConfig & AwesomeReqConfig {
    // 如果传入onMessage，自动开启
    if (
      !config.exception
      && this.onMessage
    ) {
      config.exception = ExcepType.message;
    }
    return config;
  }

  last = catchError((err: AjaxError<AwesomeReqConfig>, _caught) => {
    const {
      onCrash = () => { },
      onMessage = () => { },
    } = this;
    const {
      request,
      response,
    } = err;
    const {
      exception,
    } = request;
    if (
      exception
    ) {
      switch (exception) {
        case ExcepType.crash: {
          onCrash(response);
          return EMPTY;
        }
        case ExcepType.ignore: {
          throw err;
        }
        case ExcepType.message: {
          onMessage(response);
          return EMPTY;
        }
        case ExcepType.silence: {
          return EMPTY;
        }
        default: {
          throw err;
        }
      }
    }
    throw err;
  });

  done = (source$: Observable<AjaxResponse<any>>): Observable<any> => source$
    .pipe(
      map((i) => {
        if (
          this.checkError
          && this.checkError(i)
        ) {
          throw i;
        }
        return i;
      }),
      this.last,
    );
}
