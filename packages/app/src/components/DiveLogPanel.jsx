import Card from '@mui/joy/Card'

export const DiveLogPanel = ({ sx, children }) => {
  return (
    <Card
      sx={{
        ...sx,
        overflowY: 'scroll'
      }}
    >
      {children}
    </Card>
  )
}
