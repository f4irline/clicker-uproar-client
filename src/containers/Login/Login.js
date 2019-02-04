import React, { Component } from 'react';
import './Login.css';

class Login extends Component {

    state = {
        input: '',
        shake: false
    }

    validation = 'validation';

    handleClick() {
        if (this.state.input.length > 0) {
            this.props.user(this.state.input);
        } else {
            this.setState({shake: true})
        }
    }
    
    inputChangedHandler(event) {
        this.setState({input: event.target.value});
        if (event.target.value.length > 0) {
            this.validation = 'validation hide';
        } else {
            this.validation = 'validation';
        }
    }

    render() {

        let validationClass = this.validation;
        if (this.state.shake) {
            validationClass = 'validation shaker';
            setTimeout(() => {
                this.setState({shake: false});
            }, 500);
        }

        return (
            <div className='Login'>
                <h1 className='logo-header'>
                    Clicker uproar
                </h1>
                <div className='login-wrapper'>
                    <p className={validationClass}>Please enter a username:</p>
                    <input name='name' onChange={this.inputChangedHandler.bind(this)} placeholder='Name'></input>
                    <button name='submit' onClick={this.handleClick.bind(this)}>Submit</button>
                </div>
            </div>
        )
    }
}

export default Login;