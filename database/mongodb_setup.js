// ANTIGRAVITY DIGITAL LIBRARY
// MongoDB Setup & Seeding Script

// Connect to the local MongoDB database
// Execute this script inside mongosh or Robo 3T:
//   mongosh mongodb://localhost:27017/antigravity_library mongodb_setup.js

db = db.getSiblingDB('antigravity_library');

// Drop existing collections to start fresh
db.reading_logs.drop();
db.search_activities.drop();

// Create collections
db.createCollection('reading_logs');
db.createCollection('search_activities');

// Insert Seed Data for Reading Logs (Activity History)
db.reading_logs.insertMany([
  {
    userId: 2,
    bookId: 1,
    pagesRead: 45,
    timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    userId: 2,
    bookId: 3,
    pagesRead: 20,
    timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    userId: 2,
    bookId: 5,
    pagesRead: 85,
    timestamp: new Date() // Today
  }
]);

// Insert Seed Data for Search Activities (Semantic Search suggestions & logs)
db.search_activities.insertMany([
  {
    userId: 2,
    query: "beginner friendly programming books",
    timestamp: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 2,
    query: "books on artificial intelligence",
    timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    userId: 2,
    query: "database systems architecture",
    timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000)
  }
]);

print("MongoDB: 'antigravity_library' collections seeded successfully!");
