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

	getUsersStations,
	likeSong,
	dislikeSong,
	likeStation,
	dislikeStation,
	updateUsersLikedStation,
}

//crudl

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

async function update(user) {
	const updatedUser = await httpService.put(`user/${_id}`, user)

    const loggedinUser = getLoggedinUser() 
    if (loggedinUser._id === updatedUser._id) saveLoggedinUser(updatedUser)
	return user
}

async function likeSong(song) {
	const user= await httpService.post('user/song',song)
	saveLoggedinUser(user)
	return user.likedSongs
}

async function dislikeSong(songId) {
	const user= await httpService.delete(`user/song/${songId}`)
	saveLoggedinUser(user)
	return user.likedSongs
}

async function getUsersStations() {
	const {_id} = getLoggedinUser() 
	const stations = await httpService.get(`user/${_id}/station`)
	return stations
  }

async function likeStation(station) {
	const user= await httpService.post('user/station',station)
	saveLoggedinUser(user)
	return user.likedStations
}

async function dislikeStation(stationId) {
	const user= await httpService.delete(`user/station/${stationId}`)
	saveLoggedinUser(user)
	return user.likedStations
}

async function updateUsersLikedStation(station){
	const user= await httpService.put('user/station',station)
	saveLoggedinUser(user)
	return user.likedStations
}

//authentication

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

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = { 
        _id: user._id, 
		username: user.username,
        name: user.name, 
        imgUrl: user.imgUrl, 
        likedSongs: user.likedSongs, 
        likedStations: user.likedStations 
    }
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}
