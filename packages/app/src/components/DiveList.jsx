import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListDivider from '@mui/joy/ListDivider'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Rating from '@mui/material/Rating'

import { DiveProfileThumbnail } from './DiveProfileThumbnail'

const Item = ({ name, date, depth, time, rating, samples }) => (
  <ListItem>
    <ListItemButton
      sx={{
        alignItems: 'stretch',
        gap: 1,
        borderRadius: 'sm'
      }}
    >
      <ListItemDecorator>
        <Sheet
          variant='outlined'
          sx={{
            width: 120,
            borderRadius: 'sm',
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
          <Typography level='h5'>{name}</Typography>
          <Rating value={rating} size='small' readOnly />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            noWrap
            level='body2'
            textColor='text.secondary'
          >
            {date}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              alignSelf: 'flex-end'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
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
