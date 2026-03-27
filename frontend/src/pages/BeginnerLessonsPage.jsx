import { motion } from 'framer-motion';
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
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const lessonItems = [
  {
    id: 1,
    title: 'J, S, and Space',
    avgSpeed: 12,
    avgAcc: 95,
    time: '5:46',
    status: 'done',
    progress: 100,
    path: '/lessons/beginner/01-js',
  },
  {
    id: 2,
    title: 'U, R, and K Keys',
    avgSpeed: 12,
    avgAcc: 95,
    time: '9:37',
    status: 'done',
    progress: 100,
  },
  {
    id: 3,
    title: 'D, E, and I Keys',
    avgSpeed: 6,
    avgAcc: 92,
    time: '18:22',
    status: 'done',
    progress: 100,
  },
  {
    id: 4,
    title: 'C, G, and N Keys',
    avgSpeed: 9,
    avgAcc: 90,
    time: '1:00',
    status: 'current',
    progress: 34,
  },
];

const BeginnerLessonsPage = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 selection:bg-primary-500/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lessons
        </Link>

        <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-3xl p-6 md:p-8 shadow-xl shadow-primary-500/20 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-widest text-xs text-primary-100 font-bold mb-2">TypingKids Curriculum</p>
              <h1 className="text-3xl md:text-4xl font-black mb-2">Beginner Lessons</h1>
              <p className="text-primary-100 font-medium">Learn to type with guided beginner units and steady progression.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[280px]">
              <div className="bg-white/15 rounded-2xl p-3">
                <div className="text-xs text-primary-100 font-semibold mb-1 inline-flex items-center gap-1"><Gauge size={14} /> Avg Speed</div>
                <div className="text-xl font-black">10 wpm</div>
              </div>
              <div className="bg-white/15 rounded-2xl p-3">
                <div className="text-xs text-primary-100 font-semibold mb-1 inline-flex items-center gap-1"><Target size={14} /> Avg Acc</div>
                <div className="text-xl font-black">93%</div>
              </div>
              <div className="bg-white/15 rounded-2xl p-3">
                <div className="text-xs text-primary-100 font-semibold mb-1 inline-flex items-center gap-1"><Clock3 size={14} /> Typing Time</div>
                <div className="text-xl font-black">1:18:29</div>
              </div>
              <div className="bg-white/15 rounded-2xl p-3">
                <div className="text-xs text-primary-100 font-semibold mb-1 inline-flex items-center gap-1"><Flame size={14} /> Daily Goal</div>
                <div className="text-xl font-black">00:00</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Learn to Type</p>
              <div className="space-y-2">
                <button type="button" className="w-full text-left bg-primary-500 text-white rounded-2xl px-4 py-3 font-black inline-flex items-center justify-between">
                  Beginner <Play size={16} className="fill-current" />
                </button>
                <button type="button" className="w-full text-left bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 font-bold hover:bg-slate-200 transition-colors">
                  Intermediate
                </button>
                <button type="button" className="w-full text-left bg-slate-100 text-slate-500 rounded-2xl px-4 py-3 font-bold hover:bg-slate-200 transition-colors">
                  Advanced
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Typing Practice</p>
              <div className="space-y-2">
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <p className="font-bold text-slate-700">Reinforcement</p>
                  <p className="text-xs text-slate-500">Sharpen your current skills</p>
                </div>
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <p className="font-bold text-slate-700">Stories</p>
                  <p className="text-xs text-slate-500">A fun typing adventure</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
              <p className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Beyond Typing</p>
              <div className="space-y-2">
                {['Tech Readiness', 'Career Prep', 'Coding Essentials'].map((item) => (
                  <div key={item} className="bg-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <span className="font-semibold text-slate-700 text-sm">{item}</span>
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-400 text-slate-900">
                      <Crown size={14} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9 bg-primary-500 rounded-3xl border border-primary-300 shadow-xl shadow-primary-500/20 p-4 md:p-6">
            <div className="bg-white/15 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-white text-2xl font-black">Getting Started</h2>
                <span className="text-primary-100 font-bold">21% Complete</span>
              </div>
              <div className="w-full bg-white/25 rounded-full h-3 overflow-hidden">
                <div className="h-full bg-white w-[21%]" />
              </div>
            </div>

            <div className="space-y-4">
              {lessonItems.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`${lesson.status === 'done' ? 'bg-emerald-400/85 border-emerald-300' : 'bg-white border-slate-200'} border rounded-2xl p-4 md:p-5`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-sm font-black ${lesson.status === 'done' ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          {lesson.id}
                        </span>
                        <h3 className={`text-2xl font-black ${lesson.status === 'done' ? 'text-white' : 'text-slate-800'}`}>
                          {lesson.title}
                        </h3>
                      </div>
                      <p className={`mt-2 text-sm font-semibold ${lesson.status === 'done' ? 'text-white/95' : 'text-slate-600'}`}>
                        Avg Speed: {lesson.avgSpeed} wpm &nbsp; | &nbsp; Avg Acc: {lesson.avgAcc}% &nbsp; | &nbsp; Time: {lesson.time}
                      </p>
                    </div>

                    {lesson.status === 'done' ? (
                      lesson.path ? (
                        <Link to={lesson.path} className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 hover:bg-emerald-50 transition-colors">
                          <RotateCcw size={16} /> Restart
                        </Link>
                      ) : (
                        <button type="button" className="bg-white text-emerald-700 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2">
                          <RotateCcw size={16} /> Restart
                        </button>
                      )
                    ) : (
                      lesson.path ? (
                        <Link to={lesson.path} className="bg-secondary-400 text-slate-900 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2 hover:bg-secondary-500 transition-colors">
                          <Play size={16} className="fill-current" /> Resume
                        </Link>
                      ) : (
                        <button type="button" className="bg-secondary-400 text-slate-900 px-5 py-2 rounded-xl font-black inline-flex items-center gap-2">
                          <Play size={16} className="fill-current" /> Resume
                        </button>
                      )
                    )}
                  </div>
                  <div className="mt-4 w-full h-2.5 rounded-full bg-white/35 overflow-hidden">
                    <div className={`h-full ${lesson.status === 'done' ? 'bg-white/80' : 'bg-secondary-400'}`} style={{ width: `${lesson.progress}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BeginnerLessonsPage;
