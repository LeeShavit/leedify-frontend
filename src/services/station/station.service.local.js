import { storageService } from '../async-storage.service'
import { ApiService } from '../api.service'
import { userService } from '../user'
import { loadFromStorage, saveToStorage } from '../util.service'

const STORAGE_KEY = 'stations_db'
const SONG_STORAGE_KEY = 'current-playing-song'

export const DEFAULT_IMG =
  'https://res.cloudinary.com/dtqfckufu/image/upload/c_crop,w_450,h_450,ar_1:1/v1731425735/empty_xye9w8.png'

export const stationService = {
  query,
  getById,
  save,
  remove,
  addSongToStation,
  removeSongFromStation,
  getCurrentSong,
  getSearchResSong,
  getLikedSongsStation,
}
_createDemoSong()
_createDemoData()

async function query(filterBy = {}) {
  try {
    let stations = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      stations = stations.filter(
        (station) =>
          regex.test(station.name) ||
          regex.test(station.description) ||
          station.genres.some((genres) => regex.test(genres))
      )
    }
    if (filterBy.genre) {
      stations = stations.filter((station) => station.genres.includes(filterBy.genres))
    }

    return stations
  } catch (err) {
    console.error("station service - couldn't get stations", err)
    throw err
  }
}

async function getById(stationId) {
  try {
    if (stationId === 'liked-songs') return await getLikedSongsStation()

    let station = null
    try {
      station = await storageService.get(STORAGE_KEY, stationId)
    } catch (err) {
      console.log('Station not found in local DB')
    }

    if (!station) {
      try {
        console.log('Fetching station from Spotify...')
        const spotifyStation = await ApiService.getSpotifyItems({
          type: 'station',
          id: stationId,
          market: 'US',
        })

        if (spotifyStation) {
          const formattedStation = {
            _id: spotifyStation._id,
            name: spotifyStation.name,
            description: spotifyStation.description || '',
            imgUrl: spotifyStation.imgUrl,
            createdBy: { _id: 'spotify', name: 'Spotify' },
            songs: spotifyStation.songs.map((song) => ({
              ...song,
              addedAt: song.addedAt || new Date().toISOString(),
            })),
            tags: [],
            likedByUsers: [],
          }

          try {
            station = await storageService.post(STORAGE_KEY, formattedStation)
            console.log('Station saved to local DB')
          } catch (saveErr) {
            console.warn('Failed to save station to local DB:', saveErr)
            station = formattedStation
          }
        }
      } catch (spotifyErr) {
        console.error('Failed to fetch from Spotify:', spotifyErr)
      }
    }

    if (!station) throw new Error(`Station ${stationId} not found`)
    return station
  } catch (err) {
    console.error('Failed to get station:', err)
    throw err
  }
}

async function remove(stationId) {
  try {
    return await storageService.remove(STORAGE_KEY, stationId)
  } catch (err) {
    console.error("station service - couldn't remove station", err)
    throw err
  }
}

async function save(station) {
  try {
    if (station._id) {
      if (station.createdBy && station.createdBy._id === 'spotify') {
        return await storageService.put(STORAGE_KEY, station)
      }

      const loggedInUser = userService.getLoggedinUser()
      if (!loggedInUser) throw new Error('No logged in user found')

      station.createdBy = {
        _id: loggedInUser._id,
        name: loggedInUser.name || loggedInUser.username,
        imgUrl: loggedInUser.imgUrl,
      }

      return await storageService.put(STORAGE_KEY, station)
    } else {
      const loggedInUser = userService.getLoggedinUser()
      if (!loggedInUser) throw new Error('No logged in user found')

      const newStation = {
        ...station,
        createdBy:
          station.createdBy?._id === 'spotify'
            ? station.createdBy
            : {
                _id: loggedInUser._id,
                name: loggedInUser.name || loggedInUser.username,
                imgUrl: loggedInUser.imgUrl,
              },
      }

      return await storageService.post(STORAGE_KEY, newStation)
    }
  } catch (err) {
    console.error("station service - couldn't save station", err)
    throw err
  }
}

async function addSongToStation(stationId, song) {
  try {
    console.log('hello')
    const station = await getById(stationId)
    console.log('hello')
    console.log('station', station)
    if (!station) throw new Error(`Station ${stationId} not found`)

    const songToAdd = {
      ...song,
      addedAt: Date.now(),
    }

    station.songs.push(songToAdd)
    return await save(station)
  } catch (err) {
    console.error("station service - couldn't add song to station", err)
    throw err
  }
}

async function removeSongFromStation(stationId, songId) {
  try {
    const station = await getById(stationId)
    if (!station) throw new Error(`Station ${stationId} not found`)

    const songIdx = station.songs.findIndex((song) => song._id === songId)
    if (songIdx === -1) throw new Error(`song ${songId} not found`)

    station.songs.splice(songIdx, 1)
    return await save(station)
  } catch (err) {
    console.error("station service - couldn't remove song from station", err)
    throw err
  }
}

async function getLikedSongsStation() {
  try {
    const user = userService.getLoggedinUser()
    console.log('user', user)
    return {
      _id: 'liked-songs',
      name: 'Liked Songs',
      description: '',
      imgUrl: 'https://res.cloudinary.com/dsymwlagn/image/upload/v1732025935/ejl22wx2eyqjwccuvzta.png',
      createdBy: { name: user.name, _id: user._id },
      songs: [...user.likedSongs].sort((a, b) => a.AddedAt - b.AddedAt),
    }
  } catch (err) {
    console.log('station service- failed to create liked songs station')
  }
}

function _createDemoData() {
  const stations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  if (stations.length > 0) return

  const demoStations = [
    {
      _id: '5Rjx8Pa0tyNSgkXMyINBAS',
      name: 'Pink Floyd Essentials',
      description: 'Best of Pink Floyd',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
      tags: ['Rock', 'Psychedelic'],
      createdBy: {
        _id: 'u101',
        name: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          _id: '4gMgiXfqyzZLMhsksGmbQV',
          name: 'Another Brick in the Wall, Pt. 2',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'The Wall', _id: '5Dbax7G8SWrP9xyzkOvy2F' },
          duration: 238746,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2735d48e2f56d691f9a4e4b0bdf',
          addedAt: Date.now(),
          uri: 'spotify:track:4gMgiXfqyzZLMhsksGmbQV',
          preview_url: 'https://p.scdn.co/mp3-preview/73d913b1a9cfa64fda1f7d04d7bb16345fa0aac4',
        },
        {
          _id: '6mFkJmJqdDVQ1REhVfGgd1',
          name: 'Wish You Were Here',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'Wish You Were Here', _id: '0bCAjiUamIFqKJsekOYuRw' },
          duration: 334743,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2731a84d71391df7469c5ab8539',
          addedAt: Date.now(),
          uri: 'spotify:track:6mFkJmJqdDVQ1REhVfGgd1',
          preview_url: 'https://p.scdn.co/mp3-preview/e3d046771206da9115d0a619ede2210b610dc9f0',
        },
        {
          _id: '5HNCy40Ni5BZJFw1TKzRsC',
          name: 'Comfortably Numb',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'The Wall', _id: '5Dbax7G8SWrP9xyzkOvy2F' },
          duration: 382296,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2735d48e2f56d691f9a4e4b0bdf',
          addedAt: Date.now(),
          uri: 'spotify:track:5HNCy40Ni5BZJFw1TKzRsC',
          preview_url: 'https://p.scdn.co/mp3-preview/ac032e24ed332f7d57306ca32aead2daf5ee1be4',
        },
        {
          _id: '0vFOzaXqZHahrZp6enQwQb',
          name: 'Money',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'The Dark Side of the Moon', _id: '4LH4d3cOWNNsVw41Gqt2kv' },
          duration: 382834,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
          addedAt: Date.now(),
          uri: 'spotify:track:0vFOzaXqZHahrZp6enQwQb',
          preview_url: 'https://p.scdn.co/mp3-preview/103d8d96e99d937f45e01432cfe8f8c3a990c572',
        },
        {
          _id: '3TO7bbrUKrOSPGRTB5MeCz',
          name: 'Time',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'The Dark Side of the Moon', _id: '4LH4d3cOWNNsVw41Gqt2kv' },
          duration: 413947,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
          addedAt: Date.now(),
          uri: 'spotify:track:3TO7bbrUKrOSPGRTB5MeCz',
          preview_url: 'https://p.scdn.co/mp3-preview/af750f68023549d4744e677c0a25ddb26c8182a8',
        },
        {
          _id: '6pnwfWyaWjQiHCKTiZLItr',
          name: 'Shine On You Crazy Diamond (Pts. 1-5)',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'Wish You Were Here', _id: '0bCAjiUamIFqKJsekOYuRw' },
          duration: 811077,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2731a84d71391df7469c5ab8539',
          addedAt: Date.now(),
          uri: 'spotify:track:6pnwfWyaWjQiHCKTiZLItr',
          preview_url: 'https://p.scdn.co/mp3-preview/76993b34a8a399ac28677e5a9ec2c4f06c9e0869',
        },
        {
          _id: '2ctvdKmETyOzPb2GiJJT53',
          name: 'Breathe (In the Air)',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'The Dark Side of the Moon', _id: '4LH4d3cOWNNsVw41Gqt2kv' },
          duration: 169534,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
          addedAt: Date.now(),
          uri: 'spotify:track:2ctvdKmETyOzPb2GiJJT53',
          preview_url: 'https://p.scdn.co/mp3-preview/85e2ac92a4028e1479f93aee34bdbc44596e9a44',
        },
      ],
    },
    {
      _id: '37i9dQZF1DXbLMw3ry7d7k',
      name: 'Latin Hits',
      description: 'Top Latin songs',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
      tags: ['Latin', 'Pop'],
      createdBy: {
        _id: 'u101',
        name: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          _id: '54zcJnb3tp9c5OVKREZ1Is',
          name: 'MI EX TENÍA RAZÓN',
          artists: [{ name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' }],
          album: { name: 'MAÑANA SERÁ BONITO (BICHOTA SEASON)', _id: '0FqAaUEyKCyUNFE1uQPZ7i' },
          duration: 154374,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273d026bf9d7780f6a1267b4d03',
          addedAt: Date.now(),
          uri: 'spotify:track:54zcJnb3tp9c5OVKREZ1Is',
          preview_url: null,
        },
        {
          _id: '5PycBIeabfvX3n9ILG7Vrv',
          name: 'Propuesta Indecente',
          artists: [{ name: 'Romeo Santos', _id: '5lwmRuXgjX8xIwlnauTZIP' }],
          album: { name: 'Fórmula, Vol. 2 (Deluxe Edition)', _id: '17HsiXfqKUPoTP6Y5ebs1L' },
          duration: 235133,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e9da42890bbd629df1e8f640',
          addedAt: Date.now(),
          uri: 'spotify:track:5PycBIeabfvX3n9ILG7Vrv',
          preview_url: 'https://p.scdn.co/mp3-preview/517abecfde814f6ecb4459b4d2ff4c250ed80ec5',
        },
        {
          _id: '5RqSsdzTNPX1uzkmlHCFvK',
          name: 'QLONA',
          artists: [
            { name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' },
            { name: 'Peso Pluma', _id: '12GqGscKJx3aE4t07u7eVZ' },
          ],
          album: { name: 'MAÑANA SERÁ BONITO (BICHOTA SEASON)', _id: '0FqAaUEyKCyUNFE1uQPZ7i' },
          duration: 172797,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273d026bf9d7780f6a1267b4d03',
          addedAt: Date.now(),
          uri: 'spotify:track:5RqSsdzTNPX1uzkmlHCFvK',
        },
        {
          _id: '0DWdj2oZMBFSzRsi2Cvfzf',
          name: 'TQG',
          artists: [
            { name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' },
            { name: 'Shakira', _id: '0EmeFodog0BfCgMzAIvKQp' },
          ],
          album: { name: 'MAÑANA SERÁ BONITO', _id: '4kS7bSuU0Jm9LYMosFU2x5' },
          duration: 197933,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b27382de1ca074ae63cb18fce335',
          addedAt: Date.now(),
          uri: 'spotify:track:0DWdj2oZMBFSzRsi2Cvfzf',
        },
        {
          _id: '7FlQk2gJ6TBrHHiidvdR2O',
          name: 'MAMIII',
          artists: [
            { name: 'Becky G', _id: '4obzFoKoKRHIphyHzJ35G3' },
            { name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' },
          ],
          album: { name: 'ESQUEMAS', _id: '7eC4wtMG1I2Jtk4FDWbkKC' },
          duration: 226093,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273518859dcb13382116f450073',
          addedAt: Date.now(),
          uri: 'spotify:track:7FlQk2gJ6TBrHHiidvdR2O',
          preview_url: 'https://p.scdn.co/mp3-preview/0a699c30d354c4cb36439d03522e65b377ac0fd8',
        },
        {
          _id: '4NoOME4Dhf4xgxbHDT7VGe',
          name: 'X SI VOLVEMOS',
          artists: [
            { name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' },
            { name: 'Romeo Santos', _id: '5lwmRuXgjX8xIwlnauTZIP' },
          ],
          album: { name: 'MAÑANA SERÁ BONITO', _id: '4kS7bSuU0Jm9LYMosFU2x5' },
          duration: 200120,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b27382de1ca074ae63cb18fce335',
          addedAt: Date.now(),
          uri: 'spotify:track:4NoOME4Dhf4xgxbHDT7VGe',
        },
        {
          _id: '3HqcNJdZ2seoGxhn0wVNDK',
          name: 'PROVENZA',
          artists: [{ name: 'KAROL G', _id: '790FomKkXshlbRYZFtlgla' }],
          album: { name: 'MAÑANA SERÁ BONITO', _id: '4kS7bSuU0Jm9LYMosFU2x5' },
          duration: 207626,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b27382de1ca074ae63cb18fce335',
          addedAt: Date.now(),
          uri: 'spotify:track:3HqcNJdZ2seoGxhn0wVNDK',
        },
      ],
    },
  ]

  saveToStorage(STORAGE_KEY, demoStations)
}
function _createDemoSong() {
  const ytIdsMap = loadFromStorage('youtube ids') || {}
  ytIdsMap[`La Bachata`] = 'D6Ju9CyOB-I'
  saveToStorage('youtube ids', ytIdsMap)

  let currentSong = JSON.parse(localStorage.getItem(SONG_STORAGE_KEY))
  if (currentSong) return

  currentSong = {
    _id: '5ww2BF9slyYgNOk37BlC4u',
    name: 'La Bachata',
    artists: [
      {
        name: 'Manuel Turizo',
        _id: '0tmwSHipWxN12fsoLcFU3B',
      },
    ],
    album: {
      name: '2000',
      _id: '7ubO2LZJZFpyhiWMZkRwcH',
    },
    duration: 145200,
    url: 'youtube/song.mp4',
    imgUrl: 'https://i.scdn.co/image/ab67616d0000b273c9f744b0d62da795bc21d04a',
    likedBy: [],
    addedAt: 162521765262,
  }
  saveToStorage(SONG_STORAGE_KEY, currentSong)
}

function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}

function getCurrentSong() {
  return JSON.parse(localStorage.getItem(SONG_STORAGE_KEY))
}

async function getSearchResSong(txt) {
  const res = await ApiService.getSpotifyItems({ type: 'songSearch', query: txt, market: 'US' })
  return res.songs
}
