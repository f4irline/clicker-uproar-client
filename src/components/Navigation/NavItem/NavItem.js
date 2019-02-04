import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavItem.css';

/**
 * Uses NavLinks from react-router-dom to
 * create navigation items with easy activation.
 * 
 * @param {Object} props 
 */
const NavItem = (props) => {
    return (
        <div className='linkWrapper'>
            <NavLink
                to={props.link}
                exact
                className='NavItem'
                activeClassName='selected'>
                <p>{props.children}</p>
            </NavLink>
        </div>
    )
}

export default NavItem;