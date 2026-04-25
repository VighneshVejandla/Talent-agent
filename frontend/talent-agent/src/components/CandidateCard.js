import React from "react";

const CandidateCard = ({ candidate }) => {
  // helper for score badge
  const getScoreClass = (score) => {
    if (score >= 75) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  return (
    <div className="candidate-card">
      <div className="card-header">
        <div className="candidate-avatar">
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className="candidate-title">
          <h3>{candidate.name}</h3>
          <div className="final-score">
            Final Score: <span className={`final-score-value ${getScoreClass(candidate.final_score)}`}>
              {candidate.final_score}
            </span>
          </div>
        </div>
      </div>

      <div className="card-section">
        <div className="metric">
          <span className="metric-label">🎯 Match Score</span>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${candidate.match_score}%`, backgroundColor: candidate.match_score > 70 ? "#10b981" : candidate.match_score > 50 ? "#f59e0b" : "#ef4444" }} />
          </div>
          <span className="metric-value">{candidate.match_score}/100</span>
        </div>
        <div className="metric">
          <span className="metric-label">💡 Interest Score</span>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${candidate.interest_score}%`, backgroundColor: candidate.interest_score > 70 ? "#10b981" : candidate.interest_score > 50 ? "#f59e0b" : "#ef4444" }} />
          </div>
          <span className="metric-value">{candidate.interest_score}/100</span>
        </div>
      </div>

      <div className="card-section details-grid">
        <div><span className="detail-icon">📅</span> {candidate.experience} yrs</div>
        <div><span className="detail-icon">📍</span> {candidate.location}</div>
        <div><span className="detail-icon">🧑‍💻</span> {candidate.preferred_job_type}</div>
      </div>

      <div className="card-section match-explanation">
        <div className="section-title">🔎 Match analysis</div>
        <div className="skills-row">
          <div className="matched-skills">
            <strong>✅ Matched:</strong>
            <div className="skill-tags">
              {candidate.match_explanation.matched_skills.map((skill, idx) => (
                <span key={idx} className="skill-tag matched">{skill}</span>
              ))}
            </div>
          </div>
          <div className="missing-skills">
            <strong>❌ Missing:</strong>
            <div className="skill-tags">
              {candidate.match_explanation.missing_skills.map((skill, idx) => (
                <span key={idx} className="skill-tag missing">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="text-meta">📌 {candidate.match_explanation.experience_compared}</div>
        <div className="text-meta">⚡ {candidate.match_explanation.pref_alignment}</div>
      </div>

      <div className="card-section chat-simulation">
        <div className="section-title">💬 AI – Candidate chat</div>
        <div className="chat-container">
          {candidate.chat.map((turn, idx) => (
            <div key={idx} className={`chat-message ${turn.speaker === "AI Recruiter" ? "recruiter" : "candidate"}`}>
              <span className="chat-speaker">{turn.speaker}</span>
              <div className="chat-bubble">{turn.text}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .candidate-card {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.25s ease;
          border: 1px solid #edf2f7;
        }
        .candidate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.12);
        }
        .card-header {
          display: flex;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          background: #fafcff;
          border-bottom: 1px solid #eef2ff;
          align-items: center;
        }
        .candidate-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #4f46e5, #818cf8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 1.5rem;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
        }
        .candidate-title h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
        }
        .final-score {
          font-size: 0.75rem;
          color: #475569;
        }
        .final-score-value {
          font-weight: 800;
          margin-left: 4px;
          padding: 2px 8px;
          border-radius: 30px;
          font-size: 0.8rem;
        }
        .final-score-value.high { background: #d1fae5; color: #065f46; }
        .final-score-value.medium { background: #fed7aa; color: #92400e; }
        .final-score-value.low { background: #fee2e2; color: #b91c1c; }
        .card-section {
          padding: 0.8rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .metric {
          margin: 12px 0;
        }
        .metric-label {
          display: block;
          font-weight: 600;
          font-size: 0.8rem;
          margin-bottom: 5px;
          color: #334155;
        }
        .progress-container {
          background: #e4e7eb;
          border-radius: 30px;
          height: 8px;
          overflow: hidden;
          width: 100%;
          margin: 5px 0;
        }
        .progress-fill {
          height: 100%;
          border-radius: 30px;
          transition: width 0.4s ease;
        }
        .metric-value {
          font-size: 0.75rem;
          font-weight: 500;
          margin-left: 6px;
        }
        .details-grid {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          background: #f8fafc;
        }
        .detail-icon {
          margin-right: 6px;
        }
        .section-title {
          font-weight: 700;
          margin-bottom: 12px;
          color: #0f172a;
          border-left: 4px solid #4f46e5;
          padding-left: 10px;
        }
        .skills-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 10px;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 5px;
        }
        .skill-tag {
          padding: 4px 12px;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 500;
        }
        .skill-tag.matched {
          background: #dcfce7;
          color: #166534;
        }
        .skill-tag.missing {
          background: #fee2e2;
          color: #b91c1c;
        }
        .text-meta {
          font-size: 0.8rem;
          color: #475569;
          margin-top: 6px;
        }
        .chat-container {
          max-height: 220px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-right: 6px;
        }
        .chat-message {
          display: flex;
          flex-direction: column;
        }
        .chat-speaker {
          font-size: 0.65rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 2px;
        }
        .chat-bubble {
          background: #f1f5f9;
          padding: 8px 12px;
          border-radius: 16px;
          border-top-left-radius: 4px;
          font-size: 0.8rem;
          line-height: 1.4;
          word-break: break-word;
        }
        .chat-message.candidate .chat-bubble {
          background: #e0e7ff;
          border-top-right-radius: 4px;
          border-top-left-radius: 16px;
        }
      `}</style>
    </div>
  );
};

export default CandidateCard;