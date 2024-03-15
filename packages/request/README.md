# 通用请求库

> 基于@liangskyli/request封装多端请求库，支持中间件插件。

- 支持多端请求库的二次封装
  - http client
  - nodes
  - 小程序

## 安装:
```bash
pnpm add @liangskyli/request
```

## 使用

### createRequest
- 对第三方请求库的二次封装，如axios

```ts
import { createRequest } from '@liangskyli/request';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';

const request = (config: AxiosRequestConfig) => axios.create().request(config);
type IF = typeof request;
export const axiosCreateRequest = <
  IC extends FirstParamType<IF> = FirstParamType<IF>,
  IR = PromiseReturnType<IF>,
>(
  initConfig?: Partial<IC>,
) => createRequest<IF, IC, IR>(request, initConfig);
```

### 通用中间件
#### 1、加载中间件
- loadingMiddleware 函数类型

```ts
(option: LoadingConfig) => Middleware<Context<LoadingOption>>
```

- loadingMiddleware 函数入参属性

| 属性     | 说明   | 类型              | 默认值         |
|--------|------|-----------------|-------------|
| option | 配置参数 | `LoadingConfig` | `undefined` |

- LoadingConfig属性

| 属性                  | 说明                           | 类型           | 默认值         |
|---------------------|------------------------------|--------------|-------------|
| enable              | 是否全局开启                       | `boolean`    | `true`      |
| showLoading         | 显示加载中函数                      | `() => void` | `undefined` |
| hideLoading         | 隐藏加载中函数                      | `() => void` | `undefined` |
| hideLoadingNextTick | 是否延迟执行隐藏加载中函数，用于多个请求时，加载动画流畅 | `boolean`    | `false`     |


- LoadingOption 属性
  - 中间件回调函数里的参数，可以用于指定接口设置加载中间件是否启用(customOptions.loadingEnabled)

| 属性            | 说明         | 类型       | 默认值         |
|---------------|------------|----------|-------------|
| customOptions | 自定义中间件配置参数 | `object` | `undefined` |

- LoadingOption.customOptions 属性

| 属性             | 说明         | 类型        | 默认值                   |
|----------------|------------|-----------|-----------------------|
| loadingEnabled | 具体接口请求是否开启 | `boolean` | `继承option.enable的默认值` |

#### 2、序列化响应数据中间件
- 功能是把接口响应数据序列化为object对象的格式
  - 默认成功数据序列化格式,如果成功响应string数据，会自动转为object对象，成功数据放入data里
  ```
  {
    retCode: '0',
    data: {},// 成功响应string数据时，会自动处理为 data:'响应string数据'
    // 其它字段不处理，如：retMsg
  }
  ```

- serializedResponseMiddleware 函数类型
```ts
(option: SerializedResponseConfig) => Middleware<Context>
```

- serializedResponseMiddleware 函数入参属性

| 属性     | 说明   | 类型                         | 默认值         |
|--------|------|----------------------------|-------------|
| option | 配置参数 | `SerializedResponseConfig` | `undefined` |

- SerializedResponseConfig 属性

| 属性                            | 说明                                     | 类型       | 默认值       |
|-------------------------------|----------------------------------------|----------|-----------|
| serializedResponseCodeKey     | 响应数据code key名称                         | `string` | `retCode` |
| serializedResponseSuccessCode | 成功响应数据code值                            | `string  | number`   | `'0'` |
| serializedResponseDataKey     | 成功响应数据存放的对象key名，用于响应数据为string时，自动转对象数据 | `string` | `data`    |


#### 3、序列化错误中间件
- serializedErrorMiddleware 函数类型

```ts
<
  CodeKey extends string,
  MessageKey extends string,
>(
   option: SerializedErrorConfig<CodeKey, MessageKey>,
) => Middleware<Context>
```

- serializedErrorMiddleware 函数入参属性

| 属性     | 说明   | 类型                      | 默认值 |
|--------|------|-------------------------|-----|
| option | 配置参数 | `SerializedErrorConfig` |     |

- SerializedErrorConfig 属性

| 属性                        | 说明              | 类型                                    | 默认值                                   |
|---------------------------|-----------------|---------------------------------------|---------------------------------------|
| serializedErrorCodeKey    | 序列化错误code key名称 | `string`                              | `retCode`                             |
| serializedErrorMessageKey | 序列化错误信息 key名称   | `string`                              | `retMsg`                              |
| responseCodeKey           | 接口响应code码 key名称 | `string[]`                            | `['retCode', 'code', 'status']`       |
| responseMessageKey        | 接口响应错误信息 key名称  | `string[]`                            | `['retMsg', 'message', 'statusText']` |
| checkIsCancel             | 接口请求是否被取消       | `(error: any) => boolean`             |                                       |
| getErrorResponse          | 接口请求错误数据处理      | `(error: any) => Record<string, any>` |                                       |
| messageMap                | 接口错误提示信息映射表     | `Record<string, string>`              | `undefined`                           |
| defaultReturnMessageInfo  | 默认错误提示信息        | `string`                              | `未知错误，请稍后再试`                          |

- messageMap 默认映射表规则，可以配置messageMap覆盖默认映射规则，或加额外规则
```
{
  ['Network Error']: '网络错误，请检查网络配置',
  ['ECONNABORTED']: '网络超时，请稍后再试',
  ...messageMap,
}
```

#### 4、显示错误提示中间件
- showErrorMiddleware 函数类型

```ts
(
  option: ShowErrorConfig,
) => Middleware<Context<ShowErrorOption>>
```

- showErrorMiddleware 函数入参属性

| 属性     | 说明   | 类型                | 默认值 |
|--------|------|-------------------|-----|
| option | 配置参数 | `ShowErrorConfig` |     |

- ShowErrorConfig 属性

| 属性          | 说明                                        | 类型                                           | 默认值         |
|-------------|-------------------------------------------|----------------------------------------------|-------------|
| enable      | 是否全局开启showError                           | `boolean`                                    | `true`      |
| handleError | 发生错误时执行，`return false`可阻止后续的showError函数执行 | `(err: any, ctx: Context) => void \| false;` | `undefined` |
| showError   | 显示错误全局处理函数, cancel时不会触发                   | `(err: any, ctx: Context) => void`           |             |


- ShowErrorOption 属性
  - 中间件回调函数里的参数，可以用于指定接口设置显示错误中间件是否启用(customOptions.showErrorEnabled)
