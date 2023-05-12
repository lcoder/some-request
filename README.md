# Moego Request 请求库

# features⭐️

- 支持cancelable
- 支持请求缓存
- 支持sc环境
- 支持自定义错误处理
- 支持拦截请求
- 支持上传下载进度条
- 🚀自定义的插件系统
- 🚀🚀插件支持热插拔，运行时加载/卸载插件

# 如何使用？

安装 moe-request：`yarn add @moego/moego-request-core rxjs`

> moe-request内部实现依赖RxJS，所以需要项目自行安装

初始化 bq，`moe-request/index.ts`
```typescript
import type { MoegoPlugin } from '@moego/moego-request-core';
import { MeogoRequest } from '@moego/moego-request-core';
import { map, Observable } from 'rxjs';

// 统一提取服务端返回值的插件
// 用于提取后端返回的{ code, data } 中的data字段返回
class MapResponseData implements MoegoPlugin {
    done(source$: Observable<any>) {
      return source$.pipe(
        map((res) => res.type === 'download_load' ? res.response.data : res),
      );
    }
}

const bq = new MeogoRequest({
  plugins: [
    [MapResponseData],
  ],
});

export const {
  get,
  put,
  delete: del,
  post,
  patch,
} = bq;

export default bq;
```

发送请求 `api.ts`
```typescript
import bq from './moe-request';

// 直接发送请求
bq.get<number>(`/api/v1/tickets/batch_comment`)
  .subscribe({
    next: console.log,
  })

// hooks中，自动退订
React.useEffect(() => id ?
  bq
    .get<number>(`/api/v1/tickets/batch_comment/${id}`)
    .subscribe({
      next: console.log,
    })
    .unsubscribe
  :
  undefined
},[
  id,
]);
```


# 如何参与开发? 有任何问题@leo

包管理系统使用了[pnpm](https://pnpm.io/)。

安装pnpm包管理工具：`npm install -g pnpm`

安装依赖：`pnpm i`

## 启动

第一次拉仓库，需要先build一下，再启动。

- 项目根目录执行：`pnpm build`
- `pnpm start`
- 访问：`http://localhost:3000`


## 开发某个插件
- 如果之前没有打包过，先执行打包：`pnpm build`
- `cd packages/moe-request-plugin*`
- `yarn watch`
- `cd ../moe-request-test`
- `yarn start` 之后import对应的测试package，验证。

## 打包
- 根目录：`pnpm build`

## 发布

- 根目录：`pnpm run publish`

## 开发插件

可以先看[插件系统介绍](./docs/plugin.md)。

通用的插件，可以直接在当前仓库的`packages`中新建一个plugin，命名规范：`moe-request-plugin-*`。业务相关的，可以自行新建单个的插件仓库

## 可以有的东西

- ✅缓存插件，支持幂等请求的缓存,todo，支持缓存时间的配置
- ☑️错误抑制，相同错误弹窗拦截
- ☑️mock插件，支持开发环境区分，支持yapi @xxx
- ☑️错误码映射插件，根据后端返回code，查找错误提示 @xxx
- ☑️统一登录，实现业务侧登录逻辑 @xxx
- ☑️`moe-request-core`支持fetch调用，返回数据接口类型不变，AjaxResponse @xxx