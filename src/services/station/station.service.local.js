import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { makeId, saveToStorage } from '../util.service'
const STORAGE_KEY = 'stations_db'
const SONG_STORAGE_KEY = 'current-playing-song'

export const stationService = {
  query,
  getById,
  save,
  remove,
  getEmptyStation,
  addSongToStation,
  removeSongFromStation,
  getCurrentSong,
  getSongs,
  getSong,
  getLikedSongsStation,
}

_createDemoData()
_createDemoSong()
_createDemoSongs()

async function query(filterBy = {}) {
  try {
    let stations = await storageService.query(STORAGE_KEY)

    if (filterBy.txt) {
      const regex = new RegExp(filterBy.txt, 'i')
      stations = stations.filter(
        (station) =>
          regex.test(station.name) || regex.test(station.description) || station.tags.some((tag) => regex.test(tag))
      )
    }
    if (filterBy.tag) {
      stations = stations.filter((station) => station.tags.includes(filterBy.tag))
    }

    return stations
  } catch (err) {
    console.error("station service - couldn't get stations", err)
    throw err
  }
}

async function getById(stationId) {
  try {
    return await storageService.get(STORAGE_KEY, stationId)
  } catch (err) {
    console.error("station service - couldn't get station", err)
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
      return await storageService.put(STORAGE_KEY, station)
    } else {
      return await storageService.post(STORAGE_KEY, station)
    }
  } catch (err) {
    console.error("station service - couldn't save station", err)
    throw err
  }
}

async function addSongToStation(stationId, song) {

  try {
    const station = await getById(stationId)
    if (!station) throw new Error(`Station ${stationId} not found`)

    const songExists = station.songs.some((s) => s.id === song.id)
    if (songExists) return station

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

    const songIdx = station.songs.findIndex((song) => song.id === songId)
    if (songIdx === -1) return station

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
    return {
      name: 'Liked Songs',
      description: '',
      imgUrl: 'https://misc.scdn.co/liked-songs/liked-songs-300.png',
      createdBy: { fullname: user.name, id: user._id },
      songs: [...user.likedSongs].sort((a, b) => a.AddedAt - b.AddedAt)
    }
  } catch (err) {
    console.log('station service- failed to create liked songs station')
  }
}

function getEmptyStation() {
  return {
    name: 'New Playlist',
    description: '',
    tags: [],
    imgUrl: 'https://community.spotify.com/t5/image/serverpage/image-id/55829iC2AD64ADB887E2A5/image-size/large',
    createdBy: {},
    likedByUsers: [],
    songs: [],
  }
}

function _createDemoData() {
  const stations = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  if (stations.length > 0) return

  const demoStations = [
    {
      _id: makeId(),
      name: 'Pink Floyd Essentials',
      description: 'Best of Pink Floyd',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
      tags: ['Rock', 'Psychedelic'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          id: '4gMgiXfqyzZLMhsksGmbQV',
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
          id: '6mFkJmJqdDVQ1REhVfGgd1',
          name: 'Wish You Were Here',
          artists: [{ name: 'Pink Floyd', _id: '0k17h0D3J5VfsdmQ1iZtE9' }],
          album: { name: 'Wish You Were Here', _id: '0bCAjiUamIFqKJsekOYuRw' },
          duration: 334743,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b2731a84d71391df7469c5ab8539',
          addedAt: Date.now(),
          uri: 'spotify:track:6mFkJmJqdDVQ1REhVfGgd1',
          preview_url: 'https://p.scdn.co/mp3-preview/e3d046771206da9115d0a619ede2210b610dc9f0',
        },
      ],
    },
    {
      _id: makeId(),
      name: 'Latin Hits',
      description: 'Top Latin songs',
      imgUrl: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
      tags: ['Latin', 'Pop'],
      createdBy: {
        _id: 'u101',
        fullname: 'Admin',
        imgUrl: '',
      },
      likedByUsers: [],
      songs: [
        {
          id: '54zcJnb3tp9c5OVKREZ1Is',
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
          id: '5PycBIeabfvX3n9ILG7Vrv',
          name: 'Propuesta Indecente',
          artists: [{ name: 'Romeo Santos', _id: '5lwmRuXgjX8xIwlnauTZIP' }],
          album: { name: 'Fórmula, Vol. 2 (Deluxe Edition)', _id: '17HsiXfqKUPoTP6Y5ebs1L' },
          duration: 235133,
          imgUrl: 'https://i.scdn.co/image/ab67616d0000b273e9da42890bbd629df1e8f640',
          addedAt: Date.now(),
          uri: 'spotify:track:5PycBIeabfvX3n9ILG7Vrv',
          preview_url: 'https://p.scdn.co/mp3-preview/517abecfde814f6ecb4459b4d2ff4c250ed80ec5',
        },
      ],
    },
  ]

  saveToStorage(STORAGE_KEY, demoStations)
}

function _formatDuration(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
}

function getCurrentSong() {
  return JSON.parse(localStorage.getItem(SONG_STORAGE_KEY))
}

function _createDemoSong() {
  let currentSong = JSON.parse(localStorage.getItem(SONG_STORAGE_KEY))
  if (currentSong) return

  currentSong = {
    id: '2L9N0zZnd37dwF0clgxMGI',
    name: "ceilings",
    artists: [
      {
        name: 'Lizzy McAlpine',
        _id: '1GmsPCcpKgF9OhlNXjOsbS',
      }
    ],
    album: {
      name: 'five seconds flat',
      _id: '68L5xVV9wydotfDXEik7eD'
    },
    duration: 181200,
    url: 'youtube/song.mp4',
    imgUrl: 'https://i.scdn.co/image/ab67616d00001e02d370fdc4dbc47778b9b667c3',
    likedBy: [],
    addedAt: 162521765262,
  }
  saveToStorage(SONG_STORAGE_KEY, currentSong)
}

function _createDemoSongs() {
  let demoSongs = JSON.parse(localStorage.getItem('demo-songs'))
  if (demoSongs) return

  demoSongs = [
    {
      "id": "2PSo26j5LkdGu18mYM2ZdT",
      "name": "What's Going On",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "On The Boards",
        "_id": "6UP7rSugk9wAcMYnqZ6Ti8"
      },
      "duration": 166466,
      "url": "spotify:track:2PSo26j5LkdGu18mYM2ZdT",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b2733a3aea980c768276d923b09a",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "6fGTwrORSxE6rmX9OzQNbN",
      "name": "Blister On The Moon",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "Taste",
        "_id": "4KJWhNB66Jr4syDJNu9fzc"
      },
      "duration": 204893,
      "url": "spotify:track:6fGTwrORSxE6rmX9OzQNbN",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273cf3d2a9d6312bc639f1c448b",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "71ZgxJIApKmssV44AD1Zva",
      "name": "A Taste Of Honey",
      "artists": [
        {
          "name": "Lionel Hampton",
          "_id": "2PjgZkwAEk7UTin4jP6HLP"
        }
      ],
      "album": {
        "name": "You Better Know It!!!",
        "_id": "6uGX7ozBLgPKWwKEhxm5pV"
      },
      "duration": 164373,
      "url": "spotify:track:71ZgxJIApKmssV44AD1Zva",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273373e4b2cddd71d23552f1298",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "0T7D44xh8oCPLYDfi8HIo7",
      "name": "Railway And Gun",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "On The Boards",
        "_id": "6UP7rSugk9wAcMYnqZ6Ti8"
      },
      "duration": 216426,
      "url": "spotify:track:0T7D44xh8oCPLYDfi8HIo7",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b2733a3aea980c768276d923b09a",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "2pZdwyEyT6o1hZoKZJj2wp",
      "name": "If The Day Was Any Longer",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "On The Boards",
        "_id": "6UP7rSugk9wAcMYnqZ6Ti8"
      },
      "duration": 128066,
      "url": "spotify:track:2pZdwyEyT6o1hZoKZJj2wp",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b2733a3aea980c768276d923b09a",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "5I46WStI64aYqzmT4ZtK6m",
      "name": "I'm Moving On",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "Taste",
        "_id": "4KJWhNB66Jr4syDJNu9fzc"
      },
      "duration": 148373,
      "url": "spotify:track:5I46WStI64aYqzmT4ZtK6m",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273cf3d2a9d6312bc639f1c448b",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "3eaT8cDhFb7ng9nbDSFX8R",
      "name": "Same Old Story",
      "artists": [
        {
          "name": "Taste",
          "_id": "4Se7TFuKKQVCzttyri6bg3"
        }
      ],
      "album": {
        "name": "Taste",
        "_id": "4KJWhNB66Jr4syDJNu9fzc"
      },
      "duration": 211066,
      "url": "spotify:track:3eaT8cDhFb7ng9nbDSFX8R",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273cf3d2a9d6312bc639f1c448b",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "07NrCEN3egNvw8td2LxqJO",
      "name": "Boogie Oogie Oogie - Remastered 2004",
      "artists": [
        {
          "name": "A Taste Of Honey",
          "_id": "1ii6e2pv8VIRwnTER71rMl"
        }
      ],
      "album": {
        "name": "A Taste Of Honey",
        "_id": "4QJA3YXQdpLhuIztkSgrpo"
      },
      "duration": 338320,
      "url": "spotify:track:07NrCEN3egNvw8td2LxqJO",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b2731da1b4064fc8eb0d2a65dc97",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "6xqLmU9xdVcK7q4O7ccjLB",
      "name": "Sweet Lady - Bonus Track",
      "artists": [
        {
          "name": "Taste Nate",
          "_id": "3GuvJo4WPujuiIU3GoTnFD"
        },
        {
          "name": "Lord Lorenz",
          "_id": "3qVag8oPA3Nu6CyqwoScn2"
        }
      ],
      "album": {
        "name": "Hearticle of Poetry (Remastered 2024)",
        "_id": "0NbOUnCXQna2ChUBZW7y9k"
      },
      "duration": 240923,
      "url": "spotify:track:6xqLmU9xdVcK7q4O7ccjLB",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273a50f37e920ca9be6ac3d7107",
      "likedBy": [],
      "addedAt": 1699574400000
    },
    {
      "id": "5zZ3ObobIeeHCsoCW8WctN",
      "name": "Those Shoes - Bonus Track",
      "artists": [
        {
          "name": "Taste Nate",
          "_id": "3GuvJo4WPujuiIU3GoTnFD"
        },
        {
          "name": "Lord Lorenz",
          "_id": "3qVag8oPA3Nu6CyqwoScn2"
        }
      ],
      "album": {
        "name": "Hearticle of Poetry (Remastered 2024)",
        "_id": "0NbOUnCXQna2ChUBZW7y9k"
      },
      "duration": 89970,
      "url": "spotify:track:5zZ3ObobIeeHCsoCW8WctN",
      "imgUrl": "https://i.scdn.co/image/ab67616d0000b273a50f37e920ca9be6ac3d7107",
      "likedBy": [],
      "addedAt": 1699574400000
    }
  ]
  saveToStorage('demo-songs', demoSongs)
}

function getSongs(idx) {
  return JSON.parse(localStorage.getItem('demo-songs'))
}

function getSong(songId) {
  let demoSongs = JSON.parse(localStorage.getItem('demo-songs'))
  return demoSongs.find(song => song.id === songId)
}