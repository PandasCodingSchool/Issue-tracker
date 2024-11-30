import { initializeDatabase } from ".";

// This will be called once at startup
const dbPromise = initializeDatabase();

export default dbPromise;
