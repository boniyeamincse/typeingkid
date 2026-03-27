import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Camera,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Shield,
  Calendar,
  Globe,
  Keyboard,
  Users,
  LockKeyhole,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const PROFILE_PREFS_KEY = 'typingkids.profile.settings';
const PROFILE_USERNAME_KEY = 'typingkids.profile.username';

const DEFAULT_PREFS = {
  websiteLanguage: 'US English',
  keyboardLayout: 'United States Standard',
};

const splitName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
};

const ProfilePage = () => {
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { firstName: initialFirst, lastName: initialLast } = splitName(user?.display_name || '');

  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [username, setUsername] = useState('');
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);

  const [joinCode, setJoinCode] = useState('');
  const [joinMessage, setJoinMessage] = useState('');
  const [joinError, setJoinError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocalSaved, setShowLocalSaved] = useState(false);

  const AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Oscar',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
  ];

  useEffect(() => {
    const savedUsername = localStorage.getItem(PROFILE_USERNAME_KEY);
    const defaultUsername = user?.email ? user.email.split('@')[0] : '';
    setUsername(savedUsername || defaultUsername);

    try {
      const stored = localStorage.getItem(PROFILE_PREFS_KEY);
      if (stored) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
      }
    } catch {
      setPrefs(DEFAULT_PREFS);
    }
  }, [user?.email]);

  useEffect(() => {
    if (isSuccess && !isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isSuccess, isLoading]);

  const fullName = `${firstName} ${lastName}`.trim();
  const avatarSeed = fullName || user?.display_name || 'TypingKid';

  const accountCreated = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'N/A';

  const saveOverview = (e) => {
    e.preventDefault();
    localStorage.setItem(PROFILE_USERNAME_KEY, username.trim());
    localStorage.setItem(PROFILE_PREFS_KEY, JSON.stringify(prefs));
    setShowLocalSaved(true);
    setTimeout(() => setShowLocalSaved(false), 2000);
  };

  const saveAccountDetails = (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    dispatch(
      updateProfile({
        display_name: fullName,
        avatar_url: avatarUrl,
      })
    );
  };

  const onJoinClassroom = (e) => {
    e.preventDefault();
    setJoinMessage('');
    setJoinError('');

    if (joinCode.trim().length < 4) {
      setJoinError('Join code must be at least 4 characters.');
      return;
    }

    setJoinMessage('Class join request captured. Backend classroom join API will be connected next.');
    setJoinCode('');
  };

  const onUpdatePassword = (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    setPasswordMessage('Password update UI is ready. Backend password endpoint can be connected next.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const onDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure? Deleting account is permanent. Backend delete API will be connected next.'
    );

    if (confirmed) {
      setPasswordMessage('Delete account action confirmed in UI. Connect backend endpoint before production.');
      setPasswordError('');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary-500/20">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4 md:p-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Account Center</h1>
          <p className="text-slate-500 mt-2">Manage account overview, profile details, classroom access, and security settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
                <Camera size={20} className="text-primary-500" />
                Avatar
              </h2>

              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 rounded-3xl border-4 border-slate-200 p-1 bg-slate-50 shadow-inner overflow-hidden">
                  <img
                    src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`}
                    alt="Avatar preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
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
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-lg">
              <h3 className="font-bold text-slate-900 mb-4">Quick Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Membership</span>
                  <span className="font-semibold text-slate-900">Ad Supported - Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Role</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">
                    <Shield size={14} /> {user?.role || 'USER'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="text-slate-700 inline-flex items-center gap-1">
                    <Calendar size={14} /> {accountCreated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Account Overview</h2>

              <form onSubmit={saveOverview} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-600">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                      placeholder="boniyeam"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Membership Level</label>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-semibold">
                      Ad Supported - Free
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Website Language</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <select
                        value={prefs.websiteLanguage}
                        onChange={(e) => setPrefs((prev) => ({ ...prev, websiteLanguage: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-9 pr-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                      >
                        <option>US English</option>
                        <option>UK English</option>
                        <option>Bangla</option>
                        <option>Hindi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-600">Keyboard Layout</label>
                    <div className="relative">
                      <Keyboard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <select
                        value={prefs.keyboardLayout}
                        onChange={(e) => setPrefs((prev) => ({ ...prev, keyboardLayout: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-9 pr-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                      >
                        <option>United States Standard</option>
                        <option>United Kingdom</option>
                        <option>DVORAK</option>
                        <option>COLEMAK</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Need help deciding? Start with United States Standard.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20"
                >
                  Save Overview
                </button>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Join a Classroom</h2>
              <p className="text-slate-500 mb-6">
                Looking to join a class? Ask your teacher for your class join code and enter it below.
              </p>

              <form onSubmit={onJoinClassroom} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Join Code"
                  className="flex-1 bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-5 py-3 rounded-xl font-bold"
                >
                  <Users size={16} /> Join Classroom
                </button>
              </form>

              {joinMessage && <p className="text-emerald-600 text-sm mt-4">{joinMessage}</p>}
              {joinError && <p className="text-red-600 text-sm mt-4">{joinError}</p>}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Account Details</h2>

              <form onSubmit={saveAccountDetails} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-9 pr-4 text-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </form>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Change Password</h2>

              <form onSubmit={onUpdatePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Current Password *</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">New Password *</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold"
                >
                  <LockKeyhole size={16} /> Update Password
                </button>
              </form>

              {passwordMessage && <p className="text-emerald-600 text-sm mt-4">{passwordMessage}</p>}
              {passwordError && <p className="text-red-600 text-sm mt-4">{passwordError}</p>}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-red-50 border border-red-200 rounded-[2rem] p-8 md:p-10 shadow-lg"
            >
              <h2 className="text-2xl font-extrabold text-red-700 mb-2">Permanently Delete Account</h2>
              <p className="text-red-700/80 mb-6">
                Deleting your account will permanently remove your account and all progress.
              </p>

              <button
                type="button"
                onClick={onDeleteAccount}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold"
              >
                <Trash2 size={16} /> Delete My Account
              </button>
            </motion.section>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-emerald-700 font-bold">Account details updated</h4>
                  <p className="text-emerald-700/80 text-sm">Your profile changes were saved successfully.</p>
                </div>
              </motion.div>
            )}

            {showLocalSaved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-50 border border-primary-200 p-5 rounded-2xl flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-primary-700 font-bold">Overview saved</h4>
                  <p className="text-primary-700/80 text-sm">Language, layout, and username preferences saved on this browser.</p>
                </div>
              </motion.div>
            )}

            {isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-center gap-3 shadow-md"
              >
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="text-red-700 font-bold">Update failed</h4>
                  <p className="text-red-700/80 text-sm">{message || 'Unable to save account details right now.'}</p>
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
