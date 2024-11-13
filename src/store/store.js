import { legacy_createStore as createStore, combineReducers } from 'redux'

import { stationReducer } from './reducers/station.reducer'
import { userReducer } from './reducers/user.reducer'
import { playerReducer } from './reducers/player.reducer'

const rootReducer = combineReducers({
  stationModule: stationReducer,
  userModule: userReducer,
  playerModule: playerReducer,
})

const middleware = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  : undefined
export const store = createStore(rootReducer, middleware)

// For debug:
// store.subscribe(() => {
//     console.log('**** Store state changed: ****')
//     console.log('storeState:\n', store.getState())
//     console.log('*******************************')
// })
