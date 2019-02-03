import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';

import './Leaderboards.css';

import Table from './Table/Table';

class Leaderboards extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            winners: [],
            // endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            endpoint: 'localhost:5000',
            loading: true
        }

        this.socket = socketIOClient(this.state.endpoint);
    }

    componentDidMount() {
        this.receiveLeaderboards();

        this.socket.on('leaderboards', (data) => {
            this.setState({winners: data}, () => {
                this.setState({loading: false})
            });
        })
    }

    receiveLeaderboards() {
        this.socket.emit('requestLeaderboards');
    }

    render() {

        let leaderboards = null;

        if (this.state.loading) {
            leaderboards = <p>Loading...</p>
        } else {
            leaderboards = <Table entries={this.state.winners}/>
        }

        return (
            <div className='Leaderboards'>
                {leaderboards}
            </div>
        )
    }
}

export default Leaderboards;