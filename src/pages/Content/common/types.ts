import { SupportLanguages } from '../../../common/types'

export interface TextSelection {
  anchor?: Node
  anchorOffset?: number
  rangeCount?: number
  sourceLang?: SupportLanguages
  text: string
}

export interface TranslateJob extends TextSelection {
  id: string
}
