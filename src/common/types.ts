import { supportedLanguages, supportedRegions } from './constant'
import { OcrRegionKeys } from './ocr-client'

export interface Config {
  token: string
  targetLang: SupportLanguageKeys
  region: APIRegions
  ocrSecretId?: string
  ocrSecretKey?: string
  ocrRegion?: OcrRegionKeys
  hoverButton?: boolean
}

export type SupportLanguageKeys = keyof typeof supportedLanguages
export type SupportRegionKeys = keyof typeof supportedRegions

export type APIRegions = 'default' | 'free'

export type TranslateResult = {
  translations: Array<{
    detected_source_language: SupportLanguageKeys
    text: string
  }>
}
