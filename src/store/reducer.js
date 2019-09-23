
import {combineReducers} from "redux";

// 播放列表
function musicList(state=[],action){
    switch (action.type) {
        case "SET_MUSIC_LIST":
            return action.list;
        default:
            return state;
    }
}

// 当前播放到第几首歌了
function currentPlayIndex(state=0,action){
    switch (action.type) {
        case "SET_CURRENT_PLAY_INDEX":
            
            return action.index;
        default:
            return state;
    }
}

// 播放器是否正在播放
function playing(state=false,action){
    switch (action.type) {
        case "SET_PLAYING":
            return action.value;
        default:
            return state;
    }
}

// 当前播放时间
function currentTime(state=0,action){
    switch (action.type) {
        case "SET_CURRENT_TIME":

            return action.value;
        default:
            return state;
    }
}

// 当前播放类型
function playStyle(state="normal",action){
    switch (action.type) {
        case "SET_PLAY_STYLE":
            return action.value;
        default:
            return state;
    }
}


// 随机播放列表

function rndList(state = [],action){
    switch (action.type) {
        case "SET_RND_LIST":
            return action.value;
        default:
            return state;
    }
}

// 播放器对象
function player(state=null,action){
    switch (action.type) {
        case "SET_PLAYER":
            return action.player;
        default:
            return state;
    }
}


// 歌词字符串
function lyric(state=[],action){
    switch (action.type) {
        case "SET_LYRIC":
            return action.value;
        default:
            return state;
    }
}


let reducer = combineReducers({
    musicList,
    currentPlayIndex,
    playing,
    currentTime,
    playStyle,
    rndList,
    player,
    lyric
});

export default reducer;