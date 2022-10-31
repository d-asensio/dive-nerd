import { useCallback, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

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

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

import { Logo } from './Logo'

import { useColorScheme } from '@mui/joy/styles'

function ModeToggle () {
  const { mode, setMode } = useColorScheme()
  return (
    <IconButton
      variant='outlined'
      color='neutral'
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    >
      {mode === 'dark'
        ? <LightModeIcon />
        : <DarkModeIcon />}
    </IconButton>
  )
}

const Shortcut = ({ text }) => (
  <Typography level='body2' textColor='text.tertiary' ml='auto'>
    {text}
  </Typography>
)

function ProfileAvatarMenu ({ onLogoutClick }) {
  const buttonRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleAvatarClick = useCallback(() => {
    setMenuOpen(!menuOpen)
  }, [menuOpen])

  const handleClose = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <div>
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
            <MenuItem ariant='soft' color='danger' onClick={onLogoutClick}>
              <ListItemDecorator sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemDecorator>
              Log out
            </MenuItem>
          </List>
        </ListItem>
      </Menu>
    </div>
  )
}

export function NavigationBar () {
  const { logout } = useAuth0()

  const handleLogoutClick = useCallback(() => {
    logout({ returnTo: window.location.origin })
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Alert variant='soft' color='warning'>
            DiveNerd is still in beta, use it carefully!
          </Alert>
          <ModeToggle />
          <ProfileAvatarMenu onLogoutClick={handleLogoutClick} />
        </Box>
      </List>
    </Box>
  )
}
