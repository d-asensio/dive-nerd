import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'

export const DivelogEntryCard = () => {
  return (
    <List
      aria-labelledby='ellipsis-list-demo'
      sx={{ '--List-decorator-size': '56px' }}
    >
      <ListItem
        sx={{
          gap: 2,
          alignItems: 'stretch'
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
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography>Thomas Reef</Typography>
            <Typography level='body2' noWrap>
              25/10/2022 10:30 AM
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
                25m
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
                00:45
              </Typography>
            </Box>
          </Box>
        </ListItemContent>
      </ListItem>
    </List>
  )
}
