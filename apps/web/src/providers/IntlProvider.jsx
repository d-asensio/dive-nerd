import * as React from 'react'
import { IntlProvider as OriginalIntlProvider } from 'react-intl'

export const IntlProvider = ({ children }) => {
  return (
    <OriginalIntlProvider messages={{}} locale='es' defaultLocale='en'>
      {children}
    </OriginalIntlProvider>
  )
}
