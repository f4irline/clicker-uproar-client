import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import Loader from 'react-loader-spinner'

import './Game.css';

const onImg = require('../../assets/images/on.png');
const offImg = require('../../assets/images/off.png');
const gold = require('../../assets/images/gold.png');
const ruby = require('../../assets/images/ruby.png');
const diamond = require('../../assets/images/diamond.png');

class Game extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            totalClicks: 0,
            clicks: 0,
            endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            // endpoint: 'localhost:5000',
            user: props.userName,
            shaking: false,
            win: false,
            winText: ''
        }

        this.socket = socketIOClient(this.state.endpoint);

        this.shakeTimer = setTimeout(() => {
            this.setState({shaking: false});
        }, 2000);

        this.sound_1 = new Audio(require('../../assets/sfx/sound_1.mp3'));
        this.sound_2 = new Audio(require('../../assets/sfx/sound_2.mp3'));
        this.sound_3 = new Audio(require('../../assets/sfx/sound_3.mp3'));
        this.sound_4 = new Audio(require('../../assets/sfx/sound_4.mp3'));

        this.nextAudio = null;

        this.win = new Audio(require('../../assets/sfx/win.mp3'));
    }

    /**
     * Create socket listeners.
     */
    componentDidMount() {
        this._isMounted = true;

        this.randomizeAudio();

        this.socket.emit('initsocket');

        this.socket.on('clicked', (data) => { // Called when another socket clicks the button
            clearTimeout(this.shakeTimer);
            this.receiveClicks(data);
            if (this._isMounted) {
                this.setState({shaking: true}, () => {
                    this.shakeTimer = setTimeout(() => {
                        this.setState({shaking: false});
                    }, 1000);
                });
            }
        });

        this.socket.on('win', (data) => { // Called when this socket wins
            if (this._isMounted) {
                this.setState({winText: data, win: true});
                this.win.play();
                setTimeout(() => {
                    this.setState({win: false});
                }, 2000);    
            }
        });

        this.socket.on('initclicks', (data) => { // Called when this socket connects, sets the amount of clicks to the state
            if (this._isMounted) {
                this.setState({totalClicks: data, loading: false});
            }
        });

        this.socket.on('requestClicks', (data) => { // Called to the last in the socket list when a new socket connects. 
            this.sendClicks(data);
        });
    }

    /**
     * Close the socket connection when user leaves the component.
     */
    componentWillUnmount() {
        this.socket.emit('endconnection');
        this.socket.close();
        this.socket.removeAllListeners();
        this._isMounted = false;
        clearTimeout(this.shakeTimer);
    }

    /**
     * Sets the clicks amount when another socket clicks the button
     */
    receiveClicks = (data) => {
        this.setState({totalClicks: data})
    }

    /**
     * Sends the amount of clicks to a new socket that has connected
     */
    sendClicks = (data) => {
        this.socket.emit('newConnection', {
            clicks: this.state.totalClicks,
            socket: data
        });
    }

    /**
     * Sets the amount of clicks in state to +1 and then
     * emits the event to other sockets.
     */
    handleButtonClick = () => {
        clearTimeout(this.shakeTimer);
        if (this.nextAudio.paused) {
            this.nextAudio.play();
        } else {
            this.nextAudio.pause();
            this.nextAudio.currentTime = 0;
            this.nextAudio.play();
        }
        if (this._isMounted) {
            this.setState({totalClicks: this.state.totalClicks + 1, clicks: this.state.clicks + 1, shaking: true}, () => {
                this.socket.emit('clicked', {
                    userClicks: this.state.clicks,
                    user: this.state.user
                });
                this.shakeTimer = setTimeout(() => {
                    this.setState({shaking: false});
                }, 200);
            });
        }

        this.randomizeAudio();
    }

    randomizeAudio() {
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                this.nextAudio = this.sound_1;
                break;
            case 1:
                this.nextAudio = this.sound_2;
                break;
            case 2:
                this.nextAudio = this.sound_3;
                break;
            case 3:
                this.nextAudio = this.sound_4;
                break;
            default:
                this.nextAudio = this.sound_1;
        }
    }

    render() {

        let game = null;

        /**
         * Different styles for all the prizes.
         */
        let rubyClass = 'win hidden';
        let diamondClass = 'win hidden';
        let goldClass = 'win hidden';

        //
        let clickHeaderClass = 'click-header';
        let clickerClass = 'clicker';

        let gameImg = offImg;

        if (this.state.shaking) {
            clickerClass = 'clicker shaker';
            clickHeaderClass = 'click-header shaker'
            gameImg = onImg;
        }

        if (this.state.win) {
            if (this.state.winText === 'ruby') {
                rubyClass = 'win';
            } else if (this.state.winText === 'diamond') {
                diamondClass = 'win';
            } else if (this.state.winText === 'gold') {
                goldClass = 'win';
            }
        }

        let winImg = (
            <div>
                <img src={gold} alt='gold' className={goldClass}/>
                <img src={diamond} alt='diamond' className={diamondClass}/>
                <img src={ruby} alt='ruby' className={rubyClass}/>
            </div>
        )

        if (this.state.loading) {
            game = (
                <div className='Game'>
                    <Loader 
                        type='Oval'
                        color='rgb(243, 117, 0)'
                        height="300"
                        width="300"
                    />                       
                </div>
            )
        } else {
            game = (
                <div className='Game'>
                    <h1 className='hello'>Hello, {this.state.user}</h1>
                    <h1 className={clickHeaderClass}>Smash the rock!</h1>
                    <img src={gameImg} alt='Cookie' className={clickerClass} onClick={() => this.handleButtonClick()}/>
                    <p className='amount'>Amount of clicks needed for next win: {100 - (this.state.totalClicks % 100)}</p>
                    {winImg}
                </div>
            )
        }

        return (
            game
        )
    }
}

export default Game;