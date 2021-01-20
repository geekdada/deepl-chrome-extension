import { supportedLanguages } from './constant'

export interface Config {
  token: string
  targetLang: SupportLanguageKeys
  region: APIRegions
}

export type SupportLanguageKeys = keyof typeof supportedLanguages

export type APIRegions = 'default' | 'global' | 'dev'

export type TranslateResult = {
  translations: Array<{
    detected_source_language: SupportLanguageKeys
    text: string
  }>
}
