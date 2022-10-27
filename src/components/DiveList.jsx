import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListDivider from '@mui/joy/ListDivider'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'

const Item = ({
  name,
  date,
  depth,
  time
}) => (
  <ListItem
    sx={{
      gap: 2
    }}
  >
    <ListItemDecorator>
      <Sheet
        variant='outlined'
        sx={{
          width: 150,
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
          flexDirection: 'column',
          gap: 3,
          alignItems: 'stretch'
        }}
      >
        <Typography level='h3'>{name}</Typography>
        <Typography level='body2' noWrap>
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
          <Typography
            fontSize='sm'
            textColor='text.secondary'
          >
            DEPTH
          </Typography>
          <Typography
            fontSize='xl3'
            lineHeight={1}
          >
            {depth}
          </Typography>
        </Box>
        <Box>
          <Typography
            fontSize='sm'
            textColor='text.secondary'
          >
            TIME
          </Typography>
          <Typography
            fontSize='xl3'
            lineHeight={1}
          >
            {time}
          </Typography>
        </Box>
      </Box>
    </ListItemContent>
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
