import React from 'react'
import tw from 'twin.macro'

import { useTranslateJobs } from '../../providers/translate-jobs'
import TranslationItem from '../TranslationItem'

const TranslationList: React.FC = () => {
  const jobsState = useTranslateJobs()

  return (
    <div tw="divide-y divide-gray-200 divide-solid">
      {!jobsState.jobs.length ? (
        <div tw="py-2 text-center text-gray-500">还没有翻译…</div>
      ) : undefined}

      {jobsState.jobs.map((job) => (
        <div key={job.id} tw="border-l-0 border-r-0">
          <TranslationItem job={job} />
        </div>
      ))}
    </div>
  )
}

export default TranslationList
