import React, { useState, useEffect } from 'react';
import { getCurrentLocation } from './api/geolocation';
import { fetchCafes } from './api/cafeAPI';
import Header from '../components/Header';
import Filter from '../components/Filter';
import CafeCard from '../components/CafeCard';
import Map from '@/components/Map';

const Home: React.FC = () => {
    const [cafes, setCafes] = useState<any[]>([]);
    const [type, setType] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ latitude: Number; longitude: Number; } | null>(null);

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const { coords } = await getCurrentLocation();
                setCoords({ latitude: coords.latitude, longitude: coords.longitude });
            } catch (error) {
                console.error('There was an error fecting the location:', error);
            }
        };
        loadLocation();
    }, []);



    useEffect(() => {
        const loadCafes = async () => {
            if (coords && type) {
                try {
                    const cafesData = await fetchCafes(coords.latitude, coords.longitude, type);
                    setCafes(cafesData);
                } catch (error) {
                    console.error('Error fetching cafes:', error);
                }
            }
        };
        loadCafes();
    }, [type, coords]);

    return (
        <div>
            <Header />
            <Filter setType={setType} />
            {coords && <Map cafes={cafes} />}
            <div>
                {cafes.map(cafe => (
                    <CafeCard key={cafe.place_id} cafe={cafe} />
                ))}
            </div>
        </div>
    )
}

export default Home;