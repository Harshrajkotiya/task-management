# Task Management Dashboard

A Task Management Dashboard built with React, Node.js, and Firebase Firestore.

## Project Structure

- `client/`: React frontend built with Vite.
- `server/`: Node.js Express backend.

## Prerequisites

- Node.js (v18 or later)
- Firebase Account

## Getting Started

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration and JWT secret.
4. Start the server (development mode):
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration.
4. Start the frontend (development mode):
   ```bash
   npm run dev
   ```

## Features

- [ ] User Authentication (Firebase + JWT)
- [ ] Task Dashboard (CRUD operations)
- [ ] Responsive Design
- [ ] Real-time updates with Firestore

## Linting & Formatting

- Frontend: ESLint + Prettier
- Backend: ESLint
