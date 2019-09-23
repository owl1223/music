import React, { Component } from 'react';
import "./ControlBox.css";

import { Slider,Icon,Popover } from 'antd';

import {connect} from "react-redux";



import {
    setPlaying,
    setCurrentTime,
    setCurrentPlayIndex,
    setRndList,
    setPlayer,
    queryLyric
} from "../store/actions.js";


class ControlBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progreeNum:0,
            musicDuration:"00:00",
        }
        // 把audio对象存入组件对象中
        this.player = React.createRef();
    }
    render() { 

        let soundControl = (
            <div style={{height:"100px"}}>
                <Slider 
                    vertical 
                    defaultValue={100}
                    onChange={this.volumnChange}
                ></Slider>
            </div>
        )

        return (
            <div className="control-box-root">
                <div className="control-box-progress-bar">
                    <Slider 
                        value={this.state.progreeNum}
                        onChange={this.playTimeChange}
                    ></Slider>
                    <p className="control-box-time-label">{
                        this.secondToMinuteStr(this.props.currentTime)
                    }/
                    {this.state.musicDuration}</p>
                </div>
                <div className="control-box-control-bar">
                    <Icon type="step-backward"
                        className="control-box-icon"
                        onClick={this.gotoPrevSong}
                    />
                    <Icon 
                        type={this.props.playing?"pause-circle":"play-circle"}
                        className="control-box-icon"
                        onClick={this.playBtnClick}
                    />
                    <Icon 
                        type="step-forward" 
                        className="control-box-icon"
                        onClick={this.gotoNextSong}
                    />
                    <Popover placement="top" content={soundControl} trigger="click">
                        <Icon 
                            type="sound" 
                            className="control-box-icon"
                        />
                    </Popover>
                    
                </div>

                {/* audio标签，用于播放音频，src属性设置播放的音频数据源，autoplay属性设置页面加载完成后自动播放(部分浏览器禁止自动播放功能)。loop属性设置音频播放完毕之后自动重新播放。controls属性用于显示播放器控制条。 */}
                <audio 
                    preload="true" 
                    src={`/music/${this.props.musicList[this.props.currentPlayIndex]}.mp3`} 
                    ref={this.player}
                >
                </audio>

            </div>
        );
    }

    playBtnClick = ()=>{
        // 点击播放按钮之后，先判断当前是否正在播放，如果正在播放则暂停。如果是暂停状态则开始播放。
        if(this.props.playing){
            // pause方法，用于暂停播放
            this.player.current.pause();
        }else{
            // audio对象的play()方法，用于开始播放，如果已经正在播放则无效。
            this.player.current.play();
        }

    }

    componentDidMount(){

        // 把播放器对象放入store中
        this.props.setPlayer(this.player.current);

        // audio元素的onpause事件，当播放暂停是触发
        this.player.current.onpause = ()=>{
            this.props.setPlaying(false);
        }

        // 当歌曲可以播放时，就开始下载歌词
        this.player.current.oncanplay = ()=>{
            // console.log("准备就绪了");
            let {musicList,currentPlayIndex} = this.props;
            this.props.queryLyric(`/music/${musicList[currentPlayIndex]}.lrc`);
        }

        this.player.current.onplay = ()=>{
            this.props.setPlaying(true);
        }

        // ontimeupdate，当播放进度更新时触发，是频繁触发的事件。
        this.player.current.ontimeupdate = ()=>{
            let pn = this.player.current.currentTime/this.player.current.duration;

            this.setState({
                progreeNum:Math.round(pn*100),
                musicDuration:this.secondToMinuteStr(this.player.current.duration)
            });

            this.props.setCurrentTime(this.player.current.currentTime);
        }

        this.player.current.onended = ()=>{
            // console.log("结束了");
            if(this.props.playStyle==="single"){
                this.player.current.play();
            }else{
                this.gotoNextSong();
            }
        }

    }

    // 下一首
    gotoNextSong = ()=>{
        this.player.current.pause();
        let index = 0;
        switch (this.props.playStyle) {
            case "normal":
            case "single":
                index = this.props.currentPlayIndex+1;
                if(index>=this.props.musicList.length){
                    index = 0;
                }
                this.props.setCurrentPlayIndex(index);
                break;
            case "random":
                let ind = Math.floor(Math.random()*this.props.rndList.length);
                index = this.props.rndList[ind];
                this.props.rndList.splice(ind,1);
                if(this.props.rndList.length<=0){
                    this.props.setRndList(this.props.musicList.map((e,i)=>{
                        return i;
                    }));
                }
                this.props.setCurrentPlayIndex(index);
                break;
            
                
        
            default:
                break;
        }

        setTimeout(() => {
            this.player.current.play();
        }, 100);
    }

    // 上一首
    gotoPrevSong = ()=>{
        let index = this.props.currentPlayIndex-1;
        if(index<0){
            index = this.props.musicList.length-1;
        }
        this.props.setCurrentPlayIndex(index);

        setTimeout(() => {
            this.player.current.play();
        }, 100);
    }

    secondToMinuteStr(second){
        let m = Math.floor(second/60);
        let s = Math.round(second%60);
        m = m<10?"0"+m:m;
        s = s<10?"0"+s:s;
        return m+":"+s;
    }

    playTimeChange = e=>{
        let time = this.player.current.duration*(e/100);

        // 手动设置currentTime也会触发timeupdate事件。
        this.player.current.currentTime = time;
    }

    volumnChange = e=>{
        this.player.current.volume = e/100;
    }
    
}

export default connect(
    state=>{
        return {
            playing:state.playing,
            currentTime:state.currentTime,
            playStyle:state.playStyle,
            musicList:state.musicList,
            currentPlayIndex:state.currentPlayIndex,
            rndList:state.rndList
        }
    },
    dispatch=>{
        return {
            setPlaying(f){
                dispatch(setPlaying(f));
            },
            setCurrentTime(v){
                dispatch(setCurrentTime(v));
            },
            setCurrentPlayIndex(v){
                dispatch(setCurrentPlayIndex(v));
            },
            setRndList(v){
                dispatch(setRndList(v));
            },
            setPlayer(p){
                dispatch(setPlayer(p));
            },
            queryLyric(url){
                dispatch(queryLyric(url));
            }
        }
    }
)(ControlBox);









