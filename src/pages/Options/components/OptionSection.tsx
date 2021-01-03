import React from 'react'
import tw, { css, theme } from 'twin.macro'

const OptionSection: React.FC<{
  title: string
}> = (props) => {
  return (
    <div tw="space-y-4">
      <div tw="border-l-4 border-solid border-indigo-400 pl-4 text-xl">
        {props.title}
      </div>
      <div>{props.children}</div>
    </div>
  )
}

export default OptionSection
