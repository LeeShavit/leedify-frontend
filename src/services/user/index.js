const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local.js'
import { userService as remote } from './user.service.remote.js'

function getEmptyUser() {
  return {
    name: '',
    imgUrl: '',
    likedSongs: [],
    likedStations: [],
    createdStations: [],
  }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const userService = { ...local, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService
