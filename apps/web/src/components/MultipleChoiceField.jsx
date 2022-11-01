import Checkbox from '@mui/joy/Checkbox'
import Box from '@mui/joy/Box'
import FormLabel from '@mui/joy/FormLabel'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'

export function Choice ({ children, value }) {
  return (
    <ListItem variant="outlined">
      <Checkbox
        overlay
        value={value}
        label={children}
        sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}
        componentsProps={{
          action: ({ checked }) => ({
            sx: (theme) => ({
              ...(checked && {
                inset: -1,
                border: '2px solid',
                borderColor: theme.vars.palette.primary[500],
              }),
            }),
          }),
        }}
      />
    </ListItem>
  )
}

export function MultipleChoiceField ({
  label,
  children
}) {
  return (
    <Box
      sx={{ width: '100%' }}
      role="group"
    >
      <FormLabel>{label}</FormLabel>
      <List
        sx={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 1,
          minWidth: 240,
          '--List-gap': 0,
          '--List-item-paddingY': '1rem',
          '--List-item-radius': '8px',
          '--List-decorator-size': '32px',
        }}
      >
        {children}
      </List>
    </Box>
  )
}
