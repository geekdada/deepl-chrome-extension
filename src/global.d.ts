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

declare module 'react-resizable' {
  import { Axis, ResizeCallbackData, ResizeHandle } from 'react-resizable'

  export interface ResizableProps {
    className?: string
    width: number
    height: number
    handle?: React.ReactNode | ((resizeHandle: ResizeHandle) => React.ReactNode)
    handleSize?: [number, number]
    lockAspectRatio?: boolean
    axis?: Axis
    minConstraints?: [number, number]
    maxConstraints?: [number, number]
    onResizeStop?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any
    onResizeStart?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any
    onResize?: (e: React.SyntheticEvent, data: ResizeCallbackData) => any
    draggableOpts?: any
    resizeHandles?: ResizeHandle[]
    style?: Record<string, any>
  }
}
