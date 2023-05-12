## 插件系统介绍

### 插件数据流
![插件系统](https://img01.yzcdn.cn/upload_files/2021/11/09/FtR9LkPiYVebNBdMFaaTu-8B7Iw0.png)

### pre阶段-线性
- 首先`moe-request`的请求，是基于配置的。pre阶段的插件，是通过修改ReqConfig配置，修改请求行为。

一个例子：
```javascript
const bq = new MeogoRequest();

// 实现一个添加请求头插件
bq.pre((config) => {
  config.headers['app-name'] = 'flow-ui';
})
```

插件共享一个配置实例`config`，所以任意的修改，都可以在pre阶段共享配置结果。

`线性`：上一个插件的消费结果，会传递给下一个插件。pre阶段注册的钩子，支持返回promise，Observable对象类型。插件的返回数据类型，`moe-request-core`不关心(它只关心对入参的config修改)。

支持异步，意味着，可以延迟等待某个配置项的生成。比如，复杂项目中的，需要配置`Authorization`头部，`Authorization`需要其他异步逻辑才能获取到。

### adapter阶段

这个阶段的插件逻辑，和洋葱模型类似。


#### config.adapter配置项

可以先看adapter的签名：

```typescript
type adapter = <T = any>(config: ReqConfig) => Observable<AjaxResponse<T>>
```

adapter接受`pre阶段`完成后的结果配置项`config`，就可以发起请求了。这个阶段，可以选择合适的请求适配器来完成，比如通过`XMLHttpRequest`或者`fetch`来完成请求。

> `moe-request-core`默认提供了，基于`XMLHttpRequest`的adapter。

### adapter阶段&洋葱模型
adapter的返回结果类型是一个`Observable对象`。

之后进入洋葱模型

```typescript
compose<Observable<AjaxResponse<any, any>>>(
  ...config.beforeSends,
  config.adapter
)(config)
```

`compose`是一个高阶函数，接受一系列函数，返回一个函数。最右边的返回值，会作为左边函数的输入。

比如: `compose(f, g)(x)`

![compose](https://img01.yzcdn.cn/upload_files/2021/11/09/FkhYiyHkaS45firkz4OD7VxeCmhz.png)


`beforeSends`存储的是接受一个`Observalbe对象`，返回`Observalbe对象`的纯函数，签名如下：
```typescript
type beforeSends = (<T = any>(obs$: Observable<T>) => Observable<T>)[];
```

其实，本质上`config.adapter`和`beforeSends`存储的纯函数是一样的，单独提取`config.adapter`仅是为了抽象请求适配器的概念，方便后续扩展其他请求的实现（参考的是[Axios Adapters](https://github.com/axios/axios/tree/master/lib/adapters)里的概念）

这个adapter阶段(为了方便，beforeSends里的行为，也称为adapter好了，其实没有区别，只是个叫法)可以用来拦截请求/缓存/mock之类的，毕竟adapter虽然被调用了，但是还没发送真正的请求（请求只有在`subscribe`之后才会发出）。

adapter阶段的例子，可以查看：moe-request-plugin-cache


### after阶段-线性

adapter阶段之后，返回的应该是`AjaxResponse<any>`类型（约定，adapter阶段返回的类型）。这个阶段，主要为了定制返回的数据格式，比如`data`和`pagination`组织。

例子：
```typescript
const bq = new MeogoRequest();

// 实现一个after插件,插件处理结果，存放在extend字段中
bq.after((res) => {
  const {
    response
  } = res;
  if (
    typeof response === 'object'
  ) {
    const fixedRes = {
      data: response.data,
      pagination: response.pagination
    }
    res.extend = {
      fixedRes,
    }
  }
});
```

`after`阶段，入参，`AjaxResponse<any>`基本所有字段都是`readonly`的。所有的操作结果，可以通过修改`extend`这个扩展字段来实现。

### pre阶段, adapter阶段，after阶段为啥这么设计？

满足需求的同时，希望尽可能的简单，插件之间应该互相不干扰，可以热插拔。

如果按传统的，根据插件的返回值，传入另外一个插件，不好扩展，因为插件之间的强烈依赖注册的顺序。也有考虑缓存中间值，让`moe-request-core`来承担更多工作，不过实现逻辑稍复杂了，这种设计也是一种权衡。

by the way，有好的设计，可以提PR。

### done阶段

一开始的插件数据流并没有画这个阶段，因为这个阶段，就是插件执行完，可以自行消费数据了，一般放在业务侧使用。

在这里，可以约定统一的数据结构。

比如：
```typescript
import { map } from 'rxjs';
const bq = new MeogoRequest();

// 实现一个done插件,用来收敛响应数据
bq.done(
  map((res) => {
    const {
      response,
      extend,
    } = res;
    // 之前after处理过一次的数据
    return extend?.fixedData ?? response;
  })
);
```

> 注意，因为是所有接口都走的逻辑，需要考虑，上游可能会有上传下载的数据传递下来(可能会多次调用next)。

另外done的入参签名为：`OperatorFunction<any, any>`。所以支持任意`Observable`pipe操作


### 所有上述插件的接口，都可以通过`bq.use`来注册。

```typescript
import PluginSc from '@moego/moego-request-plugin-sc';
const bq = new MeogoRequest();

bq.use(new PluginSc('abc-sc12'));
```

可以在`PluginSc`内部，注册各个阶段的插件。

具体使用方式，可以参考sc插件：
moe-request-plugin-sc