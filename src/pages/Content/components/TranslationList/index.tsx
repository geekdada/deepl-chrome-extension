import React from 'react'

import { useTranslateJobs } from '../../providers/translate-jobs'
import TranslationItem from '../TranslationItem'

const TranslationList: React.FC = () => {
  const jobsState = useTranslateJobs()

  return (
    <div className="ate_TranslationList">
      {jobsState.jobs.map((job) => (
        <div key={job.id} className="ate_TranslationList__item">
          <TranslationItem job={job} />
        </div>
      ))}
    </div>
  )
}

export default TranslationList
