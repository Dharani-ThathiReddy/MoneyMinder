// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import GoalsManagement from "./components/GoalsManagement.jsx";
import BudgetManagement from "./components/BudgetManagement.jsx";
import InvestmentsManagement from "./components/InvestmentsManagement.jsx";
import Transactions from "./components/Transactions.jsx";


function App() {
  return (
    <Router>
      {/* Navbar is common across all pages */}
      <Navbar />  

      {/* Routes decide which page to show */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<GoalsManagement />} />
        <Route path="/budget" element={<BudgetManagement />} />
        <Route path="/investments" element={<InvestmentsManagement />} />
        <Route path="/transactions" element={<Transactions/>}/>
      </Routes>
    </Router>
  );
}

export default App;
