import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';

const EducatorPage = () => {
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
          <h1 className="text-4xl font-bold mb-2">Educator Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Welcome back, {user?.display_name}. Manage classes, assign lessons, and track student reports.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Classrooms</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Assigned Lessons</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="text-slate-400 text-sm">Students</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducatorPage;
