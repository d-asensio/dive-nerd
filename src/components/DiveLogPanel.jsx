import Card from '@mui/joy/Card'

export const DiveLogPanel = ({ children }) => {
  return (
    <Card
      sx={{
        overflowY: 'scroll'
      }}
    >
      {children}
    </Card>
  )
}
