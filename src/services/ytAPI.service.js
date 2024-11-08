import axios from "axios"
import { loadFromStorage, saveToStorage } from "./util.service.js"

const API_KEY= 'AIzaSyCCqp2BCiBvtPluxkADxMl8EeOiWrc8brg'
const ytAPI= `https://www.googleapis.com/youtube/v3/search?part=snippet&q=%7Bsong_name%7D&type=video&maxResults=1&key=${API_KEY}`
const STORAGE_KEY= 'youtube ids'

export const ytAPIService={
    getVideoId
}

async function getVideoId(songName) {
    const ytIdsMap= loadFromStorage(STORAGE_KEY)
    if(ytIdsMap[songName]) return ytIds[songName]

    try{
        const res=  axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${songName}&type=video&maxResults=1&key=${API_KEY}`)
        const ytId= res.data.items[0].id.videoId
        ytIdsMap[songName]= ytId
        saveToStorage(STORAGE_KEY, termVideosMap)
        return ytId
    }catch(err){
        console.log('YT API-> failed to get id from youtube')
        throw err
    }
}