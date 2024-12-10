import { DataSource } from "typeorm";
import { CreateSuperAdminSeed } from "./create-super-admin.seed";

export const runSeeds = async (dataSource: DataSource) => {
  try {
    await CreateSuperAdminSeed(dataSource);
    console.log("All seeds completed successfully");
  } catch (error) {
    console.error("Error running seeds:", error);
    throw error;
  }
};
