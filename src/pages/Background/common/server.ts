import cc from 'chrome-call'
import { createServer } from 'connect.io'

import Client from '../../../common/api'
import logger from '../../../common/logger'
import { Config } from '../../../common/types'
import { OcrClient } from './ocr-client'
import { Handler } from './types'
import { cropImage } from './utils'

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
    const client = new Client(config.token, config.region)

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

const onScreenshot: Handler<{
  x: number
  y: number
  width: number
  height: number
  clientWidth: number
  clientHeight: number
  clientPixelRatio: number
}> = (payload, resolve, reject) => {
  ;(async () => {
    logger.debug(
      {
        payload,
      },
      'receive screenshot payload',
    )

    const dataUrl: string = await cc(chrome.tabs, 'captureVisibleTab', null, {
      quality: 75,
    })

    resolve({
      dataUrl: await cropImage(dataUrl, {
        ...payload,
        imageWidth: payload.clientWidth,
        imageHeight: payload.clientHeight,
        imageRatio: payload.clientPixelRatio,
      }),
    })
  })().catch((err) => {
    logger.error({
      err,
    })
    reject({
      message: err.message,
    })
  })
}

const onOCR: Handler<{
  dataUrl: string
}> = (payload, resolve, reject) => {
  ;(async () => {
    logger.debug(
      {
        payload,
      },
      'receive ocr payload',
    )

    const config: Config = await cc(chrome.storage.sync, 'get')

    if (!config.ocrSecretId || !config.ocrSecretKey) {
      return
    }

    const client = new OcrClient({
      secretId: config.ocrSecretId,
      secretKey: config.ocrSecretKey,
    })
    const data = await client.request({ dataUrl: payload.dataUrl })

    resolve(data)
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
  client.on('screenshot', onScreenshot)
  client.on('ocr', onOCR)
})

export default server
