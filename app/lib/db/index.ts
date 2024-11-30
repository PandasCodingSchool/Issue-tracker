import "reflect-metadata";
import { DataSource } from "typeorm";
import {
  User,
  Organization,
  Department,
  Issue,
  Comment,
  Attachment,
} from "./entities";

declare global {
  // eslint-disable-next-line no-var
  var dbConnection: DataSource | undefined;
}

export const AppDataSource =
  global.dbConnection ||
  new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "issue_tracker",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
    entities: [User, Organization, Department, Issue, Comment, Attachment],
    migrations: ["app/lib/db/migrations/**/*.ts"],
    subscribers: ["app/lib/db/subscribers/**/*.ts"],
  });

if (process.env.NODE_ENV !== "production") {
  global.dbConnection = AppDataSource;
}

export const initializeDatabase = async () => {
  try {
    console.log("Initializing database...");
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return AppDataSource;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

// Helper function to get repositories
export const getRepositories = () => {
  if (!AppDataSource.isInitialized) {
    throw new Error("Database not initialized");
  }

  return {
    users: AppDataSource.getRepository(User),
    organizations: AppDataSource.getRepository(Organization),
    departments: AppDataSource.getRepository(Department),
    issues: AppDataSource.getRepository(Issue),
    comments: AppDataSource.getRepository(Comment),
    attachments: AppDataSource.getRepository(Attachment),
  };
};
