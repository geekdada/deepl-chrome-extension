import React, { createContext, useContext } from 'react'

import { SupportLanguages } from '../../../common/types'

export type ConfigState = {
  targetLang: SupportLanguages
}

export const ConfigContext = createContext<ConfigState | undefined>(undefined)

export const useConfig = (): ConfigState => {
  const context = useContext(ConfigContext)

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigContext.Provider')
  }

  return context
}
