import { DataSource } from "typeorm";
import { User } from "../entities/User";
import bcryptjs from "bcryptjs";
import { UserRole } from "@/lib/constants/enums";

export const CreateSuperAdminSeed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Check if super admin already exists
  const existingSuperAdmin = await userRepository.findOne({
    where: {
      email: "pankajpandey9589@gmail.com",
    },
  });

  if (!existingSuperAdmin) {
    // Hash the password
    const hashedPassword = await bcryptjs.hash("pankajpandey9589", 10);

    // Create super admin user
    const superAdmin = userRepository.create({
      firstName: "Pankaj",
      lastName: "Pandey",
      email: "pankajpandey9589@gmail.com",
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    });

    await userRepository.save(superAdmin);
    console.log("Super admin created successfully");
  } else {
    console.log("Super admin already exists");
  }
};
