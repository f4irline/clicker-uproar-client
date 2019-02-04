import React from 'react';

import Col from './Column/Column';
import './Row.css';

const Row = (props) => {
    let cols = [];
    let rowEntry = props.rowEntry;

    // First filter out the 'user_id' fields from the
    // rows, because it's not necessary to show those to 
    // the user.
    cols = Object.keys(rowEntry).filter(key => {
        return key !== 'user_id'
    })
    .map(entry => { // Then map the remaining entries to Column components.
        return <Col styleProp={props.styleProp} key={rowEntry[entry]} entry={rowEntry[entry]} />;
    })

    return (
        <div className='Row'>{cols}</div>
    )
}

export default Row;