import cc from 'chrome-call'
import { createClient } from 'connect.io'
import logger from '../../../common/logger'

export const openExtension = (): void => {
  cc(chrome.tabs, 'query', { active: true, currentWindow: true })
    .then((tabs: chrome.tabs.Tab[]) => {
      const client = createClient(tabs[0].id)

      client.send('open_extension')
    })
    .catch((err) => {
      logger.error({
        err,
      })
    })
}
