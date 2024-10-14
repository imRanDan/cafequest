# CafeQuest

## Description
CafeQuest is a web application that allows users to discover, review, and rate local cafes. The app aims to enhance the cafe experience by connecting users to hidden gems, trendy spots, and the best places to get coffee.

This project showcases full-stack development using modern web technologies and focuses on creating a user-friendly interface while providing a scalable backend for storing cafe data and user reviews.

## Features
- **Cafe Discovery**: Search for cafes by location, rating, and features (e.g., Wi-Fi, pet-friendly).
- **User Reviews & Ratings**: Users can leave reviews, give star ratings, and upload photos.
- **User Authentication**: Register, log in, and manage user profiles.
- **Interactive Map**: View cafes on a map using geolocation.
- **Favorites**: Users can save cafes to their favorites for easy access.

## Technologies Used
- **Frontend**: React.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **API Integration**: Google Maps API for geolocation and cafe listings
- **Database**: MongoDB with Mongoose for data modeling
- **Deployment**: Hosted on Heroku/Netlify (or other hosting platform)

## Setup Instructions
To run the project locally, follow these steps:

### Prerequisites
Make sure you have the following installed:
- Node.js (v16 or above)
- MongoDB (local or cloud instance)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/CafeQuest.git
   ```
2. **Navigate to the project folder:**
```bash
  cd CafeQuest
```
3. ***Install dependencies for both frontend and backend:***
  ```bash
  cd client
npm install
cd ../server
npm install
```
4. ***Set up environment variables:**Create a .env file in the /server directory with the following variables:
```bash
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
5. ***Start with npm run dev***
```bash
  npm run dev
```
6. Start searching for Cafes!
- allow location and get searching with the searchbar for locations of interest! It will find cafes within a 5km radius.
