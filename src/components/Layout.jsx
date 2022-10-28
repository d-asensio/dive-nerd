import styled from 'styled-components'

const Area = styled.div`
  grid-area: ${({ name }) => name};
`

export const Layout = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;

  max-width: 1800px;

  left: 50%;
  transform: translateX(-50%);

  display: grid;
  grid-template-areas: ${({ template }) => template};
  grid-template-columns: 3fr 5fr;
  grid-template-rows: min-content min-content;
  align-items: start;
  gap: 2em;
  padding: 2em;

  pointer-events: none;

  > * {
    pointer-events: initial;
  }
`

Layout.Area = Area
