import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser || {});
  const [income, setIncome] = useState(user?.income || "");
  const [balance, setBalance] = useState(user?.balance || "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setIncome(user?.income || 0);
    setBalance(user?.balance || 0);
  }, [user]);

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5000/api/dashboard/${user._id}`, {
        income: Number(income),
        balance: Number(balance),
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!user || !user._id) return <p>Please log in first</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.fullName}</h1>

      <div className="stats-cards">
        <div className="card">
          <h3>Income</h3>
          {editing ? (
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
          ) : (
            <p>${user.income}</p>
          )}
        </div>
        <div className="card">
          <h3>Balance</h3>
          {editing ? (
            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
          ) : (
            <p>${user.balance}</p>
          )}
        </div>
        <div className="card">
          <h3>Goals</h3>
          <p>Track your progress</p>
        </div>
      </div>

      <button className="button-primary" onClick={() => (editing ? handleUpdate() : setEditing(true))}>
        {editing ? "Save" : "Edit Info"}
      </button>
    </div>
  );
};

export default Dashboard;
