import AspectRatio from '@mui/joy/AspectRatio'
import Sheet from '@mui/joy/Sheet'

export const DivelogEntryCard = () => {
  return (
    <Sheet
      variant='outlined'
      sx={{ width: 150, borderRadius: 'md', overflow: 'auto' }}
    >
      <AspectRatio />
    </Sheet>
  )
}
