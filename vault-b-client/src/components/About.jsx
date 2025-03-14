import React from 'react';

const About = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">About Us</h2>
      <div className="card shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          <h3 className="card-title">Our Mission</h3>
          <p className="card-text">
            At e-Vault, our mission is to revolutionize digital asset storage using cutting-edge blockchain technology. We believe in providing secure, transparent, and decentralized solutions to safeguard your valuable digital assets.
          </p>
          <p className="card-text">
            Our team is committed to building a platform that empowers individuals and businesses to securely store and manage their digital possessions, without compromising on privacy or security.
          </p>
        </div>
      </div>

      <div className="card shadow p-3 mb-5 bg-white rounded">
        <div className="card-body">
          <h3 className="card-title">Why Choose e-Vault?</h3>
          <p className="card-text">
            With e-Vault, you can trust that your digital assets are protected by the latest post quantum cryptography technology. Our platform offers:
          </p>
          <ul>
            <li>Decentralized Storage: Your data is stored securely across a decentralized network of nodes, ensuring high availability and fault tolerance.</li>
            <li>Immutable Record-Keeping: Every transaction is recorded on the blockchain, providing tamper-proof and auditable records of your digital assets.</li>
            <li>End-to-End Encryption: Your data is encrypted before storage, ensuring that only you have access to your sensitive information.</li>
            <li>User-Friendly Interface: Our intuitive interface makes it easy for users to upload, manage, and access their digital assets securely.</li>
          </ul>
        </div>
      </div>

      <div className="row">
        {/* Other content */}
      </div>
    </div>
  );
};

export default About;
