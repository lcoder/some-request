## 缓存请求的插件

### 安装

`yarn add @moego/moego-request-plugin-cache`

### 使用
```typescript
import {
  MeogoRequest,
} from '@moego/moego-request-core';
import PluginCache, { CacheReqConfig } from '@moego/moego-request-plugin-cache';


const bq = new MeogoRequest<CacheReqConfig>();

// 注册 cache插件
bq.use(new PluginCache({
  // todo 可以配置过期时间
  expires: 1 * 1000 * 60 * 24,
  // todo 如果某个观察者修改了原始的response对象，那么可能会忽然其他观察者的消费行为。增加一个clone，可以拷贝响应对象（需要判断json的返回类型）
  clone: true,
}));


export default bq;

// some where
bq.get('/xxx', { cache: true });
```

done.