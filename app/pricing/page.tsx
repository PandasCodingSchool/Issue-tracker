"use client";

import { Button, Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { FiCheck } from "react-icons/fi";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 team members",
      "Basic issue tracking",
      "Email support",
      "1GB storage",
      "API access",
    ],
    color: "default",
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing teams with advanced needs",
    features: [
      "Up to 50 team members",
      "Advanced issue tracking",
      "Priority email support",
      "10GB storage",
      "API access",
      "Custom fields",
      "Advanced reporting",
    ],
    color: "primary",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom requirements",
    features: [
      "Unlimited team members",
      "Enterprise issue tracking",
      "24/7 phone & email support",
      "Unlimited storage",
      "API access",
      "Custom fields",
      "Advanced reporting",
      "Custom integrations",
      "Dedicated account manager",
    ],
    color: "secondary",
  },
] as const;

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Plans for teams of all sizes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose the perfect plan for your team. All plans include a 14-day free trial.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`h-full ${
                      plan.popular ? "border-2 border-primary" : ""
                    }`}
                  >
                    <CardHeader className="flex flex-col gap-2">
                      {plan.popular && (
                        <div className="text-tiny text-primary font-bold uppercase">
                          Most Popular
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </h3>
                      <div>
                        <span className="text-4xl font-extrabold text-gray-900">
                          {plan.price}
                        </span>
                        {plan.price !== "Custom" && (
                          <span className="text-base font-medium text-gray-500">
                            /month
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                    </CardHeader>
                    <CardBody>
                      <ul className="space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center">
                            <FiCheck className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="ml-3 text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                    <CardFooter>
                      <Button
                        as={Link}
                        href="/request-access"
                        color={plan.color}
                        variant={plan.popular ? "solid" : "bordered"}
                        className="w-full"
                        size="lg"
                      >
                        {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-bold text-gray-900">
              Need a custom plan?
            </h3>
            <p className="mt-2 text-gray-500">
              Contact us for custom pricing and requirements.
            </p>
            <Button
              as={Link}
              href="/contact"
              color="primary"
              variant="light"
              size="lg"
              className="mt-4"
            >
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 