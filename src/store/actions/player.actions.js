import {
  LOADING_START,
  LOADING_DONE,
  SET_CURRENT_SONG,
  SET_IS_PLAYING,
  ADD_TO_QUEUE,
  ADD_TO_QUEUE_NEXT,
  REMOVE_FROM_QUEUE,
  CLEAR_QUEUE,
  TOGGLE_SHUFFLE,
  SET_REPEAT_MODE,
  PLAY_NEXT,
  PLAY_PREV,
  REPLACE_QUEUE,
} from '../reducers/player.reducer'
import { store } from '../store'
import { recentlyPlayedService } from '../../services/recently-played.service'

export function setCurrentSong(song) {
  store.dispatch({ type: SET_CURRENT_SONG, currentSong: song })
}
export function setIsPlaying(isPlaying) {
  store.dispatch({ type: SET_IS_PLAYING, isPlaying })
  console.log(store.getState())
}
export function addToQueue(songsToAdd, station) {
  const cmd = { type: ADD_TO_QUEUE, songsToAdd }
  if (station) cmd.station =  {_id: station._id, name: station.name}
  recentlyPlayedService.addStation(station)
  store.dispatch(cmd)
}

export function addToQueueNext(songsToAdd) {
  store.dispatch({ type: ADD_TO_QUEUE_NEXT, songsToAdd })
}
export function removeFromQueue(songId) {
  store.dispatch({ type: REMOVE_FROM_QUEUE, songId })
}
export function clearQueue() {
  store.dispatch({ type: CLEAR_QUEUE })
}
export function toggleShuffle() {
  store.dispatch({ type: TOGGLE_SHUFFLE })
}
export function setRepeatMode(mode) {
  store.dispatch({ type: SET_REPEAT_MODE, mode })
}
export function playNext() {
  store.dispatch({ type: PLAY_NEXT })
}
export function playPrev() {
  store.dispatch({ type: PLAY_PREV })
}
export function replaceQueue(songs, station) {
  const cmd = { type: REPLACE_QUEUE, songs }
  if (station) cmd.station = {_id: station._id, name: station.name}
  store.dispatch(cmd)
}
