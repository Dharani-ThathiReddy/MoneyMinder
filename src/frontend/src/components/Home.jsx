// src/frontend/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  { title: "Track Income", description: "Log and categorize your earnings easily." },
  { title: "Manage Expenses", description: "Monitor expenses and stay on top of spending." },
  { title: "Set Financial Goals", description: "Plan goals and track your progress." },
  { title: "Insights & Reports", description: "Get visual insights of your finances." },
];

const Home = () => {
  return (
    <div className="home-container">
      <header>
        <h1 className="home-title">MoneyMinder</h1>
        <p className="home-subtitle">Smart personal finance management at your fingertips.</p>
      </header>

      <section className="cards-container">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </section>

      <div className="home-buttons">
        <Link to="/signup" className="home-button">Get Started</Link>
        <Link to="/login" className="home-button login-btn">Login</Link>
      </div>
    </div>
  );
};

export default Home;
