import './common/polyfill'

import React from 'react'
import { render } from 'react-dom'
import { v4 as uuid } from 'uuid'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

import './styles/index.scss'

import logger from '../../common/logger'
import rangy from '../../common/rangy'
import server from './common/server'
import translationStack from './common/translation-stack'
import { TextSelection, TranslateJob } from './common/types'
import { getDocumentLang, getFirstRange } from './common/utils'
import App from './components/App'
import { TranslateJobsProvider } from './providers/translate-jobs'

let isAppAttached = false
let lastSelection: TextSelection | undefined
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
      rangy.init()
      highlighter = rangy.createHighlighter()
      highlighter.addClassApplier(
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
}

const onMouseUp = (e: MouseEvent) => {
  const selection = rangy.getSelection()
  const iconElement = document.querySelector<HTMLSpanElement>('#ate-icon')

  if (!iconElement || !(e.target instanceof Element)) {
    return
  }

  /**
   * 点击翻译按钮
   */
  if (e.target === iconElement) {
    e.stopPropagation()
    e.preventDefault()

    logger.debug({
      msg: 'lastSelection',
      lastSelection,
    })

    if (lastSelection) {
      const id = uuid()
      const anchorId = `ate_anchor_${id}`

      if (lastSelection.selection.anchorNode?.parentElement) {
        lastSelection.selection.anchorNode?.parentElement.classList.add(
          anchorId,
        )
      }

      highlightSelection(lastSelection.selection)

      addTranslateJob({
        anchorId,
        id,
        text: lastSelection.text,
        sourceLang: lastSelection.sourceLang,
      })

      lastSelection?.selection.removeAllRanges()
      lastSelection = undefined
      iconElement.classList.remove('active')
    }

    return
  }

  /**
   * 没有点击翻译按钮
   */
  if (selection.toString().trim()) {
    /**
     * 选择了文字
     */

    const appElement = document.querySelector<HTMLDivElement>('.ate_App')

    if (appElement && appElement.contains(e.target)) {
      // 焦点处在 App 内，让按钮消失，清空上一次的选择
      iconElement.classList.remove('active')
      lastSelection = undefined

      return
    }

    lastSelection = getTextSelection(selection)

    iconElement.style.top = e.pageY + 20 + 'px'
    iconElement.style.left = e.pageX + 'px'
    iconElement.classList.add('active')
  } else {
    /**
     * 没有选择文字，有以下情况
     *
     * 1. 点击鼠标
     * 2. 空选择
     * 3. 拖拽
     */

    lastSelection = undefined

    // 只要没有选中文字都让按钮消失
    iconElement.classList.remove('active')
  }
}

const addTranslateJob = (job: TranslateJob) => {
  initApp()
  translationStack.push(job)
}

const attachListeners = () => {
  document.addEventListener('mouseup', onMouseUp, false)

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

const getTextSelection = (selection: RangySelection): TextSelection => {
  let text: string

  if ('toString' in selection.nativeSelection) {
    text = selection.nativeSelection.toString().trim()
  } else {
    text = selection.toString().trim()
  }

  const parentElement = selection.anchorNode?.parentElement

  if (
    parentElement &&
    (parentElement.closest('pre') || parentElement.closest('.highlight'))
  ) {
    text = text.replaceAll('\n', ' ')
  }

  logger.debug(text.split('\n'))

  return {
    selection,
    sourceLang: getDocumentLang(),
    text,
  }
}

const styleCache = createCache({
  key: 'ate',
})

const initApp = (): void => {
  if (isAppAttached) {
    window.__ate_setClose && window.__ate_setClose(false)
  } else {
    render(
      <CacheProvider value={styleCache}>
        <TranslateJobsProvider>
          <App />
        </TranslateJobsProvider>
      </CacheProvider>,
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
