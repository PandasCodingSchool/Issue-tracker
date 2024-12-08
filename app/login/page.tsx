"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginCredentials } from "@/lib/types/auth";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Checkbox,
  Link as NextUILink,
  Divider,
} from "@nextui-org/react";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem("auth_token", result.data.token);

      // Redirect based on user role
      if (result.data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/request-access"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            request access to the platform
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full">
          <CardBody className="gap-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-danger-50 text-danger"
              >
                <FiAlertCircle />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register("email")}
                type="email"
                label="Email"
                placeholder="Enter your email"
                startContent={<FiMail className="text-default-400" />}
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
              />

              <Input
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Enter your password"
                startContent={<FiLock className="text-default-400" />}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
              />

              <div className="flex items-center justify-between">
                <Checkbox defaultSelected size="sm">
                  Remember me
                </Checkbox>
                <NextUILink
                  as={Link}
                  href="/forgot-password"
                  size="sm"
                  className="text-primary"
                >
                  Forgot password?
                </NextUILink>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <Divider className="my-4" />

            <div className="text-center text-small">
              Need an account?{" "}
              <NextUILink
                as={Link}
                href="/request-access"
                size="sm"
                className="text-primary"
              >
                Request Access
              </NextUILink>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 