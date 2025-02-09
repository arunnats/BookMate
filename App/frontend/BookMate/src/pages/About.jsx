import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-primary p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Information Collection
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Account registration details (name, email address)</li>
              <li>Reading preferences and bookmarks</li>
              <li>Usage data through cookies and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Data Usage
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your information helps us to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide personalized reading recommendations</li>
              <li>Improve application functionality</li>
              <li>Communicate important service updates</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Data Protection
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600 text-lg leading-relaxed">
                We implement security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>SSL encryption for all data transmissions</li>
                <li>Regular security audits</li>
                <li>Role-based access controls</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Third-Party Services
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We utilize these trusted services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Google Analytics for usage tracking</li>
              <li>AWS for secure cloud storage</li>
              <li>Stripe for payment processing</li>
            </ul>
          </section>

          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Contact Us
            </h3>
            <p className="text-gray-600 text-lg">
              For privacy concerns:{" "}
              <a
                href="mailto:privacy@bookmate.com"
                className="text-blue-600 hover:underline"
              >
                arunnats2004@gmail.com
              </a>
            </p>
            <p className="text-gray-600 text-lg mt-2">
              Last updated: February 9, 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
