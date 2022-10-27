import { GlobalStyle } from "../../src/styles/GlobalStyle";

export const globalStylesDecorator = Story => (
  <>
    <GlobalStyle />
    <Story />
  </>
)
