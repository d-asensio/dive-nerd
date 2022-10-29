import styled from '@emotion/styled'

import { NavigationBar, Layout } from '../components'
import { DiveLog, DiveMap } from '../sections'

import Box from '@mui/joy/Box'

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`

function DiveLogPage () {
  return (
    <Wrapper>
      <NavigationBar />
      <Layout>
        <Box
          sx={{
            p: 3,
            borderLeft: 1,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'scroll',
            minHeight: 0
          }}
        >
          <DiveLog />
        </Box>
        <Box
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            minHeight: 0
          }}
        >
          <DiveMap />
        </Box>
      </Layout>
    </Wrapper>
  )
}

export default DiveLogPage
