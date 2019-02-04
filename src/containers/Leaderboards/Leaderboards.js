import React, {Component} from 'react';

import Loader from 'react-loader-spinner'

import './Leaderboards.css';

import Table from '../../components/Table/Table';

class Leaderboards extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            winners: [],
            endpoint: 'https://clicker-uproar-server.herokuapp.com/leaderboards',
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
            leaderboards = (
                <div className='Leaderboards-loading'>
                    <Loader 
                        type='Oval'
                        color='rgb(243, 117, 0)'
                        height="300"
                        width="300"
                    />                 
                </div>
            )
        } else {
            leaderboards = (
                <div className='Leaderboards'>
                    <Table className='table' entries={this.state.winners}/>
                </div>
            )
        }

        return (
            leaderboards
        )
    }
}

export default Leaderboards;