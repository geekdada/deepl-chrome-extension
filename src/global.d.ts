declare module 'scrollparent' {
  export default function (element: Element): Element
}

declare module 'smoothscroll-polyfill' {
  export function polyfill(): void
}

declare module 'rangy' {
  interface RangyHighlighter {
    addClassApplier(classApplier: RangyClassApplier): void
    highlightSelection(className: string): void
  }

  interface RangyClassApplier {
    applyToSelection(win: Window): void
  }

  interface RangyExtendedStatic {
    init(): void
    createHighlighter(): RangyHighlighter
    createClassApplier(
      className: string,
      options?: {
        ignoreWhiteSpace?: boolean
        tagNames?: string[]
      },
    ): RangyClassApplier
  }

  const rangy: RangyStatic & RangyExtendedStatic

  export = rangy
}
