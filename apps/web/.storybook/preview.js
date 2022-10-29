import { joyUIDecorator } from "./decorators/joy-ui"
import {reactRouterDecorator} from './decorators/react-router';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const decorators = [
  joyUIDecorator,
  reactRouterDecorator
]
