import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import './Game.css';

class Game extends Component {

    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            totalClicks: 0,
            clicks: 0,
            // endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            endpoint: 'localhost:5000',
            user: props.userName,
            shaking: false,
            win: false,
            winText: ''
        }

        this.socket = socketIOClient(this.state.endpoint);

        this.shakeTimer = setTimeout(() => {
            this.setState({shaking: false});
        }, 2000);

        this.monch = new Audio(require('../../assets/sfx/monch.mp3'));
        this.win = new Audio(require('../../assets/sfx/win.mp3'));
    }

    /**
     * Create socket listeners.
     */
    componentDidMount() {
        this._isMounted = true;

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
                console.log('Getting clicks');
            }
        });

        this.socket.on('requestClicks', (data) => { // Called to the last in the socket list when a new socket connects. 
            console.log('New connection found');
            console.log(data);
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
        console.log('Receiving');
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
        console.log('Clicked');
        clearTimeout(this.shakeTimer);
        if (this.monch.paused) {
            this.monch.play();
        } else {
            this.monch.pause();
            this.monch.currentTime = 0;
            this.monch.play();
        }
        if (this._isMounted) {
            this.setState({totalClicks: this.state.totalClicks + 1, clicks: this.state.clicks + 1, shaking: true}, () => {
                this.socket.emit('clicked', {
                    userClicks: this.state.clicks,
                    user: this.state.user
                });
                this.shakeTimer = setTimeout(() => {
                    this.setState({shaking: false});
                }, 1000);
            });
        }
    }

    render() {

        let game = null;
        let winClass = 'win hidden';
        let shakerClass = 'click-header';
        let cookieClass = 'clicker';

        if (this.state.shaking) {
            cookieClass = 'clicker shaker';
            shakerClass = 'click-header shaker'
        }

        if (this.state.win) {
            winClass = 'win';
        }

        if (this.state.loading) {
            game = (
                <div className='Game'>
                    <p className='loading'>Loading...</p>
                </div>
            )
        } else {
            game = (
                <div className='Game'>
                    <h1 className='hello'>Hello, {this.state.user}</h1>
                    <h1 className={shakerClass}>Click the cookie!</h1>
                    <img src={require('../../assets/images/cookie.PNG')} alt='Cookie' className={cookieClass} onClick={() => this.handleButtonClick()}/>
                    <p className='amount'>Amount of clicks needed for next win: {100 - (this.state.totalClicks % 100)}</p>
                    <p className={winClass}>You win {this.state.winText}!</p>
                </div>
            )
        }

        return (
            game
        )
    }
}

export default Game;