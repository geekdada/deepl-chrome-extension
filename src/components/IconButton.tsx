import React, {
  forwardRef,
  HTMLProps,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react'
import tw from 'twin.macro'

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
      onClick={handleClick}
      css={tw`
        inline-flex justify-center items-center w-auto h-auto m-0 p-2
        cursor-pointer text-center no-underline rounded-md
        border border-solid border-gray-800 bg-white hover:bg-gray-100 active:bg-gray-200
        transition-colors ease-in-out duration-150
      `}>
      {props.children}
    </button>
  )
})

export default IconButton
