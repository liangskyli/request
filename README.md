# 支持多环境request请求库工具，总有一种方式适合你。

<p>
  <a href="https://github.com/liangskyli/request/releases">
    <img alt="preview badge" src="https://img.shields.io/github/v/release/liangskyli/request">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/request">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/request?label=%40liangskyli%2Frequest">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/axios-request">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/axios-request?label=%40liangskyli%2Faxios-request">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/taro-request">
   <img alt="preview badge" src="https://img.shields.io/npm/v/@liangskyli/taro-request?label=%40liangskyli%2Ftaro-request">
  </a>
</p>


## 抽象的通用请求库(@liangskyli/request)
- 支持多端请求库的二次封装
  - 支持中间件插件
  - 需要自行集成第三方请求库使用
  - 可自行封装个性化请求库
  - [具体见文档](./packages/request/README.md)

## 支持中间件配置的axios请求库(@liangskyli/axios-request)
- 基于@liangskyli/request 对axios请求库二次封装
- [具体见文档](./packages/axios-request/README.md)

## 支持中间件配置的taro请求库(@liangskyli/taro-request)
- 基于@liangskyli/request 对taro请求库二次封装
- [具体见文档](./packages/taro-request/README.md)

## 其他请求库的支持
- 可以参考@liangskyli/axios-request或@liangskyli/taro-request代码的实现逻辑，使用@liangskyli/request封装适合自己的个性化请求库
