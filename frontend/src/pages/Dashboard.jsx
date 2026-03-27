import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Trophy, BookOpen, Settings, User } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-primary-500">TypeMaster</div>
          <div className="flex items-center gap-6">
            <button onClick={onLogout} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Hello, {user?.display_name}! 👋</h1>
          <p className="text-slate-400 text-lg">Ready to improve your typing speed today?</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Level', value: user?.level || 1, icon: Trophy, color: 'text-yellow-500' },
            { label: 'Personal Best', value: '72 WPM', icon: BookOpen, color: 'text-primary-500' },
            { label: 'Total XP', value: user?.xp || 0, icon: Settings, color: 'text-accent-500' },
            { label: 'Rank', value: '#128', icon: User, color: 'text-indigo-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
            >
              <div className={`${stat.color} mb-4`}>
                <stat.icon size={24} />
              </div>
              <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group cursor-pointer hover:border-primary-500/50 transition-all">
            <h3 className="text-2xl font-bold mb-4">Start Lesson</h3>
            <p className="text-slate-400 mb-6 font-light leading-relaxed">Continue where you left off and master the home row keys.</p>
            <div className="text-primary-500 font-semibold group-hover:translate-x-2 transition-transform">Get Started →</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group cursor-pointer hover:border-accent-500/50 transition-all">
            <h3 className="text-2xl font-bold mb-4">Multiplayer Race</h3>
            <p className="text-slate-400 mb-6 font-light leading-relaxed">Challenge typists from around the world in real-time.</p>
            <div className="text-accent-500 font-semibold group-hover:translate-x-2 transition-transform">Join Lobby →</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
