import React from 'react'
import { render } from 'react-dom'
// @ts-ignore
import smoothScrollPolyfill from 'smoothscroll-polyfill'
import * as rangy from 'rangy'
// @ts-ignore
import 'rangy/lib/rangy-classapplier'
import 'rangy/lib/rangy-highlighter'

import logger from '../../common/logger'
import { SupportLanguages } from '../../common/types'
import server from './common/server'
import translationStack from './common/translation-stack'
import { TextSelection } from './common/types'
import { getFirstRange } from './common/utils'
import App from './components/App'
import './styles/index.scss'
import { TranslateJobsProvider } from './providers/translate-jobs'

let isAppAttached = false
let lastSelection: (TextSelection & { selection: RangySelection }) | undefined
let highlighter: any

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
      // @ts-ignore
      rangy.init()
      // @ts-ignore
      highlighter = rangy.createHighlighter()
      // @ts-ignore
      highlighter.addClassApplier(
        // @ts-ignore
        rangy.createClassApplier('ate-highlight', {
          ignoreWhiteSpace: true,
          tagNames: ['span', 'a'],
        }),
      )

      document.querySelector<HTMLBodyElement>('body')?.append(iconContainer)
      document.querySelector<HTMLBodyElement>('body')?.append(container)

      attachListeners()

      // TODO: remove before deploying
      // initApp()
    } catch (err) {
      logger.error({
        err,
      })
    }
  })

  if (!('scrollBehavior' in document.documentElement.style)) {
    smoothScrollPolyfill.polyfill()
  }
}

const onMouseUp = (e: MouseEvent) => {
  const selection = rangy.getSelection()
  const iconElement = document.querySelector<HTMLSpanElement>('#ate-icon')

  if (selection.toString().trim() && iconElement) {
    const appElement = document.querySelector<HTMLDivElement>('.ate_App')

    if (
      appElement &&
      e.target instanceof Element &&
      appElement.contains(e.target)
    ) {
      return
    }

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
  initApp()
  translationStack.push(selection)
}

const attachListeners = () => {
  document.addEventListener('mouseup', onMouseUp, false)

  document
    .querySelector<HTMLSpanElement>('#ate-icon')
    ?.addEventListener('click', function () {
      logger.debug({
        msg: 'lastSelection',
        lastSelection,
      })

      if (lastSelection) {
        highlightSelection(lastSelection.selection)

        onClickTranslate({
          text: lastSelection.text,
          parentElement: lastSelection.parentElement,
          sourceLang: lastSelection.sourceLang,
        })

        setTimeout(() => {
          lastSelection?.selection.removeAllRanges()
          this.classList.remove('active')
        }, 0)
      }
    })

  server.on('connect', (client) => {
    client.on('open_extension', () => {
      initApp()
    })
  })
}

const highlightSelection = (selection: RangySelection) => {
  const range = getFirstRange(selection)

  if (!range || !highlighter) {
    return
  }

  highlighter.highlightSelection('ate-highlight')
}

const getTextSelection = (
  selection: RangySelection,
): TextSelection & { selection: RangySelection } => {
  const text = selection.toString().trim()
  // const html = selection.toHtml().trim()

  return {
    selection,
    parentElement: selection.anchorNode?.parentElement ?? undefined,
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
  if (isAppAttached) {
    window.__ate_setClose && window.__ate_setClose(false)
  } else {
    render(
      <TranslateJobsProvider>
        <App />
      </TranslateJobsProvider>,
      document.querySelector('#ate-container'),
    )
    isAppAttached = true
  }
}

main().catch((err) => {
  logger.error({
    err,
  })
})
