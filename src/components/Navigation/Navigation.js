import React, { Component } from 'react';

import NavItem from './NavItem/NavItem';

import './Navigation.css';

class Navigation extends Component {
    render() {
        return (
            <div className='Navigation'>
                <NavItem link='/'>Game</NavItem>
                <NavItem link='/leaderboards'>Leaderboards</NavItem>
            </div>
        )
    }
}

export default Navigation;