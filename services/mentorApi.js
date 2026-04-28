// services/mentorApi.js — AI Mentor Chatbot API
import { getApiBase } from '../lib/apiBase';

const TIMEOUT = 120000;

async function mentorRequest(path, body = null, method = 'POST') {
  const BASE = getApiBase();
  const url = `${BASE}/mentor${path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' }, signal: ctrl.signal };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    if (!res.ok) {
      const raw = await res.text().catch(() => '');
      let detail = `HTTP ${res.status}`;
      try { const e = JSON.parse(raw); detail = e?.detail || detail; } catch {}
      throw new Error(detail);
    }
    return res.json();
  } catch (e) {
    if (e?.name === 'AbortError') throw new Error('Request timed out. AI is thinking…');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const mentorChat = (body) => mentorRequest('/chat', body);
export const generateQuestions = (body) => mentorRequest('/generate-questions', body);
export const generateTestPaper = (body) => mentorRequest('/test-paper', body);
export const detectWeakTopics = (body) => mentorRequest('/weak-topics', body);
export const generateStudyPlan = (body) => mentorRequest('/study-plan', body);
export const getImportantQuestions = (cls, subject, lang = 'english') =>
  mentorRequest(`/important-questions?class_grade=${cls}&subject=${subject}&language=${lang}`, null, 'POST');
export const getSyllabus = (cls, subject) =>
  mentorRequest(`/syllabus?class_grade=${cls}&subject=${subject}`, null, 'GET');
export const adaptDifficulty = (current, score) =>
  mentorRequest(`/adapt-difficulty?current_difficulty=${current}&score_pct=${score}`, null, 'POST');
