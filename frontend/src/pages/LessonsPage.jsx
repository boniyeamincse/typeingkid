import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Flag, ShieldOff } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const difficultyBlocks = [
  {
    title: 'Beginner',
    description: 'Learn fundamentals: home row keys, finger placement, and rhythm control.',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    path: '/lessons/beginner',
  },
  {
    title: 'Intermediate',
    description: 'Increase speed with punctuation, mixed words, and longer sentence flow.',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
    path: '/lessons/intermediate',
  },
  {
    title: 'Advanced',
    description: 'Master high-speed typing with complex paragraphs and coding-style snippets.',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
    path: '/lessons/advanced',
  },
];

const LessonsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-500/20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-3">Lessons</h1>
          <p className="text-slate-500 text-lg">
            Choose your difficulty level and continue your typing progression.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="inline-flex items-center gap-2 text-red-600 font-bold mb-2">
              <Flag size={18} /> Report An Ad
            </div>
            <p className="text-slate-500 text-sm">Spotted an inappropriate or broken ad? Let us know quickly.</p>
          </motion.button>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-left bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="inline-flex items-center gap-2 text-primary-600 font-bold mb-2">
              <ShieldOff size={18} /> Remove Ads
            </div>
            <p className="text-slate-500 text-sm">Upgrade to ad-free learning for a cleaner focus experience.</p>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficultyBlocks.map((block, i) => (
            <motion.div
              key={block.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className={`border rounded-3xl p-7 shadow-sm ${block.color}`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center mb-4">
                <BookOpen size={20} />
              </div>
              <h2 className="text-2xl font-black mb-2">{block.title}</h2>
              <p className="text-sm leading-relaxed mb-5">{block.description}</p>
              {block.path ? (
                <Link
                  to={block.path}
                  className="block w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-center"
                >
                  Start {block.title}
                </Link>
              ) : (
                <button
                  type="button"
                  className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Start {block.title}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LessonsPage;
