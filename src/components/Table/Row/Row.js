import React from 'react';

import Col from './Column/Column';
import './Row.css';

const Row = (props) => {
    let cols = [];
    let rowEntry = props.rowEntry;

    cols = Object.keys(rowEntry).filter(key => {
        return key !== 'user_id'
    })
    .map(entry => {
        return <Col styleProp={props.styleProp} key={rowEntry[entry]} entry={rowEntry[entry]} />;
    })

    return (
        <div className='Row'>{cols}</div>
    )
}

export default Row;