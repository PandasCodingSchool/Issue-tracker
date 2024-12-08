"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUsers,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";
import { BiBuilding } from "react-icons/bi";
import { IRequestAccessCreate } from "@/lib/types/request";

const requestSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number format"),
  teamSize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]),
  message: z.string().optional(),
});

const teamSizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

export default function RequestAccess() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRequestAccessCreate>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: IRequestAccessCreate) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/request-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error instanceof Error ? error.message : "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Request Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Fill out the form below and we&apos;ll get back to you within 24 hours
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardBody className="gap-4">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
                  <FiCheckCircle className="h-6 w-6 text-success-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Request Submitted Successfully
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Thank you for your interest! We&apos;ll be in touch soon to help you
                  get started.
                </p>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => setSubmitSuccess(false)}
                  className="mt-4"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register("companyName")}
                  label="Company Name"
                  placeholder="Enter your company name"
                  startContent={<BiBuilding className="text-default-400" />}
                  errorMessage={errors.companyName?.message}
                  isInvalid={!!errors.companyName}
                />

                <Input
                  {...register("name")}
                  label="Your Name"
                  placeholder="Enter your full name"
                  startContent={<FiUser className="text-default-400" />}
                  errorMessage={errors.name?.message}
                  isInvalid={!!errors.name}
                />

                <Input
                  {...register("email")}
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  startContent={<FiMail className="text-default-400" />}
                  errorMessage={errors.email?.message}
                  isInvalid={!!errors.email}
                />

                <Input
                  {...register("phone")}
                  type="tel"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  startContent={<FiPhone className="text-default-400" />}
                  errorMessage={errors.phone?.message}
                  isInvalid={!!errors.phone}
                />

                <Select
                  {...register("teamSize")}
                  label="Team Size"
                  placeholder="Select team size"
                  startContent={<FiUsers className="text-default-400" />}
                  errorMessage={errors.teamSize?.message}
                  isInvalid={!!errors.teamSize}
                >
                  {teamSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </Select>

                <Textarea
                  {...register("message")}
                  label="Additional Information (Optional)"
                  placeholder="Tell us about your needs..."
                  startContent={<FiMessageSquare className="text-default-400" />}
                  errorMessage={errors.message?.message}
                  isInvalid={!!errors.message}
                />

                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
} 