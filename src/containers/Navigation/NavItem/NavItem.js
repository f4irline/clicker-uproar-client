import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavItem.css';

const NavItem = (props) => {
    return (
        <NavLink
            to={props.link}
            exact
            className='NavItem'>
            <p>{props.children}</p>
        </NavLink>
    )
}

export default NavItem;