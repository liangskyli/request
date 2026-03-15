# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.3.0-beta.0](https://github.com/liangskyli/request/compare/v0.2.2...v0.3.0-beta.0) (2026-03-15)


### ⚠ BREAKING CHANGES

* only support esm format,build form rollup to rolldown

### Features

* only support esm format,build form rollup to rolldown ([3720ffa](https://github.com/liangskyli/request/commit/3720ffa32fc6e80fe3e4f2f3494ea89e1690335b))
* support ReadableStream response ([953d43c](https://github.com/liangskyli/request/commit/953d43c4e216a238c5bd5d7cc1fb0a4e6265c198))



## [0.2.2](https://github.com/liangskyli/request/compare/v0.2.1...v0.2.2) (2025-11-06)


### Features

* export IMiddlewares type, export @liangskyli/request in axios and taro request ([60dde30](https://github.com/liangskyli/request/commit/60dde309fee11cdede38631e4c3b044f252cc7d6))



## [0.2.1](https://github.com/liangskyli/request/compare/v0.2.1-beta.1...v0.2.1) (2025-10-25)


### Features

* request.middlewares type recognition correction, and other type enhance ([4cea09f](https://github.com/liangskyli/request/commit/4cea09fb5839564db9742a01297465b1c43eb53c))



## [0.2.1-beta.1](https://github.com/liangskyli/request/compare/v0.2.1-beta.0...v0.2.1-beta.1) (2025-10-25)


### Features

* all request CodeKeyType type enhance ([b5756fd](https://github.com/liangskyli/request/commit/b5756fdea072128d016268267235f41cd3670f53))



## [0.2.1-beta.0](https://github.com/liangskyli/request/compare/v0.2.0...v0.2.1-beta.0) (2025-10-24)


### Features

* **axios-request:** axiosRequest typescript type enhance ([6689c43](https://github.com/liangskyli/request/commit/6689c43c3e983ed79ec431a2b3342a7dd0cf766f))



## [0.2.0](https://github.com/liangskyli/request/compare/v0.1.1...v0.2.0) (2025-04-17)

**Note:** Version bump only for package @liangskyli/request





## [0.1.0](https://github.com/liangskyli/request/compare/v0.1.0-beta.2...v0.1.0) (2024-03-29)

**Note:** Version bump only for package @liangskyli/request





## [0.1.0-beta.2](https://github.com/liangskyli/request/compare/v0.1.0-beta.1...v0.1.0-beta.2) (2024-03-20)


### Bug Fixes

* error code type fix for axios, error and response Middleware support taro statusCode and errMsg ([c774d00](https://github.com/liangskyli/request/commit/c774d00dcc91c047b1a0e180de4226cc2052d831))



## [0.1.0-beta.1](https://github.com/liangskyli/request/compare/v0.1.0-beta.0...v0.1.0-beta.1) (2024-03-16)


### Bug Fixes

* **request:** code value support number for serializedErrorMiddleware ([1bf88ef](https://github.com/liangskyli/request/commit/1bf88ef381a3d90bbfc8497fb1d7b644e5e7e8ef))



## 0.1.0-beta.0 (2024-03-16)


### Features

* add createRequest,composeMiddleware,context,loadingMiddleware,MiddlewareManager ([88dbc79](https://github.com/liangskyli/request/commit/88dbc79035b56826f71656dcc3cfaa4bf155e892))
* add serializedErrorMiddleware,serializedResponseMiddleware,showErrorMiddleware ([f3b668a](https://github.com/liangskyli/request/commit/f3b668a1223c64c2ea5bf31cd3d37f8cf92971b2))
* change serializedError and SerializedError not export ([e17aa55](https://github.com/liangskyli/request/commit/e17aa5554b1a8d1fa72896fc5b322bb4d9e58acc))
* initial commit ([8377cae](https://github.com/liangskyli/request/commit/8377cae7796bd9d4d2631ea72d70b64211d46868))
* response code support number,response data string to object,and code key type not convert ([882df8a](https://github.com/liangskyli/request/commit/882df8ae943037188e43a06e4192eef50e8b8bcf))
