import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListDivider from '@mui/joy/ListDivider'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'

import { DiveProfileThumbnail } from './DiveProfileThumbnail'

const Item = ({ name, date, depth, time, samples }) => (
  <ListItem>
    <ListItemButton
      sx={{
        alignItems: 'stretch',
        gap: 1
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
          <DiveProfileThumbnail samples={samples} />
        </Sheet>
      </ListItemDecorator>
      <ListItemContent
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: 3
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 0.5
          }}
        >
          <Typography level='h5' component='div'>{name}</Typography>
          <Typography level='body1' component='div' noWrap textColor='text.secondary'>
            {date}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            alignSelf: 'flex-end'
          }}
        >
          <Box>
            <Typography
              level='body3'
              textTransform='uppercase'
              fontWeight='lg'
            >
              Depth
            </Typography>
            <Typography fontSize='xl1' lineHeight={1} fontWeight='lg' noWrap>
              {depth}
            </Typography>
          </Box>
          <Box>
            <Typography
              level='body3'
              textTransform='uppercase'
              fontWeight='lg'
            >
              Time
            </Typography>
            <Typography fontSize='xl1' lineHeight={1} fontWeight='lg' noWrap>
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
