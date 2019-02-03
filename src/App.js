import React, { Component } from 'react';
import './App.css';
import Game from './containers/Game/Game';
import Login from './containers/Login/Login';

class App extends Component {

    state = {
        logged: false,
        user: ''
    }

    handleLogin(userName) {
        this.setState({logged: true, user: userName}, () => {
            console.log(this.state.user);
        });
    }

    render() {

        let app = null;

        this.state.logged ? app = <Game userName={this.state.user}/> : app = <Login user={this.handleLogin.bind(this)} />

        return (
        <div className="App">
            {app}
        </div>
        );
    }
}

export default App;
