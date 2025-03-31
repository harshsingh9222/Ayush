import React from 'react';
import { ayush2, pmModi, ayurveda, yoga, unani, siddha, naturepathy, homopathy } from '../assets/images';

const HomePage = () => {
  return (
    <div>
      {/* Image Section */}
      <section className="image flex justify-between my-8">
        <img
          id="logo-ayush2"
          src={ayush2}
          alt="AYUSH"
          className="w-1/2 object-contain"
        />
        <img
          src={pmModi}
          alt="PM Modi"
          className="w-1/2 object-contain"
        />
      </section>

      {/* Hero Section */}
      <section className="hero text-center py-20">
        <h1 className="text-3xl text-gray-800">
          Welcome to the AYUSH Startup Registration Portal
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Streamlining the registration process for startups in the AYUSH sector.
        </p>
        <a
          href="#"
          className="btn inline-block mt-6 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Get Started
        </a>
      </section>

      {/* About-Box Section */}
      <section className="about-box flex flex-wrap justify-center my-8">
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={ayurveda}
            alt="Ayurveda"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Ayurveda</h3>
          <p className="text-sm">
            Ayurveda is the time-tested traditional system of medicine of India.
            The term 'Ayurveda' means 'the knowledge of life'.
          </p>
        </div>
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={yoga}
            alt="Yoga & Naturopathy"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Yoga & Naturopathy</h3>
          <p className="text-sm">
            Yoga is about the union of personal and universal consciousness.
            Naturopathy offers drugless, non-invasive therapies.
          </p>
        </div>
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={unani}
            alt="Unani"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Unani</h3>
          <p className="text-sm">
            Unani system is a comprehensive medical system providing holistic care.
          </p>
        </div>
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={siddha}
            alt="Siddha"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Siddha</h3>
          <p className="text-sm">
            Siddha is an ancient system of medicine focusing on holistic well-being.
          </p>
        </div>
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={naturepathy}
            alt="Sowa Rigpa"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Sowa Rigpa</h3>
          <p className="text-sm">
            Sowa Rigpa is the traditional Himalayan medicine known as the 'science of healing'.
          </p>
        </div>
        <div className="w-72 border border-blue-100 p-4 m-4 rounded">
          <img
            src={homopathy}
            alt="Homeopathy"
            className="h-16 w-16 mx-auto"
          />
          <h3 className="mt-2 text-center">Homeopathy</h3>
          <p className="text-sm">
            Homeopathy uses the principle of “like cures like” for drug therapeutics.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 border-t border-gray-200 text-center">
        <h2 className="text-2xl">About Us</h2>
        <p className="mt-4 text-lg">
          The AYUSH Startup Registration Portal is designed to make the registration process more efficient,
          transparent, and accessible for startups in the Ayurveda, Yoga, Naturopathy, Unani, Siddha, and
          Homeopathy sectors.
        </p>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-10 border-t border-gray-200 text-center">
        <h2 className="text-2xl">Contact Us</h2>
        <p className="mt-4">Email: support@ayushstartups.in</p>
        <p>Phone: +91-1234567890</p>
      </section>

      {/* Footer */}
      <footer className="bg-[#303234] text-white text-center py-4">
        <p>&copy; 2024 AYUSH Startups. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
