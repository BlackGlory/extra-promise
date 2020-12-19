# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.11.0](https://github.com/BlackGlory/extra-promise/compare/v0.10.6...v0.11.0) (2020-12-19)


### ⚠ BREAKING CHANGES

* InvalidArgumentError extends CustomError
InvalidArugmentsLengthError extends CustomError

### Features

* use @blackglory/errors ([4b8f119](https://github.com/BlackGlory/extra-promise/commit/4b8f119ba3fdaf1cf844aa63c251a571c5fb5ab8))

### [0.10.6](https://github.com/BlackGlory/extra-promise/compare/v0.10.5...v0.10.6) (2020-12-19)


### Features

* overwrite Semaphore ([4d402b3](https://github.com/BlackGlory/extra-promise/commit/4d402b3807a5527fe9ea429ff385302add490a5a))

### [0.10.5](https://github.com/BlackGlory/extra-promise/compare/v0.10.4...v0.10.5) (2020-12-18)


### Features

* overwrite Mutex ([7e62996](https://github.com/BlackGlory/extra-promise/commit/7e62996cf0873ad83e552d115bcac3e9f0ae6ac2))

### [0.10.4](https://github.com/BlackGlory/extra-promise/compare/v0.10.3...v0.10.4) (2020-12-18)


### Features

* use shared/Mutex ([02446f7](https://github.com/BlackGlory/extra-promise/commit/02446f758ef7668ac26bf84110c1caf8a2a5d930))

### [0.10.3](https://github.com/BlackGlory/extra-promise/compare/v0.10.2...v0.10.3) (2020-12-18)


### Bug Fixes

* exports ([c81579d](https://github.com/BlackGlory/extra-promise/commit/c81579d4014eecb8341f61e70daa147ff87e183a))

### [0.10.2](https://github.com/BlackGlory/extra-promise/compare/v0.10.1...v0.10.2) (2020-12-18)


### Features

* add makeChannel ([aa4165a](https://github.com/BlackGlory/extra-promise/commit/aa4165ad44408edcb730581edcd083e6f0070825))

### [0.10.1](https://github.com/BlackGlory/extra-promise/compare/v0.10.0...v0.10.1) (2020-12-18)


### Features

* experimental support MPMC ([91d0749](https://github.com/BlackGlory/extra-promise/commit/91d0749dc4ba49a967bebdd920eed6116cfcc577))

## [0.10.0](https://github.com/BlackGlory/extra-promise/compare/v0.9.6...v0.10.0) (2020-12-18)


### ⚠ BREAKING CHANGES

* remove makeChannel

### Features

* remove makeChannel ([5486b34](https://github.com/BlackGlory/extra-promise/commit/5486b348ce6be65129630a39ff20ac9891be7d3d))

### [0.9.6](https://github.com/BlackGlory/extra-promise/compare/v0.9.5...v0.9.6) (2020-12-17)


### Features

* add DebounceMicrotask ([cc76f0b](https://github.com/BlackGlory/extra-promise/commit/cc76f0b65cdf837ebf8ccc1f099caecc7c632ee0))

### [0.9.5](https://github.com/BlackGlory/extra-promise/compare/v0.9.4...v0.9.5) (2020-11-21)

### [0.9.4](https://github.com/BlackGlory/extra-promise/compare/v0.9.3...v0.9.4) (2020-11-21)


### Features

* add Semaphore, Mutex ([f1af83f](https://github.com/BlackGlory/extra-promise/commit/f1af83f1721fc30cc3e138e55cb2b7a3e5ac84ff))

### [0.9.3](https://github.com/BlackGlory/extra-promise/compare/v0.9.2...v0.9.3) (2020-11-08)


### Features

* add pad, padResolve ([20db485](https://github.com/BlackGlory/extra-promise/commit/20db4851f4a7649b3824e73da7ff4a36b254cd1d))

### [0.9.2](https://github.com/BlackGlory/extra-promise/compare/v0.9.1...v0.9.2) (2020-11-08)

### [0.9.1](https://github.com/BlackGlory/extra-promise/compare/v0.9.0...v0.9.1) (2020-10-10)

## [0.9.0](https://github.com/BlackGlory/extra-promise/compare/v0.8.3...v0.9.0) (2020-10-05)


### ⚠ BREAKING CHANGES

* `makeChannel` was renamed to `makeUnlimitedChannel`
`makeBlockingChannel` was renamed to `makeBufferedChannel`

* refactor all channel functions ([149d2b3](https://github.com/BlackGlory/extra-promise/commit/149d2b35f39037b62323ff3a493efc75facd0bf1))
