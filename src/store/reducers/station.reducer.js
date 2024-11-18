
export const SET_STATIONS = 'SET_STATIONS'
export const SET_STATION = 'SET_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
// station crudl

const initialState = {
  stations: []
}

export function stationReducer(state = initialState, action) {
  var newState = state

  var stations
  switch (action.type) {
    case SET_STATIONS:
      newState = { ...state, stations: action.stations }
      break
    case REMOVE_STATION:
      stations = state.stations.filter((station) => station._id !== action.stationId)
      newState = { ...state, stations }
      break
    case ADD_STATION:
      newState = { ...state, stations: [...state.stations, action.station] }
      break
    case UPDATE_STATION:
      stations = state.stations.map((station) => (station._id === action.station._id ? action.station : station))
      newState = { ...state, stations }
      break
    default:
  }


  return newState
}
