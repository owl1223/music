import React, { Component } from 'react';
import "./MusicList.css";

import {Icon} from "antd";

import {connect} from "react-redux";

import {setPlayStyle,setCurrentPlayIndex} from "../store/actions.js";

class MusicList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() { 
        return (
            <div className="music-list-root">
                <div className="music-list-play-style">
                    <Icon 
                        className={
                            `music-list-btn ${this.props.playStyle==='normal'&&'music-list-btn-high'}`
                        }
                        type="retweet" 
                        title="顺序播放"
                        onClick={()=>this.playStyleIconClick("normal")}
                    />
                    <Icon 
                        className={
                            `music-list-btn ${this.props.playStyle==='random'&&'music-list-btn-high'}`
                        }
                        type="swap" 
                        title="随机播放"
                        onClick={()=>this.playStyleIconClick("random")}
                    />
                    <Icon 
                        className={
                            `music-list-btn ${this.props.playStyle==='single'&&'music-list-btn-high'}`
                        }
                        type="redo" 
                        title="单曲循环"
                        onClick={()=>this.playStyleIconClick("single")}
                    />
                </div>
                <div className="music-list-box">
                    {this.props.musicList.map((m,i)=>{
                        return (
                            <div 
                                key={i} 
                                className="music-list-item" 
                                title={m}
                                onClick={()=>this.musicItemClick(i)}
                            >
                                {this.props.currentPlayIndex===i&&<Icon 
                                    type="loading" 
                                    className="music-list-playing-icon"
                                ></Icon>}
                                
                                <span>{m}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );
    }

    playStyleIconClick = s =>{
        this.props.setPlayStyle(s);
    }

    musicItemClick = i=>{
        this.props.setCurrentPlayIndex(i);
        console.log( this.props )
        setTimeout(() => {
            this.props.player.play();
        }, 100);
    }
}

export default connect(
    state=>{
        return {
            musicList:state.musicList,
            currentPlayIndex:state.currentPlayIndex,
            playStyle:state.playStyle,
            player:state.player
        }
    },
    dispatch=>{
        return {
            setPlayStyle(s){
                dispatch(setPlayStyle(s));
            },
            setCurrentPlayIndex(i){
                dispatch(setCurrentPlayIndex(i));
            }
        }
    }
)(MusicList);