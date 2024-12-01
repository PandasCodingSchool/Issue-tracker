import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Organization } from "./entities/Organization";
import { Department } from "./entities/Department";
import { Issue } from "./entities/Issue";
import { Comment } from "./entities/Comment";
import { Attachment } from "./entities/Attachment";

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
    migrations: [],
    subscribers: [],
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
