import { AppDataSource } from "./index.js";
import { runSeeds } from "./seeds";

AppDataSource.initialize()
  .then(async () => {
    try {
      await runSeeds(AppDataSource);
      process.exit(0);
    } catch (error) {
      console.error("Error during seeding:", error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Error initializing database:", error);
    process.exit(1);
  });
