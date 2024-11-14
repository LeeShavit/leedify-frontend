const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

export const DEFAULT_IMG =
  'https://res.cloudinary.com/dtqfckufu/image/upload/c_crop,w_450,h_450,ar_1:1/v1731425735/empty_xye9w8.png'

function getEmptyStation() {
    return {
      name: 'New Playlist',
      description: '',
      tags: [],
      imgUrl: DEFAULT_IMG,
      likedByUsers: [],
      songs: [],
    }
  }

function getDefaultFilter() {
    return {
        txt: '',
        minSpeed: '',
        sortField: '',
        sortDir: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
