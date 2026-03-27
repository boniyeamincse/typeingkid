import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Character states:
 *  'pending'   – not yet reached by the cursor
 *  'correct'   – typed correctly
 *  'incorrect' – typed incorrectly
 */

/**
 * Builds the initial character map from a source text string.
 * @param {string} text
 * @returns {{ char: string, state: 'pending'|'correct'|'incorrect' }[]}
 */
const buildCharMap = (text) =>
  text.split('').map((char) => ({ char, state: 'pending' }));

/**
 * useTypingEngine
 *
 * Drives a full typing session: character matching, WPM, accuracy,
 * backspace support, and cursor tracking.
 *
 * @param {string} text  - The passage the user must type.
 * @returns {object}     - Engine state + control helpers.
 */
const useTypingEngine = (text = '') => {
  // ─── State ──────────────────────────────────────────────────────────────────
  /** Per-character state array */
  const [charMap, setCharMap] = useState(() => buildCharMap(text));
  /** Index of the next character to be typed */
  const [cursorIndex, setCursorIndex] = useState(0);
  /** Whether the session has started (first keystroke received) */
  const [isStarted, setIsStarted] = useState(false);
  /** Whether the session is finished (cursor reached end of text) */
  const [isFinished, setIsFinished] = useState(false);
  /** Live WPM – recalculated every second while typing */
  const [wpm, setWpm] = useState(0);
  /** Live accuracy percentage */
  const [accuracy, setAccuracy] = useState(100);
  /** Total elapsed seconds since first keystroke */
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // ─── Refs (mutable, don't trigger re-renders) ────────────────────────────────
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  /** Running count of every non-backspace key pressed */
  const totalKeyPressesRef = useRef(0);
  const charMapRef = useRef(charMap);

  // ─── Reset when the source text changes ─────────────────────────────────────
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // ─── Cleanup interval on unmount ────────────────────────────────────────────
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    charMapRef.current = charMap;
  }, [charMap]);

  // ─── WPM / elapsed-time ticker ──────────────────────────────────────────────
  const startTicker = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedSeconds(Math.floor(elapsed));
    }, 1000);
  }, []);

  // ─── Derived stat helpers ────────────────────────────────────────────────────
  /**
   * Computes WPM from correct characters typed so far.
   * Standard definition: 1 word = 5 characters.
   */
  const computeWpm = useCallback((correctChars, elapsedMs) => {
    const minutes = elapsedMs / 1000 / 60;
    if (minutes === 0) return 0;
    return Math.round(correctChars / 5 / minutes);
  }, []);

  /**
   * Computes accuracy as: (correct chars / total non-backspace keypresses) * 100.
   * Falls back to 100% before any key is pressed.
   */
  const computeAccuracy = useCallback((correctChars, totalPresses) => {
    if (totalPresses === 0) return 100;
    return Math.round((correctChars / totalPresses) * 100);
  }, []);

  useEffect(() => {
    if (!isStarted || !startTimeRef.current) return;

    const elapsedMs = Date.now() - startTimeRef.current;
    const currentCorrectChars = charMap.filter((c) => c.state === 'correct').length;

    setWpm(computeWpm(currentCorrectChars, elapsedMs));
    setAccuracy(computeAccuracy(currentCorrectChars, totalKeyPressesRef.current));
  }, [charMap, elapsedSeconds, isStarted, computeWpm, computeAccuracy]);

  // ─── Core keystroke handler ──────────────────────────────────────────────────
  /**
   * Call this with every character the user types.
   * Handles printable characters and backspace ('\b' or 'Backspace').
   *
   * @param {string} key  - A single character or 'Backspace'.
   */
  const handleKeyPress = useCallback(
    (key) => {
      if (isFinished) return;

      // ── Backspace ────────────────────────────────────────────────────────────
      if (key === 'Backspace' || key === '\b') {
        if (cursorIndex === 0) return;

        const updatedMap = [...charMapRef.current];
        updatedMap[cursorIndex - 1] = {
          ...updatedMap[cursorIndex - 1],
          state: 'pending',
        };
        setCharMap(updatedMap);
        setCursorIndex((prev) => prev - 1);
        return;
      }

      // Ignore non-printable keys (arrows, ctrl, etc.)
      if (key.length !== 1) return;

      // ── Start session on first printable key ─────────────────────────────────
      if (!isStarted) {
        startTimeRef.current = Date.now();
        setIsStarted(true);
        startTicker();
      }

      totalKeyPressesRef.current += 1;

      const updatedMap = [...charMapRef.current];
      const isCorrect = key === updatedMap[cursorIndex]?.char;
      const newState = isCorrect ? 'correct' : 'incorrect';

      updatedMap[cursorIndex] = { ...updatedMap[cursorIndex], state: newState };
      setCharMap(updatedMap);

      const nextIndex = cursorIndex + 1;
      setCursorIndex(nextIndex);

      // ── Check for completion ──────────────────────────────────────────────────
      if (nextIndex === updatedMap.length) {
        clearInterval(intervalRef.current);
        setIsFinished(true);
      }
    },
    [
      isFinished,
      isStarted,
      cursorIndex,
      startTicker,
    ]
  );

  // ─── Reset ───────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    startTimeRef.current = null;
    totalKeyPressesRef.current = 0;

    setCharMap(buildCharMap(text));
    setCursorIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setElapsedSeconds(0);
  }, [text]);

  // ─── Derived values ──────────────────────────────────────────────────────────
  const correctChars = charMap.filter((c) => c.state === 'correct').length;
  const incorrectChars = charMap.filter((c) => c.state === 'incorrect').length;
  const progress =
    charMap.length > 0
      ? Math.round((cursorIndex / charMap.length) * 100)
      : 0;

  return {
    /** Per-character state array for rendering */
    charMap,
    /** Index of the character the cursor is currently on */
    cursorIndex,
    /** Whether the first keystroke has been received */
    isStarted,
    /** Whether the passage has been fully typed */
    isFinished,
    /** Live words-per-minute */
    wpm,
    /** Live accuracy percentage (0–100) */
    accuracy,
    /** Elapsed seconds since the first keystroke */
    elapsedSeconds,
    /** Number of correctly typed characters */
    correctChars,
    /** Number of incorrectly typed characters */
    incorrectChars,
    /** Completion percentage (0–100) */
    progress,
    /** Call with each key the user presses */
    handleKeyPress,
    /** Resets the engine back to the initial state */
    reset,
  };
};

export default useTypingEngine;
