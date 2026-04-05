// Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // optional if you want separate styling

function Navbar(){
  return (
    <nav className="navbar">
      <h1 className="logo">MoneyMinder</h1>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/goals">Goals-Management</Link></li>
        <li><Link to="/budget">Budget-Management</Link></li>
        <li><Link to="/investment">Investments-Management</Link></li>
        <li><Link to= "/transactions">Transactions</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
