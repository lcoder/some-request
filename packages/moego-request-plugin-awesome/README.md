## 全局响应拦截

### 安装

`yarn add @moego/moego-request-plugin-awesome`

### 使用
```typescript
import {
  MeogoRequest,
} from '@moego/moego-request-core';
import PluginAwesome, { AwesomeReqConfig } from '@moego/moego-request-plugin-awesome';


const bq = new MeogoRequest<AwesomeReqConfig>();

// 注册 异常处理插件：PluginAwesome
bq.use(new PluginAwesome({
  // 自定义message行为
  onMessage: (msg: string) => message.error(msg),
  // 自定义crash行为
  onCrash: () => {
    ReactDOM.render(<ErrorPage />, document.querySelector('#app'));
  },
  // 默认异常处理
  default: 'ignore',
}));


export default bq;

// some where
bq.get('/xxx', { exception: 'silence' });
```

exception的可选异常处理类型：
```typescript
export enum ExcepType {
  /** 静默，吃掉异常 */
  silence = 'silence',
  /** 忽略，不处理 */
  ignore = 'ignore',
  /** 信息提示 */
  message = 'message',
  /** 页面崩溃 */
  crash = 'crash',
}
```

done.