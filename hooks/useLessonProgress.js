// hooks/useLessonProgress.js — Micro-learning progress management
// Auto-saves to localStorage; XP is integrated with the main progress store.

import { useState, useCallback, useEffect } from 'react';
import { LESSONS, getDailyLesson } from '../services/lessonData';

const STORAGE_KEY_PREFIX = 'ss_lesson_progress_';
const OFFLINE_KEY_PREFIX = 'ss_lesson_offline_';

function getLessonStorageKey(userId) {
  if (!userId) return null;
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function getDefaultLessonProgress() {
  return {
    completed: [],        // lesson IDs fully completed
    scores: {},           // { lessonId: { correct, total, pct } }
    inProgress: {},       // { lessonId: { phase, questionIndex } }
    xpEarned: {},         // { lessonId: xp awarded }
    lastLesson: null,
    lastUpdated: null,
  };
}

function loadLessonProgress(userId) {
  if (typeof window === 'undefined') return getDefaultLessonProgress();
  try {
    const key = getLessonStorageKey(userId);
    if (!key) return getDefaultLessonProgress();
    const raw = localStorage.getItem(key);
    if (!raw) return getDefaultLessonProgress();
    return { ...getDefaultLessonProgress(), ...JSON.parse(raw) };
  } catch {
    return getDefaultLessonProgress();
  }
}

function saveLessonProgress(userId, data) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    const key = getLessonStorageKey(userId);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify({ ...data, lastUpdated: Date.now() }));
  } catch {}
}

// Award XP into the main student progress store (same key used by quiz/game system)
function awardXPToMainProgress(userId, xp, lessonId) {
  if (typeof window === 'undefined' || !userId || xp <= 0) return;
  try {
    const mainKey = `ss_progress_${userId}`;
    const raw = localStorage.getItem(mainKey);
    const prog = raw ? JSON.parse(raw) : {};
    prog.xp = (prog.xp || 0) + xp;
    // Update streak: if last activity was yesterday or today, maintain/increment
    const today = new Date().toDateString();
    if (prog.lastActivityDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (prog.lastActivityDate === yesterday) {
        prog.streak = (prog.streak || 0) + 1;
      } else if (!prog.lastActivityDate) {
        prog.streak = 1;
      }
      prog.lastActivityDate = today;
    }
    // Track lesson-specific stats
    prog.lessonsCompleted = (prog.lessonsCompleted || 0) + 1;
    localStorage.setItem(mainKey, JSON.stringify(prog));
    window.dispatchEvent(new StorageEvent('storage', { key: mainKey }));
  } catch {}
}

// Save lesson content for offline access
export function saveForOffline(lessonId, lessonData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${OFFLINE_KEY_PREFIX}${lessonId}`, JSON.stringify({
      data: lessonData,
      savedAt: Date.now(),
    }));
  } catch {}
}

export function isAvailableOffline(lessonId) {
  if (typeof window === 'undefined') return false;
  try {
    return !!localStorage.getItem(`${OFFLINE_KEY_PREFIX}${lessonId}`);
  } catch {
    return false;
  }
}

export function removeOffline(lessonId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${OFFLINE_KEY_PREFIX}${lessonId}`);
  } catch {}
}

export function useLessonProgress(user) {
  const userId = user?.uid || user?.email || user?.id || null;
  const [progress, setProgress] = useState(getDefaultLessonProgress);

  const reload = useCallback(() => {
    setProgress(loadLessonProgress(userId));
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  // Auto-save wrapper
  const persist = useCallback((updated) => {
    setProgress(updated);
    saveLessonProgress(userId, updated);
  }, [userId]);

  // Save mid-lesson progress (which phase + question index)
  const saveInProgress = useCallback((lessonId, phase, questionIndex = 0) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        inProgress: {
          ...prev.inProgress,
          [lessonId]: { phase, questionIndex, savedAt: Date.now() },
        },
        lastLesson: lessonId,
      };
      saveLessonProgress(userId, updated);
      return updated;
    });
  }, [userId]);

  // Complete a lesson: save score, mark completed, award XP
  const completeLesson = useCallback((lessonId, correct, total, xpReward) => {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const xpMultiplier = pct >= 80 ? 1.0 : pct >= 60 ? 0.8 : 0.5;
    const xpEarned = Math.round(xpReward * xpMultiplier);

    setProgress((prev) => {
      const alreadyCompleted = prev.completed.includes(lessonId);
      const updated = {
        ...prev,
        completed: alreadyCompleted ? prev.completed : [...prev.completed, lessonId],
        scores: {
          ...prev.scores,
          [lessonId]: { correct, total, pct, completedAt: Date.now() },
        },
        xpEarned: {
          ...prev.xpEarned,
          [lessonId]: xpEarned,
        },
        inProgress: (() => {
          const ip = { ...prev.inProgress };
          delete ip[lessonId];
          return ip;
        })(),
        lastLesson: lessonId,
      };
      saveLessonProgress(userId, updated);
      return updated;
    });

    // Award XP to main progress store
    awardXPToMainProgress(userId, xpEarned, lessonId);

    return xpEarned;
  }, [userId]);

  // Reset / retake a lesson
  const resetLesson = useCallback((lessonId) => {
    setProgress((prev) => {
      const updated = {
        ...prev,
        completed: prev.completed.filter((id) => id !== lessonId),
        scores: (() => {
          const s = { ...prev.scores };
          delete s[lessonId];
          return s;
        })(),
        inProgress: (() => {
          const ip = { ...prev.inProgress };
          delete ip[lessonId];
          return ip;
        })(),
      };
      saveLessonProgress(userId, updated);
      return updated;
    });
  }, [userId]);

  // Derive weak subjects (< 60% average score)
  const getWeakSubjects = useCallback(() => {
    const subjectScores = {};
    Object.entries(progress.scores).forEach(([lessonId, score]) => {
      const lesson = LESSONS.find((l) => l.id === lessonId);
      if (!lesson) return;
      if (!subjectScores[lesson.subject]) subjectScores[lesson.subject] = [];
      subjectScores[lesson.subject].push(score.pct);
    });
    return Object.entries(subjectScores)
      .filter(([, scores]) => {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg < 60;
      })
      .map(([subj]) => subj);
  }, [progress.scores]);

  // Derive weak chapters (lessons scored below 60%)
  const getWeakLessons = useCallback(() => {
    return Object.entries(progress.scores)
      .filter(([, score]) => score.pct < 60)
      .map(([lessonId]) => lessonId);
  }, [progress.scores]);

  // Daily lesson recommendation
  const getDailyRecommendation = useCallback(() => {
    const weakSubjects = getWeakSubjects();
    return getDailyLesson(progress.completed, weakSubjects);
  }, [progress.completed, getWeakSubjects]);

  // Check if a lesson can be resumed
  const getResumeState = useCallback((lessonId) => {
    return progress.inProgress[lessonId] || null;
  }, [progress.inProgress]);

  // Chapter progress: for a given chapter, how many lessons done
  const getChapterProgress = useCallback((subject, chapter) => {
    const chapterLessons = LESSONS.filter((l) => l.subject === subject && l.chapter === chapter);
    const done = chapterLessons.filter((l) => progress.completed.includes(l.id)).length;
    return { done, total: chapterLessons.length, pct: chapterLessons.length > 0 ? Math.round((done / chapterLessons.length) * 100) : 0 };
  }, [progress.completed]);

  return {
    progress,
    reload,
    saveInProgress,
    completeLesson,
    resetLesson,
    getWeakSubjects,
    getWeakLessons,
    getDailyRecommendation,
    getResumeState,
    getChapterProgress,
    isCompleted: (id) => progress.completed.includes(id),
    getScore: (id) => progress.scores[id] || null,
    totalCompleted: progress.completed.length,
    totalXP: Object.values(progress.xpEarned).reduce((a, b) => a + b, 0),
  };
}
