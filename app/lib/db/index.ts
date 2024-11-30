import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Organization } from "./entities/Organization";
import { Department } from "./entities/Department";
import { Issue } from "./entities/Issue";
import { Comment } from "./entities/Comment";
import { Attachment } from "./entities/Attachment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "issue_tracker",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User, Organization, Department, Issue, Comment, Attachment],
  migrations: ["app/lib/db/migrations/**/*.ts"],
  subscribers: ["app/lib/db/subscribers/**/*.ts"],
});

export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};
