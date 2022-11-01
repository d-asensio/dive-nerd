import {Line} from '@nivo/line'

import Tooltip from '@mui/joy/Tooltip'
import Sheet from "@mui/joy/Sheet";
import Badge from "@mui/joy/Badge";
import CircularProgress from '@mui/joy/CircularProgress'
import { Skeleton } from '@mui/material'

const DepthTooltip = ({point}) => {
  return (
    <Tooltip
      placement='top'
      variant='solid'
      disableInteractive
      open
      arrow
      title={`${point.data.depth} m`}
    >
      <span/>
    </Tooltip>
  )
}

export const DiveProfileThumbnail = ({loading, highlighted, samples}) => {
  return (
    <Badge color="success" sx={{
      '.JoyBadge-badge': {
        transition: 'opacity 300ms',
        opacity: highlighted ? 1 : 0
      }
    }}>
      <Sheet
        variant='outlined'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 128,
          height: 62,
          borderRadius: 'xs',
          overflow: 'auto'
        }}
      >
        {loading
          ? <CircularProgress size="sm" />
          : (
            <Line
              width={128}
              height={62}
              data={[
                {
                  id: 'dive-profile',
                  data: samples
                }
              ]}
              colors={['#3daff7']}
              margin={{top: 6, right: 6, bottom: 6, left: 6}}
              xScale={{type: 'linear'}}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: true
              }}
              layers={['lines', 'mesh']}
              animate={false}
              enableGridX={false}
              enableGridY={false}
              useMesh
              tooltip={DepthTooltip}
            />
          )}
      </Sheet>
    </Badge>
  )
}

DiveProfileThumbnail.Skeleton = () => <Skeleton variant="rounded" width={128} height={62} />
