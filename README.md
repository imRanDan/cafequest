# CafeQuest

## Description

CafeQuest is a web application designed to help users discover, review, and rate local cafes. With an emphasis on providing a seamless user experience, the app allows users to find their favorite spots, leave reviews, and explore cafes through an interactive map. Whether you're a coffee aficionado or just looking for a cozy spot to work, CafeQuest connects you with hidden gems and the best places to enjoy coffee.

This project is a showcase of full-stack development, utilizing modern web technologies to create a responsive and user-friendly interface along with a scalable backend to store cafe data and user reviews.

## Features

- **Cafe Discovery**: Search for cafes by location, rating, and features (e.g., Wi-Fi, pet-friendly). *(BASICS DONE)*
- **User Reviews & Ratings**: Users can leave reviews, give star ratings, and upload photos. *(IN PROGRESS)*
- **User Authentication**: Register, log in, and manage user profiles. *(IN PROGRESS)*
- **Interactive Map**: View cafes on an interactive map using geolocation. *(DONE)*
- **Favorites**: Users can save cafes to their favorites for easy access. *(IN PROGRESS)*

## Technologies Used

- **Frontend**: React.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **Mapping & Geolocation**: OpenStreetMap, Leaflet.js
- **API Integration**: Nominatim API (for geolocation search), Overpass API (for querying OpenStreetMap data)
- **Database**: MongoDB with Mongoose for data modeling
- **Deployment**: Hosted on Heroku/Netlify (or another hosting platform)

## Setup Instructions

To run the project locally, follow these steps:

### Prerequisites

Ensure the following are installed:

- Node.js (v16 or above)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/CafeQuest.git

2. Navigate to the project folder:
 ```bash
cd CafeQuest
```

3. Install dependencies for both the frontend and backend:

   For the frontend:
```bash
cd client
npm install
```

   For the backend:
```bash
    cd ../server
    npm install
```
4. Set up environment variables:

    Create a .env file in the /server directory with the following variables:
```bash
    MONGODB_URI=your_mongo_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=5000
```
5. Start the application in development mode:
```bash
    npm run dev
```
    
Open your browser and start searching for cafes!
   - Allow location access to find cafes near you.
   - Use the search bar to search for cafes within a 5km radius.

Development Notes

    For a smooth development experience, make sure you’ve properly configured Leaflet for the client-side only (e.g., inside useEffect) to prevent errors related to SSR (Server-Side Rendering).
    If you encounter any issues in the development environment (e.g., window is not defined), ensure all client-side code (like map initialization) is wrapped in conditionals that check for the browser environment.
