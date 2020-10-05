export class InvalidArgumentError extends TypeError {
  constructor(name: string, expected?: string) {
    if (expected) {
      super(`${name} argument must be ${expected}`)
    } else {
      super(`Invalid ${name} value`)
    }
    this.name = this.constructor.name
  }
}

export class InvalidArgumentsLengthError extends TypeError {
  name = this.constructor.name

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

export class ChannelClosedError {
  name = this.constructor.name
}
