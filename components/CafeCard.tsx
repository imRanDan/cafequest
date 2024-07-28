import React from "react";

interface CafeCardProps {
    cafe: {
        name: string;
        vicinity: string;
    }
}

const CafeCard: React.FC<CafeCardProps> = ({ cafe }) => (
    <div>
        <h2>{cafe.name}</h2>
        <p>{cafe.vicinity}</p>
    </div>
)


export default CafeCard;