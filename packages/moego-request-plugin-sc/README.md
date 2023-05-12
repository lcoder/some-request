## 连接SC环境的插件

### 安装

`yarn add @moego/moego-request-plugin-sc`

### 使用
```typescript
import {
  MeogoRequest,
} from '@moego/moego-request-core';
import PluginSc from '@moego/moego-request-plugin-sc';


const bq = new MeogoRequest();

// 注册Sc插件，参数sc名（不需要name）,可选第二个参数，其他请求头
bq.use(new PluginSc('prj0045599'));

export default bq;
```

done.