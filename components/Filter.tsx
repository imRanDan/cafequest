import React from 'react'

interface FilterProps {
    setType: (type: string) => void;
}

const Filter: React.FC<FilterProps> = ({ setType }) => (
    <div>
        <button onClick={() => setType('solo')}>Solo</button>
        <button onClick={() => setType('family')}>Family</button>
        <button onClick={() => setType('friends')}>Friends</button>
        <button onClick={() => setType('date')}>Date</button>
    </div>
)

export default Filter;