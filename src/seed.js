// Database seeding script for sample data

import 'dotenv/config';
import { connect } from './db/client.js';
import { create } from './repositories/courtsRepo.js';
import { create as createUser } from './repositories/usersRepo.js';

const sampleCourts = [
  {
    name: 'Campus Recreation Center Court 1',
    surface: 'hard',
    location: 'Campus Recreation Center',
    openHours: { start: '07:00', end: '22:00' }
  },
  {
    name: 'Campus Recreation Center Court 2',
    surface: 'hard',
    location: 'Campus Recreation Center',
    openHours: { start: '07:00', end: '22:00' }
  },
  {
    name: 'Outdoor Tennis Complex Court A',
    surface: 'clay',
    location: 'Outdoor Tennis Complex',
    openHours: { start: '08:00', end: '20:00' }
  },
  {
    name: 'Outdoor Tennis Complex Court B',
    surface: 'clay',
    location: 'Outdoor Tennis Complex',
    openHours: { start: '08:00', end: '20:00' }
  },
  {
    name: 'Student Union Court',
    surface: 'hard',
    location: 'Student Union Building',
    openHours: { start: '06:00', end: '23:00' }
  }
];

const sampleUsers = [
  {
    email: 'alice.johnson@university.edu',
    name: 'Alice Johnson',
    skill: '3.0-3.5'
  },
  {
    email: 'bob.smith@university.edu',
    name: 'Bob Smith',
    skill: '4.0-4.5'
  },
  {
    email: 'carol.davis@university.edu',
    name: 'Carol Davis',
    skill: '2.5-3.0'
  },
  {
    email: 'david.wilson@university.edu',
    name: 'David Wilson',
    skill: '3.5-4.0'
  }
];

async function seedDatabase() {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const DB_NAME = process.env.DB_NAME || 'tennis_buddy';
    
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    const db = await connect(MONGO_URI, DB_NAME);
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing sample data...');
    await db.collection('courts').deleteMany({});
    await db.collection('users').deleteMany({ email: { $regex: /@university\.edu$/ } });
    await db.collection('buddy_posts').deleteMany({});
    await db.collection('reservations').deleteMany({});
    
    // Seed courts
    console.log('🏟️ Seeding courts...');
    for (const court of sampleCourts) {
      await create(court);
    }
    
    // Seed users
    console.log('👥 Seeding users...');
    for (const user of sampleUsers) {
      await createUser(user);
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded ${sampleCourts.length} courts and ${sampleUsers.length} users`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
