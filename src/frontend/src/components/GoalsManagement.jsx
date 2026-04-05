import React, { useState } from "react";
import "./GoalManagement.css";

function GoalManagement() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [budget, setBudget] = useState("");
  const [saved, setSaved] = useState("");

  const addGoal = () => {
    if (goalName && budget) {
      const newGoal = {
        id: Date.now(),
        name: goalName,
        budget: parseFloat(budget),
        saved: saved ? parseFloat(saved) : 0,
      };
      setGoals([...goals, newGoal]);
      setGoalName("");
      setBudget("");
      setSaved("");
    }
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const updateSaved = (id, newSaved) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, saved: parseFloat(newSaved) } : g
      )
    );
  };

  return (
    <div className="goal-container">
      <h1 className="goal-title">🎯 Goal Management</h1>

      <div className="goal-form">
        <input
          type="text"
          placeholder="Goal name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="number"
          placeholder="Already Saved (optional)"
          value={saved}
          onChange={(e) => setSaved(e.target.value)}
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>

      <div className="goals-list">
        {goals.map((goal) => {
          const progress = Math.min(
            (goal.saved / goal.budget) * 100,
            100
          ).toFixed(1);

          return (
            <div key={goal.id} className="goal-card">
              <h3>{goal.name}</h3>
              <p>Target: ₹{goal.budget}</p>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p>{progress}% achieved</p>

              <input
                type="number"
                placeholder="Update saved amount"
                value={goal.saved}
                onChange={(e) => updateSaved(goal.id, e.target.value)}
              />

              <div className="goal-actions">
                <button
                  className="delete-btn"
                  onClick={() => deleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalManagement;
