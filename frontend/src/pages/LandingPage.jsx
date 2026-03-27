import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Target, Globe, ArrowRight, Keyboard, MousePointer2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary-500/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-500/5 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-primary-400 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            New Multiplayer Mode Available
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Master the Art of <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-accent-500 bg-clip-text text-transparent">
              Speed Typing.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Join thousands of typists improving their accuracy and WPM through gamified lessons and real-time global competitions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 flex items-center gap-2 group hover:scale-[1.02] active:scale-95"
            >
              Start Typing Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 rounded-2xl font-bold text-lg text-slate-300 hover:text-white hover:bg-slate-900/50 border border-slate-800 transition-all active:scale-95"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-20 border-y border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Total Words typed', value: '1.2M+' },
              { label: 'Active Users', value: '50k+' },
              { label: 'Avg. WPM increase', value: '25%' },
              { label: 'Countries', value: '120+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-1 text-white">{stat.value}</div>
                <div className="text-slate-500 text-sm uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Level Up Your Skills</h2>
            <p className="text-slate-500 text-lg">Everything you need to go from hunt-and-peck to pro.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Live Tracking',
                desc: 'Get instant feedback on your speed and accuracy as you type with real-time analytics.',
                icon: Zap,
                color: 'bg-primary-500/10 text-primary-500'
              },
              {
                title: 'Global Ranking',
                desc: 'Climb the leaderboards and prove you are the fastest typist in your region or the world.',
                icon: Trophy,
                color: 'bg-yellow-500/10 text-yellow-500'
              },
              {
                title: 'Multiplayer Races',
                desc: 'Compete against friends and strangers in high-stakes typing duels across the globe.',
                icon: Globe,
                color: 'bg-emerald-500/10 text-emerald-500'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group transition-all hover:border-slate-700 shadow-xl"
              >
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 text-white/10 -rotate-12">
               <Keyboard size={120} />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 relative z-10 text-white">
              Ready to break <br className="hidden md:block" /> your speed record?
            </h2>
            <Link
               to="/register"
               className="bg-white text-primary-600 px-12 py-4 rounded-2xl font-bold text-xl transition-all hover:bg-slate-50 hover:scale-105 active:scale-95 inline-flex items-center gap-2 shadow-2xl"
            >
              Launch TypeMaster
              <MousePointer2 size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
                  <Zap size={14} />
                </div>
                <span className="font-bold text-lg">TypeMaster</span>
             </div>
             <div className="flex gap-8 text-slate-500 text-sm">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <a href="#" className="hover:text-white transition-colors">Discord</a>
             </div>
             <div className="text-slate-600 text-sm">
                &copy; 2026 TypeMaster. All rights reserved.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
