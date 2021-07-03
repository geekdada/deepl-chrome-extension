import '../../assets/img/icon-34.png'
import '../../assets/img/icon-128.png'

import cc from 'chrome-call'
import { createClient } from 'connect.io'

import './common/server'
import logger from '../../common/logger'

const openExtension = (): void => {
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

const toggleOCR = (): void => {
  cc(chrome.tabs, 'query', { active: true, currentWindow: true })
    .then((tabs: chrome.tabs.Tab[]) => {
      const client = createClient(tabs[0].id)

      client.send('toggle_ocr')
    })
    .catch((err) => {
      logger.error({
        err,
      })
    })
}

const translateText = (text: string): void => {
  cc(chrome.tabs, 'query', { active: true, currentWindow: true })
    .then((tabs: chrome.tabs.Tab[]) => {
      const client = createClient(tabs[0].id)

      client.send('translate_text', {
        text,
      })
    })
    .catch((err) => {
      logger.error({
        err,
      })
    })
}

chrome.browserAction.onClicked.addListener(openExtension)

chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
    case 'open_application':
      openExtension()
      break
    case 'toggle_ocr':
      toggleOCR()
      break
    default:
    // no default
  }
})

chrome.contextMenus.create({
  id: 'ate',
  title: 'DeepL Translate',
  contexts: ['page'],
})

chrome.contextMenus.create({
  id: 'ate-open_application',
  parentId: 'ate',
  title: '打开应用',
  onclick() {
    openExtension()
  },
})

chrome.contextMenus.create({
  id: 'ate-toggle_ocr',
  parentId: 'ate',
  title: '开启 OCR 识别',
  onclick() {
    toggleOCR()
  },
})

chrome.contextMenus.create({
  id: 'ate-translate_selection',
  contexts: ['selection'],
  title: '翻译选中文字',
  onclick(payload) {
    if (payload.selectionText) {
      translateText(payload.selectionText)
    }
  },
})
