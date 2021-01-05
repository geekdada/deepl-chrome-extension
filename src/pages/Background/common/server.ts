import cc from 'chrome-call'
import { createServer } from 'connect.io'

import Client from '../../../common/api'
import logger from '../../../common/logger'
import { Config } from '../../../common/types'
import { Handler } from './types'

const server = createServer()

const onTranslate: Handler<{
  text: string
  targetLang: string
}> = (payload, resolve, reject) => {
  ;(async () => {
    logger.debug({
      msg: 'receive translate payload',
      payload,
    })

    const config: Config = await cc(chrome.storage.sync, 'get')
    const client = new Client(config.token)

    if (process.env.USE_MOCK_TRANSLATE === 'true') {
      resolve({
        translations: [
          {
            detected_source_language: 'EN',
            text: '模拟翻译结果',
          },
        ],
      })
      return
    }

    const result = await client.translate(payload.text, payload.targetLang)

    resolve(result)
  })().catch((err) => {
    logger.error({
      err,
    })
    reject({
      message: err.message,
    })
  })
}

server.on('connect', (client) => {
  client.on('translate', onTranslate)
})

export default server
