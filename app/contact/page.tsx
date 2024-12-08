"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiUser,
  FiMessageSquare,
  FiHelpCircle,
  FiSend,
} from "react-icons/fi";
import Navbar from "../components/Navbar";

const topics = [
  { value: "general", label: "General Inquiry" },
  { value: "sales", label: "Sales Question" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing Issue" },
  { value: "feedback", label: "Product Feedback" },
] as const;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitSuccess(true);
    setIsSubmitting(false);
  };

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
              Contact Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Get in Touch
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Have a question or need help? We&apos;re here for you.
            </p>
          </motion.div>

          <div className="mt-16">
            <div className="max-w-lg mx-auto">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-100 mb-4">
                    <FiSend className="h-6 w-6 text-success-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Message Sent Successfully
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Thank you for contacting us! We&apos;ll get back to you within 24
                    hours.
                  </p>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => setSubmitSuccess(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <Card>
                  <CardBody className="gap-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <Input
                        label="Name"
                        placeholder="Enter your name"
                        startContent={<FiUser className="text-default-400" />}
                        isRequired
                      />

                      <Input
                        type="email"
                        label="Email"
                        placeholder="you@example.com"
                        startContent={<FiMail className="text-default-400" />}
                        isRequired
                      />

                      <Select
                        label="Topic"
                        placeholder="Select a topic"
                        startContent={<FiHelpCircle className="text-default-400" />}
                        isRequired
                      >
                        {topics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </Select>

                      <Textarea
                        label="Message"
                        placeholder="How can we help you?"
                        startContent={<FiMessageSquare className="text-default-400 mt-1" />}
                        minRows={4}
                        isRequired
                      />

                      <Button
                        type="submit"
                        color="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 text-center"
          >
            <h3 className="text-xl font-bold text-gray-900">
              Other Ways to Reach Us
            </h3>
            <div className="mt-4 space-y-2">
              <p className="text-gray-500">
                Email: support@issuetracker.com
              </p>
              <p className="text-gray-500">
                Phone: +1 (555) 123-4567
              </p>
              <p className="text-gray-500">
                Hours: Monday - Friday, 9am - 5pm EST
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 