import { useCallback, useRef, useState } from 'react'

import Alert from '@mui/joy/Alert'
import Avatar from '@mui/joy/Avatar'
import Box from '@mui/joy/Box'
import IconButton from '@mui/joy/IconButton'
import Menu from '@mui/joy/Menu'
import MenuItem from '@mui/joy/MenuItem'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListDivider from '@mui/joy/ListDivider'
import Typography from '@mui/joy/Typography'

import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'

import { Logo } from './Logo'

const Shortcut = ({ text }) => (
  <Typography level='body2' textColor='text.tertiary' ml='auto'>
    {text}
  </Typography>
)

export function NavigationBar () {
  const buttonRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleAvatarClick = useCallback(() => {
    setMenuOpen(!menuOpen)
  }, [menuOpen])

  const handleClose = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
    <List
      row
      sx={{
        p: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Logo />
      <Alert variant='soft' color='warning'>
        DiveNerd is still in beta, use it carefully!
      </Alert>
      <ListItem>
        <ListItemDecorator>
          <IconButton
            ref={buttonRef}
            color='neutral'
            aria-haspopup='menu'
            onClick={handleAvatarClick}
            sx={{
              borderRadius: '50%',
              marginInlineStart: 'var(--Avatar-marginInlineStart)',
              boxShadow: 'var(--Avatar-ring)'
            }}
          >
            <Avatar size='sm'>DN</Avatar>
          </IconButton>
          <Menu
            open={menuOpen}
            anchorEl={buttonRef.current}
            placement='bottom-end'
            onClose={handleClose}
            sx={{
              width: 250
            }}
          >
            <ListItem nested>
              <List>
                <MenuItem>
                  <ListItemDecorator>
                    <PersonIcon />
                  </ListItemDecorator>
                  Profile
                </MenuItem>
                <MenuItem>
                  <ListItemDecorator>
                    <SettingsIcon />
                  </ListItemDecorator>
                  Settings <Shortcut text='⌘ ,' />
                </MenuItem>
              </List>
            </ListItem>
            <ListDivider />
            <ListItem nested>
              <List>
                <MenuItem ariant='soft' color='danger'>
                  <ListItemDecorator sx={{ color: 'inherit' }}>
                    <LogoutIcon />
                  </ListItemDecorator>
                  Log out
                </MenuItem>
              </List>
            </ListItem>
          </Menu>
        </ListItemDecorator>
      </ListItem>
    </List>
    </Box>
  )
}
