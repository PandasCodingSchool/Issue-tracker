import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              About Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Our Mission
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We&apos;re on a mission to make issue tracking simple, efficient, and
              accessible to teams of all sizes.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
                <p className="mt-4 text-lg text-gray-500">
                  Founded in 2023, IssueTracker was born from the frustration of
                  dealing with complex and unintuitive issue tracking systems. We
                  believed there had to be a better way to manage projects and
                  track issues.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">Our Values</h3>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {values.map((value) => (
                    <div
                      key={value.name}
                      className="bg-gray-50 p-6 rounded-lg"
                    >
                      <h4 className="text-lg font-medium text-gray-900">
                        {value.name}
                      </h4>
                      <p className="mt-2 text-base text-gray-500">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900">Our Team</h3>
                <p className="mt-4 text-lg text-gray-500">
                  We&apos;re a dedicated team of developers, designers, and product
                  specialists who are passionate about creating the best issue
                  tracking experience for our users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const values = [
  {
    name: "Simplicity",
    description:
      "We believe in keeping things simple and intuitive. No unnecessary complexity.",
  },
  {
    name: "Reliability",
    description:
      "Your data and workflows are important. We ensure our system is always available and reliable.",
  },
  {
    name: "Innovation",
    description:
      "We're constantly innovating and improving our platform based on user feedback and needs.",
  },
  {
    name: "Security",
    description:
      "Security is at the core of everything we do. Your data is always protected.",
  },
  {
    name: "Customer Focus",
    description:
      "Our customers' success is our success. We're here to support you every step of the way.",
  },
  {
    name: "Transparency",
    description:
      "We believe in being transparent with our customers about our processes and decisions.",
  },
]; 