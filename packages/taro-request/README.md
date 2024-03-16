# 支持中间件配置的taro请求库
- 基于@liangskyli/request 对taro请求库二次封装
- 支持taro项目多端
  - h5
  - 小程序

## 安装:
```bash
pnpm add @liangskyli/taro-request
# 安装 peerDependencies
pnpm add @tarojs/taro
```

## 使用

### taroCreateRequest函数
- 对taro请求库的二次封装，默认没有配置中间件，可以自己灵活配置
- 例子：
```ts
import { taroCreateRequest } from '@liangskyli/taro-request';

const request = taroCreateRequest<IRequestConfig, T>(initConfig);

// request middlewares
request.middlewares.request.use(loadingMiddleware({}));
```

### taro中间件
#### 1、序列化错误中间件
- taroSerializedErrorMiddleware 函数类型
  - 继承serializedErrorMiddleware中间件

```ts
<
  CodeKey extends string,
  MessageKey extends string,
>(
  option: TaroSerializedErrorConfig<CodeKey, MessageKey>,
) => ReturnType<typeof serializedErrorMiddleware>
```

- taroSerializedErrorMiddleware 函数入参属性

| 属性     | 说明   | 类型                                               | 默认值 |
|--------|------|--------------------------------------------------|-----|
| option | 配置参数 | `TaroSerializedErrorConfig<CodeKey, MessageKey>` |     |

### taroRequest函数
- 默认集成loadingMiddleware，showErrorMiddleware，serializedResponseMiddleware，taroSerializedErrorMiddleware
- 支持自定义中间件的配置
