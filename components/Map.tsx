import React from "react";
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

const containerStyle = {
    width: '100',
    height: '400px'
};

const defaultCenter = {
    lat: 43.201308,
    lng: -80.0045131
};

interface MapProps {
    cafes: Array<{ geometry: { location: {lat: number; lng: number } }, place_id: string }>;
}

const Map: React.FC<MapProps>  = ({ cafes }) => {
    return (
        <LoadScript 
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            loadingElement={<div>Loading...</div>}
            libraries={['places']}
            >
            <GoogleMap mapContainerStyle={containerStyle} center={defaultCenter} zoom={10}>
                {cafes.map(cafe =>
                    <Marker key={cafe.place_id} position={cafe.geometry.location} />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map;