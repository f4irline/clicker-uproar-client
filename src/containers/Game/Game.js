import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

class Game extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            clicks: 0,
            endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            user: 'John'
        }

        this.socket = socketIOClient(this.state.endpoint);
    }

    unloadListener = () => {
        console.log('Added unload listener');
        window.addEventListener('beforeunload', () => {
            this.socket.emit('unload', {
                clicks: this.state.clicks
            });
        })
    }

    componentDidMount() {
        this.socket.on('clicked', (data) => {
            this.receiveClicks(data);
        });

        this.socket.on('win', (data) => {
            alert(data);
        });

        this.socket.on('db', (data) => {
            this.databaseConnection(data);
        });
        
        this.unloadListener();
    }

    componentWillUnmount() {
        this.socket.close();
    }

    databaseConnection(data) {
        console.log(data)
    }

    receiveClicks = (data) => {
        console.log('Receiving');
        this.setState({clicks: data.clicks})
    }

    handleButtonClick = () => {
        console.log('Clicked');
        this.setState({clicks: this.state.clicks + 1}, () => {
            this.socket.emit('clicked', {
                clicks: this.state.clicks,
                user: this.state.user
            });
        });
    }

    render() {
        return (
            <div className='Game'>
                <p>Clicks: {this.state.clicks}</p>
                <button onClick={() => this.handleButtonClick()}>Click!!</button>
            </div>
        )
    }
}

export default Game;