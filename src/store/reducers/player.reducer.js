import { stationService } from '../../services/station/'
import { userService } from '../../services/user'

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
export const SET_QUEUE_OPEN = 'SET_QUEUE_OPEN'

const initialState = {
  currentSong: stationService.getCurrentSong(),
  currentStation: null,
  isLoading: false,
  queue: [],
  history: [],
  isPlaying: false,
  repeat: 'OFF', //SONG , QUEUE
  shuffle: false,
  originalQueue: [],
  isQueueOpen: false,
}

export function playerReducer(state = initialState, action = {}) {
  console.log(state)
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.currentSong,
        history: action.currentSong ? [action.currentSong, ...state.history] : [...state.history],
      }
    case SET_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying }
    case ADD_TO_QUEUE:
      const songsToAdd = Array.isArray(action.songsToAdd) ? action.songsToAdd : [action.songsToAdd]
      return {
        ...state,
        queue: [...state.queue, ...songsToAdd],
        originalQueue: state.shuffle ? state.originalQueue : [...songsToAdd, ...state.originalQueue],
        currentStation: action.station || state.currentStation,
      }
    case ADD_TO_QUEUE_NEXT:
      const songsToAddNext = Array.isArray(action.songsToAdd) ? action.songsToAdd : [action.songsToAdd]
      return {
        ...state,
        queue: [...songsToAddNext, ...state.queue],
        originalQueue: state.shuffle ? state.originalQueue : [...songsToAddNext, ...state.originalQueue],
      }
    case REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((song) => song._id !== action.songId),
        originalQueue: state.originalQueue.filter((song) => song._id !== action.songId),
      }
    case CLEAR_QUEUE:
      return { ...state, queue: [], originalQueue: [] }
    case TOGGLE_SHUFFLE:
      return {
        ...state,
        shuffle: !state.shuffle,
        queue: !state.shuffle ? [...state.queue].sort(() => Math.random() - 0.5) : [...state.originalQueue],
        originalQueue: !state.shuffle ? [...state.queue] : [...state.originalQueue],
      }
    case SET_REPEAT_MODE:
      return { ...state, repeat: action.mode }
    case PLAY_NEXT:
      if (state.queue.length === 0) {
        return {
          ...state,
          currentSong: state.currentSong,
        }
      }
      if (state.repeat === 'SONG') {
        return { ...state, currentSong: state.currentSong, queue: state.queue }
      }
      const [nextSong, ...remainingQueue] = state.queue
      if (remainingQueue.length === 0) {
        if (state.repeat === 'QUEUE') {
          const newQueue = state.shuffle
            ? [...state.originalQueue].sort(() => Math.random() - 0.5)
            : [...state.originalQueue]
          return {
            ...state,
            currentSong: nextSong,
            queue: newQueue,
            history: state.currentSong ? [state.currentSong, ...state.history] : [...state.history],
          }
        }
      }
      return {
        ...state,
        currentSong: nextSong,
        queue: remainingQueue,
        history: state.currentSong ? [state.currentSong, ...state.history] : [...state.history],
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
        history: remainingHistory,
      }
    case REPLACE_QUEUE:
      const songsToReplace = Array.isArray(action.songs) ? action.songs : [action.songs]
      return {
        ...state,
        queue: state.shuffle ? songsToReplace.sort(() => Math.random() - 0.5) : songsToReplace,
        originalQueue: songsToReplace,
        history: [],
        currentStation: action.station || state.currentStation,
      }
    case SET_QUEUE_OPEN:
      return { ...state, isQueueOpen: action.isOpen }
    default:
      return state
  }
}
