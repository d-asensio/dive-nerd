import Checkbox from '@mui/joy/Checkbox'
import Box from '@mui/joy/Box'
import FormLabel from '@mui/joy/FormLabel'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import Typography from '@mui/joy/Typography'

export function Choice ({ children, value }) {
  return (
    <ListItem variant="outlined">
      <Checkbox
        overlay
        value={value}
        label={
          <Typography noWrap>{children}</Typography>
        }
        sx={{
          flexGrow: 1,
          gap: 2,
          flexDirection: 'row-reverse'
        }}
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
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
    }}
      role="group"
    >
      <FormLabel>{label}</FormLabel>
      <List
        row
        sx={{
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          minWidth: 240,
          p: 0,
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
