import { v4 as uuid } from 'uuid'
import tw, { css } from 'twin.macro'
import { ClassNames } from '@emotion/react'
import React, { useRef, useCallback, useEffect, useMemo, useState } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import cc from 'chrome-call'
// @ts-ignore
import ScrollToBottom from 'react-scroll-to-bottom'
import { useSnackbar } from 'notistack'

import logger from '../../../../common/logger'
import { Config } from '../../../../common/types'
import IconButton from '../../../../components/IconButton'
import CloseIcon from '../../../../components/svg/Close'
import CursorClick from '../../../../components/svg/CursorClick'
import LoadingCircle from '../../../../components/svg/LoadingCircle'
import translationStack from '../../common/translation-stack'
import { AllJobTypes, DirectiveJob } from '../../common/types'
import { ConfigContext, ConfigState } from '../../providers/config'
import { useTranslateJobsDispatch } from '../../providers/translate-jobs'
import OCRTool, { OnFinish } from '../OCRTool'
import TranslationList from '../TranslationList'
import client from '../../common/client'

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>()
  const [close, setClose] = useState(false)
  const [showOCRTool, setShowOCRTool] = useState(false)
  const [loadingOCR, setLoadingOCR] = useState(false)
  const appRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const ocrToolButtonRef = useRef<HTMLButtonElement>(null)
  const dispatch = useTranslateJobsDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const enableOCR = useMemo(() => {
    return !!config && !!config.ocrSecretId && !!config.ocrSecretKey
  }, [config])

  const appPosition = useMemo(() => {
    const vw = window.top.innerWidth || window.innerWidth || 0
    const vh = window.top.innerHeight || window.innerHeight || 0

    return {
      x: vw - 450 - 20,
      y: vh - 600 - 20,
    }
  }, [])

  const onNewJob = useCallback(
    (job: AllJobTypes) => {
      logger.debug({
        msg: 'new job',
        job,
      })

      const doDirectiveJob = (job: DirectiveJob): void => {
        switch (job.directive) {
          case 'toggle_ocr':
            if (enableOCR) {
              setShowOCRTool((oldVal) => !oldVal)
            } else {
              enqueueSnackbar('无法开启 OCR，请确认已正确设置腾讯云 OCR', {
                variant: 'warning',
              })
            }
            break
          default:
          // no default
        }
      }

      switch (job.type) {
        case 'translate':
          if (!job.sourceLang) {
            job.sourceLang = 'EN'
          }

          dispatch({
            type: 'add',
            payload: job,
          })
          break

        case 'directive':
          doDirectiveJob(job)
          break
      }
    },
    [dispatch, enableOCR, enqueueSnackbar],
  )

  const onDragStart: DraggableEventHandler = useCallback((e) => {
    if (
      e.target instanceof Element &&
      (closeButtonRef.current?.contains(e.target) ||
        ocrToolButtonRef.current?.contains(e.target))
    ) {
      return false
    }
  }, [])

  const onOCRToolFinish = useCallback<OnFinish>(
    (data) => {
      setShowOCRTool(false)
      logger.debug(
        {
          data,
        },
        'OCR tool finished',
      )

      if (!data) {
        return
      }

      setLoadingOCR(true)

      // Wait for the overlay to be removed
      setTimeout(() => {
        const res = client.send('screenshot', data, true) as Promise<{
          dataUrl: string
        }>

        res
          .then((data) => {
            return client.send('ocr', data, true) as Promise<any>
          })
          .then((result: string[]) => {
            translationStack.push({
              type: 'translate',
              id: uuid(),
              text: result.join('\n'),
            })
          })
          .catch((err) => {
            enqueueSnackbar(err.message || '文字识别出错，请重试')
          })
          .finally(() => {
            setLoadingOCR(false)
          })
      }, 50)
    },
    [enqueueSnackbar],
  )

  useEffect(() => {
    translationStack.attachQueue(onNewJob)

    return () => {
      translationStack.detachQueue()
    }
  }, [onNewJob])

  useEffect(() => {
    cc(chrome.storage.sync, 'get').then((config: Config) => {
      setConfig(config)
    })

    window.__ate_setClose = setClose
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      <ClassNames>
        {({ css: _css, cx }) => (
          <Draggable
            handle=".ate_App__header"
            onStart={onDragStart}
            defaultPosition={appPosition}>
            <div
              ref={appRef}
              className={cx(
                'ate_App',
                _css`
                  position: absolute;
                  width: 450px;
                  height: 600px;
                  z-index: 1;
                  will-change: transform;

                  ${tw`bg-white shadow-md rounded-lg overflow-hidden flex flex-col`}
                `,
                close &&
                  _css`
                    display: none;
                  `,
              )}>
              <div
                className="ate_App__header"
                tw="bg-purple-800 px-5 py-3 text-white font-bold text-lg cursor-move flex justify-between items-center">
                <span>DeepL Translate</span>
                <span tw="flex space-x-3">
                  {enableOCR ? (
                    <IconButton
                      title="开启 OCR 识别"
                      ref={ocrToolButtonRef}
                      tw="p-1 text-gray-800"
                      onClick={() => !loadingOCR && setShowOCRTool(true)}>
                      {loadingOCR ? (
                        <LoadingCircle
                          css={css`
                            animation: ate-animation-spin 1s linear infinite;
                          `}
                        />
                      ) : (
                        <CursorClick />
                      )}
                    </IconButton>
                  ) : undefined}

                  <IconButton
                    title="关闭"
                    ref={closeButtonRef}
                    tw="p-1 text-gray-800"
                    onClick={() => setClose(true)}>
                    <CloseIcon />
                  </IconButton>
                </span>
              </div>

              <ScrollToBottom tw="flex-1 overflow-auto" debug={false}>
                <TranslationList />
              </ScrollToBottom>
            </div>
          </Draggable>
        )}
      </ClassNames>

      {showOCRTool ? <OCRTool onFinish={onOCRToolFinish} /> : null}
    </ConfigContext.Provider>
  )
}

export default App

declare global {
  interface Window {
    __ate_setClose?: React.Dispatch<any>
  }
}
