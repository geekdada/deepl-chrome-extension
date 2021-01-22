import { AllJobTypes } from './types'

class TranslationStack {
  stack: Array<AllJobTypes> = []
  onPush?: (job: AllJobTypes) => void

  attachQueue(onPush: (job: AllJobTypes) => void) {
    this.onPush = onPush

    while (this.stack.length) {
      const job = this.stack.shift()
      if (job) this.onPush(job)
    }
  }

  detachQueue(): void {
    this.onPush = undefined
  }

  push(job: AllJobTypes) {
    if (this.onPush) {
      this.onPush(job)
    } else {
      this.stack.push(job)
    }
  }
}

const translationStack = new TranslationStack()

export default translationStack
