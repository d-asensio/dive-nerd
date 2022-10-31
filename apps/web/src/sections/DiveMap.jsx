import { useCallback, useState, useRef } from 'react'

import Map, { Marker } from 'react-map-gl'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

import { useNavigate } from 'react-router-dom'

import { useColorScheme } from '@mui/joy/styles'
import Badge from '@mui/joy/Badge'
import Tooltip from '@mui/joy/Tooltip'

import { run } from '@regenerate/core'

import { useSelector } from '../store'
import {
  diveSelector,
  diveIdListSelector,
  isDiveHighlightedSelector, divesService
} from '../entities'

import eventBus from '../eventBus'
import { useMount } from 'react-use'

const DiveMapMarker = ({ diveId }) => {
  const navigate = useNavigate()
  const isHighLighted = useSelector(
    state => isDiveHighlightedSelector(state, diveId)
  )

  const handleNavigate = useCallback(() => navigate(`/dive/${diveId}`), [diveId])

  const {
    name,
    geographicCoordinates: { latitude, longitude }
  } = useSelector((state) =>
    diveSelector(state, diveId)
  )

  const handleEnter = useCallback(() => {
    run(divesService.highlightDive(diveId))
  }, [diveId])

  const handleLeave = useCallback(() => {
    run(divesService.highlightDive(null))
  }, [])

  return (
    <Marker longitude={longitude} latitude={latitude} anchor='center'>
      <Tooltip
        disableInteractive
        open={isHighLighted}
        title={name}
        placement='top'
        variant='outlined'
        arrow
      >
        <Badge
          badgeInset='50%'
          color={isHighLighted ? 'success' : 'primary'}
          sx={{
            p: 1.5,
            transition: 'transform 300ms, color 300ms',
            cursor: 'pointer',
            transform: isHighLighted && 'scale(1.5)',
            '& .JoyBadge-badge': {
              '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '2px solid',
                borderColor: isHighLighted ? 'success.500' : 'primary.500',
                content: '""'
              }
            },
            '@keyframes ripple': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1
              },
              '100%': {
                transform: 'scale(2)',
                opacity: 0
              }
            }
          }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={handleNavigate}
        />
      </Tooltip>
    </Marker>
  )
}

export const DiveMap = () => {
  const { mode: themeMode } = useColorScheme()

  const mapRef = useRef(null)

  const diveIdList = useSelector(diveIdListSelector)

  useMount(() =>
    eventBus.on('MAP_FOCUS_ON_COORDINATES',
      ({ latitude, longitude }) => mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: 4,
        duration: 2000
      })))

  const [viewState, setViewState] = useState({
    longitude: 41.2284, // This should be user coordinates
    latitude: 80.9098,
    zoom: 1.8
  })

  const handleMapMove = useCallback(
    ({ viewState }) => setViewState(viewState),
    []
  )

  return (
    <Map
      {...viewState}
      mapLib={mapboxgl}
      ref={mapRef}
      mapStyle={`mapbox://styles/mapbox/${themeMode}-v9`}
      onMove={handleMapMove}
    >
      {diveIdList.map((diveId) => (
        <DiveMapMarker key={diveId} diveId={diveId} />
      ))}
    </Map>
  )
}
