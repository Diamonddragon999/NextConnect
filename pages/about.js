import React from "react";
import Link from "next/link"; // Import the Link component
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="home bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Hero Section */}
      <Nav />
      <section className="w-full bg-gradient-to-r from-teal-500 via-blue-600 to-teal-500 text-white py-20 text-center px-6">
        <h1 className="text-5xl font-bold">About Us</h1>
        <p className="mt-4 text-xl">
          Empowering customers to easily reserve tickets for unforgettable experiences.
        </p>
      </section>

      {/* Our Values Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid gap-8 lg:grid-cols-3">
        <h2 className="text-3xl font-semibold text-center lg:col-span-3">Our Core Values</h2>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <img src="/images/icon-quality.svg" alt="Quality" className="h-16 mb-4" />
          <h3 className="text-xl font-bold mb-2 ">Quality Experience</h3>
          <p className="text-gray-600 text-center">
            We provide a seamless experience for our customers with a focus on reliability and convenience.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <img src="/images/icon-innovation.svg" alt="Innovation" className="h-16 mb-4" />
          <h3 className="text-xl font-bold mb-2">Innovation</h3>
          <p className="text-gray-600 text-center">
            Our platform is built with cutting-edge technologies for a smooth booking experience.
          </p>
        </div>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <img src="/images/icon-support.svg" alt="Support" className="h-16 mb-4" />
          <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
          <p className="text-gray-600 text-center">
            Our team is here to assist you at every step, ensuring a hassle-free experience.
          </p>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="w-full bg-gray-100 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>
          <p className="text-gray-700 mt-2 mb-8">
            A passionate team working together to create a remarkable platform.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img src="/images/team-member-1.jpg" alt="Team Member" className="h-32 w-32 rounded-full mx-auto" />
              <h3 className="text-xl font-bold mt-4">Cimbru Darius</h3>
              <p className="text-gray-600">Head Developer</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img src="/images/team-member-2.jpg" alt="Team Member" className="h-32 w-32 rounded-full mx-auto" />
              <h3 className="text-xl font-bold mt-4">Popescu Antonio</h3>
              <p className="text-gray-600">Developer</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img src="/images/team-member-3.jpg" alt="Team Member" className="h-32 w-32 rounded-full mx-auto" />
              <h3 className="text-xl font-bold mt-4">Barbu Razvan</h3>
              <p className="text-gray-600">~Role~</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <img src="/images/team-member-4.jpg" alt="Team Member" className="h-32 w-32 rounded-full mx-auto" />
              <h3 className="text-xl font-bold mt-4">Turcea Mihai</h3>
              <p className="text-gray-600">~Role~</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-semibold text-center">What Our Users Say</h2>
        <div className="mt-8 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 italic">"A seamless experience from start to finish!"</p>
            <p className="text-right mt-4 text-blue-700 font-semibold">– Alex Johnson</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 italic">"Booking events has never been easier."</p>
            <p className="text-right mt-4 text-blue-700 font-semibold">– Maria Gomez</p>
          </div>
          {/* Add more testimonials */}
        </div>
      </section>

      {/* Technology Used Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-16 px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-3xl font-semibold">Technologies We Use</h2>
    <p className="mt-4 mb-8 max-w-2xl mx-auto">
      Our platform leverages cutting-edge tools and frameworks to deliver a reliable, responsive, and high-performance user experience.
    </p>
    <div className="flex flex-wrap justify-center gap-8 text-white">
      
      
      <div className="text-center max-w-xs">
        <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
          <img src="/images/nextjs-logo.svg" alt="Next.js" className="h-12 filter invert mx-auto mb-3" />
          <h3 className="text-xl font-semibold">Next.js</h3>
        </a>
        <p className="text-sm mt-2">A React framework for building fast, SEO-friendly websites with server-side rendering and static site generation.</p>
      </div>

      
      <div className="text-center max-w-xs">
        <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/tailwind-logo.svg" alt="Tailwind CSS" className="h-12 filter invert mx-auto mb-3" />
          <h3 className="text-xl font-semibold">Tailwind CSS</h3>
        </a>
        <p className="text-sm mt-2">A utility-first CSS framework that allows us to design responsive, fast-loading, and modern interfaces directly within the HTML structure.</p>
      </div>

      
      <div className="text-center max-w-xs">
        <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
          <img src="/images/nodejs-logo.svg" alt="Node.js" className="h-12 filter invert mx-auto mb-3" />
          <h3 className="text-xl font-semibold">Node.js</h3>
        </a>
        <p className="text-sm mt-2">A JavaScript runtime that allows us to build scalable, high-performance backends with asynchronous, event-driven architecture.</p>
      </div>

      
      
    </div>
  </div>
</section>
<Footer />
    </div>
  );
};

export default About;
