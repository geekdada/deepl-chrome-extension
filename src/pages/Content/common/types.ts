import { SupportLanguageKeys } from '../../../common/types'

export interface TextSelection {
  text: string
  selection: RangySelection
  parentElement?: HTMLElement
  sourceLang?: SupportLanguageKeys
  id?: string
  anchorId?: string
}

export interface TranslateJob {
  id: string
  anchorId: string
  text: string
  sourceLang?: SupportLanguageKeys
}
