import { SupportLanguages } from '../../../common/types'

export interface TextSelection {
  parentElement?: HTMLElement
  sourceLang?: SupportLanguages
  text: string
}

export interface TranslateJob extends TextSelection {
  id: string
}
