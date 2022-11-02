import Tooltip from '@mui/joy/Tooltip'
import { Chip } from '@mui/joy'

export function Unit ({ name, symbol }) {
  return <Tooltip
    title={name}
    arrow
    placement="top"
    size="sm"
    enterDelay={1000}
    enterNextDelay={600}
  >
    <Chip variant="soft" color="neutral" size="sm" sx={{
      cursor: 'help'
    }}>
      {symbol}
    </Chip>
  </Tooltip>
}
