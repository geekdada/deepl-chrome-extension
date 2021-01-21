import React, { createContext, useContext } from 'react'

import { SupportLanguageKeys } from '../../../common/types'

export type ConfigState = {
  targetLang: SupportLanguageKeys
  ocrSecretId?: string
  ocrSecretKey?: string
}

export const ConfigContext = createContext<ConfigState | undefined>(undefined)

export const useConfig = (): ConfigState | undefined => {
  return useContext(ConfigContext)
}
