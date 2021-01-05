import axios from 'axios'

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
    const form = new FormData()

    form.append('auth_key', this.apiToken)
    form.append('target_lang', targetLang)
    form.append('text', text)

    return this.axios.post('/v2/translate', form).then((res) => res.data)
  }

  private getAPI(): string {
    switch (this.region) {
      case 'global':
        return 'https://a-translator-api-cf.nerdynerd.org'
      case 'dev':
        return 'http://localhost:1337'
      default:
        return 'https://a-translator-api.nerdynerd.org'
    }
  }
}

export default Client
