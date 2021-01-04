import React, { useCallback, useEffect, useState } from 'react'
import Draggable from 'react-draggable'
import cc from 'chrome-call'

import logger from '../../../../common/logger'
import { Config } from '../../../../common/types'
import translationStack from '../../common/translation-stack'
import { TranslateJob } from '../../common/types'
import { ConfigContext, ConfigState } from '../../providers/config'
import { useTranslateJobsDispatch } from '../../providers/translate-jobs'
import TranslationList from '../TranslationList'

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigState>()
  const dispatch = useTranslateJobsDispatch()

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
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      <Draggable handle=".ate_App__header" defaultPosition={{ x: 20, y: 20 }}>
        <div className="ate_App">
          <div className="ate_App__header">A Translator</div>
          <div className="ate_App__container">
            <TranslationList />
          </div>
        </div>
      </Draggable>
    </ConfigContext.Provider>
  )
}

export default App
