import React, { Component } from 'react';

import NavItem from './NavItem/NavItem';

import './Navigation.css';

/**
 * Simple navigation. Create NavItem objects
 * for root (game) and the leaderboards.
 */
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