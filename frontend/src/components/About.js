import React from 'react';
import { 
  Award, 
  Truck,
  Heart
} from 'lucide-react';
import '../about.css';

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="fade-in">Redefining <br /><span>Quality Shopping</span></h1>
            <p className="fade-in delay-1">
              Founded with a simple mission: to provide premium, sustainable products that elevate your everyday life. We believe in transparency, craftsmanship, and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="container">
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><Award /></div>
              <h3>Premium Quality</h3>
              <p>Curated selection of the finest materials and ethical manufacturing.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Truck /></div>
              <h3>Reliable Delivery</h3>
              <p>Fast, secure, and tracked shipping to your doorstep worldwide.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><Heart /></div>
              <h3>Customer First</h3>
              <p>Our dedicated support team is here to ensure your complete satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Shop?</h2>
            <p>Discover our curated collection of premium essentials.</p>
            <button onClick={() => window.location.href = '/products'}>Explore Collection</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;