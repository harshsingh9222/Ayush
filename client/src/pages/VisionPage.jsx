import React from 'react';

const VisionPage = () => {
  return (
    <div className="w-4/5 mx-auto py-12">
      {/* Vision Header */}
      <section className="bg-[rgb(85,126,160)] text-white py-5 text-center shadow-lg rounded">
        <h1 className="text-5xl mb-2">Our Vision</h1>
        <p className="text-lg mt-2">Bridging Ancient Wisdom and Modern Innovation</p>
      </section>

      {/* About Us Section */}
      <section className="mt-12">
        <h2 className="text-4xl text-[#303234] mb-6 text-center">All About Us</h2>
        <p className="text-lg leading-relaxed mb-5 text-justify bg-[rgb(208,228,244)] p-4 rounded-lg shadow-md">
          The Ministry of Ayush was formed on the 9th of November 2014 with a vision of reviving the profound knowledge of our ancient systems of medicine and ensuring the optimal development and propagation of the Ayush systems of healthcare.
        </p>
        <p className="text-lg leading-relaxed mb-5 text-justify bg-[rgb(208,228,244)] p-4 rounded-lg shadow-md">
          The Startup AYUSH Portal is a unique online platform under the Ministry of Ayush designed for all stakeholders within India’s startup ecosystem. Specifically, it serves as a hub for AYUSH (Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy) startups. Governed by the Indian government, this portal aims to identify, support, and promote innovations and startups in the AYUSH sector.
        </p>
        <p className="text-lg leading-relaxed mb-5 text-justify bg-[rgb(208,228,244)] p-4 rounded-lg shadow-md">
          Through collaboration with institutions like the All India Institute of Ayurveda (AIIA), it fosters research, development, and technology adoption, accelerating the growth of AYUSH practices across the country.
        </p>
      </section>

      {/* Vision Goals Section */}
      <section className="mt-12">
        <h2 className="text-4xl text-[#303234] mb-6 text-center">Our Goals</h2>
        <ul className="list-none pl-0">
          <li className="bg-[rgb(208,228,244)] mb-5 p-5 text-lg leading-relaxed border-l-8 border-[rgb(85,126,160)] rounded-lg shadow-md">
            <strong>Connecting Entrepreneurs with Government Support:</strong> Our platform serves as a gateway for entrepreneurs to connect directly with the government. Together, we focus on promoting the AYUSH sector—from small startups to large enterprises.
          </li>
          <li className="bg-[rgb(208,228,244)] mb-5 p-5 text-lg leading-relaxed border-l-8 border-[rgb(85,126,160)] rounded-lg shadow-md">
            <strong>Reviving Indian Culture through AYUSH:</strong> AYUSH—Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy—has been an integral part of our ancient heritage. We aim to revive and celebrate Indian culture by empowering entrepreneurs to explore AYUSH in novel ways.
          </li>
          <li className="bg-[rgb(208,228,244)] mb-5 p-5 text-lg leading-relaxed border-l-8 border-[rgb(85,126,160)] rounded-lg shadow-md">
            <strong>Inclusive Entrepreneurship:</strong> Whether from a bustling metropolis or a serene village, our platform is open to all. We are committed to democratizing access to quality healthcare through AYUSH practices.
          </li>
          <li className="bg-[rgb(208,228,244)] mb-5 p-5 text-lg leading-relaxed border-l-8 border-[rgb(85,126,160)] rounded-lg shadow-md">
            <strong>Preserving and Innovating:</strong> We preserve AYUSH’s holistic well-being approach while promoting innovation. Entrepreneurs are encouraged to bring fresh ideas, disruptive technologies, and sustainable practices to the AYUSH ecosystem.
          </li>
          <li className="bg-[rgb(208,228,244)] mb-5 p-5 text-lg leading-relaxed border-l-8 border-[rgb(85,126,160)] rounded-lg shadow-md">
            <strong>Calling All Young Entrepreneurs:</strong> If you are passionate about transforming lives through AYUSH, join us in making AYUSH not just a culture but a movement. Let’s change how people perceive health, wellness, and India’s heritage.
          </li>
        </ul>
      </section>

      {/* Footer Section */}
      <footer className="mt-12 p-8 bg-[#303234] text-white text-xl text-center">
        <p>
          Be part of our startup journey. Let’s grow, heal, and thrive—together. Welcome to the AYUSH revolution!
        </p>
      </footer>
    </div>
  );
};

export default VisionPage;
