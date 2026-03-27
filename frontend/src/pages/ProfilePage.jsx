import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, ArrowLeft, Loader2, CheckCircle2, Star, Shield, Calendar, SlidersHorizontal, BellRing, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const PREFERENCES_STORAGE_KEY = 'typingkids.profile.preferences';

const DEFAULT_PREFERENCES = {
  bio: '',
  dailyGoalWpm: 60,
  preferredDifficulty: 'intermediate',
  keyboardLayout: 'qwerty',
  soundEnabled: true,
  emailReminders: false,
};

const ProfilePage = () => {
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [showPrefsSaved, setShowPrefsSaved] = useState(false);

  const AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya'
  ];

  useEffect(() => {
    if (isSuccess && !isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, isLoading]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      setPreferences(DEFAULT_PREFERENCES);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ display_name: displayName, avatar_url: avatarUrl }));
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    setShowPrefsSaved(true);
    setTimeout(() => setShowPrefsSaved(false), 2500);
  };

  const accountCreated = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary-500/20">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 md:p-12">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Comprehensive Profile</h1>
          <p className="text-slate-500 mt-2">
            Manage your public identity, account details, and typing progress in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Avatar Selection (Left) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Camera size={20} className="text-primary-500" />
                Identity Avatar
              </h2>
              
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-3xl border-4 border-slate-200 p-1 bg-slate-50 shadow-inner group overflow-hidden relative">
                  <img src={avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + displayName} alt="Preview" className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                      avatarUrl === url ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={url} alt="Option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs text-slate-500 text-center italic leading-relaxed">Choose a persona that represents your typing style.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-lg">
              <h3 className="font-bold text-slate-900 mb-4">Account Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Role</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">
                    <Shield size={14} /> {user?.role || 'USER'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Member Since</span>
                  <span className="text-slate-700 inline-flex items-center gap-1"><Calendar size={14} /> {accountCreated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Level</span>
                  <span className="text-slate-900 font-bold inline-flex items-center gap-1"><Star size={14} className="text-amber-500" /> {user?.level || 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">XP</span>
                  <span className="text-slate-900 font-bold">{user?.xp || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form (Right) */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-primary-500/10 -rotate-12 translate-x-4 -translate-y-4 pointer-events-none">
                <User size={200} />
              </div>

              <h2 className="text-3xl font-extrabold mb-2 relative z-10 text-slate-900">Profile Information</h2>
              <p className="text-slate-500 mb-10 relative z-10">Update your public profile information and display name.</p>

              <form onSubmit={onSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Display Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="MasterTypist"
                        className="w-full bg-white border border-slate-300 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all outline-none font-medium hover:border-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Email (Locked)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 cursor-not-allowed font-medium text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="text-xs text-slate-500 font-mono">
                        Level: <span className="text-primary-500">{user?.level || 1}</span>
                      </div>
                      <div className="w-px h-4 bg-slate-300" />
                      <div className="text-xs text-slate-500 font-mono">
                        XP: <span className="text-accent-500">{user?.xp || 0}</span>
                      </div>
                   </div>

                   <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group hover:scale-[1.02] active:scale-95"
                  >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Update Profile
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <SlidersHorizontal size={20} className="text-primary-500" />
                <h3 className="text-2xl font-extrabold text-slate-900">Typing Preferences</h3>
              </div>
              <p className="text-slate-500 mb-8">Personalize your practice experience and set better goals.</p>

              <form onSubmit={onSavePreferences} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 ml-1">Bio</label>
                  <textarea
                    value={preferences.bio}
                    onChange={(e) => updatePreference('bio', e.target.value)}
                    rows={3}
                    placeholder="Tell us about your typing goals..."
                    className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Daily WPM Goal</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={preferences.dailyGoalWpm}
                      onChange={(e) => updatePreference('dailyGoalWpm', Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Preferred Difficulty</label>
                    <select
                      value={preferences.preferredDifficulty}
                      onChange={(e) => updatePreference('preferredDifficulty', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all outline-none"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-600 ml-1">Keyboard Layout</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['qwerty', 'dvorak', 'colemak', 'azerty'].map((layout) => (
                        <button
                          key={layout}
                          type="button"
                          onClick={() => updatePreference('keyboardLayout', layout)}
                          className={`rounded-xl px-3 py-2 text-sm font-semibold border transition-all ${
                            preferences.keyboardLayout === layout
                              ? 'bg-primary-50 text-primary-700 border-primary-300'
                              : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {layout.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center justify-between gap-3 border border-slate-200 rounded-2xl p-4 cursor-pointer">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-medium">
                      <Volume2 size={16} className="text-primary-500" />
                      Typing Sound Effects
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.soundEnabled}
                      onChange={(e) => updatePreference('soundEnabled', e.target.checked)}
                      className="w-4 h-4 accent-primary-600"
                    />
                  </label>

                  <label className="flex items-center justify-between gap-3 border border-slate-200 rounded-2xl p-4 cursor-pointer">
                    <span className="inline-flex items-center gap-2 text-slate-700 font-medium">
                      <BellRing size={16} className="text-primary-500" />
                      Email Practice Reminders
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.emailReminders}
                      onChange={(e) => updatePreference('emailReminders', e.target.checked)}
                      className="w-4 h-4 accent-primary-600"
                    />
                  </label>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">These preferences are saved locally for now.</p>
                  <button
                    type="submit"
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20"
                  >
                    Save Preferences
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Notifications */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4 shadow-md"
              >
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-emerald-400 font-bold text-lg">Identity Refined!</h4>
                  <p className="text-emerald-700/80 text-sm">Your profile has been successfully updated across the platform.</p>
                </div>
              </motion.div>
            )}

            {showPrefsSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-50 border border-primary-200 p-5 rounded-3xl flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-primary-700 font-bold">Preferences Saved</h4>
                  <p className="text-primary-700/80 text-sm">Your typing options have been saved for this browser.</p>
                </div>
              </motion.div>
            )}

            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 p-6 rounded-3xl flex items-center gap-4 shadow-md"
              >
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-md shadow-red-500/30">
                  <CheckCircle2 className="text-white rotate-45" size={24} />
                </div>
                <div>
                  <h4 className="text-red-400 font-bold text-lg">Update Failed</h4>
                  <p className="text-red-700/80 text-sm">{message || 'We encountered an error while saving your profile updates.'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
