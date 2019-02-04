import React, { Component } from 'react';
import './App.css';
import Game from './containers/Game/Game';
import Login from './containers/Login/Login';
import Leaderboards from './containers/Leaderboards/Leaderboards';
import { Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';

class App extends Component {

    /**
     * State which checks if the user has logged in or not.
     */
    state = {
        logged: false,
        user: '',
    }

    handleLogin(userName) {
        this.setState({logged: true, user: userName});
    }

    render() {

        let app = null;

        if (this.state.logged) {
            app = (
                <div className='App'>
                    <Navigation />
                    <Route path='/' exact render={(props) => <Game {...props} userName={this.state.user} />} />
                    <Route path='/leaderboards' exact component={Leaderboards} />
                </div>
            )
        } else {
            app = ( 
                <div className='App'>
                    <Login user={this.handleLogin.bind(this)} />
                </div>
            )
        }

        return (
            app
        );
    }
}

export default App;
