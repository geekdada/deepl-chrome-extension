import React, { HTMLProps, MouseEventHandler } from 'react'
import clsx from 'clsx'

const IconButton: React.FC<Omit<HTMLProps<HTMLButtonElement>, 'size'>> = (
  props,
) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    props.onClick && props.onClick(e)
  }

  return (
    <button
      className={clsx(['ate_IconButton', props.className])}
      onClick={handleClick}>
      {props.children}
    </button>
  )
}

export default IconButton
