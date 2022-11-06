import { IntlProvider } from 'react-intl'

export const reactIntlDecorator = (Story) => (
  <IntlProvider messages={{}} locale="es" defaultLocale="en">
    <Story />
  </IntlProvider>
)
