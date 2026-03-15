# ASA Lost & Found System

A modern MERN stack web application designed for the campus community to report lost items and return found belongings.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT.
- **Lost and Found Reporting**: Detailed forms with image upload support for items.
- **Claim System**: Verification workflow for claiming found items.
- **Admin Dashboard**: Specialized interface for administrators to approve/reject claims and manage listings.
- **Real-time Notifications**: Instant feedback for claim status updates.
- **Search & Filter**: Search functionality with category-based filtering.
- **Security**: Implemented Helmet, XSS-clean, rate limiting, and server-side validation.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, Zustand (State Management), Sonner (Notifications), Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose ODM.
- **Media Storage**: Local storage for item images using Multer.

---

## 🏃 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lost-found-system
```

### 2. Backend Setup

1. **Navigate to the server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```

4. **Start the server**:
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```
   The server will run at `http://localhost:5000`.

### 3. Frontend Setup

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:5173`.

---

## 📂 Project Structure

```text
lost-found-system/
├── client/              # React frontend
│   ├── src/
│   │   ├── component/   # Reusable UI components
│   │   ├── pages/       # Page components (Dashboard, Report, etc.)
│   │   ├── store/       # Zustand state management
│   │   └── api/         # Axios configuration
├── server/              # Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Auth, validation, rate-limiting
│   └── uploads/         # Local item images 
```

## 🛡️ Security Features

- **Input Validation**: `express-validator` and custom frontend error highlighting.
- **Data Protection**: `helmet` headers and `xss-clean` to prevent malicious scripts.
- **Rate Limiting**: Protection against brute force attacks.
- **Duplicate Detection**: Prevents multiple identical reports from the same user.