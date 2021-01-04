import axios from 'axios'

import { TranslateResult } from './types'

class Client {
  axios = axios.create({
    baseURL: 'https://a-translator-api.nerdynerd.org',
  })

  constructor(private apiToken: string) {
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
}

export default Client
