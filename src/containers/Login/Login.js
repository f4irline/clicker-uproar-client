import React, { Component } from 'react';

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
                <input name='name' onChange={this.inputChangedHandler.bind(this)} placeholder='Name'></input>
                <button name='submit' onClick={this.handleClick.bind(this)}>Submit</button>
            </div>
        )
    }
}

export default Login;