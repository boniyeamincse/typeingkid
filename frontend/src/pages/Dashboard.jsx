import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Star, Globe, ArrowRight, Keyboard, BookOpen, ClipboardCheck, Gamepad2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [topSpeed, setTopSpeed] = useState(0);
  const [globalRank, setGlobalRank] = useState('#-');

  useEffect(() => {
    const loadTopSpeed = async () => {
      try {
        const [summaryResponse, rankResponse] = await Promise.all([
          api.get('/lessons/progress/summary'),
          api.get('/lessons/rank/me'),
        ]);

        const maxWpm = summaryResponse.data.reduce((max, row) => {
          const wpm = Number.isFinite(row.best_wpm) ? row.best_wpm : 0;
          return Math.max(max, wpm);
        }, 0);

        const rank = rankResponse.data?.rank;
        setTopSpeed(maxWpm);
        setGlobalRank(Number.isInteger(rank) ? `#${rank}` : '#-');
      } catch {
        setTopSpeed(0);
        setGlobalRank('#-');
      }
    };

    loadTopSpeed();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-500/20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-10"
        >
          <span className="text-secondary-600 font-black uppercase tracking-widest text-xs mb-2 block">
            Student Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-slate-950">
            Welcome back, <span className="text-primary-600">{user?.display_name}</span>! 👋
          </h1>
          <p className="text-slate-500 text-lg font-medium">Ready to smash your typing records today?</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Current Level', value: user?.level || 1, icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Top Speed', value: `${topSpeed} WPM`, icon: Zap, color: 'bg-primary-100 text-primary-600' },
            { label: 'Experience Point', value: user?.xp || 0, icon: Star, color: 'bg-secondary-100 text-secondary-600' },
            { label: 'Global Rank', value: globalRank, icon: Globe, color: 'bg-emerald-100 text-emerald-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:scale-105 transition-transform cursor-default"
            >
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={24} />
              </div>
              <div className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-slate-950 tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 group cursor-pointer hover:border-primary-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-black mb-4 text-slate-950">Next Lesson</h3>
                <p className="text-slate-500 mb-8 max-w-md leading-relaxed font-medium">Continue your journey through the Enchanted Forest and master the Home Row keys.</p>
                <div className="inline-flex items-center gap-3 bg-primary-500 text-white px-8 py-3 rounded-2xl font-black group-hover:bg-primary-600 transition-colors">
                  Resume Adventure <ArrowRight size={20} />
                </div>
              </div>
              <div className="w-40 h-40 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100">
                <Keyboard size={80} className="text-slate-200" />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 bg-secondary-500 p-10 rounded-[2.5rem] shadow-xl shadow-secondary-500/20 group cursor-pointer hover:bg-secondary-600 transition-all text-slate-900">
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Globe size={24} /> Race Mode
            </h3>
            <p className="mb-8 font-bold text-slate-900/80">Challenge other kids in real-time races and win trophies!</p>
            <div className="bg-white text-slate-900 py-3 rounded-2xl font-black text-center group-hover:scale-105 transition-transform">
              Join Lobby
            </div>
          </div>
        </div>

        {/* Main Option Boxes */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Lessons',
              description: 'Practice guided lessons to improve speed and accuracy step by step.',
              icon: BookOpen,
              color: 'bg-primary-100 text-primary-600',
              action: 'Open Lessons',
              path: '/lessons',
            },
            {
              title: 'Tests',
              description: 'Take timed typing tests and compare your latest scores.',
              icon: ClipboardCheck,
              color: 'bg-emerald-100 text-emerald-600',
              action: 'Start Test',
            },
            {
              title: 'Games',
              description: 'Play fun typing games to build consistency with less stress.',
              icon: Gamepad2,
              color: 'bg-secondary-100 text-secondary-700',
              action: 'Play Games',
            },
          ].map((option, i) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${option.color}`}>
                <option.icon size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{option.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{option.description}</p>
              {option.path ? (
                <Link
                  to={option.path}
                  className="block w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-black transition-colors text-center"
                >
                  {option.action}
                </Link>
              ) : (
                <button
                  type="button"
                  className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
                >
                  {option.action}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
