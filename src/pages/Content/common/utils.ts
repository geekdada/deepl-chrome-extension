import { SupportLanguageKeys } from '../../../common/types'

export const getFirstRange = (sel: RangySelection): RangyRange | undefined => {
  return sel.rangeCount ? sel.getRangeAt(0) : undefined
}

export const getDocumentLang = (): SupportLanguageKeys | undefined => {
  const html = document.querySelector('html')

  if (!html) return

  if (!html.hasAttribute('lang')) {
    return
  }

  const lang = (html.getAttribute('lang') as string).toUpperCase()

  if (lang.startsWith('ZH')) {
    return 'ZH'
  }
  if (lang.startsWith('EN')) {
    return 'EN-US'
  }
  if (lang.startsWith('JA')) {
    return 'JA'
  }
  if (lang.startsWith('DE')) {
    return 'DE'
  }
  if (lang.startsWith('FR')) {
    return 'FR'
  }
  if (lang.startsWith('ES')) {
    return 'ES'
  }
  if (lang.startsWith('PT')) {
    return 'PT-PT'
  }
  if (lang.startsWith('IT')) {
    return 'IT'
  }
  if (lang.startsWith('NL')) {
    return 'NL'
  }
  if (lang.startsWith('PL')) {
    return 'PL'
  }
  if (lang.startsWith('RU')) {
    return 'RU'
  }

  return undefined
}

export const cleanText = (str: string): string => {
  return str
    .split('\n')
    .filter((item) => item !== '')
    .map((item) => item.trim())
    .join('\n')
}
