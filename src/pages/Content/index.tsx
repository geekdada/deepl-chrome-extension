import React from 'react'
import { render } from 'react-dom'

import logger from '../../common/logger'
import { SupportLanguages } from '../../common/types'
import translationStack from './common/translation-stack'
import { TextSelection } from './common/types'
import App from './components/App'
import './styles/index.scss'
import { TranslateJobsProvider } from './providers/translate-jobs'

let isAppAttached = false
let lastSelection: TextSelection | undefined
const main = async () => {
  const container = document.createElement('div')
  container.id = 'ate-container'

  const iconContainer = document.createElement('div')
  iconContainer.id = 'ate-icon-container'

  const iconElement = document.createElement('span')
  iconElement.id = 'ate-icon'
  iconElement.style.backgroundImage = `url(${chrome.runtime.getURL(
    'icon-128.png',
  )})`

  iconContainer.appendChild(iconElement)

  window.addEventListener('load', () => {
    try {
      document.querySelector('body')?.append(iconContainer)
      document.querySelector('body')?.append(container)

      attachListeners()

      // TODO: remove before deploying
      initApp()
    } catch (err) {
      logger.error({
        err,
      })
    }
  })
}

const onMouseUp = (e: MouseEvent) => {
  const selection = window.getSelection()
  const iconElement = document.querySelector<HTMLSpanElement>('#ate-icon')

  if (selection?.toString().trim() && iconElement) {
    lastSelection = getTextSelection(selection)
    iconElement.style.top = e.pageY + 20 + 'px'
    iconElement.style.left = e.pageX + 'px'
    iconElement.classList.add('active')
  } else {
    // @ts-ignore
    if (e.target?.id !== 'ate-icon') {
      lastSelection = undefined
    }

    iconElement?.classList.remove('active')
  }
}

const onClickTranslate = (selection: TextSelection) => {
  if (isAppAttached) {
    translationStack.push(selection)
  } else {
    initApp()
    translationStack.push(selection)
  }
}

const attachListeners = () => {
  document.addEventListener('mouseup', onMouseUp, false)
  document.querySelector('#ate-icon')?.addEventListener('click', (e) => {
    logger.debug({
      msg: 'lastSelection',
      lastSelection,
    })
    if (lastSelection) {
      onClickTranslate(lastSelection)
    }
  })
}

const getTextSelection = (selection: Selection): TextSelection => {
  const text = selection.toString().trim()

  return {
    anchor: selection.anchorNode?.parentElement ?? undefined,
    anchorOffset: selection.anchorOffset,
    rangeCount: selection.rangeCount,
    sourceLang: getSourceLang(),
    text,
  }
}

const getSourceLang = (): SupportLanguages | undefined => {
  const html = document.querySelector('html')

  if (!html) return

  if (!html.hasAttribute('lang')) {
    return
  }

  const lang = (html.getAttribute('lang') as string).toUpperCase()

  if (lang.startsWith('ZH')) {
    return 'ZH'
  }
  if (lang.startsWith('EN')) {
    return 'EN'
  }
  if (lang.startsWith('EN')) {
    return 'EN'
  }
  if (lang.startsWith('JA')) {
    return 'JA'
  }
  if (lang.startsWith('DE')) {
    return 'DE'
  }
  if (lang.startsWith('FR')) {
    return 'FR'
  }
  if (lang.startsWith('ES')) {
    return 'ES'
  }
  if (lang.startsWith('PT')) {
    return 'PT'
  }
  if (lang.startsWith('PT')) {
    return 'PT'
  }
  if (lang.startsWith('IT')) {
    return 'IT'
  }
  if (lang.startsWith('NL')) {
    return 'NL'
  }
  if (lang.startsWith('PL')) {
    return 'PL'
  }
  if (lang.startsWith('RU')) {
    return 'RU'
  }

  return undefined
}

const initApp = () => {
  render(
    <TranslateJobsProvider>
      <App />
    </TranslateJobsProvider>,
    document.querySelector('#ate-container'),
  )
  isAppAttached = true
}

main().catch((err) => {
  logger.error({
    err,
  })
})
