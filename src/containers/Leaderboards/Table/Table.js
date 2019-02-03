import React from 'react';

import Row from './Row/Row';

const Table = (props) => {
    let rows = [];
    let winners = props.entries;
    let header = {
        name: 'Name',
        clicks: 'Clicks',
        win: 'Size'
    }

    rows.push(<Row 
        styleProp={{backgroundColor: 'rgb(243, 117, 0)', 
                    textTransform: 'uppercase', 
                    fontWeight: '900', 
                    color: 'white',
                    letterSpacing: '3px',
                    border: '2px solid #666'
                }} 
        key={1} rowEntry={header} />)

    for (let i = winners.length - 1; i >= 0; i--) {
        rows.push(<Row key={winners[i].user_id} rowEntry={winners[i]} />)
    }
    return (
        <div>{rows}</div>
    )
}

export default Table;