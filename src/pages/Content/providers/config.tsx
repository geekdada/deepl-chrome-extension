import React, { createContext, useContext } from 'react'

import { SupportLanguages } from '../../../common/types'

export type ConfigState = {
  targetLang: SupportLanguages
}

export const ConfigContext = createContext<ConfigState | undefined>(undefined)

export const useConfig = (): ConfigState | undefined => {
  return useContext(ConfigContext)
}
