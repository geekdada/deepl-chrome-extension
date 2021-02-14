import axios from 'axios'
import qs from 'query-string'

import { APIRegions, TranslateResult } from './types'

class Client {
  axios = axios.create({
    baseURL: this.getAPI(),
  })

  constructor(private apiToken: string, private region: APIRegions) {
    this.axios.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (error.response) {
          const { data, status } = error.response

          if (data.message) {
            error.message = `${data.message} (${status})`
          }
        }
        return Promise.reject(error)
      },
    )
  }

  async translate(text: string, targetLang: string): Promise<TranslateResult> {
    return this.axios
      .post(
        '/v2/translate',
        qs.stringify({
          auth_key: this.apiToken,
          target_lang: targetLang,
          split_sentences: '1',
          preserve_formatting: '0',
          text: text,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
          responseType: 'json',
        },
      )
      .then((res) => res.data)
  }

  private getAPI(): string {
    switch (this.region) {
      default:
        return 'https://api.deepl.com'
    }
  }
}

export default Client
