import { stationService } from "../../services/station/station.service.local"

export const SET_STATIONS = 'SET_STATIONS'
export const SET_STATION = 'SET_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
//playing a song in player
export const SET_PLAYING_SONG = 'SET_PLAYING_SONG'
export const SET_IS_PLAYING= 'SET_IS_PLAYING'
// station crudl
export const ADD_SONG_TO_STATION = 'ADD_SONG_TO_STATION'
export const REMOVE_SONG_FROM_STATION = 'REMOVE_SONG_FROM_STATION'

const initialState = {
  stations: [],
  currentStation: null,
  currentSong: stationService.getCurrentSong(),
  isPlaying: false,
}

export function stationReducer(state = initialState, action) {
  var newState = state
  var stations
  switch (action.type) {
    case SET_STATIONS:
      newState = { ...state, stations: action.stations }
      break
    case SET_STATION:
      newState = { ...state, currentStation: action.station }
      break
    case REMOVE_STATION:
      const lastRemovedStation = state.stations.find((station) => station._id === action.stationId)
      stations = state.stations.filter((station) => station._id !== action.stationId)
      newState = { ...state, stations, lastRemovedStation }
      break
    case ADD_STATION:
      newState = { ...state, stations: [...state.stations, action.station] }
      break
    case UPDATE_STATION:
      stations = state.stations.map((station) => (station._id === action.station._id ? action.station : station))
      newState = { ...state, stations }
      break
    case SET_PLAYING_SONG:
       newState = {...state, currentSong: action.currentSong}
       break
    case SET_IS_PLAYING:
       newState = {...state, isPlaying: action.isPlaying}
      break
    case ADD_SONG_TO_STATION:
      const updatedStationAdd = { ...state.currentStation }
      updatedStationAdd.songs.push(action.song)
      stations = state.stations.map((station) => (station._id === updatedStationAdd._id ? updatedStationAdd : station))
      newState = {
        ...state,
        stations,
        currentStation: updatedStationAdd,
      }
      break
    case REMOVE_SONG_FROM_STATION:
      const updatedStationRemove = { ...state.currentStation }
      updatedStationRemove.songs = updatedStationRemove.songs.filter((song) => song._id !== action.songId)
      stations = state.stations.map((station) =>
        station._id === updatedStationRemove._id ? updatedStationRemove : station
      )
      newState = {
        ...state,
        stations,
        currentStation: updatedStationRemove,
      }
      break
    default:
  }
  return newState
}
