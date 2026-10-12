# YouTube MERN Project

A full-stack video-sharing application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

## Features

- User registration and login
- JWT-based authentication
- Video upload and management
- Video listing and playback
- Like and unlike videos
- Comments: add, edit, delete, and like
- Cloudinary integration for media uploads
- Protected routes and middleware

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## Project Structure

```text
youtube-mern-project/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── README.md
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB database
- Cloudinary account

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/RajKamal09/youtube-mern-project.git
cd youtube-mern-project
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file using the environment-variable names required by the backend configuration.

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Start the backend

From the backend directory, run the start command defined in `backend/package.json`.

## Environment Variables

Configure the backend environment variables for MongoDB, JWT authentication, and Cloudinary using your local `.env` file.

**Never commit `.env` files, API secrets, passwords, or private tokens to GitHub.**

## Future Improvements

- Video search and filtering
- Video categories and sorting
- Responsive UI improvements
- Deployment

## Author

RajKamal09

## License

This project is currently intended for learning and portfolio purposes.