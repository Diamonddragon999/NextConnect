import React from 'react';
import Link from 'next/link';
import Footer  from '../components/Footer';
import Nav from '../components/Nav';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
        <Nav />

      {/* Contact Page Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-2">Have questions or need help? Reach out to us at:</p>
        <a href="mailto:nextconnectapp@gmail.com" className="text-xl font-bold text-gray-700">
          nextconnectapp@gmail.com
        </a>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Contact;
    