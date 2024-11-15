import { Password } from '@mui/icons-material'
import { httpService } from '../http.service'
import { User2Icon } from 'lucide-react'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

initialize()

async function initialize() {
	const loggedInUser = getLoggedinUser()
	if (!loggedInUser) {
	  await login({ username: 'guest', password:'guest123' })
	}
  }

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
}

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await httpService.put(`user/${_id}`, { _id, score })

	// When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser() // Might not work because its defined in the main service???
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

	return user
}

async function likeSong(song) {
	const user= await httpService.post('user/song',song)
	return user.likedSongs
}

async function dislikeSong(songId) {
	const user= await httpService.delete(`user/song/${songId}`)
	return user.likedSongs
}

async function likeStation(station) {
	const user= await httpService.post('user/station',station)
	return user.likeStations
}

async function dislikeStation(stationId) {
	const user= await httpService.delete(`user/station/${stationId}`)
	return user.likeStations
}


async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
	if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

async function getLoggedinUser() {
    const {_id}= JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
	const user= await getById(_id)
	return user
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
        name: user.name, 
        imgUrl: user.imgUrl, 
        likedSongs: user.likedSongs, 
        likeStations: user.likedStations 
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}
