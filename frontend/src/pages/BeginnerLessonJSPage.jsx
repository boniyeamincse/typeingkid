import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useTypingEngine from '../hooks/useTypingEngine';
import api from '../services/api';

const BEGINNER_PROGRESS_KEY = 'typingkid_beginner_progress_v1';

const toLessonPath = (lesson) => {
  if (!lesson) return '/lessons';
  if (lesson.difficulty === 'beginner') {
    return `/lessons/beginner/${lesson.order_index + 1}`;
  }
  return '/lessons';
};

const readLocalBeginnerProgress = () => {
  try {
    const raw = localStorage.getItem(BEGINNER_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
};

const writeLocalBeginnerProgress = (updateFn) => {
  const current = readLocalBeginnerProgress();
  const next = updateFn(current);
  localStorage.setItem(BEGINNER_PROGRESS_KEY, JSON.stringify(next));
};

const keyboardRows = [
  [
    { label: '~', value: '`' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '0', value: '0' },
    { label: '-', value: '-' },
    { label: '=', value: '=' },
    { label: 'Delete', value: 'Backspace', widthClass: 'w-20 md:w-24' },
  ],
  [
    { label: 'Tab', value: 'Tab', widthClass: 'w-16 md:w-20' },
    { label: 'Q', value: 'Q' },
    { label: 'W', value: 'W' },
    { label: 'E', value: 'E' },
    { label: 'R', value: 'R' },
    { label: 'T', value: 'T' },
    { label: 'Y', value: 'Y' },
    { label: 'U', value: 'U' },
    { label: 'I', value: 'I' },
    { label: 'O', value: 'O' },
    { label: 'P', value: 'P' },
    { label: '[', value: '[' },
    { label: ']', value: ']' },
    { label: '\\', value: '\\', widthClass: 'w-16 md:w-20' },
  ],
  [
    { label: 'Caps', value: 'CapsLock', widthClass: 'w-20 md:w-24' },
    { label: 'A', value: 'A' },
    { label: 'S', value: 'S' },
    { label: 'D', value: 'D' },
    { label: 'F', value: 'F' },
    { label: 'G', value: 'G' },
    { label: 'H', value: 'H' },
    { label: 'J', value: 'J' },
    { label: 'K', value: 'K' },
    { label: 'L', value: 'L' },
    { label: ';', value: ';' },
    { label: "'", value: "'" },
    { label: 'Enter', value: 'Enter', widthClass: 'w-20 md:w-24' },
  ],
  [
    { label: 'Shift', value: 'Shift', widthClass: 'w-24 md:w-28' },
    { label: 'Z', value: 'Z' },
    { label: 'X', value: 'X' },
    { label: 'C', value: 'C' },
    { label: 'V', value: 'V' },
    { label: 'B', value: 'B' },
    { label: 'N', value: 'N' },
    { label: 'M', value: 'M' },
    { label: ',', value: ',' },
    { label: '.', value: '.' },
    { label: '/', value: '/' },
    { label: 'Shift', value: 'ShiftRight', widthClass: 'w-24 md:w-28' },
  ],
  [
    { label: 'Ctrl', value: 'Control', widthClass: 'w-14 md:w-16' },
    { label: 'Alt', value: 'Alt', widthClass: 'w-14 md:w-16' },
    { label: 'Space', value: 'Space', widthClass: 'w-56 md:w-72' },
    { label: 'Alt', value: 'AltRight', widthClass: 'w-14 md:w-16' },
    { label: 'Ctrl', value: 'ControlRight', widthClass: 'w-14 md:w-16' },
  ],
];

const getKeyClassName = (value, activeKey, targetKeys) => {
  const isActive = activeKey === value;
  const isTarget = targetKeys.has(value);

  if (isActive) {
    return 'bg-primary-500 text-white border-primary-600 shadow-lg shadow-primary-500/30';
  }

  if (isTarget) {
    return 'bg-primary-100 text-primary-700 border-primary-300';
  }

  return 'bg-white text-slate-600 border-slate-300';
};

const getStarsFromAccuracy = (acc) => {
  if (acc >= 98) return 3;
  if (acc >= 90) return 2;
  return 1;
};

const BeginnerLessonJSPage = () => {
  const { lessonNumber } = useParams();
  const navigate = useNavigate();
  const parsedLessonNumber = Number.parseInt(lessonNumber || '1', 10);

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [adaptiveSuggestion, setAdaptiveSuggestion] = useState(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const hasSavedProgressRef = useRef(false);

  useEffect(() => {
    const loadLesson = async () => {
      if (Number.isNaN(parsedLessonNumber) || parsedLessonNumber <= 0) {
        setLoadError('Invalid lesson number.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError('');
        hasSavedProgressRef.current = false;

        const orderIndex = parsedLessonNumber - 1;
        const response = await api.get(`/lessons/difficulty/beginner/order/${orderIndex}`);
        setLesson(response.data);
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Failed to load lesson.');
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [parsedLessonNumber]);

  const lessonPattern = useMemo(() => {
    if (!lesson?.content) return '';
    return lesson.content.toLowerCase();
  }, [lesson]);

  const {
    charMap,
    cursorIndex,
    wpm,
    accuracy,
    elapsedSeconds,
    progress,
    handleKeyPress,
    reset,
    isFinished,
  } = useTypingEngine(lessonPattern);

  const targetKeys = useMemo(() => {
    const keys = new Set();
    for (const char of lessonPattern) {
      if (/[a-z]/.test(char)) {
        keys.add(char.toUpperCase());
      }
    }
    return keys;
  }, [lessonPattern]);

  const allowedCharacters = useMemo(() => {
    const chars = new Set();
    for (const char of lessonPattern) {
      if (char === ' ' || /[a-z]/.test(char)) {
        chars.add(char);
      }
    }
    return chars;
  }, [lessonPattern]);

  useEffect(() => {
    if (!lesson) return;

    const onKeyDown = (event) => {
      const key = event.key;

      if (key === 'Backspace') {
        event.preventDefault();
        handleKeyPress('Backspace');
        return;
      }

      if (key.length === 1) {
        const normalized = key.toLowerCase();
        if (allowedCharacters.has(normalized)) {
          event.preventDefault();
          handleKeyPress(normalized);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lesson, handleKeyPress, allowedCharacters]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!lesson || !isFinished || hasSavedProgressRef.current) return;

      try {
        hasSavedProgressRef.current = true;
        setSaveError('');
        await api.post(`/lessons/${lesson.id}/progress`, {
          wpm,
          accuracy,
        });
      } catch (error) {
        hasSavedProgressRef.current = false;
        setSaveError(error.response?.data?.message || 'Failed to save progress.');
      }
    };

    saveProgress();
  }, [lesson, isFinished, wpm, accuracy]);

  useEffect(() => {
    const loadAdaptiveSuggestion = async () => {
      if (!lesson || !isFinished) return;

      try {
        setSuggestionLoading(true);
        const response = await api.get(`/lessons/${lesson.id}/adaptive-next`, {
          params: { wpm, accuracy },
        });
        setAdaptiveSuggestion(response.data?.recommendation ?? null);
      } catch {
        setAdaptiveSuggestion(null);
      } finally {
        setSuggestionLoading(false);
      }
    };

    loadAdaptiveSuggestion();
  }, [lesson, isFinished, wpm, accuracy]);

  const expectedChar = charMap[cursorIndex]?.char ?? ' ';
  const promptKey = expectedChar === ' ' ? 'Space' : expectedChar.toUpperCase();
  const activeKey = expectedChar === ' ' ? 'Space' : expectedChar.toUpperCase();

  const elapsedDisplay = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [elapsedSeconds]);

  const upcomingLetters = useMemo(() => {
    const windowSize = 8;
    const upcoming = charMap.slice(cursorIndex, cursorIndex + windowSize);

    return upcoming.map((item, index) => ({
      label: item.char === ' ' ? 'space' : item.char,
      isCurrent: index === 0,
    }));
  }, [charMap, cursorIndex]);

  const onRestart = () => {
    hasSavedProgressRef.current = false;
    setSaveError('');
    setAdaptiveSuggestion(null);
    writeLocalBeginnerProgress((current) => ({
      ...current,
      [String(parsedLessonNumber - 1)]: {
        inProgress: false,
        completed: false,
        progressPercent: 0,
      },
    }));
    reset();
  };

  const fallbackNextPath = '/lessons/beginner';
  const recommendedLesson = adaptiveSuggestion?.lesson ?? null;
  const recommendedPath = toLessonPath(recommendedLesson);
  const continuePath = adaptiveSuggestion ? recommendedPath : fallbackNextPath;
  const continueLabel =
    adaptiveSuggestion?.type === 'retry'
      ? 'Try Again'
      : adaptiveSuggestion?.type === 'promote'
        ? 'Move Up'
        : adaptiveSuggestion?.type === 'complete'
          ? 'Back to Lessons'
          : 'Continue';
  const stars = getStarsFromAccuracy(accuracy);

  useEffect(() => {
    if (!lesson || Number.isNaN(parsedLessonNumber) || parsedLessonNumber <= 0) return;

    const lessonKey = String(parsedLessonNumber - 1);
    writeLocalBeginnerProgress((current) => {
      const previous = current[lessonKey] || {};
      return {
        ...current,
        [lessonKey]: {
          ...previous,
          inProgress: !isFinished && cursorIndex > 0,
          completed: isFinished,
          progressPercent: isFinished ? 100 : progress,
        },
      };
    });
  }, [lesson, parsedLessonNumber, cursorIndex, progress, isFinished]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600 font-semibold">
            Loading lesson...
          </div>
        </main>
      </div>
    );
  }

  if (loadError || !lesson) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/lessons/beginner"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Beginner Lessons
          </Link>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-700 font-semibold">
            {loadError || 'Lesson not found.'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/lessons/beginner"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Beginner Lessons
        </Link>

        <section className="relative bg-slate-200/70 border border-slate-300 rounded-3xl p-4 md:p-8 overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-primary-600 mb-1">
                Beginner {String(parsedLessonNumber).padStart(2, '0')}
              </p>
              <h1 className="text-xl md:text-2xl font-black text-slate-900">{lesson.title}</h1>
            </div>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-2.5 font-bold hover:bg-black transition-colors"
            >
              <RotateCcw size={16} /> Retake
            </button>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-6 mb-6">
            <div className="w-full lg:w-56 bg-sky-200 border-4 border-slate-400 rounded-2xl p-4 flex flex-col items-center justify-center">
              <div className="text-5xl leading-none">💻</div>
              <div className="text-4xl mt-2">:)</div>
            </div>

            <div className="relative flex-1 bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
              <div className="absolute left-[-14px] top-10 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[14px] border-r-white" />
              <p className="text-slate-600 text-lg">Howdy! Use your home row fingers to:</p>
              <div className="flex items-center flex-wrap gap-3 mt-4">
                <span className="text-4xl md:text-5xl font-black text-slate-800">Type the</span>
                <span className="inline-flex items-center justify-center min-w-20 h-20 rounded-xl border-2 border-slate-300 text-5xl font-black text-slate-800 bg-slate-50 px-4">
                  {promptKey}
                </span>
                <span className="text-4xl md:text-5xl font-black text-slate-800">key</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-300 rounded-3xl p-4 md:p-5 border border-slate-400">
            <div className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Keyboard Trainer</div>

            <div className="space-y-2">
              {keyboardRows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex justify-center gap-2 flex-wrap md:flex-nowrap">
                  {row.map((key) => (
                    <div
                      key={key.label + key.value}
                      className={`h-12 md:h-14 ${key.widthClass ?? 'w-12 md:w-14'} rounded-lg border font-bold text-sm md:text-base flex items-center justify-center transition-all ${getKeyClassName(key.value, activeKey, targetKeys)}`}
                    >
                      {key.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[-80px] left-[10%] h-60 w-40 rounded-[80%] bg-rose-300/35 blur-[1px] rotate-12" />
          <div className="pointer-events-none absolute bottom-[-80px] right-[10%] h-60 w-40 rounded-[80%] bg-rose-300/35 blur-[1px] -rotate-12" />

          <div className="mt-5 bg-slate-100 border border-slate-300 rounded-2xl p-3 md:p-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {upcomingLetters.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className={`min-w-20 h-16 rounded-lg border flex items-center justify-center text-4xl font-light transition-colors ${
                    item.isCurrent
                      ? 'bg-primary-500 text-white border-primary-600'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  {item.label}
                </div>
              ))}
              {upcomingLetters.length === 0 ? (
                <div className="text-sm text-slate-500 font-semibold px-2 py-3">No upcoming letters.</div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 bg-white border border-slate-300 rounded-2xl p-4 md:p-5">
            <h2 className="font-black text-slate-800 mb-3">Practice Line</h2>
            <div className="leading-10 text-2xl md:text-3xl font-black tracking-wide break-words">
              {charMap.map((item, idx) => {
                const char = item.char === ' ' ? '\u00A0' : item.char.toUpperCase();
                const isCurrent = idx === cursorIndex;

                let classes = 'px-0.5 rounded ';
                if (item.state === 'correct') classes += 'text-emerald-600';
                if (item.state === 'incorrect') classes += 'text-rose-600 bg-rose-100';
                if (item.state === 'pending') classes += 'text-slate-400';
                if (isCurrent) classes += ' ring-2 ring-primary-500 text-slate-900';

                return (
                  <span key={`${item.char}-${idx}`} className={classes}>
                    {char}
                  </span>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">WPM</p>
                <p className="text-2xl font-black text-slate-900">{wpm}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Accuracy</p>
                <p className="text-2xl font-black text-slate-900">{accuracy}%</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time</p>
                <p className="text-2xl font-black text-slate-900">{elapsedDisplay}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Progress</p>
                <p className="text-2xl font-black text-slate-900">{progress}%</p>
              </div>
            </div>

            {!isFinished ? (
              <p className="mt-3 text-slate-500 text-sm">Tip: Press only highlighted lesson keys, Space, and Backspace.</p>
            ) : null}
            {saveError ? <p className="mt-2 text-rose-600 text-sm font-semibold">{saveError}</p> : null}
          </div>
        </section>

        {isFinished ? (
          <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm flex items-center justify-center p-4">
            <section className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-2xl">
              <h2 className="text-3xl font-black text-center text-slate-800">Lesson Complete</h2>

              <div className="flex justify-center gap-2 text-5xl mt-4">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={n <= stars ? 'text-amber-400' : 'text-slate-300'}>
                    ★
                  </span>
                ))}
              </div>

              <p className="text-center text-slate-600 font-semibold mt-3">
                You earned {stars}/3 stars for accuracy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">Speed</p>
                  <p className="text-2xl font-black text-primary-700">{wpm} WPM</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Accuracy</p>
                  <p className="text-2xl font-black text-emerald-700">{accuracy}%</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Time</p>
                  <p className="text-2xl font-black text-slate-800">{elapsedDisplay}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {suggestionLoading ? (
                  <p className="text-sm font-semibold text-slate-500">Analyzing your performance...</p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-slate-700">
                      {adaptiveSuggestion?.message || 'Good work. Continue your learning track.'}
                    </p>
                    {recommendedLesson ? (
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Suggested next: {recommendedLesson.title} ({recommendedLesson.difficulty})
                      </p>
                    ) : null}
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  to="/lessons/beginner"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-center"
                >
                  Back to Lessons
                </Link>
                <button
                  type="button"
                  onClick={onRestart}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Redo
                </button>
                <button
                  type="button"
                  onClick={() => navigate(continuePath)}
                  className="px-4 py-2.5 rounded-xl bg-secondary-500 text-slate-900 font-black hover:bg-secondary-600 transition-colors"
                >
                  {continueLabel}
                </button>
              </div>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default BeginnerLessonJSPage;
