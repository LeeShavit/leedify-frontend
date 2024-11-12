import { storageService } from '../async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USERS = 'users'

_createDemoUser()

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
}

async function getUsers() {
    const users = await storageService.query(STORAGE_KEY_USERS)
    return users.map(user => {
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

    // When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query(STORAGE_KEY_USERS)
    const user = users.find(user => user.username === userCred.username)
    console.log(userCred)
    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await storageService.post(STORAGE_KEY_USERS, userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        name: user.name,
        imgUrl: user.imgUrl,
        likedSongs: user.likedSongs,
        likedStations: user.likedStations,
        createdStations: user.createdStations
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

async function likeSong(songToLike) {
    try {
        const {_id} = getLoggedinUser()
        if (!_id) throw new Error(`User not loggedIn found`)
        
        const user= await getById(_id)
        if (!user) throw new Error(`User not found`)

        songToLike = {
            ...songToLike,
            LikedAt: Date.now(),
        }
        if (user.likedSongs.some(song => song.id === songToLike.id)) return user.likedSongs

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
        const {_id} = getLoggedinUser()
        if (!_id) throw new Error(`User not loggedIn found`)

        const user = await getById(_id)
        if (!user) throw new Error(`User not found`)

        const songIdx = user.likedSongs.findIndex((song) => song.id === songId)
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

async function _createDemoUser() {
    const users = await storageService.query(STORAGE_KEY_USERS)
    if (users.length) return

    const user = {
        username: 'guest',
        password: 'guest',
        name: 'Guest User',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        likedSongs: [{
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
        likedStations: [],
        createdStations: []
    }

    const newUser = await storageService.post(STORAGE_KEY_USERS, user)
    login({ username: newUser.username })
}