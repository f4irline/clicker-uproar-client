import React, { Component } from 'react';
import './Login.css';

class Login extends Component {

    state = {
        input: ''
    }

    handleClick() {
        this.props.user(this.state.input);
    }
    
    inputChangedHandler(event) {
        this.setState({input: event.target.value});
    }

    render() {
        return (
            <div className='Login'>
                <div className='login-wrapper'>
                    <input name='name' onChange={this.inputChangedHandler.bind(this)} placeholder='Name'></input>
                    <button name='submit' onClick={this.handleClick.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }
}

export default Login;