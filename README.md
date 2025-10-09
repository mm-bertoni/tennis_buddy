# Tennis Buddy 🎾

**Campus Tennis Court & Hitting Buddy Finder**

A web application that helps students find and book tennis courts on campus while connecting with other players of similar skill levels.

## Project Information

- **Course**: CS5610 Web Development
- **Author**: [Your Name]
- **Class Link**: [Course Link]
- **Live Demo**: [Deployment URL]

## Project Objective

Tennis Buddy addresses the common problem of finding available tennis courts and hitting partners on campus. Students often struggle to coordinate court bookings and find players of similar skill levels for practice sessions. This application provides a centralized platform where students can:

1. **Search and book available tennis courts** with real-time availability checking
2. **Find hitting partners** by posting their availability and skill level
3. **Manage their reservations** and connect with the tennis community

The application solves real pain points faced by tennis players on campus, making it easier to organize practice sessions and build a stronger tennis community.

## Target Users

### Persona 1: Sarah - The Busy Graduate Student

- **Background**: 24-year-old PhD student in Computer Science
- **Tennis Experience**: Intermediate player (3.0-3.5 NTRP rating)
- **Pain Points**: Limited free time, difficulty finding courts during peak hours, wants to find consistent hitting partners
- **Goals**: Efficiently book courts during her limited free time and connect with players of similar skill level

### Persona 2: Mike - The Social Tennis Enthusiast

- **Background**: 20-year-old undergraduate in Business
- **Tennis Experience**: Advanced player (4.0+ NTRP rating)
- **Pain Points**: Wants to find competitive matches, looking to improve his game
- **Goals**: Find skilled hitting partners for competitive practice and potentially join tennis tournaments

## User Stories

- **As a student**, I want to search for available tennis courts by date so that I can find when courts are free for booking
- **As a student**, I want to book a tennis court reservation so that I can secure a time slot for playing
- **As a student**, I want to post my availability and skill level so that other players can find me as a hitting partner
- **As a student**, I want to browse available hitting partners by skill level so that I can find compatible players
- **As a student**, I want to view my current reservations so that I can manage my court bookings
- **As a student**, I want to cancel reservations so that I can free up courts for other players
- **As a student**, I want to see court information including location and surface type so that I can choose the best court for my needs
- **As a student**, I want to filter buddy posts by skill level so that I can find players at my level

## Data Model

The application uses MongoDB with the following collections:

### Users Collection

```javascript
{
  "_id": "ObjectId",
  "email": "student@university.edu",
  "name": "Student Name",
  "skill": "3.0-3.5",
  "createdAt": "2025-01-04T10:00:00Z"
}
```

### Courts Collection

```javascript
{
  "_id": "ObjectId",
  "name": "Campus Court 1",
  "surface": "hard",
  "location": "Campus Recreation Center",
  "openHours": {
    "start": "07:00",
    "end": "22:00"
  },
  "createdAt": "2025-01-04T10:00:00Z"
}
```

### Reservations Collection

```javascript
{
  "_id": "ObjectId",
  "courtId": "ObjectId",
  "userId": "ObjectId",
  "date": "2025-01-20",
  "start": "18:00",
  "end": "19:00",
  "status": "booked",
  "createdAt": "2025-01-04T15:00:00Z"
}
```

### Buddy Posts Collection

```javascript
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "skill": "3.0-3.5",
  "availability": "Weeknights 6-8pm",
  "notes": "Looking for singles matches",
  "isOpen": true,
  "createdAt": "2025-01-04T15:00:00Z"
}
```

## Design Mockups

![Home Page Design](public/img/mockup-home.png)
_Home page showing court search and buddy board_

![Reservations Page Design](public/img/mockup-reservations.png)
_Reservations page for booking and managing court reservations_

![Buddies Page Design](public/img/mockup-buddies.png)
_Buddies page for posting and finding hitting partners_

## Data Model Diagram

![Data Model Diagram](public/img/data-model.png)
_Entity relationship diagram showing collections and their relationships_

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB (native driver)
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Database**: MongoDB
- **Development Tools**: ESLint, Prettier, Nodemon
- **Deployment**: Render/Railway + MongoDB Atlas

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd tennis-buddy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your MongoDB connection string:

   ```
   MONGO_URI=mongodb://localhost:27017
   DB_NAME=tennis_buddy
   PORT=3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

#### Using Render (Recommended)

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service** with these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node.js

3. **Set environment variables** in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `DB_NAME`: `tennis_buddy_prod`
   - `NODE_ENV`: `production`

4. **Deploy** and get your live URL

#### Using Railway

1. **Connect your GitHub repository** to Railway
2. **Add environment variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `DB_NAME`: `tennis_buddy_prod`
3. **Deploy** automatically

## API Endpoints

### Courts

- `GET /api/v1/courts` - List all courts (with optional filters)
- `GET /api/v1/courts/:id` - Get specific court
- `POST /api/v1/courts` - Create new court (admin)
- `PATCH /api/v1/courts/:id` - Update court
- `DELETE /api/v1/courts/:id` - Delete court

### Reservations

- `GET /api/v1/reservations` - List reservations (with filters)
- `GET /api/v1/reservations/:id` - Get specific reservation
- `POST /api/v1/reservations` - Create new reservation
- `PATCH /api/v1/reservations/:id` - Update reservation
- `DELETE /api/v1/reservations/:id` - Cancel reservation

### Buddy Posts

- `GET /api/v1/buddies` - List buddy posts (with skill filter)
- `GET /api/v1/buddies/:id` - Get specific buddy post
- `POST /api/v1/buddies` - Create new buddy post
- `PATCH /api/v1/buddies/:id` - Update buddy post
- `PATCH /api/v1/buddies/:id/close` - Close buddy post
- `DELETE /api/v1/buddies/:id` - Delete buddy post

### Users

- `GET /api/v1/users/me` - Get current user (demo)
- `POST /api/v1/users` - Create new user

### Authentication

- `POST /api/v1/auth/signup` - Create a new account and receive a JWT
- `POST /api/v1/auth/login` - Log in with user email and password

## Features

### ✅ Core Features

- [x] Court search and availability checking
- [x] Court reservation system with conflict prevention
- [x] Buddy posting and finding system
- [x] User reservation management
- [x] Responsive design for mobile and desktop
- [x] Real-time form validation
- [x] Error handling and user feedback

### 🔒 Security Features

- [x] Input validation and sanitization
- [x] Rate limiting to prevent abuse
- [x] CORS configuration
- [x] Helmet.js security headers
- [x] Environment variable protection

### 📱 User Experience

- [x] Clean, modern interface
- [x] Intuitive navigation
- [x] Loading states and feedback
- [x] Mobile-responsive design
- [x] Accessibility considerations

## Development Commands

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
tennis-buddy/
├── public/                 # Static files
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   │   ├── api/          # API client functions
│   │   ├── views/        # DOM rendering helpers
│   │   └── pages/        # Page-specific logic
│   ├── img/              # Images and mockups
│   └── *.html            # HTML pages
├── src/                   # Server-side code
│   ├── db/               # Database connection
│   ├── repositories/     # Data access layer
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   ├── app.js           # Express app configuration
│   └── server.js        # Server entry point
├── .env.example          # Environment variables template
├── .eslintrc.cjs        # ESLint configuration
├── .prettierrc          # Prettier configuration
├── package.json         # Dependencies and scripts
├── LICENSE              # MIT License
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for CS5610 Web Development course
- Inspired by real campus tennis court booking challenges
- Uses modern web development best practices

## Demo Screenshots

![Home Page](public/img/demo-home.png)
_Home page showing court search functionality_

![Reservations](public/img/demo-reservations.png)
_Reservations page with booking form_

![Buddy Board](public/img/demo-buddies.png)
_Buddy board with available hitting partners_
