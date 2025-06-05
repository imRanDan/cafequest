# ☕ CafeQuest

**Discover local cafes and save your favorites.**

CafeQuest helps you find nearby coffee spots using your current location. It’s built for people who want to explore new cafes, save places they love, and support local businesses — all through a clean, modern web interface.

---

## 🚀 Features

- 📍 **Cafe Discovery by Location** – Find cafes near you using a location search or GPS.
- 💾 **Save Cafes** – Bookmark cafes to your personal list when logged in.
- 🗺️ **Map Integration** – Interactive map powered by Leaflet and OpenStreetMap.
- 🔒 **Authentication** – Log in with Firebase Auth (Google sign-in).
- 🌓 **Dark Mode** – Seamless theme switching with Chakra UI and Next.js.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (App Router)
- **React 18**
- **Chakra UI**
- **Leaflet** + **React-Leaflet**
- **Framer Motion**
- **next-themes**

### Backend / Services
- **Firebase** (Auth + Firestore)
- **Nominatim API** (location search)
- **OpenStreetMap** + **Overpass API** (cafe data)

### Utilities & Tools
- **Axios**
- **lodash.debounce**
- **@react-google-maps/api** (exploring)
- **Zustand**, **bcryptjs**, and **figlet** (installed but *not currently used*)

---

## 🧪 In Progress

- ✅ Display saved cafes as cards
- 🖼️ Add fallback image for cafes with no photo
- 🔍 Search/filter for saved cafes
- 📱 Improved mobile UX
- 📍 "Nearby Cafes" via GPS
- 📬 "List Your Cafe" contact form

---

## 📦 Getting Started (Local Dev)

### Prerequisites

- Node.js 18+
- Firebase project (Firestore + Auth enabled)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/CafeQuest.git
cd CafeQuest

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a `.env.local` file in the root and add:

NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# 4. Run the app
npm run dev

