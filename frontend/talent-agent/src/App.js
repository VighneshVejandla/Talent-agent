// src/App.js
import React, { useState } from "react";
import JobDescriptionForm from "./components/JobDescriptionForm";
import CandidateCard from "./components/CandidateCard";
import "./App.css";

function App() {
  const [results, setResults] = useState(null);

  const handleResult = (data) => setResults(data);

  return (
    <div className="App">
      <JobDescriptionForm onResult={handleResult} />

      {results && (
        <div className="results-section" style={{ marginTop: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700" }}>
              🏆 Ranked shortlist
            </h2>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span
                style={{
                  background: "#eef2ff",
                  padding: "4px 12px",
                  borderRadius: "40px",
                  fontSize: "0.8rem",
                }}
              >
                {results.candidates.length} candidates
              </span>
            </div>
          </div>

          <table className="shortlist-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Match</th>
                <th>Interest</th>
                <th>Final</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {results.candidates.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>
                    <span
                      className={`score-badge ${
                        c.match_score >= 75
                          ? "high-score"
                          : c.match_score >= 50
                          ? "medium-score"
                          : "low-score"
                      }`}
                    >
                      {c.match_score}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`score-badge ${
                        c.interest_score >= 75
                          ? "high-score"
                          : c.interest_score >= 50
                          ? "medium-score"
                          : "low-score"
                      }`}
                    >
                      {c.interest_score}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`score-badge ${
                        c.final_score >= 75
                          ? "high-score"
                          : c.final_score >= 50
                          ? "medium-score"
                          : "low-score"
                      }`}
                    >
                      {c.final_score}
                    </span>
                  </td>
                  <td>{c.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ margin: "2rem 0 1rem 0", fontSize: "1.4rem" }}>
            📋 Detailed candidate insights
          </h3>
          <div className="candidates-grid">
            {results.candidates.map((c, i) => (
              <CandidateCard key={i} candidate={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;