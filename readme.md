# 🚀 AI‑Powered Talent Scouting & Engagement Agent

A full‑stack hackathon project that:

- **Takes a Job Description (JD)** as input  
- **Parses and understands** it (skills, experience, role, location, preference)  
- **Finds matching candidates** from a JSON dataset  
- **Simulates conversational engagement** between recruiter and candidate  
- **Computes Match Score, Interest Score, and a Final Score**  
- **Ranks candidates** and shows expandable cards with explanations and chat

Based on your choice, you can run it either:

- as a **Streamlit‑only demo app**, or  
- as a **React frontend + Python backend JSON API** (this README assumes the React + Python stack).

---

## 🧩 Features

### 1. Job Description Input

- Rich text box for pasting a Job Description.  
- “Load Sample JD” button for quick demo (Backend Engineer role in Bengaluru).  

### 2. JD Parsing

- Rule‑based parser that extracts:
  - Skills
  - Minimum years of experience
  - Role
  - Location
  - Preferred job type (onsite / remote / hybrid)

No external LLM API key required.

### 3. Candidate Matching Engine

- Computes **Match Score (0–100)** based on:
  - Skill overlap (50%)
  - Experience match (30%)
  - Preference alignment (20%)
- Shows **explainability**:
  - Matching skills
  - Missing skills
  - Experience comparison
  - Preference alignment

### 4. Conversational Simulation

- Simulates a **2–3 turn chat** between recruiter and candidate.  
- Uses **rule‑based responses** (no OpenAI / API key needed).

### 5. Interest Score (0–100)

- Computes **Interest Score** using:
  - Sentiment of the candidate’s response  
  - Willingness to switch roles  
  - Location match
- Final Score:
  \[
  \text{Final Score} = 0.6 \times \text{Match Score} + 0.4 \times \text{Interest Score}
  \]

### 6. Ranked Output UI

- Table of **ranked candidates** (descending by Final Score).  
- Expandable **cards per candidate** showing:
  - Match Score (progress bar)  
  - Interest Score (progress bar)  
  - Experience, location, preference  
  - Match explanation  
  - Chat simulation (Recruiter → Candidate → Recruiter)

---

## 🧰 Tech Stack

### Backend (Python Agent)

- Language: **Python 3.12+**  
- Framework: **FastAPI**  
- Server: **Uvicorn**  
- Logic modules:
  - `utils/parser.py` – JD parsing (rule‑based).
  - `utils/matcher.py` – match score computation.
  - `utils/conversation.py` – chat simulation (`generate_chat_llm` and `generate_chat_fallback`).
  - `utils/scorer.py` – interest score and final score.

### Frontend (React)

- Framework: **React (CRA)**  
- UI: Plain React + `fetch` to call the backend.  
- Styling: Inline CSS for cleanliness and demo clarity.

### Optional PDF Resume Support

- Users can **paste resume text** or **upload a PDF resume** (optional).  
- Backend uses `pdfplumber` to extract text and parses it into skills, experience, location, etc.  
- Then plugs the **parsed resume into the same matching and scoring engine**.

---

## 📁 Project Structure

```bash
talent-agent/
├── agent/                       # Python AI agent API
│   ├── app.py
│   ├── requirements.txt
│   ├── data/
│   │   └── candidates.json         # 15–20 realistic candidates
│   └── utils/
│       ├── parser.py
│       ├── matcher.py
│       ├── conversation.py
│       ├── scorer.py
│
├── frontend/talent-agent/         # React UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── reportWebVitals.js
│   │   ├── components/
│   │   │   ├── JobDescriptionForm.js
│   │   │   └── CandidateCard.js
│   │   │   └── management.png
│   │   └── api/
│   │       └── client.js
│   └── package.json
```

---

## ⚙️ Setup

### 1. Install backend dependencies

```bash
cd talent-agent/agent
python -m pip install -r requirements.txt
```

Ensure you have at least:

```txt
fastapi>=0.110.0
uvicorn>=0.29.0
pdfplumber>=0.9.0        # only if you want PDF resume support
```

### 2. Start backend (Python agent)

```bash
cd talent-agent/agent
python -m uvicorn app:app --host 0.0.0.0 --port 5000
```

You’ll see:

```bash
INFO:     Uvicorn running on http://0.0.0.0:5000
```

### 3. Install frontend dependencies

```bash
cd talent-agent/frontend/talent-agent
npm install
```

### 4. Start React frontend

```bash
npm start
```

Your browser should open:

> 🔗 http://localhost:3000

---

## 🧪 How to Run and Demo

### 1. Basic scenario (no resume)

1. Start backend:
   ```bash
   cd talent-agent/agent
   python -m uvicorn app:app --host 0.0.0.0 --port 5000
   ```
2. Start frontend:
   ```bash
   cd talent-agent/frontend/talent-agent
   npm start
   ```
3. In browser, at `http://localhost:3000`:
   - Click **“Load Sample JD (Backend Engineer)”**.  
   - Click **“Find Candidates”**.  
4. Observe:
   - A **table of ranked candidates**.  
   - **Expandable cards** with:
     - Match Score (progress bar)  
     - Interest Score (progress bar)  
     - Experience, location, preference  
     - Chat simulation.  

### 2. Example Job Description (for demo)

You can paste this into the JD box:

```text
We are hiring a Senior Backend Engineer (Python) to join our core product team in Bengaluru. The role can be remote or hybrid.

Responsibilities:
- Design and build scalable backend services in Python.
- Develop and maintain RESTful APIs consumed by web and mobile clients.
- Work with PostgreSQL and Redis to design and optimize queries and caching strategies.
- Deploy and monitor services on AWS using Docker and ECS.
- Collaborate with frontend engineers and product managers to translate requirements into robust APIs.

Required Skills:
- Strong Python programming skills.
- 4+ years of backend development experience.
- Proficiency with PostgreSQL and writing efficient SQL queries.
- Experience with REST API design and implementation.
- Familiarity with Docker and containerized deployments.

Nice‑to‑have Skills:
- Experience with Redis or other caching systems.
- Experience with AWS (ECS, EC2, S3).
- Experience with message brokers like Kafka or RabbitMQ.
- Familiarity with CI/CD pipelines.

Location:
- Bengaluru (remote or hybrid).

Preferred job type:
- remote or hybrid.
```

Click **“Find Candidates”** → the match scores will reflect **real skill overlap** and not be artificially low.

### 3. Resume text input (optional)

If you want to test **single candidate matching**:

1. Paste the same JD in the **Job Description** box.  
2. In the **Resume text** box, paste a candidate profile, e.g.:

   ```text
   Maya Singh
   3 years of experience with React and Node.js. 
   Currently based in Bengaluru and open to remote work.
   ```

3. Click **“Find Candidates”** → backend will parse resume text and return one ranked candidate card.

---

## 📝 How the Scores Are Calculated

### Match Score (0–100)

- **Skill overlap (50%)**  
  - Percentage of JD‑required skills present in the candidate.  
- **Experience match (30%)**  
  - Compares candidate’s years of experience with JD’s minimum.  
- **Preference alignment (20%)**  
  - How well the candidate’s preferred job type (onsite / remote / hybrid) matches the JD.  

### Interest Score (0–100)

- Based on:
  - **Sentiment** of the candidate’s response (rule‑based).  
  - **Willingness to switch** roles.  
  - **Location match** (how close the candidate’s location is to the JD location).  

### Final Score

\[
\text{Final Score} = 0.6 \times \text{Match Score} + 0.4 \times \text{Interest Score}
\]

Then candidates are **sorted descending** by Final Score.

---

## 🎥 Suggested 3–5 Minute Demo Script

1. **Title slide (0–20s)**  
   - “AI‑Powered Talent Scouting & Engagement Agent – a full‑stack hackathon project.”  
2. **Architecture overview (20–60s)**  
   - Show folder structure and mention: React frontend, FastAPI backend, rule‑based parsing, no API key.  
3. **Live demo (1–4 min)**  
   - Start backend (`uvicorn`) and frontend (`npm start`).  
   - Open `http://localhost:3000`.  
   - Load sample JD → click “Find Candidates” → expand one or two cards to show:
     - Match Score / Interest Score.  
     - Matching / missing skills.  
     - Chat simulation.  
4. **Explanation of scores (last 30–60s)**  
   - “Final Score is weighted 60% on match, 40% on interest.”  
   - “This lets recruiters see both technical fit and candidate engagement at a glance.”

---

## 🚫 Troubleshooting Common Errors

### 1. `No module named uvicorn`

Run:

```bash
python -m pip install "uvicorn[standard]"
```

### 2. `422 Unprocessable Entity` when sending `/match`

- Ensure your React sends **pure string** inside JSON:

  ```js
  body: JSON.stringify(jd)
  ```

  not `{ jd }`.

### 3. `404 Not Found` on `/match-resume`

- If you want resume text support, add a `/match-resume-text` route in `app.py`.  
- If you don’t, remove or comment out any `/match-resume` call in `client.js`.

### 4. `manifest.json: Syntax error`

Replace `public/manifest.json` with a valid JSON manifest (see “Project manifest” section above).

---

## 📄 License

This project is for **demo and educational purposes**.  
You can use this code as a starting point for your own recruiting or matching system.

---

If you have any questions or want to extend this system (e.g., add OpenAI, add more NLP‑based parsing, or support bulk resume uploads), feel free to iterate on the `utils/` modules.