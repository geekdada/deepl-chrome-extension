import tw, { css } from 'twin.macro'
import { ClassNames } from '@emotion/react'
import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import cc from 'chrome-call'
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom'
import { SnackbarProvider } from 'notistack'

import logger from '../../../../common/logger'
import { Config } from '../../../../common/types'
import IconButton from '../../../../components/IconButton'
import CloseIcon from '../../../../components/svg/Close'
import translationStack from '../../common/translation-stack'
import { TranslateJob } from '../../common/types'
import { ConfigContext, ConfigState } from '../../providers/config'
import { useTranslateJobsDispatch } from '../../providers/translate-jobs'
import TranslationList from '../TranslationList'

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>()
  const [close, setClose] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dispatch = useTranslateJobsDispatch()

  const appPosition = useMemo(() => {
    const vw = window.top.innerWidth || window.innerWidth || 0
    const vh = window.top.innerHeight || window.innerHeight || 0

    return {
      x: vw - 450 - 20,
      y: vh - 600 - 20,
    }
  }, [])

  const onNewJob = useCallback(
    (job: TranslateJob) => {
      logger.debug({
        msg: 'new job',
        job,
      })

      if (!job.sourceLang) {
        job.sourceLang = 'EN'
      }

      dispatch({
        type: 'add',
        payload: job,
      })
    },
    [dispatch],
  )

  const onDragStart: DraggableEventHandler = (e) => {
    if (
      e.target instanceof Element &&
      closeButtonRef.current?.contains(e.target)
    ) {
      return false
    }
  }

  useEffect(() => {
    translationStack.attachQueue(onNewJob)

    return () => {
      translationStack.detachQueue()
    }
  }, [onNewJob])

  useEffect(() => {
    cc(chrome.storage.sync, 'get').then((config: Config) => {
      setConfig({
        targetLang: config.targetLang,
      })
    })

    window.__ate_setClose = setClose
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      <ClassNames>
        {({ css, cx }) => (
          <Draggable
            handle=".ate_App__header"
            onStart={onDragStart}
            defaultPosition={appPosition}>
            <div
              ref={appRef}
              className={cx(
                'ate_App',
                css`
                  position: absolute;
                  width: 450px;
                  height: 600px;
                  z-index: 1;
                  will-change: transform;

                  ${tw`bg-white shadow-md rounded-lg overflow-hidden flex flex-col`}
                `,
                close &&
                  css`
                    display: none;
                  `,
              )}>
              <SnackbarProvider
                maxSnack={3}
                domRoot={appRef.current || undefined}>
                <div
                  className="ate_App__header"
                  tw="bg-purple-800 px-5 py-3 text-white font-bold text-lg cursor-move flex justify-between items-center">
                  <span>A Translator</span>
                  <span>
                    <IconButton
                      ref={closeButtonRef}
                      css={[
                        tw`p-1`,
                        css`
                          svg {
                            @apply text-gray-800;
                          }
                        `,
                      ]}
                      onClick={() => setClose(true)}>
                      <CloseIcon />
                    </IconButton>
                  </span>
                </div>
                <ScrollToBottom tw="flex-1 overflow-auto" debug={false}>
                  <TranslationList />
                </ScrollToBottom>
              </SnackbarProvider>
            </div>
          </Draggable>
        )}
      </ClassNames>
    </ConfigContext.Provider>
  )
}

export default App

declare global {
  interface Window {
    __ate_setClose?: React.Dispatch<any>
  }
}
