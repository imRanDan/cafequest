import axios from "axios";


export const fetchCafes = async (latitude: number, longitude: number, type: string) => {
    const response = await axios.get('/api/cafes', {
        params: {
            location: `${latitude}, ${longitude}`,
            latitude,
            longitude,
            type
        }
    });
    console.log(response.data);
    return response.data.results;
}