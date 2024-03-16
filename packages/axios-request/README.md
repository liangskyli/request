# 支持中间件配置的axios请求库
- 基于@liangskyli/request 对axios请求库二次封装
- 支持多端
  - http client
  - nodes

## 安装:
```bash
pnpm add @liangskyli/axios-request
# 安装 peerDependencies
pnpm add axios
```

## 使用

### axiosCreateRequest函数
- 对axios请求库的二次封装，默认没有配置中间件，可以自己灵活配置
- 例子：
```ts
import { axiosCreateRequest } from '@liangskyli/axios-request';

const request = axiosCreateRequest<IRequestConfig, T>(initConfig);

// request middlewares
request.middlewares.request.use(loadingMiddleware({}));
```

### axios中间件
#### 1、序列化错误中间件
- axiosSerializedErrorMiddleware 函数类型
  - 继承serializedErrorMiddleware中间件

```ts
<
  CodeKey extends string,
  MessageKey extends string,
>(
  option: AxiosSerializedErrorConfig<CodeKey, MessageKey>,
) => ReturnType<typeof serializedErrorMiddleware>
```

- axiosSerializedErrorMiddleware 函数入参属性

| 属性     | 说明   | 类型                                                | 默认值 |
|--------|------|---------------------------------------------------|-----|
| option | 配置参数 | `AxiosSerializedErrorConfig<CodeKey, MessageKey>` |     |

### axiosRequest函数
- 默认集成loadingMiddleware，showErrorMiddleware，serializedResponseMiddleware，axiosSerializedErrorMiddleware中间件
- 支持自定义中间件的配置
- 例子，具体使用可看测试用例的[使用](./test/axios-request.test.ts)
```ts
import { axiosRequest } from '@liangskyli/axios-request';

const request = axiosRequest({
  loadingMiddlewareConfig: {
    showLoading: showLoadingFn,
    hideLoading: hideLoadingFn,
  },
  ShowErrorMiddlewareConfig: {
    showError: showErrorFn,
  },
});

// 使用
await request({ url: '/test' }).then((value)=>{
  console.log('result value:',value);
  // value返回格式
  /*{
    retCode: '0',
    data: { a: 1 },
    retMsg: undefined,
  }*/
});
```


