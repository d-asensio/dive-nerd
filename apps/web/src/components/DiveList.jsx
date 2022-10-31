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

import {DiveProfileThumbnail} from './DiveProfileThumbnail'
import Badge from "@mui/joy/Badge";

const Item = ({
                name,
                date,
                maximumDepth,
                totalDuration,
                rating,
                samples,
                highlighted,
                onClick,
                onHover,
                onMouseLeave
              }) => (
  <ListItem>
    <ListItemButton
      sx={{
        alignItems: 'stretch',
        gap: 1,
        borderRadius: 'sm'
      }}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onMouseLeave}
    >
      <ListItemDecorator>
        <Badge color="success" sx={{
          '.JoyBadge-badge': {
            transition: 'opacity 300ms',
            opacity: highlighted ? 1 : 0
          }
        }}>
          <Sheet
            variant='outlined'
            sx={{
              width: 120,
              borderRadius: 'sm',
              overflow: 'auto'
            }}
          >
            <DiveProfileThumbnail samples={samples}/>
          </Sheet>
        </Badge>
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
          <Rating value={rating} size='small' readOnly/>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Typography noWrap level='body2' textColor='text.secondary'>
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
                {maximumDepth}
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
                {totalDuration}
              </Typography>
            </Box>
          </Box>
        </Box>
      </ListItemContent>
    </ListItemButton>
  </ListItem>
)

export const DiveList = ({children}) => {
  return (
    <List
      inset='gutter'
      aria-labelledby='ellipsis-list-demo'
      sx={{'--List-decorator-size': '56px'}}
    >
      {children}
    </List>
  )
}

DiveList.Item = Item
DiveList.Divider = ListDivider
