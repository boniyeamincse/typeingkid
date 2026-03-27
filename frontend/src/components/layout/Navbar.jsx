import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { LogOut, User, LayoutDashboard, Zap } from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary-500/20">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            TypeMaster
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link to="/profile" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                <User size={18} />
                Profile
              </Link>
              <button
                onClick={onLogout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 border border-slate-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary-500/20 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
