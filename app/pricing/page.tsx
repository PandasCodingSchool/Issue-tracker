import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Pricing
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Plans for teams of all sizes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Choose the perfect plan for your team. All plans include our core
              features.
            </p>
          </div>

          <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative p-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {plan.name}
                  </h3>
                  {plan.mostPopular ? (
                    <p className="absolute top-0 -translate-y-1/2 transform inline-flex px-4 py-1 rounded-full bg-indigo-500 text-white text-sm font-semibold tracking-wide uppercase">
                      Most popular
                    </p>
                  ) : null}
                  <p className="mt-4 flex items-baseline text-gray-900">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold">/month</span>
                  </p>
                  <p className="mt-6 text-gray-500">{plan.description}</p>

                  <ul role="list" className="mt-6 space-y-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex">
                        <svg
                          className="flex-shrink-0 w-6 h-6 text-indigo-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/request-access"
                  className={`mt-8 block w-full bg-${
                    plan.mostPopular ? "indigo-500" : "indigo-50"
                  } text-${
                    plan.mostPopular ? "white" : "indigo-700"
                  } rounded-md py-3 px-6 text-center font-medium`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for small teams just getting started.",
    features: [
      "Up to 10 team members",
      "Basic issue tracking",
      "Email support",
      "1GB storage",
      "API access",
    ],
    mostPopular: false,
  },
  {
    name: "Professional",
    price: 99,
    description: "Great for growing teams that need more.",
    features: [
      "Up to 50 team members",
      "Advanced issue tracking",
      "Priority email support",
      "10GB storage",
      "API access",
      "Custom workflows",
      "Analytics dashboard",
    ],
    mostPopular: true,
  },
  {
    name: "Enterprise",
    price: 299,
    description: "For large organizations with complex needs.",
    features: [
      "Unlimited team members",
      "Enterprise issue tracking",
      "24/7 phone & email support",
      "Unlimited storage",
      "API access",
      "Custom workflows",
      "Advanced analytics",
      "SSO & SAML",
      "Dedicated account manager",
    ],
    mostPopular: false,
  },
]; 