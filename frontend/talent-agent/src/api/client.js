// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const matchCandidates = async (jd) => {
  const resp = await fetch(`${API_BASE_URL}/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd }),
  });
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }
  return await resp.json();
};