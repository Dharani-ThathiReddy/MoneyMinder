import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import "./Transactions.css";

const categories = ["Food", "Shopping", "Bills", "Other"];
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Transactions = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [view, setView] = useState("pie");
  const [filter, setFilter] = useState("all"); // all, day, month
  const [file, setFile] = useState(null);

  const fetchTransactions = async () => {
    const res = await axios.get(`http://localhost:5000/api/transactions/${storedUser._id}`);
    setTransactions(res.data);
  };

  useEffect(() => { if (storedUser) fetchTransactions(); }, []);

  // Manual add
  const handleAddTransaction = async () => {
    if (!amount) return alert("Enter amount");
    const res = await axios.post(`http://localhost:5000/api/transactions/${storedUser._id}`, {
      amount: Number(amount),
      category,
      description,
      date: new Date(),
    });
    setTransactions([res.data, ...transactions]);
    setAmount(""); setDescription("");
  };

  // File upload
  const handleFileUpload = async () => {
    if (!file) return alert("Select a file");
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(
      `http://localhost:5000/api/transactions/upload/${storedUser._id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    alert(res.data.message);
    fetchTransactions();
  };

  // Filter transactions by day/month
  const filteredTransactions = transactions.filter(t => {
    if (filter === "day") return new Date(t.date).toDateString() === new Date().toDateString();
    if (filter === "month") return new Date(t.date).getMonth() === new Date().getMonth();
    return true;
  });

  const categoryData = categories.map(cat => ({
    name: cat,
    value: filteredTransactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      <div className="transaction-input">
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={handleAddTransaction}>Add</button>
      </div>

      <div className="file-upload">
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("day")}>Today</button>
        <button onClick={() => setFilter("month")}>This Month</button>
      </div>

      <div className="charts-toggle">
        <button onClick={() => setView("pie")}>Pie Chart</button>
        <button onClick={() => setView("bar")}>Bar Chart</button>
      </div>

      <div className="charts-container">
        {view === "pie" ? (
          <PieChart width={400} height={300}>
            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {categoryData.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <BarChart width={500} height={300} data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        )}
      </div>

      <div className="transactions-list">
        <h3>Recent Transactions</h3>
        <ul>
          {filteredTransactions.map(t => (
            <li key={t._id}>
              ${t.amount} - {t.category} - {t.description} - {new Date(t.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transactions;
