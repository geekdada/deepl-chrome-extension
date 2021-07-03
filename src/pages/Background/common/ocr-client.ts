import defaultsDeep from 'lodash-es/defaultsDeep'
import { SHA256, HmacSHA256, enc } from 'crypto-js'
import axios from 'axios'

export class TcRequestError extends Error {
  code?: string

  constructor(message: string, code?: string) {
    super(message + (code ? ` [${code}]` : ''))
    this.name = 'TcRequestError'
    if (code) this.code = code
  }
}

export class OcrClient {
  private config: {
    secretId: string
    secretKey: string
    region: string
  }
  private requestConfig = {
    host: 'ocr.tencentcloudapi.com',
    service: 'ocr',
    version: '2018-11-19',
    algorithm: 'TC3-HMAC-SHA256',
    httpRequestMethod: 'POST',
    canonicalUri: '/',
    canonicalQueryString: '',
    canonicalHeaders:
      'content-type:application/json; charset=utf-8\nhost:ocr.tencentcloudapi.com\n',
    signedHeaders: 'content-type;host',
  }

  constructor(config: { secretId: string; secretKey: string; host?: string }) {
    this.config = defaultsDeep({}, config, {
      region: 'ap-shanghai',
    })
  }

  async request(data: { dataUrl: string }): Promise<string[]> {
    const payload = {
      ImageBase64: data.dataUrl,
    }
    const signature = this.signPayload(payload)
    const headers = {
      Authorization: signature.authorization,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-TC-Action': 'GeneralBasicOCR',
      'X-TC-Timestamp': signature.timestamp,
      'X-TC-Version': this.requestConfig.version,
      'X-TC-Region': this.config.region,
      'X-TC-RequestClient': `WXAPP_SDK_OcrSDK_1.1.0`,
    }

    return axios
      .request({
        url: 'https://ocr.tencentcloudapi.com',
        data: payload,
        method: 'POST',
        headers,
        responseType: 'json',
      })
      .then((res) => {
        if (res.data?.Response?.Error) {
          const error = res.data.Response.Error
          throw new TcRequestError(error.Message, error.Code)
        }

        if (!res.data?.Response?.TextDetections) {
          throw new TcRequestError('没有数据返回')
        }

        const detections = res.data.Response.TextDetections
        const result: string[] = []

        detections.forEach(
          (item: { DetectedText: string; AdvancedInfo: string }) => {
            const advanceInfo: {
              Parag: {
                ParagNo: number
              }
            } = JSON.parse(item.AdvancedInfo)
            const index = advanceInfo.Parag.ParagNo - 1

            if (result[index]) {
              result[index] += ` ${item.DetectedText}`
            } else {
              result.push(item.DetectedText)
            }
          },
        )

        return result
      })
  }

  private signPayload(payload: Record<string, any>): {
    authorization: string
    timestamp: number
  } {
    const hashedRequestPayload = SHA256(JSON.stringify(payload))
    const canonicalRequest = [
      this.requestConfig.httpRequestMethod,
      this.requestConfig.canonicalUri,
      this.requestConfig.canonicalQueryString,
      this.requestConfig.canonicalHeaders,
      this.requestConfig.signedHeaders,
      hashedRequestPayload,
    ].join('\n')
    const t = new Date()
    const date = t.toISOString().substr(0, 10)
    const timestamp = Math.round(t.getTime() / 1000)
    const credentialScope = `${date}/${this.requestConfig.service}/tc3_request`
    const hashedCanonicalRequest = SHA256(canonicalRequest)
    const stringToSign = [
      this.requestConfig.algorithm,
      timestamp,
      credentialScope,
      hashedCanonicalRequest,
    ].join('\n')

    const secretDate = HmacSHA256(date, `TC3${this.config.secretKey}`)
    const secretService = HmacSHA256(this.requestConfig.service, secretDate)
    const secretSigning = HmacSHA256('tc3_request', secretService)

    const signature = enc.Hex.stringify(HmacSHA256(stringToSign, secretSigning))

    return {
      authorization:
        `${this.requestConfig.algorithm} ` +
        `Credential=${this.config.secretId}/${credentialScope}, ` +
        `SignedHeaders=${this.requestConfig.signedHeaders}, ` +
        `Signature=${signature}`,
      timestamp,
    }
  }
}
