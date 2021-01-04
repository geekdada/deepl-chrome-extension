import { v4 as uuid } from 'uuid'

import { TextSelection, TranslateJob } from './types'

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

  push(job: TextSelection) {
    if (this.onPush) {
      this.onPush({
        ...job,
        id: uuid(),
      })
    } else {
      this.stack.push({
        ...job,
        id: uuid(),
      })
    }
  }
}

const translationStack = new TranslationStack()

export default translationStack
