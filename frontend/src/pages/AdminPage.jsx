import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

const AdminPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Admin Console</h1>
          <p className="text-slate-400 text-lg">
            Hello {user?.display_name}. Manage users, roles, and platform-wide content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Total Users</div>
            <div className="text-3xl font-bold mt-2">-</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Educators</div>
            <div className="text-3xl font-bold mt-2">-</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Active Lessons</div>
            <div className="text-3xl font-bold mt-2">-</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
