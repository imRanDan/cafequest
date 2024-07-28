import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_KEY = process.env.SERVER_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { latitude, longitude, type} = req.query;

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                location: `${latitude}, ${longitude}`,
                radius: '1500',
                type: 'cafe',
                key: API_KEY
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cafes' });
    }
}

export default handler;