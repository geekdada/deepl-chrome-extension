import React from 'react'
import { render } from 'react-dom'
import { GlobalStyles } from 'twin.macro'

import Options from './Options'

render(
  <div>
    <GlobalStyles />
    <Options />
  </div>,
  window.document.querySelector('#app'),
)
