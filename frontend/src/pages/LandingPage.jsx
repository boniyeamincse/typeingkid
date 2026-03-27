import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Target, Globe, ArrowRight, Keyboard, MousePointer2, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary-500/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-primary-100/30 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100/20 blur-[100px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-xl shadow-primary-500/5 border border-slate-100 text-primary-600 text-sm font-bold mb-10"
          >
            <Star size={16} className="text-secondary-500 fill-secondary-500" />
            The #1 Typing App for Students
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-slate-950"
          >
            Type Fast. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
              Think Faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Welcome to <span className="text-slate-900 font-bold">Typing Kid</span> — the ultimate gamified platform where kids master the keyboard through epic adventures and global challenges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/register"
              className="bg-primary-500 hover:bg-primary-600 text-white px-12 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-primary-500/20 flex items-center gap-3 group hover:scale-[1.05] active:scale-95"
            >
              Start Typing
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-12 py-5 rounded-[2rem] font-bold text-xl text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition-all shadow-lg shadow-slate-200/50 active:scale-95"
            >
              Log In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Words typed', value: '2.5M+' },
              { label: 'Happy Learners', value: '10k+' },
              { label: 'Avg. Speed Gain', value: '+40%' },
              { label: 'Badges Earned', value: '500k+' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-black mb-1 text-slate-900">{stat.value}</div>
                <div className="text-primary-500 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-950">Why Students Love Us</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">We've turned boring practice into an addictive game you'll never want to put down.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Live Scoreboard',
                desc: 'See your speed and accuracy update in real-time as you blast through typing drills.',
                icon: Target,
                color: 'bg-primary-500/10 text-primary-500'
              },
              {
                title: 'Global Hero',
                desc: 'Climb the ranks and earn legendary badges that show off your incredible typing skills.',
                icon: Trophy,
                color: 'bg-secondary-500/10 text-secondary-600'
              },
              {
                title: 'Multiplayer Fun',
                desc: 'Race against friends and classmates in high-speed duels to see who is the ultimate Typing Kid.',
                icon: Zap,
                color: 'bg-accent-500/10 text-accent-600'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white border border-slate-100 p-10 rounded-[2.5rem] group transition-all hover:border-primary-200 shadow-xl shadow-slate-200/40"
              >
                <div className={`${feature.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-primary-600 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary-500/20">
            <div className="absolute top-0 right-0 p-12 text-white/10 -rotate-12">
               <Keyboard size={200} />
            </div>
            <div className="absolute bottom-0 left-0 p-12 text-white/10 rotate-12">
               <Zap size={150} />
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black mb-10 relative z-10 text-white tracking-tight leading-tight">
              Ready to win <br className="hidden md:block" /> the race?
            </h2>
            <Link
               to="/register"
               className="bg-secondary-500 text-slate-900 px-14 py-5 rounded-[2.5rem] font-black text-2xl transition-all hover:bg-white hover:scale-105 active:scale-95 inline-flex items-center gap-3 shadow-2xl relative z-10"
            >
              Get Started for Free
              <MousePointer2 size={28} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 logo-shadow">
                  <img src="/typing_kid_logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-2xl tracking-tighter">Typing<span className="text-secondary-500">Kid</span></span>
             </div>
             <div className="flex gap-12 text-slate-400 font-bold text-sm uppercase tracking-widest">
                <a href="#" className="hover:text-primary-500 transition-colors">Twitter</a>
                <a href="#" className="hover:text-primary-500 transition-colors">GitHub</a>
                <a href="#" className="hover:text-primary-500 transition-colors">Discord</a>
             </div>
             <div className="text-slate-400 text-sm font-medium">
                &copy; 2026 Typing Kid. Every key counts.
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
