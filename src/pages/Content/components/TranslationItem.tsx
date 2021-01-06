import React, { useEffect, useMemo, useState } from 'react'
import Clipboard from 'react-clipboard.js'
import { useSnackbar } from 'notistack'
import { Collapse } from 'react-collapse'

import logger from '../../../common/logger'
import { TranslateResult } from '../../../common/types'
import IconButton from '../../../components/IconButton'
import ArrowRight from '../../../components/svg/ArrowRight'
import ClipboardCopy from '../../../components/svg/ClipboardCopy'
import client from '../common/client'
import { TranslateJob } from '../common/types'
import { useConfig } from '../providers/config'

const TranslationItem: React.FC<{
  job: TranslateJob
}> = ({ job }) => {
  const config = useConfig()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<string[]>()
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

    if (parentElement instanceof HTMLElement) {
      window.scrollTo(0, parentElement.offsetTop - 20)
    }
  }

  useEffect(() => {
    if (!config) return

    const res = client.send(
      'translate',
      {
        text: job.text,
        id: job.id,
        targetLang: config.targetLang,
      },
      true,
    ) as Promise<TranslateResult>

    res
      .then((payload) => {
        logger.debug({
          msg: 'receive result',
          payload,
        })

        setResult(payload.translations.map((item) => item.text))

        setLoading(false)
      })
      .catch((err) => {
        logger.error({
          msg: 'translate failed',
          data: err,
        })

        setLoading(false)
        enqueueSnackbar(`翻译失败：${err.message}`, { variant: 'error' })
      })
  }, [job, config])

  return (
    <div className="ate_TranslationItem">
      <div className="ate_TranslationItem__upper">
        <div
          className="ate_TranslationItem__original"
          onClick={() => setCollapse((prev) => !prev)}>
          <Collapse isOpened={!collapse}>
            <>
              {textContent.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </>
          </Collapse>
        </div>

        {loading ? (
          <div className="ate_TranslationItem__result">翻译中…</div>
        ) : undefined}
        {result ? (
          <div className="ate_TranslationItem__result">
            {result.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div>
        ) : undefined}
      </div>
      <div className="ate_TranslationItem__lower">
        <div>
          {job.sourceLang && (
            <div className="ate_TranslationItem__source-lang-tag">
              {job.sourceLang}
            </div>
          )}
        </div>
        <div>
          {result ? (
            <Clipboard
              option-text={() => result}
              button-title="复制翻译结果"
              onSuccess={() => enqueueSnackbar('复制成功')}
              component={IconButton}
              className="ate_TranslationItem__copy-button">
              <ClipboardCopy />
            </Clipboard>
          ) : undefined}
          <IconButton
            className="ate_TranslationItem__jump-button"
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
