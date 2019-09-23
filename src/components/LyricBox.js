import React, { Component } from 'react';
import "./LyricBox.css";

import {connect} from "react-redux";


class LyricBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            line:0
        }
        this.lyricBox = new React.createRef();
    }
    render() { 
        return (
            <div ref={this.lyricBox} className="lyric-box-root">
                {this.props.lyric.map((l,i)=>{
                    return (
                        <p 
                            key={i} 
                            className={
                                `lyric-box-line ${this.state.line===i?"lyric-box-highline":""}`
                            }
                            onClick={()=>this.lineClick(i)}
                        >{l.content||"-"}</p>
                    )
                })}
                
            </div>
        );
    }

    lineClick = index=>{
        this.props.player.currentTime = this.props.lyric[index].time+0.2;
    }


    // 当组件接受到传值或传值更新时调用。
    componentWillReceiveProps(props){
        // console.log(props.currentTime);
        // 找到当前时间对应的歌词
        let index = null;
        for(let i = 0;i<props.lyric.length;i++){
            if(props.lyric[i].time>=props.currentTime){
                index = i-1;
                break;
            }
        }
        
        if(index!==this.state.line){
            if(index===null){
                index = props.lyric.length-1;
            }
            let lines = index-4;
            lines = lines<0?0:lines;

            let target = 45*lines;
            target = target<0?0:target;
            let maxoffset = this.lyricBox.current.scrollHeight - this.lyricBox.current.clientHeight;
            target = target>maxoffset?maxoffset:target;
        
            let distance = target - this.lyricBox.current.scrollTop;
            
            let velocity = distance/30;
            
            let count = 0;

            let update = ()=>{
                count++;
                this.lyricBox.current.scrollTop += velocity;
                let diff = Math.abs(this.lyricBox.current.scrollTop-target);
                // console.log(diff,Math.abs(velocity));
                if(diff>Math.abs(velocity)&&count<30){
                    requestAnimationFrame(update);
                }else{
                    this.lyricBox.current.scrollTop = target
                }
            }
            if(distance!==0){
                requestAnimationFrame(update);
            }
        }
        this.setState({line:index});

    }
}

export default connect(
    state=>{
        return {
            lyric:state.lyric,
            currentTime:state.currentTime,
            player:state.player
        }
    },
    dispatch=>{
        return {

        }
    }
)(LyricBox);

