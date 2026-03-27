import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  Gauge,
  Target,
  Clock3,
  RotateCcw,
  Play,
  Crown,
  Keyboard,
  Gamepad2,
  Star,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Trophy,
  Loader2,
  Lock,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

/* ─────────────────────────────────────────── local-storage helpers ── */
const BEGINNER_PROGRESS_KEY = 'typingkid_beginner_progress_v1';

const readLocalBeginnerProgress = () => {
  try {
    const raw = localStorage.getItem(BEGINNER_PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch { return {}; }
};

const getLessonPath  = (lesson) => `/lessons/beginner/${lesson.order_index + 1}`;
const formatAttempts = (n)      => n ? `${n} attempt${n > 1 ? 's' : ''}` : 'Not started';
const shuffle        = (arr)    => [...arr].sort(() => Math.random() - 0.5);
const pick           = (arr, n) => shuffle(arr).slice(0, n);

/* ─────────────────────────────────────────── save result to API ── */
const saveResult = async (practice_type, score, accuracy, duration_secs) => {
  try {
    await api.post('/practice/results', { practice_type, score, accuracy, duration_secs });
  } catch (_) { /* silently fail — don't break UX */ }
};

/* ═══════════════════════════════════════════════════════
   PersonalBest banner
   ═══════════════════════════════════════════════════════ */
const PersonalBest = ({ type, bests }) => {
  const b = bests[type];
  if (!b) return null;
  return (
    <div className="flex gap-3 mb-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-center">
        <p className="text-xs text-amber-500 font-bold">Best Score</p>
        <p className="text-xl font-black text-amber-700">{b.best_score}</p>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-center">
        <p className="text-xs text-emerald-500 font-bold">Best Acc</p>
        <p className="text-xl font-black text-emerald-700">{b.best_accuracy}%</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center">
        <p className="text-xs text-slate-400 font-bold">Attempts</p>
        <p className="text-xl font-black text-slate-700">{b.attempts}</p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   AlphabetPractice — 26 keys from DB
   ═══════════════════════════════════════════════════════ */
const AlphabetPractice = ({ items, bests }) => {
  const letters  = useMemo(() => items.filter(i => i.type === 'letter').map(i => i.value.toUpperCase()), [items]);
  const [current, setCurrent]  = useState(0);
  const [results, setResults]  = useState([]);
  const [done,    setDone]     = useState(false);
  const [started, setStarted]  = useState(false);
  const [typed,   setTyped]    = useState('');
  const startTime = useRef(null);

  const reset = () => { setCurrent(0); setResults([]); setDone(false); setStarted(false); setTyped(''); };

  const handleKey = useCallback((e) => {
    if (!started || done || !letters.length) return;
    const key = e.key.toLowerCase();
    if (key.length !== 1 || !/[a-z]/.test(key)) return;
    e.preventDefault();
    const correct = key === letters[current].toLowerCase();
    const newResults = [...results, { letter: letters[current], correct }];
    setResults(newResults);
    setTyped(key);
    setTimeout(() => setTyped(''), 200);
    if (current + 1 >= letters.length) {
      setDone(true);
      const dur = Math.round((Date.now() - startTime.current) / 1000);
      const correctCount = newResults.filter(r => r.correct).length;
      const acc = Math.round((correctCount / letters.length) * 100);
      saveResult('alphabet', correctCount, acc, dur);
    } else {
      setCurrent(current + 1);
    }
  }, [started, done, current, letters, results]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const correctCount = results.filter(r => r.correct).length;

  if (!letters.length) return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-400 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Loading letters from database…
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
          <Keyboard size={20} />
        </div>
        <div>
          <h2 className="font-black text-slate-800 text-lg">26 Letters Practice</h2>
          <p className="text-xs text-slate-500">Type each letter of the alphabet in order</p>
        </div>
        {done && (
          <span className="ml-auto text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {correctCount}/{letters.length} correct
          </span>
        )}
      </div>

      <PersonalBest type="alphabet" bests={bests} />

      {!started ? (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setStarted(true); startTime.current = Date.now(); }}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
          <Play size={18} className="fill-current" /> Start Alphabet Practice
        </motion.button>
      ) : done ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {results.map((r, i) => (
              <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black
                ${r.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                {r.letter}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(correctCount / letters.length) * 100}%` }} />
            </div>
            <span className="text-sm font-black text-primary-600">{Math.round((correctCount / letters.length) * 100)}%</span>
          </div>
          <button onClick={reset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {letters.map((l, i) => (
              <div key={l} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all
                ${i < current
                  ? (results[i]?.correct ? 'bg-emerald-400 text-white' : 'bg-rose-400 text-white')
                  : i === current ? 'bg-primary-500 text-white scale-110 shadow-lg shadow-primary-300' : 'bg-slate-100 text-slate-400'}`}>
                {l}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center py-6 bg-slate-50 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Type This Letter</p>
            <motion.div key={current} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-black text-primary-600 leading-none">
              {letters[current]}
            </motion.div>
            <p className="text-slate-400 text-sm mt-3">{current + 1} / {letters.length}</p>
            {typed && (
              <motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -20 }} className="text-2xl font-black text-slate-600 mt-2">
                {typed.toUpperCase()}
              </motion.div>
            )}
          </div>
          <p className="text-center text-xs text-slate-400">Press the matching key on your keyboard</p>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ComboPractice — 2-letter or 3-letter combos from DB
   ═══════════════════════════════════════════════════════ */
const ComboPractice = ({ type, items, bests }) => {
  const dbType  = type === 2 ? 'two_letter' : 'three_letter';
  const apiType = dbType; // same string used in practice_type
  const color   = type === 2 ? 'violet' : 'emerald';
  const pool    = useMemo(() => items.filter(i => i.type === dbType).map(i => i.value), [items, dbType]);

  const [session,  setSession]  = useState([]);
  const [idx,      setIdx]      = useState(0);
  const [input,    setInput]    = useState('');
  const [results,  setResults]  = useState([]);
  const [done,     setDone]     = useState(false);
  const [flash,    setFlash]    = useState(null);
  const startTime = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (pool.length) { setSession(pick(pool, 10)); }
  }, [pool]);

  const reset = () => {
    setSession(pick(pool, 10)); setIdx(0); setInput(''); setResults([]); setDone(false); setFlash(null);
  };

  const target = session[idx] ?? '';

  const handleInput = (e) => {
    const val = e.target.value.toLowerCase();
    setInput(val);
    if (!target || val.length < target.length) return;
    const correct = val === target;
    setFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFlash(null);
      const newResults = [...results, { combo: target, typed: val, correct }];
      setResults(newResults);
      if (idx + 1 >= session.length) {
        setDone(true);
        const dur = Math.round((Date.now() - startTime.current) / 1000);
        const correctCount = newResults.filter(r => r.correct).length;
        const acc = Math.round((correctCount / session.length) * 100);
        saveResult(apiType, correctCount, acc, dur);
      } else {
        setIdx(i => i + 1);
      }
      setInput('');
    }, 400);
  };

  const correctCount = results.filter(r => r.correct).length;
  const cls = {
    violet:  { bg: 'bg-violet-500',  light: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-200' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  }[color];

  if (!pool.length) return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-400 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Loading combos from database…
    </div>
  );

  return (
    <div className={`bg-white rounded-3xl border ${cls.border} shadow-sm p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-2xl ${cls.light} flex items-center justify-center ${cls.text}`}>
          <span className="font-black text-sm">{type}L</span>
        </div>
        <div>
          <h2 className="font-black text-slate-800 text-lg">{type}-Letter Combos</h2>
          <p className="text-xs text-slate-500">Type each {type}-letter combination shown</p>
        </div>
        {done && (
          <span className={`ml-auto text-sm font-bold ${cls.text} ${cls.light} px-3 py-1 rounded-full`}>
            {correctCount}/10 correct
          </span>
        )}
      </div>

      <PersonalBest type={apiType} bests={bests} />

      {!session.length ? (
        <div className="flex items-center justify-center gap-2 py-8 text-slate-400"><Loader2 size={18} className="animate-spin" /> Preparing session…</div>
      ) : done ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-bold
                ${r.correct ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                {r.correct ? <CheckCircle2 size={13} /> : <XCircle size={13} />} {r.combo}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
              <div className={`h-full ${cls.bg} rounded-full`} style={{ width: `${(correctCount / session.length) * 100}%` }} />
            </div>
            <span className={`text-sm font-black ${cls.text}`}>{correctCount * 10}%</span>
          </div>
          <button onClick={reset} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
            <RotateCcw size={16} /> New Set
          </button>
        </div>
      ) : (
        <div className="space-y-4" onClick={() => { startTime.current = startTime.current || Date.now(); }}>
          <div className="flex gap-1.5">
            {session.map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full transition-all
                ${i < idx ? (results[i]?.correct ? 'bg-emerald-400' : 'bg-rose-400') : i === idx ? cls.bg : 'bg-slate-200'}`} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`flex flex-col items-center py-8 rounded-2xl transition-colors
                ${flash === 'correct' ? 'bg-emerald-50' : flash === 'wrong' ? 'bg-rose-50' : 'bg-slate-50'}`}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Type This Combo</p>
              <div className="text-6xl font-black text-slate-800 tracking-widest mb-1">{target.toUpperCase()}</div>
              <p className="text-xs text-slate-400">{idx + 1} of {session.length}</p>
            </motion.div>
          </AnimatePresence>
          <input ref={inputRef} autoFocus value={input} onChange={handleInput}
            onFocus={() => { startTime.current = startTime.current || Date.now(); }}
            maxLength={target.length + 1}
            placeholder={`Type "${target}"…`}
            className={`w-full text-center text-2xl font-black border-2 rounded-2xl py-4 outline-none transition-colors
              ${flash === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                : flash === 'wrong' ? 'border-rose-400 bg-rose-50 text-rose-600'
                : 'border-slate-200 focus:border-primary-400 bg-white text-slate-800'}`}
          />
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   ComboGame — timed game using DB items
   ═══════════════════════════════════════════════════════ */
const GAME_DURATION = 30;

const ROUND_DEFS = [
  { label: 'Letters',    dbType: 'letter',       apiType: 'alphabet',     color: 'from-primary-500 to-primary-700' },
  { label: '2-Letter',   dbType: 'two_letter',    apiType: 'two_letter',   color: 'from-violet-500 to-violet-700' },
  { label: '3-Letter',   dbType: 'three_letter',  apiType: 'three_letter', color: 'from-emerald-500 to-emerald-700' },
  { label: 'Mixed',      dbType: null,            apiType: 'combo_game',   color: 'from-amber-500 to-orange-600' },
];

const ComboGame = ({ items, bests }) => {
  const [roundIdx,  setRoundIdx]  = useState(0);
  const [gameState, setGameState] = useState('idle');
  const [words,     setWords]     = useState([]);
  const [wordIdx,   setWordIdx]   = useState(0);
  const [input,     setInput]     = useState('');
  const [score,     setScore]     = useState(0);
  const [errors,    setErrors]    = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(GAME_DURATION);
  const [flash,     setFlash]     = useState(null);
  const timerRef  = useRef(null);
  const inputRef  = useRef(null);
  const startTime = useRef(null);

  const round = ROUND_DEFS[roundIdx];

  const poolFor = (def) => {
    if (!def.dbType) {
      // Mixed: blend all types
      return items.map(i => i.value);
    }
    return items.filter(i => i.type === def.dbType).map(i => i.value);
  };

  const startGame = () => {
    const pool = poolFor(round);
    if (!pool.length) return;
    setWords(shuffle(pool).slice(0, 40));
    setWordIdx(0); setInput(''); setScore(0); setErrors(0);
    setTimeLeft(GAME_DURATION); setFlash(null);
    setGameState('playing');
    startTime.current = Date.now();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameState('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Save result when game ends
  useEffect(() => {
    if (gameState !== 'result') return;
    const dur = Math.round((Date.now() - startTime.current) / 1000);
    const acc = (score + errors) > 0 ? Math.round((score / (score + errors)) * 100) : 100;
    saveResult(round.apiType, score, acc, dur);
  }, [gameState]); // eslint-disable-line

  const handleInput = (e) => {
    if (gameState !== 'playing') return;
    const val = e.target.value.toLowerCase();
    const target = words[wordIdx];
    setInput(val);
    if (val.length < target?.length) return;
    const correct = val === target;
    setFlash(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFlash(null);
      if (correct) setScore(s => s + 1); else setErrors(err => err + 1);
      setWordIdx(i => i + 1);
      setInput('');
    }, 300);
  };

  const accuracy = (score + errors) > 0 ? Math.round((score / (score + errors)) * 100) : 100;

  if (!items.length) return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-400 font-semibold">
      <Loader2 size={20} className="animate-spin" /> Loading game data from database…
    </div>
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
          <Gamepad2 size={20} />
        </div>
        <div>
          <h2 className="font-black text-slate-800 text-lg">Combination Typing Game</h2>
          <p className="text-xs text-slate-500">Race the clock — letters, 2-letter &amp; 3-letter combos!</p>
        </div>
      </div>

      {/* Round tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ROUND_DEFS.map((r, i) => (
          <button key={r.label} onClick={() => { setRoundIdx(i); setGameState('idle'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all
              ${roundIdx === i ? `bg-gradient-to-br ${r.color} text-white shadow-md` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            {r.label}
          </button>
        ))}
      </div>

      <PersonalBest type={round.apiType} bests={bests} />

      {gameState === 'idle' && (
        <div className={`bg-gradient-to-br ${round.color} text-white rounded-2xl p-6 text-center space-y-4`}>
          <Gamepad2 size={40} className="mx-auto opacity-80" />
          <h3 className="text-xl font-black">{round.label} Challenge</h3>
          <p className="text-white/80 text-sm">Type as many {round.label.toLowerCase()} as you can in {GAME_DURATION} seconds!</p>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={startGame}
            className="bg-white text-slate-800 font-black px-8 py-3 rounded-2xl inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
            <Play size={18} className="fill-current" /> Start Game
          </motion.button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-2xl p-3 text-center">
              <p className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-center gap-1"><Zap size={11} /> Score</p>
              <p className="text-2xl font-black text-primary-600">{score}</p>
            </div>
            <div className={`rounded-2xl p-3 text-center transition-colors ${timeLeft <= 10 ? 'bg-rose-50' : 'bg-slate-50'}`}>
              <p className={`text-xs font-bold mb-1 flex items-center justify-center gap-1 ${timeLeft <= 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                <Clock3 size={11} /> Time
              </p>
              <p className={`text-2xl font-black ${timeLeft <= 10 ? 'text-rose-600' : 'text-slate-700'}`}>{timeLeft}s</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-3 text-center">
              <p className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-center gap-1"><Target size={11} /> Acc</p>
              <p className="text-2xl font-black text-slate-700">{accuracy}%</p>
            </div>
          </div>

          <div className={`rounded-2xl p-5 text-center transition-colors ${flash === 'correct' ? 'bg-emerald-50' : flash === 'wrong' ? 'bg-rose-50' : 'bg-slate-50'}`}>
            <p className="text-xs text-slate-400 mb-2 font-bold">TYPE THIS</p>
            <AnimatePresence mode="wait">
              <motion.div key={wordIdx} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.2, opacity: 0 }}
                className="text-5xl font-black text-slate-800 tracking-widest">
                {words[wordIdx]?.toUpperCase()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 overflow-hidden">
            {words.slice(wordIdx + 1, wordIdx + 5).map((w, i) => (
              <span key={i} className="text-slate-300 font-bold text-sm px-2 py-1 bg-slate-50 rounded-lg">{w.toUpperCase()}</span>
            ))}
          </div>

          <input ref={inputRef} autoFocus value={input} onChange={handleInput}
            placeholder="Type here…"
            className="w-full text-center text-2xl font-black border-2 border-slate-200 focus:border-primary-400 rounded-2xl py-4 outline-none transition-colors bg-white text-slate-800" />

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <motion.div className={`h-full rounded-full transition-colors ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-primary-500'}`}
              style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="space-y-4">
          <div className={`bg-gradient-to-br ${round.color} text-white rounded-2xl p-6 text-center`}>
            <Trophy size={40} className="mx-auto mb-3 opacity-90" />
            <h3 className="text-2xl font-black mb-1">Time's Up!</h3>
            <p className="text-white/80 text-sm">{round.label} Challenge complete — result saved!</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-primary-400 font-bold mb-1">Score</p>
              <p className="text-3xl font-black text-primary-700">{score}</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-emerald-400 font-bold mb-1">Accuracy</p>
              <p className="text-3xl font-black text-emerald-700">{accuracy}%</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-rose-400 font-bold mb-1">Errors</p>
              <p className="text-3xl font-black text-rose-600">{errors}</p>
            </div>
          </div>
          {score >= 10 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <Star size={18} className="text-amber-500 fill-amber-400" />
              <span className="text-amber-700 font-bold text-sm">
                {score >= 20 ? '🏆 Amazing! Expert level!' : score >= 15 ? '⭐ Great job!' : '👍 Good start!'}
              </span>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={startGame}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              <RotateCcw size={16} /> Play Again
            </button>
            <button onClick={() => setGameState('idle')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              Change Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
const BeginnerLessonsPage = () => {
  const [lessonItems,    setLessonItems]    = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [loadError,      setLoadError]      = useState('');
  const [activeTab,      setActiveTab]      = useState('lessons');
  const [practiceItems,  setPracticeItems]  = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [bests,          setBests]          = useState({});

  // Load lessons
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const [lr, sr] = await Promise.all([
          api.get('/lessons?difficulty=beginner'),
          api.get('/lessons/progress/summary?difficulty=beginner'),
        ]);
        const localProgress = readLocalBeginnerProgress();
        const summaryMap = new Map(sr.data.map(i => [i.id, i]));
        const merged = lr.data
          .sort((a, b) => a.order_index - b.order_index)
          .map(lesson => {
            const summary = summaryMap.get(lesson.id);
            const local   = localProgress[String(lesson.order_index)] || {};
            const isCompleted = (summary?.is_completed ?? false) || !!local.completed;
            const isResume    = !isCompleted && !!local.inProgress;
            const pct = Number.isFinite(local.progressPercent)
              ? Math.max(0, Math.min(100, Math.round(local.progressPercent))) : 0;
            return {
              id: lesson.id, orderIndex: lesson.order_index, index: lesson.order_index + 1,
              title: lesson.title,
              avgSpeed: summary?.best_wpm ?? 0, avgAcc: summary?.best_accuracy ?? 0,
              time: formatAttempts(summary?.attempts ?? 0),
              status: isCompleted ? 'done' : isResume ? 'resume' : 'pending',
              progress: isCompleted ? 100 : pct,
              path: getLessonPath(lesson),
            };
          });
        const firstPending = merged.findIndex(i => i.status === 'pending');
        setLessonItems(merged.map((item, idx) => ({
          ...item,
          status: (item.status === 'done' || item.status === 'resume') ? item.status
            : idx === firstPending ? 'current' : 'pending',
        })));
      } catch (e) {
        setLoadError(e.response?.data?.message || 'Failed to load beginner lessons.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Load practice items from DB + personal bests
  useEffect(() => {
    const loadPractice = async () => {
      try {
        setPracticeLoading(true);
        const [itemsRes, bestsRes] = await Promise.all([
          api.get('/practice/items'),
          api.get('/practice/results/me/best'),
        ]);
        setPracticeItems(itemsRes.data);
        setBests(bestsRes.data);
      } catch (_) {
        // graceful fallback — practice items will just be empty
      } finally {
        setPracticeLoading(false);
      }
    };
    loadPractice();
  }, []);

  // Refresh personal bests when switching back to a practice tab
  const refreshBests = async () => {
    try {
      const res = await api.get('/practice/results/me/best');
      setBests(res.data);
    } catch (_) {}
  };

  const totalLessons     = lessonItems.length;
  const completedLessons = useMemo(() => lessonItems.filter(i => i.status === 'done').length, [lessonItems]);
  const completionPct    = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const avgWpm = completedLessons > 0
    ? Math.round(lessonItems.filter(i => i.status === 'done').reduce((s, i) => s + i.avgSpeed, 0) / completedLessons) : 0;
  const avgAcc = completedLessons > 0
    ? Math.round(lessonItems.filter(i => i.status === 'done').reduce((s, i) => s + i.avgAcc, 0) / completedLessons)    : 0;

  const TABS = [
    { id: 'lessons',  label: 'Lessons',    icon: <Crown size={15} /> },
    { id: 'alphabet', label: '26 Letters', icon: <Keyboard size={15} /> },
    { id: '2letter',  label: '2-Letter',   icon: <ChevronRight size={15} /> },
    { id: '3letter',  label: '3-Letter',   icon: <Star size={15} /> },
    { id: 'game',     label: 'Combo Game', icon: <Gamepad2 size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-primary-500/20">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/lessons" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </Link>

        {/* Hero */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary-500/20 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-widest text-xs text-primary-100 font-bold mb-2">TypingKids Curriculum</p>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Beginner Lessons</h1>
              <p className="text-primary-100 font-medium">Learn to type with guided beginner units and steady progression.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[280px]">
              {[
                { icon: <Gauge size={14} />, label: 'Avg Speed', val: `${avgWpm} wpm` },
                { icon: <Target size={14} />, label: 'Avg Acc',   val: `${avgAcc}%` },
                { icon: <Clock3 size={14} />, label: 'Progress',  val: `${completedLessons}/${totalLessons}` },
                { icon: <Flame size={14} />,  label: 'Daily Goal', val: `${completionPct}%` },
              ].map(({ icon, label, val }) => (
                <div key={label} className="bg-white/15 rounded-2xl p-3">
                  <div className="text-xs text-primary-100 font-semibold mb-1 inline-flex items-center gap-1">{icon} {label}</div>
                  <div className="text-xl font-black">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id !== 'lessons') refreshBests(); }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-300/40'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── LESSONS TAB ── */}
        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Learn to Type</p>
                <div className="space-y-2">
                  <button type="button" className="w-full text-left bg-primary-500 text-white rounded-2xl px-4 py-3 font-black inline-flex items-center justify-between">
                    Beginner <Play size={16} className="fill-current" />
                  </button>
                  <button type="button" className="w-full text-left bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 font-bold hover:bg-slate-200 transition-colors">Intermediate</button>
                  <button type="button" className="w-full text-left bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 font-bold hover:bg-slate-200 transition-colors">Advanced</button>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Typing Practice</p>
                <div className="space-y-2">
                  {[
                    { id: 'alphabet', label: '26 Letters',   sub: 'Type the full alphabet',       color: 'primary' },
                    { id: '2letter',  label: '2-Letter Combos', sub: 'Practice letter pairs',      color: 'violet' },
                    { id: '3letter',  label: '3-Letter Combos', sub: 'Practice short words',       color: 'emerald' },
                    { id: 'game',     label: 'Combo Game 🎮',   sub: 'Race the clock!',            color: 'amber' },
                  ].map(t => (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); refreshBests(); }}
                      className={`w-full text-left bg-${t.color}-50 border border-${t.color}-200 rounded-2xl px-4 py-3 hover:bg-${t.color}-100 transition-colors`}>
                      <p className={`font-bold text-${t.color}-700`}>{t.label}</p>
                      <p className={`text-xs text-${t.color}-500`}>{t.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Beyond Typing</p>
                <div className="space-y-2">
                  {['Tech Readiness', 'Career Prep', 'Coding Essentials'].map(item => (
                    <div key={item} className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-sm">{item}</span>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-400 text-slate-900"><Crown size={14} /></span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <section className="lg:col-span-8 xl:col-span-9 bg-primary-500 rounded-3xl border border-primary-300 shadow-xl shadow-primary-500/20 p-4 md:p-6">
              <div className="bg-white/15 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-white text-2xl font-black">Getting Started</h2>
                  <span className="text-primary-100 font-bold">{completionPct}% Complete</span>
                </div>
                <div className="w-full bg-white/25 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-white" style={{ width: `${completionPct}%` }} />
                </div>
              </div>

              {isLoading && <div className="bg-white rounded-2xl p-5 text-slate-600 font-semibold flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> Loading lessons…</div>}
              {!isLoading && loadError && <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-700 font-semibold">{loadError}</div>}
              {!isLoading && !loadError && lessonItems.length === 0 && (
                <div className="bg-white rounded-2xl p-5 text-slate-600 font-semibold">No beginner lessons found. Add lessons from admin panel first.</div>
              )}

              {!isLoading && !loadError && lessonItems.length > 0 && (
                <div className="space-y-4">
                  {lessonItems.map((lesson, i) => (
                    <motion.div key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className={`${lesson.status === 'done' ? 'bg-emerald-400/85 border-emerald-300' : 'bg-white border-slate-200'} border rounded-2xl p-4 md:p-5`}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="inline-flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-black ${lesson.status === 'done' ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-700'}`}>{lesson.index}</span>
                            <h3 className={`text-2xl font-black ${lesson.status === 'done' ? 'text-white' : 'text-slate-800'}`}>{lesson.title}</h3>
                          </div>
                          <p className={`mt-2 text-sm font-semibold ${lesson.status === 'done' ? 'text-white/95' : 'text-slate-600'}`}>
                            Best Speed: {lesson.avgSpeed} wpm &nbsp;|&nbsp; Best Acc: {lesson.avgAcc}% &nbsp;|&nbsp; {lesson.time}
                          </p>
                        </div>
                        {lesson.status === 'done' ? (
                          lesson.path
                            ? <Link to={lesson.path} className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 hover:bg-emerald-50 transition-colors"><RotateCcw size={16} /> Retake</Link>
                            : <button className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2"><RotateCcw size={16} /> Retake</button>
                        ) : lesson.status === 'resume' && lesson.path ? (
                          <Link to={lesson.path} className="bg-primary-500 text-white px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"><Play size={16} className="fill-current" /> Resume</Link>
                        ) : lesson.status === 'current' && lesson.path ? (
                          <Link to={lesson.path} className="bg-secondary-400 text-slate-900 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 hover:bg-secondary-500 transition-colors"><Play size={16} className="fill-current" /> Start</Link>
                        ) : (
                          <button disabled className="bg-slate-300 text-slate-600 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 cursor-not-allowed"><Lock size={16} /> Locked</button>
                        )}
                      </div>
                      <div className="mt-4 w-full h-2.5 rounded-full bg-white/35 overflow-hidden">
                        <div className={`h-full ${lesson.status === 'done' ? 'bg-white/80' : 'bg-secondary-400'}`} style={{ width: `${lesson.progress}%` }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Practice loading state */}
        {activeTab !== 'lessons' && practiceLoading && (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-500 font-semibold">
            <Loader2 size={24} className="animate-spin text-primary-500" /> Loading practice data from database…
          </div>
        )}

        {/* ── ALPHABET TAB ── */}
        {activeTab === 'alphabet' && !practiceLoading && (
          <div className="max-w-2xl mx-auto">
            <AlphabetPractice items={practiceItems} bests={bests} />
          </div>
        )}

        {/* ── 2-LETTER TAB ── */}
        {activeTab === '2letter' && !practiceLoading && (
          <div className="max-w-2xl mx-auto">
            <ComboPractice type={2} items={practiceItems} bests={bests} />
          </div>
        )}

        {/* ── 3-LETTER TAB ── */}
        {activeTab === '3letter' && !practiceLoading && (
          <div className="max-w-2xl mx-auto">
            <ComboPractice type={3} items={practiceItems} bests={bests} />
          </div>
        )}

        {/* ── COMBO GAME TAB ── */}
        {activeTab === 'game' && !practiceLoading && (
          <div className="max-w-2xl mx-auto">
            <ComboGame items={practiceItems} bests={bests} />
          </div>
        )}
      </main>
    </div>
  );
};

export default BeginnerLessonsPage;
