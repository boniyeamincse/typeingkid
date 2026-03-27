import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import useTypingEngine from '../hooks/useTypingEngine';
import api from '../services/api';

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const getKeyClassName = (key, activeKey, targetKeys) => {
  const isActive = activeKey === key;
  const isTarget = targetKeys.has(key);

  if (isActive) {
    return 'bg-primary-500 text-white border-primary-600 shadow-lg shadow-primary-500/30';
  }

  if (isTarget) {
    return 'bg-primary-100 text-primary-700 border-primary-300';
  }

  return 'bg-white text-slate-600 border-slate-300';
};

const BeginnerLessonJSPage = () => {
  const { lessonNumber } = useParams();
  const parsedLessonNumber = Number.parseInt(lessonNumber || '1', 10);

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
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

  const expectedChar = charMap[cursorIndex]?.char ?? ' ';
  const promptKey = expectedChar === ' ' ? 'Space' : expectedChar.toUpperCase();
  const activeKey = expectedChar === ' ' ? null : expectedChar.toUpperCase();

  const elapsedDisplay = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }, [elapsedSeconds]);

  const onRestart = () => {
    hasSavedProgressRef.current = false;
    setSaveError('');
    reset();
  };

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

        <section className="bg-white border border-slate-200 rounded-3xl p-5 md:p-7 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest font-black text-primary-600 mb-1">
                Beginner {String(parsedLessonNumber).padStart(2, '0')}
              </p>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900">{lesson.title}</h1>
              <p className="text-slate-500 mt-1">
                Type only these keys: {Array.from(targetKeys).join(', ') || 'A-Z'} and Space.
              </p>
            </div>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl px-4 py-2.5 font-bold hover:bg-black transition-colors"
            >
              <RotateCcw size={16} /> Restart
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
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
        </section>

        <section className="relative bg-slate-200/70 border border-slate-300 rounded-3xl p-4 md:p-8 overflow-hidden">
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
              {keyboardRows.map((row) => (
                <div key={row.join('')} className="flex justify-center gap-2">
                  {row.map((key) => (
                    <div
                      key={key}
                      className={`h-12 w-12 md:h-14 md:w-14 rounded-lg border font-bold text-lg flex items-center justify-center transition-all ${getKeyClassName(key, activeKey, targetKeys)}`}
                    >
                      {key}
                    </div>
                  ))}
                </div>
              ))}

              <div className="flex justify-center pt-1">
                <div
                  className={`h-12 md:h-14 w-56 md:w-72 rounded-lg border font-bold text-lg flex items-center justify-center transition-all ${
                    promptKey === 'Space'
                      ? 'bg-primary-500 text-white border-primary-600 shadow-lg shadow-primary-500/30'
                      : 'bg-white text-slate-500 border-slate-300'
                  }`}
                >
                  Space
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-[-80px] left-[10%] h-60 w-40 rounded-[80%] bg-rose-300/35 blur-[1px] rotate-12" />
          <div className="pointer-events-none absolute bottom-[-80px] right-[10%] h-60 w-40 rounded-[80%] bg-rose-300/35 blur-[1px] -rotate-12" />
        </section>

        <section className="mt-6 bg-white border border-slate-200 rounded-2xl p-4 md:p-5">
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
          {isFinished ? (
            <p className="mt-3 text-emerald-600 font-bold">
              Great job! You completed beginner lesson {String(parsedLessonNumber).padStart(2, '0')}.
            </p>
          ) : (
            <p className="mt-3 text-slate-500 text-sm">Tip: Press only highlighted lesson keys, Space, and Backspace.</p>
          )}
          {saveError ? <p className="mt-2 text-rose-600 text-sm font-semibold">{saveError}</p> : null}
        </section>
      </main>
    </div>
  );
};

export default BeginnerLessonJSPage;
