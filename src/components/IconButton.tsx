import React, {
  forwardRef,
  HTMLProps,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react'
import clsx from 'clsx'

export interface BaseProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset' | undefined
  ref?: Ref<HTMLButtonElement>
}
type IconButtonProps = Omit<HTMLProps<HTMLButtonElement>, 'size'> & BaseProps

const IconButton = forwardRef(function IconButton(
  props: IconButtonProps,
  ref?: BaseProps['ref'],
) {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.onClick && props.onClick(e)
  }

  return (
    <button
      {...props}
      ref={ref}
      className={clsx(['ate_IconButton', props.className])}
      onClick={handleClick}>
      {props.children}
    </button>
  )
})

export default IconButton
