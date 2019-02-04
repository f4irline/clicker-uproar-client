import React, {Component} from 'react';
// import socketIOClient from 'socket.io-client';

import './Leaderboards.css';

import Table from './Table/Table';

class Leaderboards extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            winners: [],
            endpoint: 'https://clicker-uproar-server.herokuapp.com/',
            // endpoint: 'http://localhost:5000/leaderboards',
            loading: true
        }
    }

    componentDidMount() {
        this.fetchWinners()
            .catch((error) => {
                console.log(error);
            });
    }

    fetchWinners = async () => {
        try {
            const res = await fetch (this.state.endpoint);
            const data = await res.json();
            this.setState({winners: data}, () => {
                this.setState({loading: false});
            })
        } catch (error) {
            console.log('Error');
            throw error;
        }
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