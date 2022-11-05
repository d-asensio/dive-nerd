import Box from '@mui/joy/Box'
import { Children } from 'react'

export function FieldsRow ({ children, columns }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: columns || `repeat(${Children.count(children)}, 1fr)`,
        gap: 2,
        mb: 2,
        width: '100%',
        '&:last-child': {
          mb: 0
        }
      }}
    >
      {children}
    </Box>
  )
}
