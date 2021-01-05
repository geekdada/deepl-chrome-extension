import React, { useEffect, useState } from 'react'
import Clipboard from 'react-clipboard.js'

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
  const [result, setResult] = useState<string>()

  const findOriginal = () => {
    const { parentElement } = job

    if (!parentElement) {
      return
    }

    window.scrollTo(0, parentElement.offsetTop - 20)
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

        setResult(payload.translations.map((item) => item.text).join('\n'))

        setLoading(false)
      })
      .catch((err) => {
        logger.error({
          msg: 'translate failed',
          err,
        })

        setLoading(false)
      })
  }, [job, config])

  return (
    <div className="ate_TranslationItem">
      <div className="ate_TranslationItem__upper">
        <div>
          {job.text.length > 100 ? (
            <div>{job.text.substring(0, 100)}...</div>
          ) : (
            <div>{job.text}</div>
          )}
        </div>
        {loading ? (
          <div className="ate_TranslationItem__result">翻译中…</div>
        ) : undefined}
        {result ? (
          <div className="ate_TranslationItem__result">{result}</div>
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
