import { SnackbarProvider } from 'notistack'
import React from 'react'
import { render } from 'react-dom'
import { GlobalStyles } from 'twin.macro'

import Options from './Options'

render(
  <SnackbarProvider>
    <GlobalStyles />
    <Options />
  </SnackbarProvider>,
  window.document.querySelector('#app'),
)
