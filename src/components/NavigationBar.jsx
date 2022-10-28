import * as React from 'react'
import Avatar from '@mui/joy/Avatar'
import IconButton from '@mui/joy/IconButton'
import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import { Logo } from './Logo'

export function NavigationBar () {
  return (
    <List
      row
      variant='outlined'
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        '--List-decorator-size': '48px',
        '--List-item-paddingY': '1rem'
      }}
    >
      <Logo
        sx={{
          marginLeft: '8px'
        }}
      />
      <ListItem>
        <ListItemDecorator>
          <IconButton
            color='neutral'
            aria-haspopup='menu'
            sx={{
              borderRadius: '50%',
              marginInlineStart: 'var(--Avatar-marginInlineStart)',
              boxShadow: 'var(--Avatar-ring)'
            }}
          >
            <Avatar size='sm' src='/static/images/avatar/3.jpg' />
          </IconButton>
        </ListItemDecorator>
      </ListItem>
    </List>
  )
}
