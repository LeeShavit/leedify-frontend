import { stationService } from '../../services/station/'
import { store } from '../store'
import {
  ADD_STATION,
  REMOVE_STATION,
  SET_STATIONS,
  UPDATE_STATION
} from '../reducers/station.reducer'
import { userService } from '../../services/user'
import { updateUsersLikedStation } from './user.actions'

export async function loadStations(sortBy) {
  try {
    const stations = await userService.getUsersStations(sortBy)
    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log('Cannot load stations', err)
    throw err
  }
}

export async function removeStation(stationId) {
  try {
    const res = await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log('Cannot remove station', err)
    throw err
  }
}

export async function addStation() {
  try {
    const station = stationService.getEmptyStation()
    const savedStation = await stationService.save(station)
    return savedStation
  } catch (err) {
    console.log('Cannot add station', err)
    throw err
  }
}

export async function updateStation(station) {
  try {
    const updatedStation = await stationService.save(station)
    const savedStation =await updateUsersLikedStation(updatedStation)
    store.dispatch(getCmdUpdateStation(savedStation))
    return updatedStation
  } catch (err) {
    console.log('Cannot save station', err)
    throw err
  }
}

export async function addSongToStation(stationId, song) {
  try {
    const updatedStation = await stationService.addSongToStation(stationId, song)
    return updatedStation
  } catch (err) {
    console.log('Cannot add song to station', err)
    throw err
  }
}

export async function removeSongFromStation(stationId, songId) {
  try {
    const updatedStation = await stationService.removeSongFromStation(stationId, songId)
    return updatedStation
  } catch (err) {
    console.log('Cannot remove song from station', err)
    throw err
  }
}

export async function likeStation(station) {
  try {
    await userService.likeStation(station)
    store.dispatch(getCmdAddStation(station))
  } catch (err) {
    showErrorMsg('Cannot like station')
    console.log('Cannot like station', err)
  }
}

export async function dislikeStation(stationId) {
  try {
    await userService.dislikeStation(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    showErrorMsg('Cannot dislike station')
    console.log('Cannot dislike station', err)
  }
}

function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations,
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