import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavItem.css';

const NavItem = (props) => {
    return (
        <div className='linkWrapper'>
            <NavLink
                to={props.link}
                exact
                className='NavItem'>
                <p>{props.children}</p>
            </NavLink>
        </div>
    )
}

export default NavItem;