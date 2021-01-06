import { TranslateJob } from './types'

class TranslationStack {
  stack: Array<TranslateJob> = []
  onPush?: (job: TranslateJob) => void

  attachQueue(onPush: (job: TranslateJob) => void) {
    this.onPush = onPush

    while (this.stack.length) {
      const job = this.stack.shift()
      if (job) this.onPush(job)
    }
  }

  detachQueue(): void {
    this.onPush = undefined
  }

  push(job: TranslateJob) {
    if (this.onPush) {
      this.onPush(job)
    } else {
      this.stack.push(job)
    }
  }
}

const translationStack = new TranslationStack()

export default translationStack
