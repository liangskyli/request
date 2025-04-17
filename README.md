# Request Library for Multiple Environments / 多环境请求库工具

<p align="center">
  <a href="https://github.com/liangskyli/request/releases">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/liangskyli/request">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/request">
    <img alt="npm version" src="https://img.shields.io/npm/v/@liangskyli/request?label=%40liangskyli%2Frequest">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/axios-request">
    <img alt="npm version" src="https://img.shields.io/npm/v/@liangskyli/axios-request?label=%40liangskyli%2Faxios-request">
  </a>
  <a href="https://www.npmjs.com/package/@liangskyli/taro-request">
    <img alt="npm version" src="https://img.shields.io/npm/v/@liangskyli/taro-request?label=%40liangskyli%2Ftaro-request">
  </a>
  <a href="https://github.com/liangskyli/request/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/npm/l/@liangskyli/request">
  </a>
</p>

> A flexible request library that supports multiple environments, with middleware capabilities.
>
> 一个支持多环境的灵活请求库，具备中间件能力。

English | [简体中文](#简体中文)

## Features

- 🚀 Multiple environment support (Browser, Node.js, Mini Programs)
- 🔌 Powerful middleware system
- 🛠 Highly customizable
- 📦 Multiple packages for different needs

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@liangskyli/request](./packages/request/) | Core request library with middleware support | [![npm](https://img.shields.io/npm/v/@liangskyli/request)](https://www.npmjs.com/package/@liangskyli/request) |
| [@liangskyli/axios-request](./packages/axios-request/) | Axios-based request library | [![npm](https://img.shields.io/npm/v/@liangskyli/axios-request)](https://www.npmjs.com/package/@liangskyli/axios-request) |
| [@liangskyli/taro-request](./packages/taro-request/) | Taro-based request library for mini programs | [![npm](https://img.shields.io/npm/v/@liangskyli/taro-request)](https://www.npmjs.com/package/@liangskyli/taro-request) |

## Quick Start

Choose the package that best fits your needs:

### Core Library

```bash
pnpm add @liangskyli/request
```

### Axios Integration

```bash
pnpm add @liangskyli/axios-request axios
```

### Taro Integration

```bash
pnpm add @liangskyli/taro-request @tarojs/taro
```

## Documentation

- [Core Library Documentation](./packages/request/README.md)
- [Axios Integration Documentation](./packages/axios-request/README.md)
- [Taro Integration Documentation](./packages/taro-request/README.md)

## Custom Integration

You can create your own request library integration by following our examples:
- Reference [@liangskyli/axios-request](./packages/axios-request/) for HTTP clients
- Reference [@liangskyli/taro-request](./packages/taro-request/) for mini programs

---

# 简体中文

## 特性

- 🚀 支持多环境（浏览器、Node.js、小程序）
- 🔌 强大的中间件系统
- 🛠 高度可定制
- 📦 多个包满足不同需求

## 包列表

| 包名 | 描述 | 版本 |
|-----|------|-----|
| [@liangskyli/request](./packages/request/) | 核心请求库，支持中间件 | [![npm](https://img.shields.io/npm/v/@liangskyli/request)](https://www.npmjs.com/package/@liangskyli/request) |
| [@liangskyli/axios-request](./packages/axios-request/) | 基于 Axios 的请求库 | [![npm](https://img.shields.io/npm/v/@liangskyli/axios-request)](https://www.npmjs.com/package/@liangskyli/axios-request) |
| [@liangskyli/taro-request](./packages/taro-request/) | 基于 Taro 的小程序请求库 | [![npm](https://img.shields.io/npm/v/@liangskyli/taro-request)](https://www.npmjs.com/package/@liangskyli/taro-request) |

## 快速开始

选择最适合你需求的包：

### 核心库

```bash
pnpm add @liangskyli/request
```

### Axios 集成

```bash
pnpm add @liangskyli/axios-request axios
```

### Taro 集成

```bash
pnpm add @liangskyli/taro-request @tarojs/taro
```

## 文档

- [核心库文档](./packages/request/README.md)
- [Axios 集成文档](./packages/axios-request/README.md)
- [Taro 集成文档](./packages/taro-request/README.md)

## 自定义集成

你可以参考我们的示例创建自己的请求库集成：
- 参考 [@liangskyli/axios-request](./packages/axios-request/) 用于 HTTP 客户端
- 参考 [@liangskyli/taro-request](./packages/taro-request/) 用于小程序

## License

[MIT](./LICENSE)
