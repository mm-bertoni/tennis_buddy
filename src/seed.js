// Database seeding script for sample data

import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from './db/client.js';
import { create } from './repositories/courtsRepo.js';
import { create as createUser } from './repositories/usersRepo.js';
import { create as createBuddy } from './repositories/buddiesRepo.js';
import { create as createReservation, hasOverlap } from './repositories/reservationsRepo.js';

// Sample data arrays
const courtNames = [
  'Court A',
  'Court B',
  'Court C',
  'Court D',
  'Court E',
  'Court F',
  'Court G',
  'Court H',
  'Court I',
  'Court J',
];
const surfaces = ['hard', 'clay', 'grass'];
const locations = [
  'Campus Recreation Center',
  'Outdoor Tennis Complex',
  'Student Union Building',
  'Downtown Sports Center',
  'Eastside Courts',
  'West End Arena',
];
const openHoures = [
  { start: '07:00', end: '22:00' },
  { start: '07:00', end: '22:00' },
  { start: '08:00', end: '20:00' },
  { start: '08:00', end: '20:00' },
  { start: '06:00', end: '23:00' },
  { start: '06:00', end: '21:00' },
];
const emails = [
  'northeastern.edu',
  'nyu.edu',
  'berkeley.edu',
  'stanford.edu',
  'mit.edu',
  'harvard.edu',
  'princeton.edu',
  'yale.edu',
];
const userNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Gabe'];
const skills = ['1.0-2.0', '2.5-3.0', '3.0-3.5', '3.5-4.0', '4.0-4.5', '4.5-5.0', '5.5+'];

// Generate database entries
const sampleCourts = [];
for (let i = 0; i < courtNames.length; i++) {
  for (let k = 0; k < surfaces.length; k++) {
    for (let j = 0; j < locations.length; j++) {
      for (let l = 0; l < openHoures.length; l++) {
        sampleCourts.push({
          name: courtNames[i],
          surface: surfaces[k],
          location: locations[j],
          openHours: openHoures[l],
        });
      }
    }
  }
}

const sampleUsers = [];
for (let i = 0; i < userNames.length; i++) {
  for (let l = 0; l < userNames.length; l++) {
    for (let j = 0; j < emails.length; j++) {
      for (let k = 0; k < skills.length; k++) {
        sampleUsers.push({
          name: userNames[i] + ' ' + userNames[l],
          email: `${userNames[i].toLowerCase()}.${userNames[l].toLowerCase()}@${emails[j]}`,
          skill: skills[k],
        });
      }
    }
  }
}

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

    // Load created users and courts to create related data
    const users = await db.collection('users').find({}).toArray();
    const courts = await db.collection('courts').find({}).toArray();

    // Seed buddy posts
    console.log('🤝 Seeding buddy posts...');
    const targetBuddyPosts = 100;
    let createdBuddy = 0;
    let buddyAttempts = 0;
    while (createdBuddy < targetBuddyPosts && buddyAttempts < targetBuddyPosts * 5) {
      buddyAttempts++;
      const user = users[Math.floor(Math.random() * users.length)];
      const skill = user.skill || skills[Math.floor(Math.random() * skills.length)];
      const hour = 7 + Math.floor(Math.random() * 12); // 7..18
      const availability = `Weekdays ${hour}:00 - ${hour + 1}:30`;
      const notes = [
        `Looking for hitting partner near ${user.name}`,
        'Open to singles or doubles',
        'Prefer morning sessions',
      ][Math.floor(Math.random() * 3)];
      await createBuddy({ userId: user._id, skill, availability, notes });
      createdBuddy++;
    }

    // Seed reservations
    console.log('📆 Seeding reservations...');
    const targetReservations = 100;
    let createdRes = 0;
    let resAttempts = 0;
    const today = new Date();
    const dateWindow = 21; // days ahead
    while (createdRes < targetReservations && resAttempts < targetReservations * 10) {
      resAttempts++;
      const user = users[Math.floor(Math.random() * users.length)];
      const court = courts[Math.floor(Math.random() * courts.length)];
      const dayOffset = Math.floor(Math.random() * dateWindow);
      const date = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().slice(0, 10);

      // choose a random start hour between 7 and 20, duration 1 or 2 hours
      const startHour = 7 + Math.floor(Math.random() * 14); // 7..20
      const duration = 1 + Math.floor(Math.random() * 2); // 1 or 2
      const start = `${String(startHour).padStart(2, '0')}:00`;
      const end = `${String(startHour + duration).padStart(2, '0')}:00`;

      const overlap = await hasOverlap({ courtId: court._id, date: dateStr, start, end });
      if (!overlap) {
        await createReservation({
          courtId: court._id,
          userId: user._id,
          date: dateStr,
          start,
          end,
        });
        createdRes++;
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(
      `📊 Seeded ${sampleCourts.length} courts, ${sampleUsers.length} users, ${createdBuddy || 0} buddy posts, and ${createdRes || 0} reservations`
    );
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly (cross-platform)
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  seedDatabase();
}

export { seedDatabase };
