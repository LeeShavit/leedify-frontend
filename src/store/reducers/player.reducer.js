import { stationService } from "../../services/station/station.service.local"

export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const ADD_TO_QUEUE = 'ADD_TO_QUEUE'
export const ADD_TO_QUEUE_NEXT = 'ADD_TO_QUEUE_NEXT'
export const REMOVE_FROM_QUEUE = 'REMOVE_FROM_QUEUE'
export const CLEAR_QUEUE = 'CLEAR_QUEUE'
export const TOGGLE_SHUFFLE = 'TOGGLE_SHUFFLE'
export const SET_REPEAT_MODE = 'SET_REPEAT_MODE'
export const PLAY_NEXT = 'PLAY_NEXT'
export const PLAY_PREV = 'PLAY_PREV'
export const REPLACE_QUEUE = 'REPLACE_QUEUE'


const initialState = {
  currentSong: stationService.getCurrentSong(),
  currentStationId: null,
  isLoading: false,
  queue: [],
  history: [],
  isPlaying: false,
  repeat: 'OFF', //SONG , QUEUE
  shuffle: false,
  originalQueue: [],
}

export function playerReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.currentSong,
        history: action.currentSong ? [action.currentSong, ...state.history] : [...state.history]
      }
    case SET_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying }
    case ADD_TO_QUEUE:
      let songsToAdd = Array.isArray(action.songsToAdd) ? action.songsToAdd : [action.songsToAdd]
      return { ...state, queue: [...state.queue, ...songsToAdd], currentStationId: action.stationId || state.currentStationId }
    case ADD_TO_QUEUE_NEXT:
      songsToAdd = Array.isArray(action.songsToAdd) ? action.songsToAdd : [action.songsToAdd]
      return {
        ...state,
        queue: [...songsToAdd, ...state.queue],
        originalQueue: state.shuffle ? state.originalQueue : [...songsToAdd, ...state.originalQueue]
      }
    case REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter(song => song._id === action.songId),
        originalQueue: state.originalQueue.filter(song => song._id === action.songId)
      }
    case CLEAR_QUEUE:
      return { ...state, queue: [], originalQueue: [] }
    case TOGGLE_SHUFFLE:
      return {
        ...state,
        shuffle: !state.shuffle,
        queue: !state.shuffle ? [...state.queue].sort(() => Math.random + 0.5) : [...state.originalQueue],
        originalQueue: !state.shuffle ? [...state.queue] : [...state.originalQueue]
      }
    case TOGGLE_SHUFFLE:
      const newShuffle= !state.shuffle
      return {
        ...state,
        shuffle: newShuffle,
        queue: newShuffle ? [...state.queue].sort(() => Math.random - 0.5) : [...state.originalQueue],
        originalQueue: newShuffle ? [...state.queue] : state.originalQueue
      }
    case SET_REPEAT_MODE:
      return { ...state, repeat: action.mode }
    case PLAY_NEXT:
      if (state.queue.length === 0) return { ...state, isPlaying: false, currentSong: null }
      
      let [nextSong, ...remainingQueue] = state.queue
      if (state.repeat === 'SONG') {
        remainingQueue.unshift(nextSong)
      } else if (state.repeat === 'QUEUE' && remainingQueue.length === 0) {
        remainingQueue = state.shuffle ? [...state.originalQueue].sort(() => Math.random + 0.5) : [...state.originalQueue]
      }
      return {
        ...state,
        currentSong: nextSong,
        queue: remainingQueue,
        history: state.currentSong ? [state.currentSong, ...state.history] : [...state.history]
      }
    case PLAY_PREV:
      console.log(state)
      if (state.history.length === 0) {
        return state
      }
      const [prevSong, ...remainingHistory] = state.history
      return {
        ...state,
        currentSong: prevSong,
        queue: state.currentSong ? [state.currentSong, ...state.queue] : state.queue,
        history: remainingHistory
      }
    case REPLACE_QUEUE:
      return {
        ...state,
        currentSong: action.songs[0],
        queue: songs.slice(1),
        originalQueue: songs.slice(1),
        history: [],
        isPlaying: true
      }
    default: return state
  }
}
