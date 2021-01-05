import React, { createContext, useContext, useReducer } from 'react'

import { TranslateJob } from '../common/types'

type TranslateJobsState = {
  jobs: Array<TranslateJob>
}
type TranslateJobsDispatch = (action: AddJobAction) => void
type TranslateJobsReducer = (
  state: TranslateJobsState,
  action: AddJobAction,
) => TranslateJobsState
interface AddJobAction {
  type: 'add'
  payload: TranslateJob
}

const reducer: TranslateJobsReducer = (state, action) => {
  switch (action.type) {
    case 'add':
      return {
        jobs: [...state.jobs, action.payload],
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
const TranslateJobsContext = createContext<TranslateJobsState | undefined>(
  undefined,
)
const TranslateJobsDispatchContext = createContext<
  TranslateJobsDispatch | undefined
>(undefined)

export const TranslateJobsProvider: React.FC = (props) => {
  const [translateJobs, translateJobsDispatch] = useReducer(reducer, {
    jobs: [],
  })

  return (
    <TranslateJobsContext.Provider value={translateJobs}>
      <TranslateJobsDispatchContext.Provider value={translateJobsDispatch}>
        {props.children}
      </TranslateJobsDispatchContext.Provider>
    </TranslateJobsContext.Provider>
  )
}

export const useTranslateJobs = (): TranslateJobsState => {
  const context = useContext(TranslateJobsContext)

  if (context === undefined) {
    throw new Error(
      'useTranslateJobs must be used within a TranslateJobsProvider',
    )
  }

  return context
}

export const useTranslateJobsDispatch = (): TranslateJobsDispatch => {
  const context = useContext(TranslateJobsDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useTranslateJobsDispatch must be used within a TranslateJobsProvider',
    )
  }

  return context
}
