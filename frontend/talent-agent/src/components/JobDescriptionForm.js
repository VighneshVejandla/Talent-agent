import React, { useState } from "react";
import { matchCandidates } from "../api/client";
import icon from "./management.png";

const JobDescriptionForm = ({ onResult }) => {
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);

    const sampleJD = `We are hiring a Senior Backend Engineer to join our product team. The role is based in Bengaluru and can be remote.

Responsibilities:
- Build and maintain scalable backend services in Python
- Design and implement REST APIs
- Work with PostgreSQL and Redis
- Deploy services using Docker and AWS

Required Skills:
- Strong Python skills
- Experience with Django or Flask
- Experience with PostgreSQL
- Familiarity with Docker and AWS
- Experience with REST APIs

Preferred Skills:
- Experience with Redis
- Experience with Kafka

Experience:
- 4+ years of backend development experience

Location:
- Bengaluru (remote also acceptable)

Preferred job type:
- remote or hybrid`;

    const handleLoadSample = () => setJd(sampleJD);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await matchCandidates(jd);
            onResult(result);
        } catch (err) {
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        window.location.reload(); // full page refresh – resets everything
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h1> <img src={icon} alt="icon" style={{ width: "32px", verticalAlign: "middle", marginRight: "8px" }} />
                    AI Talent Scout</h1>
                <p>Paste a job description & get AI‑ranked candidates instantly</p>
            </div>

            <form onSubmit={handleSubmit} className="jd-form">
                <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    rows={9}
                    placeholder="📝 Paste job description here..."
                    className="jd-textarea"
                />
                <div className="button-group">
                    <button type="button" onClick={handleLoadSample} className="btn-secondary">
                        📋 Load Sample
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "🔍 Analyzing..." : "✨ Find Candidates"}
                    </button>
                    <button
                        onClick={handleReset}
                        style={{
                            background: "#f1f5f9",
                            border: "none",
                            padding: "6px 16px",
                            borderRadius: "40px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "0.2s",
                            fontSize: "0.8rem",
                            color: "#334155",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#e2e8f0")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#f1f5f9")
                        }
                    >
                        🔄 Reset
                    </button>
                </div>
            </form>

            <style jsx>{`
        .form-container {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 2rem;
          padding: 1.8rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        .form-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b, #4f46e5);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          margin-bottom: 0.25rem;
        }
        .form-header p {
          color: #475569;
          margin-bottom: 1.2rem;
        }
        .jd-textarea {
          width: 100%;
          padding: 1rem;
          border-radius: 1.25rem;
          border: 1px solid #e2e8f0;
          background: white;
          font-size: 0.9rem;
          line-height: 1.5;
          transition: all 0.2s;
          resize: vertical;
          font-family: 'Inter', monospace;
        }
        .jd-textarea:focus {
          outline: none;
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .btn-primary, .btn-secondary {
          padding: 0.7rem 1.5rem;
          border-radius: 2rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: 0.2s;
          border: none;
        }
        .btn-primary {
          background: #4f46e5;
          color: white;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
        }
        .btn-primary:hover:not(:disabled) {
          background: #4338ca;
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: #f1f5f9;
          color: #334155;
        }
        .btn-secondary:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default JobDescriptionForm;