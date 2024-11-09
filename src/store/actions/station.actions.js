import { stationService } from '../../services/station/station.service.local'
import { store } from '../store'
import {
  ADD_STATION,
  REMOVE_STATION,
  SET_STATIONS,
  SET_STATION,
  UPDATE_STATION,
  SET_PLAYING_SONG,
  ADD_SONG_TO_STATION,
  REMOVE_SONG_FROM_STATION,
} from '../reducers/station.reducer'

export async function loadStations(filterBy) {
  try {
    const stations = await stationService.query(filterBy)
    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log('Cannot load stations', err)
    throw err
  }
}

export async function loadStation(stationId) {
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
    return station
  } catch (err) {
    console.log('Cannot load station', err)
    throw err
  }
}

export async function removeStation(stationId) {
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log('Cannot remove station', err)
    throw err
  }
}

export async function addStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdAddStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot add station', err)
    throw err
  }
}

export async function updateStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log('Cannot save station', err)
    throw err
  }
}

export async function addSongToStation(stationId, song) {
  try {
    const updatedStation = await stationService.addSongToStation(stationId, song)
    store.dispatch(getCmdAddSongToStation(song))
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log('Cannot add song to station', err)
    throw err
  }
}

export async function removeSongFromStation(stationId, songId) {
  try {
    const updatedStation = await stationService.removeSongFromStation(stationId, songId)
    store.dispatch(getCmdRemoveSongFromStation(songId))
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log('Cannot remove song from station', err)
    throw err
  }
}

export function setPlayingSong(song) {
  store.dispatch(getCmdSetPlayingSong(song))
}

// Command Creators:
function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations,
  }
}
function getCmdSetStation(station) {
  return {
    type: SET_STATION,
    station,
  }
}
function getCmdRemoveStation(stationId) {
  return {
    type: REMOVE_STATION,
    stationId,
  }
}
function getCmdAddStation(station) {
  return {
    type: ADD_STATION,
    station,
  }
}
function getCmdUpdateStation(station) {
  return {
    type: UPDATE_STATION,
    station,
  }
}
function getCmdSetPlayingSong(song) {
  return {
    type: SET_PLAYING_SONG,
    song,
  }
}
function getCmdAddSongToStation(song) {
  return {
    type: ADD_SONG_TO_STATION,
    song,
  }
}
function getCmdRemoveSongFromStation(songId) {
  return {
    type: REMOVE_SONG_FROM_STATION,
    songId,
  }
}
