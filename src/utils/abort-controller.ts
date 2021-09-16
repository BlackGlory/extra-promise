import NodeAbortController from 'abort-controller'

export const AbortController = globalThis.AbortController ?? NodeAbortController as typeof globalThis.AbortController
