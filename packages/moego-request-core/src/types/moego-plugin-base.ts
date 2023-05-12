import type { FnDone, FnPre } from "./moego-plugin";

export interface IMoegoPluginBase {
  /** 获取所有前置处理函数 */
  get preFns(): FnPre[];

  /** 获取所有兜底函数 */
  get doneFns(): FnDone[];
}
