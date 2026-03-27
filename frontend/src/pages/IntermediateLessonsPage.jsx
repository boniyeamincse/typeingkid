import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const IntermediateLessonsPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [lessonsRes, summaryRes] = await Promise.all([
          api.get('/lessons?difficulty=intermediate'),
          api.get('/lessons/progress/summary?difficulty=intermediate'),
        ]);

        const summaryMap = new Map(summaryRes.data.map((row) => [row.id, row]));
        const merged = lessonsRes.data
          .sort((a, b) => a.order_index - b.order_index)
          .map((lesson) => {
            const summary = summaryMap.get(lesson.id);
            const isDone = summary?.is_completed ?? false;
            return {
              id: lesson.id,
              index: lesson.order_index + 1,
              title: lesson.title,
              attempts: summary?.attempts ?? 0,
              bestWpm: summary?.best_wpm ?? 0,
              bestAccuracy: summary?.best_accuracy ?? 0,
              status: isDone ? 'done' : 'pending',
              path: `/lessons/intermediate/${lesson.order_index + 1}`,
            };
          });

        const firstPending = merged.findIndex((item) => item.status === 'pending');
        setItems(
          merged.map((item, idx) => ({
            ...item,
            status: item.status === 'done' ? 'done' : idx === firstPending ? 'current' : 'pending',
          }))
        );
      } catch (loadError) {
        setError(loadError.response?.data?.message || 'Failed to load intermediate lessons.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const doneCount = useMemo(() => items.filter((item) => item.status === 'done').length, [items]);
  const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </Link>

        <section className="bg-amber-500 text-white rounded-3xl p-6 shadow-xl mb-6">
          <p className="uppercase tracking-widest text-xs text-amber-100 font-bold mb-2">Sentence Training</p>
          <h1 className="text-3xl font-black">Intermediate Lessons</h1>
          <p className="text-amber-100 mt-2">Practice real sentence flow with punctuation and longer phrasing.</p>
          <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold">Progress: {doneCount}/{items.length} lessons completed</p>
        </section>

        {isLoading ? <div className="bg-white border border-slate-200 rounded-2xl p-5">Loading lessons...</div> : null}
        {error ? <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-5 font-semibold">{error}</div> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-600 font-semibold">
            No intermediate lessons found. Run backend seed to add sentence lessons.
          </div>
        ) : null}

        {!isLoading && !error && items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 ${item.status === 'done' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">
                      {String(item.index).padStart(2, '0')} - {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 font-semibold">
                      Best WPM: {item.bestWpm} | Best Accuracy: {item.bestAccuracy}% | Attempts: {item.attempts}
                    </p>
                  </div>
                  {item.status === 'done' ? (
                    <Link
                      to={item.path}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      <RotateCcw size={16} /> Retake
                    </Link>
                  ) : (
                    <Link
                      to={item.path}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                    >
                      <Play size={16} className="fill-current" /> Start
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default IntermediateLessonsPage;
