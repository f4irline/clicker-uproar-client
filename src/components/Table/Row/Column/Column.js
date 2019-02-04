import React from 'react';

import './Column.css';

const Column = (props) => {
    return (
        <div style={props.styleProp} className='Column'>
            <p>{props.entry}</p>
        </div>
    )
}

export default Column