/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap } from "@react-google-maps/api";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
};

// Coords
const defaultMapCenter = {
    lat: 35.8799866,
    lng: 76.5048004
}

// Default Zoom level, adjust as needed
const defaultMapZoom = 18

// Map options
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'satellite',
};

const MapComponent = () => {
    return (
        <div className="w-full">
            <GoogleMap mapContainerStyle={defaultMapContainerStyle} center={defaultMapCenter} zoom={defaultMapZoom} options={defaultMapOptions}>
            </GoogleMap>
        </div>
    )
};

export { MapComponent };