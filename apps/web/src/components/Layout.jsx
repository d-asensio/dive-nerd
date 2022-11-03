import styled from '@emotion/styled'

export const Layout = styled.div`
  width: 100%;
  height: 100%;
  max-width: 2000px;
  min-height: 0;

  display: grid;
  grid-template-columns: minmax(400px, 1fr) minmax(800px, 2fr);
  grid-template-rows: 1fr;
`
