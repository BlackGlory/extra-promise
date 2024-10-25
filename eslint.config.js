// @ts-check

import js from '@eslint/js'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended
, ...ts.configs.recommended
, {
    rules: {
      'no-constant-condition': 'off'
    , 'require-yield': 'off'
    , 'no-async-promise-executor': 'off'
    , 'no-cond-assign': 'off'
    , '@typescript-eslint/no-inferrable-types': 'off'
    , '@typescript-eslint/ban-types': 'off'
    , '@typescript-eslint/ban-ts-comment': 'off'
    , '@typescript-eslint/no-explicit-any': 'off'
    , '@typescript-eslint/no-unused-vars': 'off'
    }
  }
)
