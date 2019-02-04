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

    // Helper variable to check that 
    // no setState is called if the component
    // happens to be unmounted already.
    _isMounted = false;

    constructor(props) {
        super(props);
        
        this.state = {
            loading: true,
            totalClicks: 0,
            clicks: 0,
            endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            // endpoint: 'localhost:5000', // Local endpoint for the socket.io
            user: props.userName,
            shaking: false,
            win: false,
            winText: ''
        }

        // Connect to socket.io
        this.socket = socketIOClient(this.state.endpoint);

        // Initiate a timer which sets the state
        // 'shaking' to false after 2 seconds, so that the
        // shaking animation stops.
        this.shakeTimer = setTimeout(() => {
            this.setState({shaking: false});
        }, 2000);

        this.winTimer = setTimeout(() => {
            this.setState({win: false});
        }, 2000);

        // Sound effects for the pickaxe smash
        this.sound_1 = new Audio(require('../../assets/sfx/sound_1.mp3'));
        this.sound_2 = new Audio(require('../../assets/sfx/sound_2.mp3'));
        this.sound_3 = new Audio(require('../../assets/sfx/sound_3.mp3'));
        this.sound_4 = new Audio(require('../../assets/sfx/sound_4.mp3'));

        // A global variable for the next audio for the pickaxe smash.
        // Initially null, but a random audio of the Audio pieces above
        // will be chosen on every click 
        this.nextAudio = null;

        // Audio for when user wins something.
        this.win = new Audio(require('../../assets/sfx/win.mp3'));
    }

    /**
     * Create socket listeners.
     */
    componentDidMount() {
        this._isMounted = true; // The component is mounted succesfully, set it to true.

        this.randomizeAudio(); // Randomize the first click audio

        this.socket.on('clicked', (data) => { // Called when another socket clicks the button
            clearTimeout(this.shakeTimer); // Clear the current timeout from the shaker if there's one active
            this.receiveClicks(data);
            if (this._isMounted) { // If the component is not unmounted, manipulate state
                this.setState({shaking: true}, () => {
                    this.shakeTimer = setTimeout(() => { // Initialize the shaketimer again
                        this.setState({shaking: false});
                    }, 1000);
                });
            }
        });

        this.socket.on('win', (data) => { // Called when this socket wins
            if (this._isMounted) {
                this.setState({winText: data, win: true});
                this.win.play();
                this.winTimer = setTimeout(() => {
                    this.setState({win: false}); // The state 'win' is used to display the prize player won whenever 'win' is true.
                }, 2000);                        // Therefore it needs to be set to 'false' after some time when it's been displayed.
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
        this.socket.close();
        this._isMounted = false; // Set the helper variable to false so that no state manipulationing is happening anymore
        clearTimeout(this.shakeTimer); // Clear the timeouts to avoid errors
        clearTimeout(this.winTimer); // Clear the timeouts to avoid errors
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
        clearTimeout(this.shakeTimer); // Clear the timeout so shaking doesn't stap on consecutive clicks!
        if (this.nextAudio.paused) { // If the audio is currently paused, just play it
            this.nextAudio.play();
        } else { // If it's not, pause it, rewind it to 0 and play it
            this.nextAudio.pause();
            this.nextAudio.currentTime = 0;
            this.nextAudio.play();
        }

        if (this._isMounted) { // Set the amount of clicks and the users clicks to state and make it shake
            this.setState({totalClicks: this.state.totalClicks + 1, clicks: this.state.clicks + 1, shaking: true}, () => {
                this.socket.emit('clicked', {
                    userClicks: this.state.clicks,
                    user: this.state.user
                });
                this.shakeTimer = setTimeout(() => { // Timer to clear out the shaking
                    this.setState({shaking: false});
                }, 200);
            });
        }

        this.randomizeAudio(); // Randomize the audio which will be played on the next click
    }

    /**
     * Handles randomizing the pickaxe sounds
     */
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
         * Initially they are hidden.
         */
        let rubyClass = 'win hidden';
        let diamondClass = 'win hidden';
        let goldClass = 'win hidden';

        // Initial classes for the 'Smash the rock' text and the image which 
        // user clicks
        let clickHeaderClass = 'click-header';
        let clickerClass = 'clicker';

        let gameImg = offImg; // Initially the image displayed is off (the pickaxe isn't hitting the rock)

        if (this.state.shaking) { // If the user has just hit the rock, the state 'shaking' is true...
            clickerClass = 'clicker shaker'; // .. so add classes to make it shake
            clickHeaderClass = 'click-header shaker'
            gameImg = onImg; // Also change the image to the image where pickaxe hits the rock
        }

        /**
         * If the user has won something,
         * check which kind of prize the user has
         * won and remove the 'hidden' class from that 
         * one so it is displayed to the user.
         */
        if (this.state.win) {
            if (this.state.winText === 'ruby') {
                rubyClass = 'win';
            } else if (this.state.winText === 'diamond') {
                diamondClass = 'win';
            } else if (this.state.winText === 'gold') {
                goldClass = 'win';
            }
        }

        // If the game is currently loading the amount of clicks
        // from the other sockets or the database, display a loading spinner
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
                    <img src={gold} alt='gold' className={goldClass}/>
                    <img src={diamond} alt='diamond' className={diamondClass}/>
                    <img src={ruby} alt='ruby' className={rubyClass}/>
                </div>
            )
        }

        return (
            game
        )
    }
}

export default Game;