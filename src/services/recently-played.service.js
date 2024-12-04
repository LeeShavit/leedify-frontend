import { stationService } from './station'

const RECENTLY_PLAYED_KEY = 'recently_played_stations'
const MAX_RECENT_STATIONS = 8

const DEFAULT_STATION_IDS = [
  '7jJmLeloy4ZrjJ4thCCgMe',
  '6WjtRWXqU8SenEhZhTkUfc',
  '44imBReuLDHuIP0j4UmCtm',
  '02Jjjt6CHQW3lBq5Co5SCW',
  '1F7kVQP5qMmjbecZev5pth',
  '7fQjOBRbDPJlGAc8UOMDFY',
  '3bEWBSKpBX6UpbNkDIbszK',
  '3qwyQJzNAt4BDfnijpKkbi',
]

export const recentlyPlayedService = {
  addStation,
  getRecentlyPlayed,
}

function addStation(station) {
  const stationId= station._id
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
