import type { MeogoRequest } from "./moego-request";
import type { MoegoPlugin, FnDone, FnPre, Plugin, PluginConstruct } from "./types/moego-plugin";
import type { IMoegoPluginBase } from "./types/moego-plugin-base";

/** 插件构造函数 */
export interface PluginConfig {
  plugins?: Plugin[];
}

const Assert = <T>(i: T | undefined): i is T => !!i;

export class RequestPluginBase implements IMoegoPluginBase {
  private register: Map<PluginConstruct, MoegoPlugin> = new Map();

  private get plugins() {
    return Array.from(this.register.values());
  }

  public get preFns(): FnPre[] {
    return this
      .plugins
      .map((i) => i.pre?.bind(i))
      .filter<FnPre>(Assert);
  }

  public get doneFns(): FnDone[] {
    return this
      .plugins
      .map((i) => i.done?.bind(i))
      .filter<FnDone>(Assert);
  }

  public constructor(
    config: PluginConfig
  ) {
    const {
      plugins,
    } = config;
    if (plugins) {
      this.install(plugins);
    }
  }

  /** 添加插件 */
  protected install(plugins: Plugin[]): void {
    for (let clsRef of plugins) {
      let ins: MoegoPlugin;
      if (
        Array.isArray(clsRef)
      ) {
        const [cls, ...args] = clsRef;
        clsRef = cls;
        if (this.hasInstalled(clsRef)) continue;
        ins = new clsRef(this as unknown as MeogoRequest, ...args);
      } else {
        if (this.hasInstalled(clsRef)) continue;
        ins = new clsRef(this as unknown as MeogoRequest);
      }
      this.register.set(clsRef, ins);
    }
  }

  /** 检查是否注册了已经注册了插件 */
  protected hasInstalled(key: PluginConstruct) {
    return this.register.has(key);
  }

  /** 删除插件 */
  protected eject(key: PluginConstruct): void {
    let pluginIns;
    if (
      (pluginIns = this.register.get(key))
      && pluginIns.destroy
    ) {
      pluginIns.destroy();
    }
    this.register.delete(key);
  }
}
