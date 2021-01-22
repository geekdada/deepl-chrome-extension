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
  type: 'translate'
  id: string
  text: string
  anchorId?: string
  sourceLang?: string
}

export interface DirectiveJob {
  type: 'directive'
  directive: string
  payload?: Record<string, any>
}

export type AllJobTypes = TranslateJob | DirectiveJob
