import MusicList from "./components/MusicList.js";
import LyricBox from "./components/LyricBox.js";
import ControlBox from "./components/ControlBox.js";

import React, { Component } from 'react';
import "./App.css";

import {connect} from "react-redux";

import {queryMusicList} from "./store/actions.js";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() { 
        return (
            <div>
                <div className="app-main">

                    <div 
                        className="app-cd app-cd-spin"
                        style={this.cdStyleObj()}
                    >
                        <div className="app-cd-hole"></div>
                    </div>

                    <div className="app-player-box">
                        <MusicList></MusicList>
                        <div className="app-right-box">
                            <LyricBox></LyricBox>
                            <ControlBox></ControlBox>
                        </div>
                    </div>

                    
                </div>
                
            </div>
        );
    }

    componentDidMount(){
        this.props.queryMusicList()
    }

    cdStyleObj = ()=>{
        return {
            backgroundImage:`url("/music/${this.props.musicList[this.props.currentPlayIndex]}.jpg")`,
            animationPlayState:this.props.playing?"running":"paused"
        }
    }
}

function mapState(state){
    return {
        musicList:state.musicList,
        currentPlayIndex:state.currentPlayIndex,
        playing:state.playing
    }
}
function mapAction(dispatch){
    return {
        queryMusicList(){
            return dispatch(queryMusicList());
        }
    }
}
export default connect(
    mapState,
    mapAction
)(App);