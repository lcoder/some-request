import type { ReqConfig, MoegoPlugin } from '@moego/moego-request-core';

export class MeogoRequestPluginSc implements MoegoPlugin {
  constructor(
    bq: any,
    public readonly sc: string,
    public readonly headers?: Record<string|number, any>,
  ) {
  }
  pre(config: ReqConfig) {
    const {
      sc: scName,
      headers,
    } = this;

    Object.assign(
      config.headers,
      headers,
      {
        'x-service-chain': `{"name": "${scName}"}`,
      },
    );
    return config;
  };
}
