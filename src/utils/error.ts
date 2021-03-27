import { CustomError } from '@blackglory/errors'

export class InvalidArgumentError extends CustomError {
  constructor(name: string, expected?: string) {
    if (expected) {
      super(`${name} argument must be ${expected}`)
    } else {
      super(`Invalid ${name} value`)
    }
  }
}

export class InvalidArgumentsLengthError extends CustomError {
  constructor(name: string, minimum: number, got: number) {
    super(`${name} requires at least ${pluralize('argument', minimum)}, but only ${pluralize('was', got)} passed`)
  }
}

function pluralize(word: string, count: number) {
  if (count !== 1) {
    switch (word) {
      case 'was': word = 'were'; break
      default: word = word + 's'
    }
  }
  return `${count} ${word}`
}

export class ChannelClosedError extends CustomError {}
