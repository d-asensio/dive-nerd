import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemContent from '@mui/joy/ListItemContent'
import ListDivider from '@mui/joy/ListDivider'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'

import { DiveProfileThumbnail } from './DiveProfileThumbnail'
import { DiveSnippet } from './DiveSnippet'

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
        <DiveProfileThumbnail
          samples={samples}
          highlighted={highlighted}
        />
      </ListItemDecorator>
      <ListItemContent>
        <DiveSnippet
          name={name}
          date={date}
          maximumDepth={maximumDepth}
          totalDuration={totalDuration}
          rating={rating}
        />
      </ListItemContent>
    </ListItemButton>
  </ListItem>
)

export const DiveList = ({ children }) => {
  return (
    <List
      inset="gutter"
      aria-labelledby="ellipsis-list-demo"
      sx={{ '--List-decorator-size': '56px' }}
    >
      {children}
    </List>
  )
}

DiveList.Item = Item
DiveList.Divider = ListDivider
