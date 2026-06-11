# SpotiMERN - Full Stack Music Library Capstone

SpotiMERN is a comprehensive, interactive music catalogue and library application designed for administrators and users. It features persistent global music playback, playlist curation, responsive layouts, client/server validation, and custom user notification streams.

---

## 📂 Project Structure

The project is divided into two primary workspaces:
*   **`/backend`**: Node.js & Express REST API utilizing MongoDB Mongoose ODM schemas, role-based middlewares, express-validators, and Jest/Supertest suites.
*   **`/frontend`**: React SPA built with TypeScript, Vite, React Context APIs (for Auth and Audio states), React Router, Axios HTTP client, and custom Bootstrap styling.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, TypeScript, Vite, React Router, Axios, Bootstrap 5 (CSS & JS bundle), custom responsive CSS variables.
*   **Backend**: Node.js, Express.js, JWT Authentication (stored in localStorage), Mongoose (ODM), express-validator.
*   **Database**: MongoDB (Atlas or Local Instance).
*   **Testing**: Jest, Supertest.

---

## 🌟 Implemented Features

### User Capabilities
1.  **Authentication**: Register and Login with personal details (Name, Email, 10-digit Phone, Password) and standard user session persistence.
2.  **Music Catalogue**: Browse and search active tracks by artist, album, genre, or director.
3.  **Details Panel**: Select card actions to play the track, showing duration, album cover, and release date details.
4.  **Global persistent Audio Player**: Interactive player stickied to the bottom of the screen featuring play, pause, timelines, volume control, skipping tracks, repeat loops, and shuffle modes.
5.  **Playlist Management**: Full CRUD operations on custom playlists. Users can search and insert tracks into individual playlists, filter playlist tracks, or remove them.
6.  **Interactive Notifications**: Receive unread notification badges when new music is added by administrators, with options to dismiss/clear notifications locally from the user's dashboard.
7.  **Profile Dashboard**: View and update personal details (Name, Email/Gmail, and Phone number) with full client-side format validation.

### Administrator Capabilities
1.  **Auth Guards**: Separate secure login portals and role guards preventing standard users from accessing administrator actions.
2.  **Song CRUD Management**: Create new tracks (verifying fields like custom durations `MM:SS`), update existing metadata, and delete entries.
3.  **Visibility Controls**: Toggle a track's visibility state. Hidden songs are blocked from user searches but remain editable by administrators.
4.  **Broadcast alerts**: Auto-broadcast notification events to all active users when seeding or adding a new track.
5.  **User Moderation Panel**: View all registered users (Name, Email, Phone, Joined date) and delete accounts, with restrictions blocking admins from self-deleting their active profile.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure your environment variables inside a `.env` file in `/backend`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/music-library
    JWT_SECRET=your_jwt_secret_token_here
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Integration Tests

We have written an integration test suite for the REST API endpoints using Jest and Supertest.

To execute the test suite:
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Run tests sequentially:
    ```bash
    npm test
    ```

The tests cover:
*   **Auth**: User registration, login payloads, and invalid credential blocks.
*   **Profile**: Fetching details, updating profiles, and validation checking.
*   **Playlists**: Playlist CRUD and duplicate track validations.
*   **Notifications**: Real-time listing and user dismissal checks.
