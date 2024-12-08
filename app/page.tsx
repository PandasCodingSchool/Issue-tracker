"use client";

import { Button, Card, CardBody } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";
import {
  FiShield,
  FiClock,
  FiUsers,
  FiTrendingUp,
  FiGlobe,
  FiLock,
} from "react-icons/fi";

const features = [
  {
    name: "Real-time Collaboration",
    description:
      "Work together seamlessly with your team in real-time. Track changes, assign tasks, and stay updated.",
    icon: FiUsers,
  },
  {
    name: "Fast Performance",
    description:
      "Lightning-fast issue tracking and management. No more waiting for pages to load.",
    icon: FiTrendingUp,
  },
  {
    name: "24/7 Support",
    description:
      "Round-the-clock support to help you with any questions or issues you might have.",
    icon: FiClock,
  },
  {
    name: "Global Access",
    description:
      "Access your projects from anywhere in the world. Stay connected with your team.",
    icon: FiGlobe,
  },
  {
    name: "Enterprise Security",
    description:
      "Bank-grade security to protect your data. Regular backups and encryption.",
    icon: FiShield,
  },
  {
    name: "Privacy First",
    description:
      "Your data belongs to you. We never share or sell your information to third parties.",
    icon: FiLock,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Track Issues</span>{" "}
                  <span className="block text-primary">Like Never Before</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline your workflow with our powerful issue tracking system.
                  Built for teams who want to get things done efficiently.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Button
                    as={Link}
                    href="/request-access"
                    color="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={Link}
                    href="/about"
                    variant="bordered"
                    size="lg"
                    className="w-full sm:w-auto mt-3 sm:mt-0"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides all the tools you need to manage your projects
              effectively.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardBody className="gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {feature.name}
                            </h3>
                            <p className="mt-2 text-base text-gray-500">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
