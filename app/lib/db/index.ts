import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "./entities";

declare global {
  // eslint-disable-next-line no-var
  var dbConnection: DataSource | undefined;
}

const createDataSource = () =>
  new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "issue_tracker",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: Object.values(entities),
    migrations: [],
    subscribers: [],
  });

export const AppDataSource = global.dbConnection || createDataSource();

if (process.env.NODE_ENV !== "production") {
  global.dbConnection = AppDataSource;
}

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      console.log("Initializing database connection...");
      await AppDataSource.initialize();
      console.log("Database connection initialized successfully");
    } else if (!AppDataSource.isConnected) {
      console.log("Reconnecting to database...");
      await AppDataSource.connect();
      console.log("Database reconnected successfully");
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error with database connection:", error);

    // If there's a connection error, try to create a new connection
    if (!global.dbConnection?.isConnected) {
      console.log("Attempting to create new connection...");
      global.dbConnection = createDataSource();
      await global.dbConnection.initialize();
      console.log("New connection established successfully");
      return global.dbConnection;
    }

    throw error;
  }
};

// Helper function to get repositories
export const getRepositories = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error("Database not initialized");
  }

  return {
    users: AppDataSource.getRepository(entities.User),
    organizations: AppDataSource.getRepository(entities.Organization),
    departments: AppDataSource.getRepository(entities.Department),
    issues: AppDataSource.getRepository(entities.Issue),
    comments: AppDataSource.getRepository(entities.Comment),
    attachments: AppDataSource.getRepository(entities.Attachment),
    requestAccess: AppDataSource.getRepository(entities.RequestAccess),
  };
};
