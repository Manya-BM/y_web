# Y-Ultimate Management System

A unified web platform for Y-Ultimate to manage tournaments and coaching programmes.

## Features

- Tournament management (creation, scheduling, team registration)
- Team management (roster, approval, jersey verification)
- Match tracking with scoring events
- Spirit scoring system with five categories
- Role-based access control with 7 user roles
- Coaching programme management

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React, Redux, Bootstrap
- **Authentication**: JWT

## Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend && npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   NODE_ENV=development
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

```
# Run both frontend and backend
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client
```

## User Roles

- **Tournament Director**: Full access to tournament management
- **Team Manager**: Team registration and roster management
- **Field Official**: Match scoring and updates
- **Tech Team**: System administration
- **Player**: Limited access to team information
- **Visitor**: Tournament attendance
- **Public**: View-only access to public information

## License

This project is licensed under the [MIT License](LICENSE).

With Login (Authenticated Access):
As Tournament Director (director@yultimate.com):
✅ Full access to everything
✅ Create tournaments
✅ Manage teams (approve/reject)
✅ Create and manage matches
✅ Submit spirit scores
✅ Access coaching dashboard
✅ View analytics
As Team Manager (manager@yultimate.com):
✅ Register teams
✅ Manage team rosters
✅ Submit spirit scores
✅ Access coaching dashboard
✅ View team statistics
As Player (john@yultimate.com):
✅ View tournaments
✅ View matches
✅ View spirit scores
✅ Update profile
❌ Cannot create tournaments
❌ Cannot access coaching dashboard