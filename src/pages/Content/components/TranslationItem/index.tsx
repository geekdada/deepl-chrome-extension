import React, { useEffect, useMemo, useState } from 'react'
import Clipboard from 'react-clipboard.js'
import { useSnackbar } from 'notistack'
import { Collapse } from 'react-collapse'
import scrollParent from 'scrollparent'
import tw, { css } from 'twin.macro'
import { supportedLanguages } from '../../../../common/constant'

import logger from '../../../../common/logger'
import { SupportLanguageKeys, TranslateResult } from '../../../../common/types'
import IconButton from '../../../../components/IconButton'
import ArrowRight from '../../../../components/svg/ArrowRight'
import ClipboardCopy from '../../../../components/svg/ClipboardCopy'
import Refresh from '../../../../components/svg/Refresh'
import client from '../../common/client'
import { TranslateJob } from '../../common/types'
import { cleanText } from '../../common/utils'
import { useConfig } from '../../providers/config'

const TranslationItem: React.FC<{
  job: TranslateJob
}> = ({ job }) => {
  const config = useConfig()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<string[]>()
  const [overrideLang, setOverrideLang] = useState<string>()
  const [dirty, setDirty] = useState(0)
  const [collapse, setCollapse] = useState(true)
  const { enqueueSnackbar } = useSnackbar()

  const textContent = useMemo((): string[] => {
    return job.text.split('\n')
  }, [job.text])

  const findOriginal = () => {
    const { anchorId } = job
    const parentElement = document.querySelector(`.${anchorId}`)

    if (!parentElement) {
      enqueueSnackbar('已找不到原文', { variant: 'info' })
      return
    }

    const scrollContainer = scrollParent(parentElement)

    if (parentElement instanceof HTMLElement) {
      if (scrollContainer === document.body) {
        document.documentElement.scrollTo({
          top: parentElement.offsetTop - 20,
          left: 0,
          behavior: 'smooth',
        })
      } else {
        scrollContainer.scrollTo({
          top: parentElement.offsetTop - 20,
          left: 0,
          behavior: 'smooth',
        })
      }
    }
  }

  const refreshResult = () => {
    setDirty((val) => val + 1)
  }

  useEffect(() => {
    if (!config) return

    setResult(undefined)
    setLoading(true)
    setError(undefined)

    const res = client.send(
      'translate',
      {
        text: cleanText(job.text),
        id: job.id,
        targetLang: overrideLang || config.targetLang,
      },
      true,
    ) as Promise<TranslateResult>

    res
      .then((payload) => {
        logger.debug({
          msg: 'receive result',
          payload,
        })

        const result: string[] = []

        payload.translations.forEach((item) => {
          result.push(...item.text.split('\n'))
        })

        setError(undefined)
        setResult(result)
        setLoading(false)
      })
      .catch((err: Error) => {
        logger.error({
          msg: 'translate failed',
          data: err,
        })

        setError(err.message)
        setLoading(false)
        enqueueSnackbar(`翻译失败：${err.message}`, { variant: 'error' })
      })
  }, [job, config, enqueueSnackbar, dirty, overrideLang])

  return (
    <div tw="p-3 text-gray-800 space-y-3 select-text">
      <div tw="space-y-3">
        <div
          tw="bg-gray-50 hover:bg-gray-100 p-3 rounded cursor-pointer leading-normal"
          css={css`
            .ReactCollapse--collapse {
              min-height: 48px;
              will-change: height;
              transition-property: height;

              ${tw`ease-in-out duration-300`};
            }
            .ReactCollapse--content {
              ${tw`space-y-2`};
            }
          `}
          onClick={() => setCollapse((prev) => !prev)}>
          <Collapse isOpened={!collapse}>
            <>
              {textContent.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </>
          </Collapse>
        </div>

        <div tw="rounded bg-yellow-50 p-3 space-y-2 leading-normal">
          {error ? <span>{error}</span> : undefined}

          {loading ? <span>{'翻译中…'}</span> : undefined}

          {result ? (
            <>
              {result.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </>
          ) : undefined}
        </div>
      </div>
      <div
        css={[
          tw`flex justify-between items-center`,
          css`
            & > div {
              ${tw`space-x-2`}
            }
          `,
        ]}>
        <div
          tw="flex items-center space-x-3"
          css={css`
            height: 35px;
          `}>
          {job.sourceLang && (
            <div tw="px-3 py-0 h-full flex items-center bg-green-50 text-green-600 text-sm rounded">
              {job.sourceLang}
            </div>
          )}
          <div tw="h-full">
            {config ? (
              <select
                tw="px-2 py-0 h-full rounded-md truncate border-none bg-blue-50 text-gray-800"
                css={css`
                  width: 100px;
                `}
                name="target-lang"
                value={overrideLang || config.targetLang}
                onChange={(e) => setOverrideLang(e.target.value)}>
                {Object.keys(supportedLanguages).map((lang, index) => (
                  <option value={lang} key={index}>
                    {supportedLanguages[lang as SupportLanguageKeys]}
                  </option>
                ))}
              </select>
            ) : undefined}
          </div>
        </div>
        <div>
          {result ? (
            <Clipboard
              option-text={() => result}
              button-title="复制翻译结果"
              onSuccess={() => enqueueSnackbar('复制成功')}
              component={IconButton}
              tw="p-1">
              <ClipboardCopy />
            </Clipboard>
          ) : undefined}

          {!loading && error ? (
            <IconButton
              tw="p-1 border-red-500 bg-red-100 text-red-500 hover:bg-red-200"
              onClick={() => refreshResult()}
              title="重试">
              <Refresh />
            </IconButton>
          ) : undefined}

          <IconButton
            tw="p-1"
            onClick={() => findOriginal()}
            title="跳转到原文">
            <ArrowRight />
          </IconButton>
        </div>
      </div>
    </div>
  )
}

export default TranslationItem
