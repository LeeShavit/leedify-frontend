import { userService } from '../../services/user'


export const SET_USER = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const LIKE_SONG = 'LIKE_SONG'
export const DISLIKE_SONG = 'DISLIKE_SONG'

const initialState = {
    user: userService.getLoggedinUser(),
    users: [],
}


export function userReducer(state = initialState, action) {
    var newState = state
    switch (action.type) {
        case SET_USER:
            newState = { ...state, user: action.user }
            break
        case REMOVE_USER:
            newState = {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }
            break
        case SET_USERS:
            newState = { ...state, users: action.users }
            break
        case LIKE_SONG:
            newState = { ...state, user: { ...state.user, likedSongs: [...state.user.likedSongs, action.song] } }
            break
        case DISLIKE_SONG:
            newState = {
                ...state, user: {
                    ...state.user,
                    likedSongs: state.user.likedSongs.filter(song=> song._id !== action.songId)
                }
            }
            break
        default:
    }
    // For debug:
    // window.userState = newState
    // console.log('State:', newState)
    return newState

}
