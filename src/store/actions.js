
import axios from "axios";

function setMusicList(list){
    return {
        type:"SET_MUSIC_LIST",
        list
    }
}

function queryMusicList(){
    return function(dispatch){
        let p = axios.get("/music/music-list.json");
        p.then(res=>{
            dispatch(setMusicList(res.data.list));

            // 生成一个和歌曲列表一样长度的索引数组
            let tempArr = res.data.list.map((e,i)=>{
                return i;
            });
            tempArr.splice(0,1);
            dispatch(setRndList(tempArr));
        });
        return p;
    }
}

function setCurrentPlayIndex(index){
    return {
        type:"SET_CURRENT_PLAY_INDEX",
        index
    }
}

function setPlaying(value){
    return {
        type:"SET_PLAYING",
        value
    }
}


function setCurrentTime(value){
    return {
        type:"SET_CURRENT_TIME",
        value
    }
}

function setPlayStyle(value){
    return {
        type:"SET_PLAY_STYLE",
        value
    }
}

function setRndList(value){
    return {
        type:"SET_RND_LIST",
        value
    }
}

function setPlayer(player){
    return {
        type:"SET_PLAYER",
        player
    }
}


// 设置歌词的同步action
function setLyric(value){
    return {
        type:"SET_LYRIC",
        value
    }
}

// 请求歌词
function queryLyric(url){
    return dispatch=>{
        return axios.get(url)
        .then(res=>{
            let txt = res.data;
            let regexp = /\[(\d\d):(\d\d\.\d\d)\](.*)/g;
            let rs = null;
            let temp = [];
            while (!!(rs=regexp.exec(txt))) {
                // console.log(rs);
                let time = rs[1]*60+rs[2]*1;
                let content = rs[3];
                temp.push({time,content})
            }
             console.log(temp);
            dispatch(setLyric(temp));
        });
    }
}

export {
    queryMusicList,
    setMusicList,
    setCurrentPlayIndex,
    setPlaying,
    setCurrentTime,
    setPlayStyle,
    setRndList,
    setPlayer,
    setLyric,
    queryLyric
};





