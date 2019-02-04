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

    /**
     * Called from 'Login' component when user has provided a 
     * username succesfully.
     * 
     * @param {String} userName 
     */
    handleLogin(userName) {
        this.setState({logged: true, user: userName});
    }

    render() {

        // Initially the app is null
        let app = null;

        // If user has logged in, display the Game component and Leaderboards component and stuff.
        if (this.state.logged) {
            app = (
                <div className='App'>
                    <Navigation />
                    <Route path='/' exact render={(props) => <Game {...props} userName={this.state.user} />} />
                    <Route path='/leaderboards' exact component={Leaderboards} />
                </div>
            )
        } else { // If the user has not logged in, display the Login component.
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
