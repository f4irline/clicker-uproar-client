import React, { Component } from 'react';
import './Login.css';

class Login extends Component {

    state = {
        input: '',
        shake: false
    }

    // Class for the validation paragraph on top of the input field.
    validation = 'validation';

    /**
     * Validates that the user has entered atleast some username.
     * Then set the username to state of the root App-component.
     */
    handleClick() {
        if (this.state.input.length > 0) {
            this.props.user(this.state.input);
        } else {
            this.setState({shake: true})
        }
    }
    
    /**
     * Updates the input state when the input field is changed.
     * Handles changing the class of the validation paragraph on top
     * of the input field.
     * 
     * @param {Object} event 
     */
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
            validationClass = 'validation shaker'; // Make the validation text shake if user has not entered anything.
            setTimeout(() => {
                this.setState({shake: false});
            }, 500); // Clear the shaking after 0.5s
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