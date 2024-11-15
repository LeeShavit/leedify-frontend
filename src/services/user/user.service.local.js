import { LucideCloudLightning } from 'lucide-react'
import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USERS = 'users'

async function initialize() {
  try {
    console.log('Starting initialization')
    const loggedInUser = getLoggedinUser()

    if (!loggedInUser) {
      console.log('No logged in user, creating demo user')
      const demoUser = await _createDemoUser()
      console.log('Created demo user:', demoUser)

      if (demoUser) {
        console.log('Attempting to log in demo user')
        const loginResult = await login({
          username: 'guest',
          password: 'guest',
        })
        console.log('Demo user logged in:', loginResult)
        return loginResult
      }
    }

    return loggedInUser
  } catch (err) {
    console.error('Failed to initialize:', err)
    throw err
  }
}

initialize()
// _createDemoUser()

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

function remove(userId) {
  return storageService.remove(STORAGE_KEY_USERS, userId)
}

async function update({ _id }) {
  const user = await storageService.get(STORAGE_KEY_USERS, _id)
  user.score = score
  await storageService.put(STORAGE_KEY_USERS, user)

  const loggedinUser = getLoggedinUser()
  if (loggedinUser._id === user._id) saveLoggedinUser(user)

  return user
}

async function login(userCred) {
  try {
    const users = await storageService.query(STORAGE_KEY_USERS)
    console.log('users in login:', users)

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
    return saveLoggedinUser(user)
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

async function _createDemoUser() {
  try {
    const users = await storageService.query(STORAGE_KEY_USERS)
    console.log('Existing users:', users)

    if (users.length) {
      console.log('Users already exist, returning')
      return users[0]
    }

    const user = {
      username: 'guest',
      password: 'guest',
      name: 'guest User',
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
    }

    const newUser = await storageService.post(STORAGE_KEY_USERS, user)
    console.log('New demo user created:', newUser)
    return newUser
  } catch (err) {
    console.error('Failed to create demo user:', err)
    throw err
  }
}
