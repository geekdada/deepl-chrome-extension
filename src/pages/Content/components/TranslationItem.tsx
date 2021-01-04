import React, { useEffect, useState } from 'react'

import Client from '../../../common/api'
import logger from '../../../common/logger'
import { TranslateResult } from '../../../common/types'
import client from '../common/client'
import { TranslateJob } from '../common/types'
import { useConfig } from '../providers/config'

const TranslationItem: React.FC<{
  job: TranslateJob
}> = ({ job }) => {
  const config = useConfig()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<string>()

  useEffect(() => {
    const res = client.send(
      'translate',
      {
        ...job,
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
        {loading && <div className="ate_TranslationItem__result">翻译中…</div>}
        {result && <div className="ate_TranslationItem__result">{result}</div>}
      </div>
      <div className="ate_TranslationItem__lower">
        {job.sourceLang && (
          <div className="ate_TranslationItem__source-lang-tag">
            {job.sourceLang}
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslationItem
