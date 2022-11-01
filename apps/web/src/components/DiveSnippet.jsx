import Box from '@mui/joy/Box'
import Typography from '@mui/joy/Typography'
import Rating from '@mui/material/Rating'

export const DiveSnippet = ({
  name,
  date,
  maximumDepth,
  totalDuration,
  rating
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      gap: 3
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 0.5
      }}
    >
      <Typography level="h5">{name}</Typography>
      <Rating value={rating} size="small" readOnly/>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Typography noWrap level="body2" textColor="text.secondary">
        {date}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          alignSelf: 'flex-end'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <Typography
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Depth
          </Typography>
          <Typography fontSize="xl1" lineHeight={1} fontWeight="lg" noWrap>
            {maximumDepth}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <Typography
            level="body3"
            textTransform="uppercase"
            fontWeight="lg"
          >
            Time
          </Typography>
          <Typography fontSize="xl1" lineHeight={1} fontWeight="lg" noWrap>
            {totalDuration}
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
)
