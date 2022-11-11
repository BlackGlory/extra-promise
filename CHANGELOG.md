# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.3.0](https://github.com/BlackGlory/extra-promise/compare/v4.2.0...v4.3.0) (2022-11-11)


### Features

* specify behaviors of channels after they are closed ([7ca4bbb](https://github.com/BlackGlory/extra-promise/commit/7ca4bbbc90706c6e6061659b083f30558ba84023))

## [4.2.0](https://github.com/BlackGlory/extra-promise/compare/v4.1.0...v4.2.0) (2022-11-10)


### Features

* improve `asyncify` ([9c69644](https://github.com/BlackGlory/extra-promise/commit/9c69644d113b1fdadbac9c899ff4dad67fe24688))


### Bug Fixes

* **asyncify:** the function signature ([9837302](https://github.com/BlackGlory/extra-promise/commit/9837302aab36e04e2185c95b9bb4ea97c5b4374a))

## [4.1.0](https://github.com/BlackGlory/extra-promise/compare/v4.0.0...v4.1.0) (2022-11-07)


### Features

* add `isPromise`, `isPromiseLike` ([8ab8c7a](https://github.com/BlackGlory/extra-promise/commit/8ab8c7ae6ff15c64697e704019a86bdcdd278d13))

## [4.0.0](https://github.com/BlackGlory/extra-promise/compare/v3.2.2...v4.0.0) (2022-10-20)


### ⚠ BREAKING CHANGES

* Changed behaviors of `Channel`, `BufferChannel`, `UnlimitedChannel`.
* Removed `Signal`, `SignalGroup`
* renamed `reusePendingPromise` to `reusePendingPromises`
* Renamed `queueConcurrency` to `limitConcurrencyByQueue`
* Rewrote `TaskRunner`
* Removed `throttleConcurrency` because it has a terrible name.
* `ExtraPromise` now is `StatefulPromise`.
* `toExtraPromise` is now `ExtraPromise.from`.
* Removed `throttleUntilDone`, because other functions
can replace it

### Features

* merge `toExtraPromise` into `ExtraPromise` ([b3f902f](https://github.com/BlackGlory/extra-promise/commit/b3f902f4d943ad67f466c5beaac2dd1f143b13fc))
* remove `Signal`, rewrite `SignalGroup` to `DeferredGroup` ([e6368e0](https://github.com/BlackGlory/extra-promise/commit/e6368e06201222dbf48ab8d715447af733f7eb04))
* remove `throttleConcurrency` ([a54fc56](https://github.com/BlackGlory/extra-promise/commit/a54fc561993432ea8062ca0a7967d8352a8dd2f7))
* remove `throttleUntilDone` ([8b21dff](https://github.com/BlackGlory/extra-promise/commit/8b21dff09087e151cfb1b218926aca53613a9b75))


* improve behaviors ([5a41bf8](https://github.com/BlackGlory/extra-promise/commit/5a41bf8bc356d8b1bf7f531c7009d396bbc40e8c))
* rename `queueConcurrency` to `limitConcurrencyByQueue` ([6ab8e18](https://github.com/BlackGlory/extra-promise/commit/6ab8e18768d573c39a6038309ba725dc6a390917))
* rename `reusePendingPromise` to `reusePendingPromises` ([8b8378b](https://github.com/BlackGlory/extra-promise/commit/8b8378bb97f2d90f790b9a606b94853611b95e82))
* rewrite `ExtraPromise` to `StatefulPromise` ([3614a37](https://github.com/BlackGlory/extra-promise/commit/3614a372f53c8fc76b293f7a3f1e9c387245ecb1))
* rewrite `TaskRunner` ([24cb19e](https://github.com/BlackGlory/extra-promise/commit/24cb19ea3f30ad7a280c17173dc51bc63cb8bef7))

### [3.2.2](https://github.com/BlackGlory/extra-promise/compare/v3.2.1...v3.2.2) (2022-09-13)

### [3.2.1](https://github.com/BlackGlory/extra-promise/compare/v3.2.0...v3.2.1) (2022-09-12)

## [3.2.0](https://github.com/BlackGlory/extra-promise/compare/v3.1.1...v3.2.0) (2022-08-29)


### Features

* **ExtraPromise:** add `state` getter ([a18fb41](https://github.com/BlackGlory/extra-promise/commit/a18fb41e06473cf17f54f0226b8b9044a3636ac5))

### [3.1.1](https://github.com/BlackGlory/extra-promise/compare/v3.1.0...v3.1.1) (2022-08-27)


### Bug Fixes

* error handling ([770b45e](https://github.com/BlackGlory/extra-promise/commit/770b45e0c7f9c2d722b39f641c7d744441af777e))

## [3.1.0](https://github.com/BlackGlory/extra-promise/compare/v3.0.0...v3.1.0) (2022-08-27)


### Features

* improve error handling ([1f2cbe7](https://github.com/BlackGlory/extra-promise/commit/1f2cbe7b211542a4545cdc55591a449b6f17dd68))

## [3.0.0](https://github.com/BlackGlory/extra-promise/compare/v2.4.1...v3.0.0) (2022-08-27)


### ⚠ BREAKING CHANGES

* Renamed `ReusableDeferred` to `MutableDeferred`

### Features

* add ReusableDeferred ([a44d9ca](https://github.com/BlackGlory/extra-promise/commit/a44d9ca399a25a0caab3b8d72a4d9bf466fb687f))


* rename `ReusableDeferred` to `MutableDeferred` ([6f1937e](https://github.com/BlackGlory/extra-promise/commit/6f1937ed15c72f3eb8f37d32218addf818b1172b))

### [2.4.1](https://github.com/BlackGlory/extra-promise/compare/v2.4.0...v2.4.1) (2022-08-06)


### Bug Fixes

* function signautre overloads ([c9a521b](https://github.com/BlackGlory/extra-promise/commit/c9a521b16e2c4888defb7627f9eaf858a9c41c7d))

## [2.4.0](https://github.com/BlackGlory/extra-promise/compare/v2.3.0...v2.4.0) (2022-08-04)


### Features

* add options for `reusePendingPromise` ([475fca5](https://github.com/BlackGlory/extra-promise/commit/475fca50bd4920f95a5c8a630bec3c250e132651))

## [2.3.0](https://github.com/BlackGlory/extra-promise/compare/v2.2.0...v2.3.0) (2022-07-25)


### Features

* add reusePendingPromise ([cdcc61f](https://github.com/BlackGlory/extra-promise/commit/cdcc61fc4eb7846fa4d04819087ee603a82de34f))

## [2.2.0](https://github.com/BlackGlory/extra-promise/compare/v2.1.1...v2.2.0) (2022-06-18)


### Features

* improve promisify for an edge case ([03cbbb5](https://github.com/BlackGlory/extra-promise/commit/03cbbb5a56b04a2e6ce2ec845faa907fd0fd28a7))


### Bug Fixes

* callbackify for edge cases ([d630910](https://github.com/BlackGlory/extra-promise/commit/d630910ead656cdb3a698e09352e37f3101b629b))
* callbackify for edge cases ([57c788b](https://github.com/BlackGlory/extra-promise/commit/57c788ba5822a12d521ab6216321f3e5d7ec8b8d))

### [2.1.1](https://github.com/BlackGlory/extra-promise/compare/v2.1.0...v2.1.1) (2022-06-18)


### Bug Fixes

* an edge case for promisify ([8765b17](https://github.com/BlackGlory/extra-promise/commit/8765b177617057d343f70b6cab9b300ca85cd126))

## [2.1.0](https://github.com/BlackGlory/extra-promise/compare/v2.0.0...v2.1.0) (2022-06-18)


### Features

* improve promisify ([db8491c](https://github.com/BlackGlory/extra-promise/commit/db8491ca906f2ae09dcfe2a0b59c1ef6a60302be))

## [2.0.0](https://github.com/BlackGlory/extra-promise/compare/v1.0.2...v2.0.0) (2022-05-16)


### ⚠ BREAKING CHANGES

* rewrite TaskRunner
* `cascadify` removed

### Features

* remove `cascadify` ([08e94d8](https://github.com/BlackGlory/extra-promise/commit/08e94d8a25a2406b75298981f3abb41c6fccf5b1))
* rewrite TaskRunner ([41f9295](https://github.com/BlackGlory/extra-promise/commit/41f9295ff97abcd50b794484330c741c30690471))

### [1.0.2](https://github.com/BlackGlory/extra-promise/compare/v1.0.1...v1.0.2) (2022-03-23)

### [1.0.1](https://github.com/BlackGlory/extra-promise/compare/v1.0.0...v1.0.1) (2022-03-17)

## [1.0.0](https://github.com/BlackGlory/extra-promise/compare/v0.21.2...v1.0.0) (2022-03-05)


### ⚠ BREAKING CHANGES

* remove isPromise, isntPromise, isPromiseLike, isntPromiseLike

### Features

* remove isPromise, isntPromise, isPromiseLike, isntPromiseLike ([6335d1c](https://github.com/BlackGlory/extra-promise/commit/6335d1c40020a9c9773027506465064404fcc9e8))

### [0.21.2](https://github.com/BlackGlory/extra-promise/compare/v0.21.1...v0.21.2) (2022-01-24)


### Features

* improve ([f49a83c](https://github.com/BlackGlory/extra-promise/commit/f49a83c9f78205e9e0310fef0db263c51c8ea408))

### [0.21.1](https://github.com/BlackGlory/extra-promise/compare/v0.21.0...v0.21.1) (2022-01-06)

## [0.21.0](https://github.com/BlackGlory/extra-promise/compare/v0.20.0...v0.21.0) (2021-12-17)


### ⚠ BREAKING CHANGES

* - Remove `timeoutSignal`, `withAbortSignal`, `raceAbortSignals`

### Features

* remove timeoutSignal, withAbortSignal, raceAbortSignals ([d810f3c](https://github.com/BlackGlory/extra-promise/commit/d810f3c8ea5d0889f7029ad2c556dea317092961))

## [0.20.0](https://github.com/BlackGlory/extra-promise/compare/v0.19.7...v0.20.0) (2021-12-16)


### ⚠ BREAKING CHANGES

* - The minimum version is Node.js v16

* upgrade Node.js version ([57975a3](https://github.com/BlackGlory/extra-promise/commit/57975a34020d782ecbaab9615b55a9ffb146c161))

### [0.19.7](https://github.com/BlackGlory/extra-promise/compare/v0.19.6...v0.19.7) (2021-12-16)

### [0.19.6](https://github.com/BlackGlory/extra-promise/compare/v0.19.5...v0.19.6) (2021-12-13)

### [0.19.5](https://github.com/BlackGlory/extra-promise/compare/v0.19.4...v0.19.5) (2021-12-13)

### [0.19.4](https://github.com/BlackGlory/extra-promise/compare/v0.19.3...v0.19.4) (2021-12-04)

### [0.19.3](https://github.com/BlackGlory/extra-promise/compare/v0.19.2...v0.19.3) (2021-12-04)


### Features

* add ReusableDeferred ([68641b3](https://github.com/BlackGlory/extra-promise/commit/68641b3113ab5afa227fd0780ff1c66e35c8937b))

### [0.19.2](https://github.com/BlackGlory/extra-promise/compare/v0.19.1...v0.19.2) (2021-12-01)

### [0.19.1](https://github.com/BlackGlory/extra-promise/compare/v0.19.0...v0.19.1) (2021-10-14)

## [0.19.0](https://github.com/BlackGlory/extra-promise/compare/v0.18.7...v0.19.0) (2021-10-12)


### ⚠ BREAKING CHANGES

* methods Semaphore.acquire and Mutx.acquire will unlock after throwing

### Features

* methods Semaphore.acquire and Mutx.acquire will unlock after throwing ([7b076f9](https://github.com/BlackGlory/extra-promise/commit/7b076f9b3b9871510b37de369b0a6729f8c5852c))

### [0.18.7](https://github.com/BlackGlory/extra-promise/compare/v0.18.6...v0.18.7) (2021-09-25)

### [0.18.6](https://github.com/BlackGlory/extra-promise/compare/v0.18.5...v0.18.6) (2021-09-19)


### Features

* add queueConcurrency, throttleConcurrency, throttleUntilDone ([8726c3d](https://github.com/BlackGlory/extra-promise/commit/8726c3d817c065f690c1486632770de931bca154))

### [0.18.5](https://github.com/BlackGlory/extra-promise/compare/v0.18.4...v0.18.5) (2021-09-16)

### [0.18.4](https://github.com/BlackGlory/extra-promise/compare/v0.18.3...v0.18.4) (2021-09-14)

### [0.18.3](https://github.com/BlackGlory/extra-promise/compare/v0.18.2...v0.18.3) (2021-09-14)


### Features

* add raceAbortSignals ([8c91d8a](https://github.com/BlackGlory/extra-promise/commit/8c91d8abbb06854aa23ef1d8e352dfaf7a3f1039))

### [0.18.2](https://github.com/BlackGlory/extra-promise/compare/v0.18.1...v0.18.2) (2021-08-02)

### [0.18.1](https://github.com/BlackGlory/extra-promise/compare/v0.18.0...v0.18.1) (2021-07-14)


### Features

* improve Semaphore, Mutex ([950ab8b](https://github.com/BlackGlory/extra-promise/commit/950ab8bfc9f1caee5bceaaf2da81a105ba5e1587))

## [0.18.0](https://github.com/BlackGlory/extra-promise/compare/v0.17.6...v0.18.0) (2021-07-14)


### ⚠ BREAKING CHANGES

* The `acquire` method of `Semaphore` and `Mutex` now always return `Promise`.

### Features

* improve Semaphore, Mutex ([41af3a9](https://github.com/BlackGlory/extra-promise/commit/41af3a92f2f0df136d46142616caa9cee40ffb3b))

### [0.17.6](https://github.com/BlackGlory/extra-promise/compare/v0.17.5...v0.17.6) (2021-07-13)


### Bug Fixes

* close unexhausted iterators ([2545371](https://github.com/BlackGlory/extra-promise/commit/25453714c818e8e01af6e8604c41882ec4c1e41b))

### [0.17.5](https://github.com/BlackGlory/extra-promise/compare/v0.17.4...v0.17.5) (2021-07-12)

### [0.17.4](https://github.com/BlackGlory/extra-promise/compare/v0.17.3...v0.17.4) (2021-07-03)

### [0.17.3](https://github.com/BlackGlory/extra-promise/compare/v0.17.2...v0.17.3) (2021-05-30)


### Bug Fixes

* build ([220a091](https://github.com/BlackGlory/extra-promise/commit/220a091b36c9f83756ba7fb10fb35a5a8a4d76c9))

### [0.17.2](https://github.com/BlackGlory/extra-promise/compare/v0.17.1...v0.17.2) (2021-05-30)


### Features

* add all ([f8fdca8](https://github.com/BlackGlory/extra-promise/commit/f8fdca87fe5ba60d3a6302f9bf6ee37cb4f53d5c))

### [0.17.1](https://github.com/BlackGlory/extra-promise/compare/v0.17.0...v0.17.1) (2021-05-17)

## [0.17.0](https://github.com/BlackGlory/extra-promise/compare/v0.16.6...v0.17.0) (2021-05-17)


### ⚠ BREAKING CHANGES

* - remove `InvalidArgumentError`
- remove `InvalidArgumentsLengthError`

### Features

* rewrite ([a67a402](https://github.com/BlackGlory/extra-promise/commit/a67a40274c65785c53572c7e8f010b6a1800e54b))

### [0.16.6](https://github.com/BlackGlory/extra-promise/compare/v0.16.5...v0.16.6) (2021-05-16)

### [0.16.5](https://github.com/BlackGlory/extra-promise/compare/v0.16.4...v0.16.5) (2021-05-16)

### [0.16.4](https://github.com/BlackGlory/extra-promise/compare/v0.16.3...v0.16.4) (2021-04-30)


### Features

* improve spawn ([836e4c7](https://github.com/BlackGlory/extra-promise/commit/836e4c726102f0d7ded3979466ab0cacd443f1d4))

### [0.16.3](https://github.com/BlackGlory/extra-promise/compare/v0.16.2...v0.16.3) (2021-04-30)


### Features

* add spawn ([9bf6d45](https://github.com/BlackGlory/extra-promise/commit/9bf6d453a732151eae84d7313e9d5974794e499d))

### [0.16.2](https://github.com/BlackGlory/extra-promise/compare/v0.16.1...v0.16.2) (2021-03-27)


### Features

* add toExtraPromise ([32b1c97](https://github.com/BlackGlory/extra-promise/commit/32b1c97d071d55715e9c3c5025acf5f453b94de1))

### [0.16.1](https://github.com/BlackGlory/extra-promise/compare/v0.16.0...v0.16.1) (2021-03-27)


### Features

* add ExtraPromise ([a2a4e8c](https://github.com/BlackGlory/extra-promise/commit/a2a4e8c76310acaf5fc3f8beb45da700902feca0))


### Bug Fixes

* edge cases ([185f94d](https://github.com/BlackGlory/extra-promise/commit/185f94de984f02891d74698ab60d9e92ac9143aa))
* parallel behavior ([6978627](https://github.com/BlackGlory/extra-promise/commit/69786274eae6d29080e1c1caa02c9d0033a03ee6))

## [0.16.0](https://github.com/BlackGlory/extra-promise/compare/v0.15.6...v0.16.0) (2021-03-22)


### ⚠ BREAKING CHANGES

* move retryUntil to extra-retry

### Features

* move retryUntil to extra-retry ([e38211d](https://github.com/BlackGlory/extra-promise/commit/e38211d025c37029ac1408894046995e9b4741be))

### [0.15.6](https://github.com/BlackGlory/extra-promise/compare/v0.15.5...v0.15.6) (2021-03-17)

### [0.15.5](https://github.com/BlackGlory/extra-promise/compare/v0.15.4...v0.15.5) (2021-03-15)


### Features

* add withAbortSignal ([28cf792](https://github.com/BlackGlory/extra-promise/commit/28cf79209ccf5ffeb33e3784d793bb39ae5d9f7c))

### [0.15.4](https://github.com/BlackGlory/extra-promise/compare/v0.15.3...v0.15.4) (2021-03-05)

### [0.15.3](https://github.com/BlackGlory/extra-promise/compare/v0.15.2...v0.15.3) (2021-03-05)


### Features

* add isntPromise, isntPromiseLike ([0b31adf](https://github.com/BlackGlory/extra-promise/commit/0b31adf29840af1903ed266c1591181a28a706e1))

### [0.15.2](https://github.com/BlackGlory/extra-promise/compare/v0.15.1...v0.15.2) (2021-03-05)

### [0.15.1](https://github.com/BlackGlory/extra-promise/compare/v0.15.0...v0.15.1) (2021-03-05)


### Bug Fixes

* timeoutSignal ([720eb00](https://github.com/BlackGlory/extra-promise/commit/720eb00a6726aaa4703215fb7151916d2da628cf))

## [0.15.0](https://github.com/BlackGlory/extra-promise/compare/v0.14.5...v0.15.0) (2021-03-05)


### ⚠ BREAKING CHANGES

* remove retryForever, retryCount

### Features

* remove retryForever, retryCount ([fcb5d19](https://github.com/BlackGlory/extra-promise/commit/fcb5d19232862dbaeef4180d073c23d8536eb423))

### [0.14.5](https://github.com/BlackGlory/extra-promise/compare/v0.14.4...v0.14.5) (2021-03-02)


### Features

* add parameter fatalErrors ([02c39f6](https://github.com/BlackGlory/extra-promise/commit/02c39f61b4bb226d5027e5bacf5bcfb52d443bbf))

### [0.14.4](https://github.com/BlackGlory/extra-promise/compare/v0.14.3...v0.14.4) (2021-02-25)

### [0.14.3](https://github.com/BlackGlory/extra-promise/compare/v0.14.2...v0.14.3) (2021-02-04)

### [0.14.2](https://github.com/BlackGlory/extra-promise/compare/v0.14.1...v0.14.2) (2021-02-03)


### Bug Fixes

* bundle ([bb5a73e](https://github.com/BlackGlory/extra-promise/commit/bb5a73e754a437c19fe11028b79ddd0647f79424))

### [0.14.1](https://github.com/BlackGlory/extra-promise/compare/v0.14.0...v0.14.1) (2021-02-03)

## [0.14.0](https://github.com/BlackGlory/extra-promise/compare/v0.13.15...v0.14.0) (2021-02-02)


### ⚠ BREAKING CHANGES

* cascadable => Cascadable

### Features

* rename cascadable to Cascadable ([a14c6e0](https://github.com/BlackGlory/extra-promise/commit/a14c6e006903f997335530760033ece82c017fb7))

### [0.13.15](https://github.com/BlackGlory/extra-promise/compare/v0.13.14...v0.13.15) (2021-01-20)


### Bug Fixes

* build scripts ([cd70298](https://github.com/BlackGlory/extra-promise/commit/cd70298222a82b76414f52b3df84ea33ca8b69da))

### [0.13.14](https://github.com/BlackGlory/extra-promise/compare/v0.13.13...v0.13.14) (2021-01-20)

### [0.13.13](https://github.com/BlackGlory/extra-promise/compare/v0.13.12...v0.13.13) (2021-01-15)


### Bug Fixes

* esm bundle ([1fc1e0d](https://github.com/BlackGlory/extra-promise/commit/1fc1e0da2d147b7b9960f4fd8611c35a9e89377b))

### [0.13.12](https://github.com/BlackGlory/extra-promise/compare/v0.13.11...v0.13.12) (2021-01-05)


### Features

* add clear ([4f4e759](https://github.com/BlackGlory/extra-promise/commit/4f4e7593b9152709f0d214ed0acc44bf7ff8c108))

### [0.13.11](https://github.com/BlackGlory/extra-promise/compare/v0.13.10...v0.13.11) (2021-01-04)

### [0.13.10](https://github.com/BlackGlory/extra-promise/compare/v0.13.9...v0.13.10) (2021-01-04)

### [0.13.9](https://github.com/BlackGlory/extra-promise/compare/v0.13.8...v0.13.9) (2021-01-04)


### Features

* add TaskRunner ([81b5468](https://github.com/BlackGlory/extra-promise/commit/81b5468a0ff377b6a2968c1f81b0e70f82b09b02))

### [0.13.8](https://github.com/BlackGlory/extra-promise/compare/v0.13.7...v0.13.8) (2021-01-01)


### Features

* add retryForever, retryCount ([22c97dd](https://github.com/BlackGlory/extra-promise/commit/22c97dd6cc5c1d327b698723c135a7cdb2a06a68))

### [0.13.7](https://github.com/BlackGlory/extra-promise/compare/v0.13.6...v0.13.7) (2020-12-23)

### [0.13.6](https://github.com/BlackGlory/extra-promise/compare/v0.13.5...v0.13.6) (2020-12-21)


### Bug Fixes

* bundle ([742539d](https://github.com/BlackGlory/extra-promise/commit/742539d76138d595b7bce61a020ca294ecf60cc2))

### [0.13.5](https://github.com/BlackGlory/extra-promise/compare/v0.13.4...v0.13.5) (2020-12-21)


### Features

* add timeoutSignal ([cdc7d75](https://github.com/BlackGlory/extra-promise/commit/cdc7d7503d5d4afcebeb12ab725585164c518882))

### [0.13.4](https://github.com/BlackGlory/extra-promise/compare/v0.13.3...v0.13.4) (2020-12-20)

### [0.13.3](https://github.com/BlackGlory/extra-promise/compare/v0.13.2...v0.13.3) (2020-12-20)


### Bug Fixes

* types ([33bee5e](https://github.com/BlackGlory/extra-promise/commit/33bee5e86165a47711654bcd8d1910c1c94a1654))

### [0.13.2](https://github.com/BlackGlory/extra-promise/compare/v0.13.1...v0.13.2) (2020-12-19)

### [0.13.1](https://github.com/BlackGlory/extra-promise/compare/v0.13.0...v0.13.1) (2020-12-19)

## [0.13.0](https://github.com/BlackGlory/extra-promise/compare/v0.12.1...v0.13.0) (2020-12-19)


### ⚠ BREAKING CHANGES

* makeChannel => Channel
makeBufferedChannel => BufferedChannel
makeUnlimitedChannel => UnlimitedChannel

### Features

* replace makeChannel functions with classes ([933bc6c](https://github.com/BlackGlory/extra-promise/commit/933bc6cc5a0a53e20267ed9288914a7a395c934b))

### [0.12.1](https://github.com/BlackGlory/extra-promise/compare/v0.12.0...v0.12.1) (2020-12-19)

## [0.12.0](https://github.com/BlackGlory/extra-promise/compare/v0.11.0...v0.12.0) (2020-12-19)


### ⚠ BREAKING CHANGES

* remove Signal#refresh

### Features

* export SignalGroup ([24fbb49](https://github.com/BlackGlory/extra-promise/commit/24fbb49b644cb855f7fa1227756f43f31b687f3d))
* remove Signal#refresh ([5da7dce](https://github.com/BlackGlory/extra-promise/commit/5da7dce8d49e2003d9002cfae3b55849b32011b1))

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
