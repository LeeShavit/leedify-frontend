import { stationService } from './station'

const RECENTLY_PLAYED_KEY = 'recently_played_stations'
const MAX_RECENT_STATIONS = 8

const DEFAULT_STATION_IDS = [
  '37i9dQZF1DX10zKzsJ2jva',
  '37i9dQZEVXbv80hRxuEhT9',
  '37i9dQZF1DX76Wlfdnj7AP',
  '37i9dQZF1DXbIeCFU20wRm',
  '37i9dQZF1DWSYF6geMtQMW',
  '37i9dQZF1DX7Qo2zphj7u3',
  '37i9dQZF1DX8WzB1Rs2vkz',
  '37i9dQZEVXbMDoHDwVN2tF',
]

export const recentlyPlayedService = {
  addStation,
  getRecentlyPlayed,
}

function addStation(stationId) {
  let recentlyPlayed = JSON.parse(localStorage.getItem(RECENTLY_PLAYED_KEY) || '[]')
  recentlyPlayed = recentlyPlayed.filter((id) => id !== stationId)
  recentlyPlayed.unshift(stationId)
  recentlyPlayed = recentlyPlayed.slice(0, MAX_RECENT_STATIONS)
  localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(recentlyPlayed))
}

async function getRecentlyPlayed() {
  const recentlyPlayed = JSON.parse(localStorage.getItem(RECENTLY_PLAYED_KEY) || '[]')

  try {
    if (recentlyPlayed.length === 0) {
      const defaultStations = await Promise.all(DEFAULT_STATION_IDS.map((id) => stationService.getById(id)))
      return defaultStations.filter((station) => station)
    }

    const stations = await Promise.all(recentlyPlayed.map((id) => stationService.getById(id)))
    return stations.filter((station) => station)
  } catch (err) {
    console.error('Failed to get recently played stations:', err)
    return []
  }
}
