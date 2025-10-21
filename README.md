# Tennis Buddy 🎾

**Campus Tennis Court & Hitting Buddy Finder**

A web application that helps students find and book tennis courts on campus while connecting with other players of similar skill levels.

## Project Information

- **Course**: CS5610 Web Development
- **Author**: [Shaobo Chen & Muchen Qi]
- **Class Link**: [https://johnguerra.co/classes/webDevelopment_online_fall_2025/Links to an external site.]
- **Repository**: [github.com/GideonCCC/tennis_buddy](https://github.com/GideonCCC/tennis_buddy)
- **Database**: MongoDB Atlas (Cloud)
- **Status**: ✅ Development Environment Ready
- **Live Demo**: [To be deployed] (Note->Missing a link to the deployed site) 

## Current Setup Status

✅ **Repository cloned** from `git@github.com:GideonCCC/tennis_buddy.git`  
✅ **Dependencies installed** (228 packages)  
✅ **MongoDB Atlas configured** - Connected to cloud database  
✅ **Database seeded** - 1,080 courts, 4,536 users, 100 buddy posts, 100 reservations  
✅ **Development server ready** - Ready to run on `http://localhost:3000`

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

## Mock up

📄 **[View Full Mockup Document (PDF)](public/submissions/CS5610_Project02_Tennis_Buddy.pdf)**

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

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB (native driver)
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Database**: MongoDB Atlas (Cloud Database)
- **Development Tools**: ESLint, Prettier, Nodemon
- **Deployment**: Render/Railway (ready to deploy)

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher) ✅ Installed
- MongoDB Atlas Account ✅ Configured

### Quick Start (Current Setup)

**This project is already configured and ready to run!** 

The environment is set up with:
- ✅ Dependencies installed
- ✅ MongoDB Atlas connected
- ✅ Database seeded with sample data
- ✅ Environment variables configured

**To start the development server:**

```bash
npm run dev
```

Then open your browser and navigate to `http://localhost:3000`

### Environment Variables (Already Configured)

The `.env` file is configured with:

```env
# MongoDB Configuration (Atlas Cloud)
MONGO_URI=mongodb+srv://812249072:****@cluster0.mjacxti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=tennis_buddy
PORT=3000

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-change-this-in-production

# Node Environment
NODE_ENV=development
```



### Production Deployment

**MongoDB Atlas is already configured!** You can use the same database for production or create a separate production database.

#### Using Render (Recommended)

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service** with these settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node.js

3. **Set environment variables** in Render dashboard:
   - `MONGO_URI`: `mongodb+srv://812249072:****@cluster0.mjacxti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
   - `DB_NAME`: `tennis_buddy` (or `tennis_buddy_prod` for separate prod DB)
   - `JWT_SECRET`: Strong secret key for production
   - `NODE_ENV`: `production`

4. **Deploy** and get your live URL

#### Using Railway

1. **Connect your GitHub repository** to Railway
2. **Add environment variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string (same as above)
   - `DB_NAME`: `tennis_buddy` (or create separate prod database)
   - `JWT_SECRET`: Strong secret key for production
   - `NODE_ENV`: `production`
3. **Deploy** automatically

#### Production Database Options

**Option 1: Use existing database** (Quick deployment)
- Use the same `tennis_buddy` database already seeded
- Set `DB_NAME=tennis_buddy` in production

**Option 2: Separate production database** (Recommended)
- Create a new database in MongoDB Atlas: `tennis_buddy_prod`
- Set `DB_NAME=tennis_buddy_prod` in production
- Run `npm run seed` once after deployment to populate production data

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

## Database Information

### Current Database Status

The MongoDB Atlas database is **seeded and ready** with:
- **1,080 Courts** - Various surfaces (hard, clay, grass) across 6 locations
- **4,536 Users** - Different skill levels from 1.0 to 5.5+
- **100 Buddy Posts** - Sample posts from users looking for hitting partners
- **100 Reservations** - Sample court bookings for the next 21 days

### Database Collections

| Collection | Document Count | Description |
|------------|----------------|-------------|
| `courts` | 1,080 | Tennis courts with surface, location, and hours |
| `users` | 4,536 | User profiles with email, name, and skill level |
| `buddy_posts` | 100 | Posts from users seeking hitting partners |
| `reservations` | 100 | Court bookings with date and time slots |

### Accessing MongoDB Atlas

- **Dashboard**: [cloud.mongodb.com](https://cloud.mongodb.com)
- **Cluster**: `cluster0.mjacxti.mongodb.net`
- **Database**: `tennis_buddy`

You can view and manage your data through the MongoDB Atlas web interface.

## Development Commands

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Seed/reseed database (takes 2-3 minutes)
npm run seed

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Troubleshooting

**Port 3000 already in use?**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in .env file
PORT=3001
```

**Database connection issues?**
- Check your MongoDB Atlas IP whitelist (Network Access)
- Verify your database credentials in the `.env` file
- Ensure your internet connection is stable

## Project Structure

```
tennis-buddy/
├── public/                        # Static frontend files
│   ├── css/                       # Stylesheets
│   │   ├── auth.css              # Authentication pages styling
│   │   ├── base.css              # Base styles and variables
│   │   └── pages/                # Page-specific styles
│   │       ├── buddies.css       # Buddy board page
│   │       ├── home.css          # Home page
│   │       └── reservations.css  # Reservations page
│   ├── js/                       # Client-side JavaScript
│   │   ├── api/                  # API client functions
│   │   │   ├── buddiesApi.js    # Buddy posts API calls
│   │   │   ├── courtsApi.js     # Courts API calls
│   │   │   ├── http.js          # HTTP utilities
│   │   │   └── reservationsApi.js # Reservations API calls
│   │   ├── pages/                # Page-specific logic
│   │   │   ├── buddies.js       # Buddy board functionality
│   │   │   ├── home.js          # Home page functionality
│   │   │   ├── login.js         # Login page
│   │   │   ├── reservations.js  # Reservations page
│   │   │   └── signup.js        # Signup page
│   │   ├── utils/                # Utility functions
│   │   │   ├── auth.js          # Authentication helpers
│   │   │   ├── buddyActions.js  # Buddy post actions
│   │   │   ├── confirmModal.js  # Confirmation modal
│   │   │   ├── editBuddyModal.js    # Edit buddy modal
│   │   │   ├── editReservationModal.js # Edit reservation modal
│   │   │   └── reservationActions.js   # Reservation actions
│   │   ├── views/                # DOM rendering helpers
│   │   │   └── renderCards.js   # Card rendering utilities
│   │   └── main.js              # Main entry point
│   ├── img/                      # Images and screenshots
│   │   ├── demo-buddies.png     # Buddy board screenshot
│   │   ├── demo-home.png        # Home page screenshot
│   │   ├── demo-login.png       # Login page screenshot
│   │   └── demo-reservations.png # Reservations screenshot
│   ├── submissions/              # Project submissions
│   │   └── CS5610_Project02_Tennis_Buddy.pdf # Mockup document
│   ├── index.html               # Home page
│   ├── buddies.html             # Buddy board page
│   ├── reservations.html        # Reservations page
│   ├── login.html               # Login page
│   └── signup.html              # Signup page
├── src/                          # Server-side code
│   ├── db/                       # Database configuration
│   │   └── client.js            # MongoDB connection
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   ├── rateLimit.js         # Rate limiting
│   │   └── validate.js          # Input validation
│   ├── repositories/             # Data access layer
│   │   ├── buddiesRepo.js       # Buddy posts repository
│   │   ├── courtsRepo.js        # Courts repository
│   │   ├── reservationsRepo.js  # Reservations repository
│   │   └── usersRepo.js         # Users repository
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── buddies.js           # Buddy posts routes
│   │   ├── courts.js            # Courts routes
│   │   ├── reservations.js      # Reservations routes
│   │   └── users.js             # Users routes
│   ├── app.js                   # Express app configuration
│   ├── server.js                # Server entry point
│   └── seed.js                  # Database seeding script
├── .env                          # Environment variables (not in git)
├── .gitignore                   # Git ignore file
├── AUTHENTICATION_IMPLEMENTATION.md # Auth documentation
├── LICENSE                      # MIT License
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Dependency lock file
└── README.md                    # This file
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
![Login page](public/img/demo-login.png)
_Login page showing log in functionality_

![Home Page](public/img/demo-home.png)
_Home page showing court search functionality_

![Reservations](public/img/demo-reservations.png)
_Reservations page with booking form_

![Buddy Board](public/img/demo-buddies.png)
_Buddy board with available hitting partners_
