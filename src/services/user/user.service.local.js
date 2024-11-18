import { storageService } from '../async-storage.service'
import { stationService } from '../station'
import { saveToStorage } from '../util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USERS = 'users'

_createDemoUsers()

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  getLoggedinUser,
  saveLoggedinUser,

  getUsersStations,
  likeSong,
  dislikeSong,
  likeStation,
  dislikeStation,
  updateUsersLikedStation,
  loginWithGoogle,
}

async function getUsers() {
  const users = await storageService.query(STORAGE_KEY_USERS)
  return users.map((user) => {
    delete user.password
    return user
  })
}

async function getById(userId) {
  return await storageService.get(STORAGE_KEY_USERS, userId)
}

async function getUsersStations() {
  const loggedinUser = getLoggedinUser()
  const { likedStations } = await storageService.get(STORAGE_KEY_USERS, loggedinUser._id)
  const stations = Promise.all(
    likedStations.map((likedStation) => {
      return stationService.getById(likedStation._id).then((station) => {
        return {
          _id: station._id,
          name: station.name,
          imgUrl: station.imgUrl,
          createdBy: station.createdBy,
          addedAt: likedStation.addedAt,
        }
      })
    })
  )
  return stations
}

function remove(userId) {
  return storageService.remove(STORAGE_KEY_USERS, userId)
}

async function update(user) {
  const updatedUser = await storageService.put(STORAGE_KEY_USERS, user)

  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === updatedUser._id) saveLoggedinUser(updatedUser)

  return updatedUser
}

async function login(userCred) {
  try {
    const users = await storageService.query(STORAGE_KEY_USERS)
    console.log('users in login:', users) // Debug log

    if (!users) users = await _createDemoUsers()

    const user = users.find((user) => user.username === userCred.username && user.password === userCred.password)

    if (!user) throw new Error('Invalid username or password')

    const validUser = {
      _id: user._id,
      name: user.name || user.username,
      username: user.username,
      password: user.password,
      imgUrl: user.imgUrl,
      likedSongs: user.likedSongs || [],
      likedStations: user.likedStations || [],
    }

    const savedUser = saveLoggedinUser(validUser)
    console.log('logged in user:', savedUser)
    return savedUser
  } catch (err) {
    console.error('Could not login:', err)
    throw err
  }
}

async function loginWithGoogle(googleUser) {
  try {
    const users = await storageService.query(STORAGE_KEY_USERS)
    let user = users.find((u) => u._id === googleUser._id)

    if (!user) {
      user = await storageService.post(STORAGE_KEY_USERS, googleUser)
    }

    return saveLoggedinUser(user)
  } catch (err) {
    console.error('Could not login with Google:', err)
    throw err
  }
}

async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
  const user = JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
  console.log('user', user)
  return user
}

async function signup(userCred) {
  const userToSave = {
    _id: '',
    name: userCred.name || userCred.username,
    username: userCred.username,
    password: userCred.password,
    email: userCred.email,
    imgUrl: userCred.imgUrl || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
    likedSongs: [],
    likedStations: [],
  }

  try {
    const user = await storageService.post(STORAGE_KEY_USERS, userToSave)
    user.likedSongs = _getDemoSongs()
    user.likedStations = await _getDemoStationsForNewUser(user._id, user.name, user.imgUrl)
    const updatedUser = await update(user)
    return saveLoggedinUser(updatedUser)
  } catch (err) {
    console.error('Could not signup:', err)
    throw err
  }
}

function saveLoggedinUser(user) {
  const userToSave = {
    _id: user._id,
    name: user.name,
    username: user.username,
    imgUrl: user.imgUrl,
    likedSongs: user.likedSongs || [],
    likedStations: user.likedStations || [],
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
  return userToSave
}

async function likeStation(station) {
  try {
    const { _id } = getLoggedinUser()
    if (!_id) throw new Error(`User not loggedIn found`)

    const user = await getById(_id)
    if (!user) throw new Error(`User not found`)

    const stationToAdd = {
      _id: station._id,
      name: station.name,
      imgUrl: station.imgUrl,
      createdBy: station.createdBy.name,
      songsCount: station.songs.length,
      addedAt: Date.now(),
    }

    user.likedStations.push(stationToAdd)
    await storageService.put(STORAGE_KEY_USERS, user)
    saveLoggedinUser(user)
    return stationToAdd
  } catch (err) {
    console.error("user service - couldn't add song from liked songs", err)
    throw err
  }
}

async function dislikeStation(stationId) {
  try {
    const { _id } = getLoggedinUser()
    if (!_id) throw new Error(`User not loggedIn found`)

    const user = await getById(_id)
    if (!user) throw new Error(`User not found`)

    const stationIdx = user.likedStations.findIndex((likedStation) => likedStation._id === stationId)
    if (stationIdx === -1) return user.likedStations

    user.likedStations.splice(stationIdx, 1)
    await storageService.put(STORAGE_KEY_USERS, user)
    saveLoggedinUser(user)
    return user.likedStations
  } catch (err) {
    console.error("user service - couldn't add station from liked songs", err)
    throw err
  }
}
async function likeSong(songToLike) {
  try {
    const { _id } = getLoggedinUser()
    if (!_id) throw new Error(`User not loggedIn found`)

    const user = await getById(_id)
    if (!user) throw new Error(`User not found`)

    songToLike = {
      ...songToLike,
      LikedAt: Date.now(),
    }
    if (user.likedSongs.some((song) => song._id === songToLike._id)) return user.likedSongs

    user.likedSongs.push(songToLike)
    await storageService.put(STORAGE_KEY_USERS, user)
    saveLoggedinUser(user)

    return user.likedSongs
  } catch (err) {
    console.error("user service - couldn't add song from liked songs", err)
    throw err
  }
}

async function dislikeSong(songId) {
  try {
    const { _id } = getLoggedinUser()
    if (!_id) throw new Error(`User not loggedIn found`)

    const user = await getById(_id)
    if (!user) throw new Error(`User not found`)

    const songIdx = user.likedSongs.findIndex((song) => song._id === songId)
    if (songIdx === -1) return user.likedSongs

    user.likedSongs.splice(songIdx, 1)
    await storageService.put(STORAGE_KEY_USERS, user)
    saveLoggedinUser(user)
    return user.likedSongs
  } catch (err) {
    console.error("user service - couldn't remove song from liked songs", err)
    throw err
  }
}

async function updateUsersLikedStation(station) {
  try {
    const { _id } = getLoggedinUser()
    if (!_id) throw new Error(`User not loggedIn found`)
    const user = await getById(_id)
    if (!user) throw new Error(`User not found`)

    const stationIdx = user.likedStations.findIndex((likedStation) => likedStation._id === station._id)

    user.likedStations[stationIdx] = {
      ...user.likedStations[stationIdx],
      name: station.name,
      imgUrl: station.imgUrl,
      songsCount: station.songs.length,
    }

    await storageService.put(STORAGE_KEY, user)
    return user.likedStations
  } catch (err) {
    console.error("station service - couldn't save station", err)
    throw err
  }
}

async function _createDemoUsers() {
  try {
    let users = await storageService.query(STORAGE_KEY_USERS)
    console.log('Existing users:', users)

    if (users.length > 0) return users

    users = [
      {
        _id: '673747e44f46d732f3578f0a',
        username: 'guest',
        password: 'guest123',
        name: 'Guest User',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        likedSongs: [
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
        ],
        likedStations: [
          {
            _id: '5Rjx8Pa0tyNSgkXMyINBAS',
            name: 'Pink Floyd Essentials',
            imgUrl: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
            createdBy: 'Admin',
            songCount: 7,
            addedAt: 1696789200000,
          },
          {
            _id: '37i9dQZF1DXbLMw3ry7d7k',
            name: 'Latin Hits',
            imgUrl: 'https://i.scdn.co/image/ab67616d0000b273491678beaffcefac517a699e',
            createdBy: 'Admin',
            songCount: 7,
            addedAt: 1698624000000,
          },
        ],
      },
      {
        _id: '6734ad1b80e09674b9b8e09b',
        name: 'Lee Shavit',
        username: 'lee',
        password: 'lee123',
        likedSongs: [
          {
            _id: '1CsMKhwEmNnmvHUuO5nryA',
            name: 'SKINNY',
            artists: [
              {
                name: 'Billie Eilish',
                _id: '6qqNVTkY8uBg9cP3Jd7DAH',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485171d62ea7ea8a5be92d3c1f62',
                width: 64,
              },
            ],
            duration: 219733,
            album: {
              name: 'HIT ME HARD AND SOFT',
              _id: '7aJuG4TFXa2hmE4z1yxc3n',
            },
            youtubeId: '',
          },
          {
            _id: '19kHhX6f6EfLU7rcO3RqjO',
            name: 'Back On 74',
            artists: [
              {
                name: 'Jungle',
                _id: '59oA5WbbQvomJz2BuRG071',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27377619f14cb03e11baf5761d1',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0277619f14cb03e11baf5761d1',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485177619f14cb03e11baf5761d1',
                width: 64,
              },
            ],
            duration: 209482,
            album: {
              name: 'Volcano',
              _id: '5xnXOCf5aZgZ43DgGN4EDv',
            },
            youtubeId: '',
          },
          {
            _id: '6TGd66r0nlPaYm3KIoI7ET',
            name: 'THE GREATEST',
            artists: [
              {
                name: 'Billie Eilish',
                _id: '6qqNVTkY8uBg9cP3Jd7DAH',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485171d62ea7ea8a5be92d3c1f62',
                width: 64,
              },
            ],
            duration: 293840,
            album: {
              name: 'HIT ME HARD AND SOFT',
              _id: '7aJuG4TFXa2hmE4z1yxc3n',
            },
            youtubeId: '',
          },
          {
            _id: '629DixmZGHc7ILtEntuiWE',
            name: 'LUNCH',
            artists: [
              {
                name: 'Billie Eilish',
                _id: '6qqNVTkY8uBg9cP3Jd7DAH',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485171d62ea7ea8a5be92d3c1f62',
                width: 64,
              },
            ],
            duration: 179586,
            album: {
              name: 'HIT ME HARD AND SOFT',
              _id: '7aJuG4TFXa2hmE4z1yxc3n',
            },
            youtubeId: '',
          },
          {
            _id: '1GGpgUDxD5bjEq0OSEDTvc',
            name: 'No Vas a Encontrar',
            artists: [
              {
                name: 'Jalil Lopez',
                _id: '1lE4AVltTIHnpsWVdN58jN',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273c3979196aec7c62ab34d0f5f',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02c3979196aec7c62ab34d0f5f',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851c3979196aec7c62ab34d0f5f',
                width: 64,
              },
            ],
            duration: 192253,
            album: {
              name: 'No Vas a Encontrar',
              _id: '7LEOqYU7W9dFTLwq7xoBd0',
            },
            youtubeId: '',
          },
          {
            _id: '4tKGFmENO69tZR9ahgZu48',
            name: 'Murder On The Dancefloor',
            artists: [
              {
                name: 'Sophie Ellis-Bextor',
                _id: '2cBh5lVMg222FFuRU7EfDE',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273b736151ed1c04f2d41d5f69e',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02b736151ed1c04f2d41d5f69e',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851b736151ed1c04f2d41d5f69e',
                width: 64,
              },
            ],
            duration: 230013,
            album: {
              name: 'Read My Lips (Deluxe Version)',
              _id: '68ishLKwqH5oH79kUteEHG',
            },
            youtubeId: '',
          },
          {
            _id: '7DpUoxGSdlDHfqCYj0otzU',
            name: 'BITTERSUITE',
            artists: [
              {
                name: 'Billie Eilish',
                _id: '6qqNVTkY8uBg9cP3Jd7DAH',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485171d62ea7ea8a5be92d3c1f62',
                width: 64,
              },
            ],
            duration: 298440,
            album: {
              name: 'HIT ME HARD AND SOFT',
              _id: '7aJuG4TFXa2hmE4z1yxc3n',
            },
            youtubeId: '',
          },
          {
            _id: '1ACA277B6f46DYCgZW8di3',
            name: "if u think i'm pretty",
            artists: [
              {
                name: 'Artemas',
                _id: '0PCCGZ0wGLizHt2KZ7hhA2',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273fabe0943f6dd962a792b42a1',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02fabe0943f6dd962a792b42a1',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851fabe0943f6dd962a792b42a1',
                width: 64,
              },
            ],
            duration: 128205,
            album: {
              name: 'pretty',
              _id: '2xpgb8R0BXVS2e1XnXI9xZ',
            },
            youtubeId: '',
          },
          {
            _id: '43iIQbw5hx986dUEZbr3eN',
            name: 'From The Start',
            artists: [
              {
                name: 'Laufey',
                _id: '7gW0r5CkdEUMm42w9XpyZO',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27374c732f8aa0e0ccbb3d17d96',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0274c732f8aa0e0ccbb3d17d96',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485174c732f8aa0e0ccbb3d17d96',
                width: 64,
              },
            ],
            duration: 169573,
            album: {
              name: 'Bewitched',
              _id: '1rpCHilZQkw84A3Y9czvMO',
            },
            youtubeId: '',
          },
          {
            _id: '7j3zZ2jAjzFD60UjhldhHo',
            name: "I've Been In Love",
            artists: [
              {
                name: 'Jungle',
                _id: '59oA5WbbQvomJz2BuRG071',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27377619f14cb03e11baf5761d1',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0277619f14cb03e11baf5761d1',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485177619f14cb03e11baf5761d1',
                width: 64,
              },
            ],
            duration: 169472,
            album: {
              name: 'Volcano',
              _id: '5xnXOCf5aZgZ43DgGN4EDv',
            },
            youtubeId: '',
          },
          {
            _id: '3QaPy1KgI7nu9FJEQUgn6h',
            name: 'WILDFLOWER',
            artists: [
              {
                name: 'Billie Eilish',
                _id: '6qqNVTkY8uBg9cP3Jd7DAH',
              },
            ],
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0271d62ea7ea8a5be92d3c1f62',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485171d62ea7ea8a5be92d3c1f62',
                width: 64,
              },
            ],
            duration: 261466,
            album: {
              name: 'HIT ME HARD AND SOFT',
              _id: '7aJuG4TFXa2hmE4z1yxc3n',
            },
            youtubeId: '',
          },
        ],
        likedStations: [
          {
            _id: '3KG8kwO0epkgTLFGEpTf9h',
            name: 'Remastered hits of the 80s',
            imgUrl: [
              {
                height: 640,
                url: 'https://mosaic.scdn.co/640/ab67616d0000b2732f124b6b8b940e378b41c1d1ab67616d0000b273a7865e686c36a4adda6c9978ab67616d0000b273b414c63fb435b622238c15edab67616d0000b273e2e8f804c2cdd5b3815adbf9',
                width: 640,
              },
              {
                height: 300,
                url: 'https://mosaic.scdn.co/300/ab67616d0000b2732f124b6b8b940e378b41c1d1ab67616d0000b273a7865e686c36a4adda6c9978ab67616d0000b273b414c63fb435b622238c15edab67616d0000b273e2e8f804c2cdd5b3815adbf9',
                width: 300,
              },
              {
                height: 60,
                url: 'https://mosaic.scdn.co/60/ab67616d0000b2732f124b6b8b940e378b41c1d1ab67616d0000b273a7865e686c36a4adda6c9978ab67616d0000b273b414c63fb435b622238c15edab67616d0000b273e2e8f804c2cdd5b3815adbf9',
                width: 60,
              },
            ],
            createdBy: {
              _id: '6734ad1b80e09674b9b8e09b',
              name: 'Lee Shavit',
              imgUrl: null,
            },
            songCount: 369,
            addedAt: '2024-03-15T09:23:12Z',
          },
          {
            _id: '4HrvOxnSDAJ9ZdxqmiuNM4',
            name: 'Remastered',
            imgUrl: [
              {
                height: null,
                url: 'https://image-cdn-fa.spotifycdn.com/image/ab67706c0000bebbe7d19999e77cb33d22533259',
                width: null,
              },
            ],
            createdBy: {
              _id: '6734ad1b80e09674b9b8e09b',
              name: 'Lee Shavit',
              imgUrl: null,
            },
            songCount: 220,
            addedAt: '2023-08-22T14:45:30Z',
          },
          {
            _id: '37i9dQZF1E8PQHa6zKqm86',
            name: '1979 - Remastered 2012 Radio',
            imgUrl: [
              {
                height: null,
                url: 'https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/radio/track/5QLHGv0DfpeXLNFo7SFEy1/en',
                width: null,
              },
            ],
            createdBy: {
              _id: '6734ad1b80e09674b9b8e09b',
              name: 'Lee Shavit',
              imgUrl: null,
            },
            songCount: 50,
            addedAt: '2023-11-30T18:12:45Z',
          },
          {
            _id: '37i9dQZF1E8zUAqMx5LMW6',
            name: 'Today - 2011 Remaster Radio',
            imgUrl: [
              {
                height: null,
                url: 'https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/radio/track/0u5aO1GYsIhAWCPuXdwnak/en',
                width: null,
              },
            ],
            createdBy: {
              _id: '6734ad1b80e09674b9b8e09b',
              name: 'Lee Shavit',
              imgUrl: null,
            },
            songCount: 50,
            addedAt: '2024-01-05T11:34:22Z',
          },
          {
            _id: '37i9dQZF1E8IG3MWt4dEsJ',
            name: 'Dreams - 2004 Remaster Radio',
            imgUrl: [
              {
                height: null,
                url: 'https://pickasso.spotifycdn.com/image/ab67c0de0000deef/dt/v1/img/radio/track/0ofHAoxe9vBkTCp2UQIavz/en',
                width: null,
              },
            ],
            createdBy: {
              _id: '6734ad1b80e09674b9b8e09b',
              name: 'Lee Shavit',
              imgUrl: null,
            },
            songCount: 50,
            addedAt: '2023-07-12T08:55:15Z',
          },
        ],
      },
      {
        name: 'lidor nissim',
        username: 'lidor',
        password: '$2b$10$BJhCeVm/18qCbzGBqWIFW.WOI7fufI/xUbVRdqt.RH8BcZpXph2u6',
        likedSongs: [
          {
            _id: '7ne4VBA60CxGM75vw0EYad',
            name: "That's So True",
            artists: {
              name: 'Gracie Abrams',
              _id: '4tuJ0bMpJh08umKkEXKUI5',
            },
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b2731dac3694b3289cd903cb3acf',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e021dac3694b3289cd903cb3acf',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d000048511dac3694b3289cd903cb3acf',
                width: 64,
              },
            ],
            duration: 166300,
            album: {
              name: 'The Secret of Us (Deluxe)',
              _id: '0hBRqPYPXhr1RkTDG3n4Mk',
            },
            youtubeId: '',
          },
          {
            _id: '2plbrEY59IikOBgBGLjaoe',
            name: 'Die With A Smile',
            artists: {
              name: 'Lady Gaga',
              _id: '1HY2Jd0NmPuamShAr6KMms',
            },
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e0282ea2e9e1858aa012c57cd45',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d0000485182ea2e9e1858aa012c57cd45',
                width: 64,
              },
            ],
            duration: 251667,
            album: {
              name: 'Die With A Smile',
              _id: '10FLjwfpbxLmW8c25Xyc2N',
            },
            youtubeId: '',
          },
          {
            _id: '1d7Ptw3qYcfpdLNL5REhtJ',
            name: 'Taste',
            artists: {
              name: 'Sabrina Carpenter',
              _id: '74KM79TiuVKeVCqs8QtB0B',
            },
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b2735e1ec3f6b114e4e4924f006f',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e025e1ec3f6b114e4e4924f006f',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d000048515e1ec3f6b114e4e4924f006f',
                width: 64,
              },
            ],
            duration: 157279,
            album: {
              name: "Short n' Sweet",
              _id: '4B4Elma4nNDUyl6D5PvQkj',
            },
            youtubeId: '',
          },
          {
            _id: '5vNRhkKd0yEAg8suGBpjeY',
            name: 'APT.',
            artists: {
              name: 'ROSÉ',
              _id: '3eVa5w3URK5duf6eyVDbu9',
            },
            imgUrl: [
              {
                height: 640,
                url: 'https://i.scdn.co/image/ab67616d0000b273f8c8297efc6022534f1357e1',
                width: 640,
              },
              {
                height: 300,
                url: 'https://i.scdn.co/image/ab67616d00001e02f8c8297efc6022534f1357e1',
                width: 300,
              },
              {
                height: 64,
                url: 'https://i.scdn.co/image/ab67616d00004851f8c8297efc6022534f1357e1',
                width: 64,
              },
            ],
            duration: 169917,
            album: {
              name: 'APT.',
              _id: '2IYQwwgxgOIn7t3iF6ufFD',
            },
            youtubeId: '',
          },
        ],
        likedStations: [],
      },
    ]

    saveToStorage(STORAGE_KEY_USERS, users)
    console.log('New demo users created:', users)
    return users
  } catch (err) {
    console.error('Failed to create demo user:', err)
    throw err
  }
}

function _getDemoSongs() {
  return [
    {
      _id: '3Z2tPWiNiIpg8UMMoowHIk',
      name: 'We Are The World',
      artists: [
        {
          name: 'U.S.A. For Africa',
          _id: '7sF6m3PpW6G6m6J2gzzmzM',
        },
      ],
      album: {
        name: 'We Are The World',
        _id: '2O6gXGWFJcNrLYAqDINrDa',
      },
      duration: 427333,
      imgUrl: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b273920f421260033ee54865d673',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e02920f421260033ee54865d673',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/ab67616d00004851920f421260033ee54865d673',
          width: 64,
        },
      ],
      addedAt: 1731851718157,
      youtubeId: '',
    },
    {
      _id: '4PTG3Z6ehGkBFwjybzWkR8',
      name: 'Never Gonna Give You Up',
      artists: [
        {
          name: 'Rick Astley',
          _id: '0gxyHStUsqpMadRV0Di1Qt',
        },
      ],
      album: {
        name: 'Whenever You Need Somebody',
        _id: '6eUW0wxWtzkFdaEFsTJto6',
      },
      duration: 213573,
      imgUrl: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b27315ebbedaacef61af244262a8',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e0215ebbedaacef61af244262a8',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/ab67616d0000485115ebbedaacef61af244262a8',
          width: 64,
        },
      ],
      addedAt: 1731851930306,
      youtubeId: '',
    },
    {
      _id: '7JkZ2hQdDonRURJjlMuh8q',
      name: 'What Is Love - 7" Mix',
      artists: [
        {
          name: 'Haddaway',
          _id: '0Suv0tRrNrUlRzAy8aXjma',
        },
      ],
      album: {
        name: 'What Is Love',
        _id: '5IrMfIT621GidGPuOSRTB4',
      },
      duration: 270373,
      imgUrl: [
        {
          height: 640,
          url: 'https://i.scdn.co/image/ab67616d0000b2739c783e96159db6857816809e',
          width: 640,
        },
        {
          height: 300,
          url: 'https://i.scdn.co/image/ab67616d00001e029c783e96159db6857816809e',
          width: 300,
        },
        {
          height: 64,
          url: 'https://i.scdn.co/image/ab67616d000048519c783e96159db6857816809e',
          width: 64,
        },
      ],
      addedAt: 1731851942001,
      youtubeId: '',
    },
  ]
}

async function _getDemoStationsForNewUser(_id, name, imgUrl) {
  let station1 = {
    name: 'Happy songs',
    imgUrl: 'https://res.cloudinary.com/dsymwlagn/image/upload/v1731852449/uus7rijw5s7npwhjjehl.jpg',
    createdBy: { name, _id, imgUrl },
    tags: [],
    description: '',
    songCount: 3,
    likedByUsers: [],
    addedAt: 1696789200000,
    songs: [
      {
        _id: '0bRXwKfigvpKZUurwqAlEh',
        name: 'Lovely Day',
        artists: [
          {
            name: 'Bill Withers',
            _id: '1ThoqLcyIYvZn7iWbj8fsj',
          },
        ],
        album: {
          name: 'Menagerie',
          _id: '3QjPTUI6UcPr5m9RujkO3c',
        },
        duration: 254560,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b2735ade9b4d547203c9061fc340',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e025ade9b4d547203c9061fc340',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d000048515ade9b4d547203c9061fc340',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853016255,
        youtubeId: '',
      },
      {
        _id: '2hKdd3qO7cWr2Jo0Bcs0MA',
        name: 'Drops of Jupiter (Tell Me)',
        artists: [
          {
            name: 'Train',
            _id: '3FUY2gzHeIiaesXtOAdB7A',
          },
        ],
        album: {
          name: 'Drops Of Jupiter',
          _id: '6j6Zgm7vzAZegr48UppFVT',
        },
        duration: 259933,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b273a65df73c4011b6a9357c89f0',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e02a65df73c4011b6a9357c89f0',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00004851a65df73c4011b6a9357c89f0',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853027080,
        youtubeId: '',
      },
      {
        _id: '2M9ro2krNb7nr7HSprkEgo',
        name: 'Fast Car',
        artists: [
          {
            name: 'Tracy Chapman',
            _id: '7oPgCQqMMXEXrNau5vxYZP',
          },
        ],
        album: {
          name: 'Tracy Chapman',
          _id: '6hmmX5UP4rIvOpGSaPerV8',
        },
        duration: 296800,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b27390b8a540137ee2a718a369f9',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e0290b8a540137ee2a718a369f9',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d0000485190b8a540137ee2a718a369f9',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853030328,
        youtubeId: '',
      },
    ],
  }
  station1 = await stationService.post(station1)
  let station2 = {
    name: 'My Party Favs',
    imgUrl: 'https://res.cloudinary.com/dsymwlagn/image/upload/t_ddd/c5qjnleiu7oorke7zqfw.jpg',
    createdBy: { name, _id, imgUrl },
    tags: [],
    description: '',
    songCount: 7,
    addedAt: 1698624000000,
    songs: [
      {
        _id: '0HPD5WQqrq7wPWR7P7Dw1i',
        name: 'TiK ToK',
        artists: [
          {
            name: 'Kesha',
            _id: '6LqNN22kT3074XbTVUrhzX',
          },
        ],
        album: {
          name: 'Animal',
          _id: '4Fts9DL8sj5UQ0TkN4SvMK',
        },
        duration: 199693,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b27365836b344b9d983462d5f1a7',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e0265836b344b9d983462d5f1a7',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d0000485165836b344b9d983462d5f1a7',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853045580,
        youtubeId: '',
      },
      {
        _id: '2CEgGE6aESpnmtfiZwYlbV',
        name: 'Dynamite',
        artists: [
          {
            name: 'Taio Cruz',
            _id: '6MF9fzBmfXghAz953czmBC',
          },
        ],
        album: {
          name: 'The Rokstarr Hits Collection',
          _id: '0eGvq1J5Ke7VlLLOYIlY4k',
        },
        duration: 202613,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b27366c3eb32692a0ae487079cf1',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e0266c3eb32692a0ae487079cf1',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d0000485166c3eb32692a0ae487079cf1',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853047178,
        youtubeId: '',
      },
      {
        _id: '0nrRP2bk19rLc0orkWPQk2',
        name: 'Wake Me Up',
        artists: [
          {
            name: 'Avicii',
            _id: '1vCWHaC5f2uS3yhpwWbIA6',
          },
        ],
        album: {
          name: 'True',
          _id: '2H6i2CrWgXE1HookLu8Au0',
        },
        duration: 247426,
        imgUrl: [
          {
            url: 'https://i.scdn.co/image/ab67616d0000b273e14f11f796cef9f9a82691a7',
            width: 640,
            height: 640,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00001e02e14f11f796cef9f9a82691a7',
            width: 300,
            height: 300,
          },
          {
            url: 'https://i.scdn.co/image/ab67616d00004851e14f11f796cef9f9a82691a7',
            width: 64,
            height: 64,
          },
        ],
        addedAt: 1731853052088,
        youtubeId: '',
      },
    ],
  }
  station2 = await stationService.post(station2)
  return [
    {
      _id: station1._id,
      name: station1.name,
      imgUrl: station1.imgUrl,
      createdBy: station1.createdBy,
      songCount: station1.songCount,
      addedAt: station1.addedAt,
    },
    {
      _id: station2._id,
      name: station2.name,
      imgUrl: station2.imgUrl,
      createdBy: station2.createdBy,
      songCount: station2.songCount,
      addedAt: station2.addedAt,
    },
  ]
}
