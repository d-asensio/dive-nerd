import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListDivider from '@mui/joy/ListDivider'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'

const Item = ({ name, date, depth, time }) => (
  <ListItem>
    <ListItemButton
      sx={{
        gap: 2
      }}
    >
      <ListItemDecorator>
        <Sheet
          variant='outlined'
          sx={{
            width: 120,
            borderRadius: 'md',
            overflow: 'auto'
          }}
        >
          <AspectRatio />
        </Sheet>
      </ListItemDecorator>
      <ListItemContent
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography level='h5'>{name}</Typography>
          <Typography level='body1' noWrap textColor='text.secondary'>
            {date}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignItems: 'stretch'
          }}
        >
          <Box>
            <Typography level='body2' textColor='text.secondary'>
              Depth
            </Typography>
            <Typography fontSize='xl1' lineHeight={1} fontWeight='lg'>
              {depth}
            </Typography>
          </Box>
          <Box>
            <Typography level='body2' textColor='text.secondary'>
              Time
            </Typography>
            <Typography fontSize='xl1' lineHeight={1} fontWeight='lg'>
              {time}
            </Typography>
          </Box>
        </Box>
      </ListItemContent>
    </ListItemButton>
  </ListItem>
)

export const DiveList = ({ children }) => {
  return (
    <List
      inset='gutter'
      aria-labelledby='ellipsis-list-demo'
      sx={{ '--List-decorator-size': '56px' }}
    >
      {children}
    </List>
  )
}

DiveList.Item = Item
DiveList.Divider = ListDivider
