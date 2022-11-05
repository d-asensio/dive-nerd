import { radioClasses, RadioGroup } from '@mui/joy'
import Sheet from '@mui/joy/Sheet'
import Radio from '@mui/joy/Radio'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import Typography from '@mui/joy/Typography'

function Item({ children, ...rest }) {
  return (
    <Sheet
      variant='outlined'
      sx={{
        minWidth: 110,
        borderRadius: 'md',
        bgcolor: 'background.level1',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Radio {...rest} checkedIcon={<CheckCircleIcon />} />
      <Typography level='h4'>{children}</Typography>
    </Sheet>
  )
}

export function SingleChoiceField ({ children }) {
  return (
    <RadioGroup
      aria-label='platform'
      defaultValue='Website'
      overlay
      name='platform'
      sx={{
        mb: 3,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
        gap: 2,
        [`& .${radioClasses.checked}`]: {
          [`& .${radioClasses.action}`]: {
            inset: -1,
            border: '3px solid',
            borderColor: 'primary.500'
          }
        },
        [`& .${radioClasses.radio}`]: {
          display: 'contents',
          '& > svg': {
            zIndex: 2,
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            bgcolor: 'background.body',
            borderRadius: '50%'
          }
        }
      }}
    >
      {children}
    </RadioGroup>
  )
}

SingleChoiceField.Item = Item
