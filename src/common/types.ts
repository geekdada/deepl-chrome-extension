export interface Config {
  token: string
  targetLang: SupportLanguages
  region: APIRegions
}

export type SupportLanguages =
  | 'ZH'
  | 'EN'
  | 'JA'
  | 'DE'
  | 'FR'
  | 'ES'
  | 'PT'
  | 'IT'
  | 'NL'
  | 'PL'
  | 'RU'

export type APIRegions = 'default' | 'global' | 'dev'

export type TranslateResult = {
  translations: Array<{
    detected_source_language: SupportLanguages
    text: string
  }>
}
