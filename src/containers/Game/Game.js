import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Game extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            totalClicks: 0,
            clicks: 0,
            endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            // endpoint: 'localhost:5000',
            user: props.userName
        }

        this.socket = socketIOClient(this.state.endpoint);
    }

    /**
     * Sends the current amount of clicks to the socket.io listener
     * when the app is closed.
     */
    unloadListener = () => {
        console.log('Added unload listener');
        window.addEventListener('beforeunload', () => {
            this.socket.emit('unload', {
                clicks: this.state.totalClicks
            });
        })
    }

    /**
     * Create socket listeners.
     */
    componentDidMount() {
        this.socket.on('clicked', (data) => { // Called when another socket clicks the button
            this.receiveClicks(data);
        });

        this.socket.on('win', (data) => { // Called when this socket wins
            alert(data);
        });

        this.socket.on('initclicks', (data) => { // Called when this socket connects, sets the amount of clicks to the state
            this.setState({totalClicks: data});
            console.log('Getting clicks');
        });

        this.socket.on('requestClicks', (data) => { // Called to the last in the socket list when a new socket connects. 
            console.log('New connection found');
            console.log(data);
            this.sendClicks(data);
        });
        
        this.unloadListener(); // Initialize unload listener
    }

    /**
     * Close the socket connection when user leaves the component.
     */
    componentWillUnmount() {
        this.socket.close();
    }

    /**
     * Sets the clicks amount when another socket clicks the button
     */
    receiveClicks = (data) => {
        console.log('Receiving');
        this.setState({totalClicks: data.clicks})
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
        this.setState({totalClicks: this.state.totalClicks + 1, clicks: this.state.clicks + 1}, () => {
            this.socket.emit('clicked', {
                clicks: this.state.totalClicks,
                userClicks: this.state.clicks,
                user: this.state.user
            });
        });
    }

    render() {
        return (
            <div className='Game'>
                <h1>Hello {this.state.user}</h1>
                <p>Amount of clicks needed for next win: {100 - (this.state.totalClicks % 100)}</p>
                <button onClick={() => this.handleButtonClick()}>Click!!</button>
            </div>
        )
    }
}

export default Game;