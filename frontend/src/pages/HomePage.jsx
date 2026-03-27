import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Keyboard,
  Trophy,
  Users,
  BarChart2,
  Star,
  Zap,
  BookOpen,
  Globe,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Keyboard,
    color: 'bg-teal-500/10 text-teal-500',
    title: 'Comprehensive Keyboarding',
    desc: 'Structured lessons from home-row basics to advanced touch typing — every finger, every key.',
  },
  {
    icon: Trophy,
    color: 'bg-yellow-500/10 text-yellow-400',
    title: 'Gamified Progress',
    desc: 'Earn XP, level up, and unlock badges as you hit new speed and accuracy milestones.',
  },
  {
    icon: Users,
    color: 'bg-violet-500/10 text-violet-400',
    title: 'Multiplayer Races',
    desc: 'Race against friends or random opponents in real-time head-to-head typing battles.',
  },
  {
    icon: BarChart2,
    color: 'bg-emerald-500/10 text-emerald-400',
    title: 'Performance Analytics',
    desc: 'WPM trend charts, accuracy heatmaps, and weekly reports to track your improvement.',
  },
  {
    icon: BookOpen,
    color: 'bg-rose-500/10 text-rose-400',
    title: 'Lesson Library',
    desc: 'Beginner, intermediate, and advanced passages carefully curated for every skill level.',
  },
  {
    icon: Globe,
    color: 'bg-orange-500/10 text-orange-400',
    title: 'Learn Anywhere',
    desc: 'Fully responsive — practice on a laptop, tablet, or phone without missing a beat.',
  },
];

const studentPerks = [
  'Self-paced lessons that adapt to your level',
  'Instant feedback on every keystroke',
  'Real-time WPM & accuracy stats',
  'Leaderboards to fuel friendly competition',
];

const educatorPerks = [
  'Manage student accounts from one dashboard',
  'Assign custom lessons by difficulty',
  'Track class-wide progress and reports',
  'Automated grading and performance alerts',
];

const stats = [
  { value: '2M+', label: 'Active Learners' },
  { value: '98%', label: 'Accuracy Achieved' },
  { value: '80+', label: 'WPM Average Gain' },
  { value: '500+', label: 'Lesson Passages' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="bg-orange-500 text-white rounded-lg p-1.5">
            <Keyboard size={18} />
          </span>
          <span className="font-extrabold text-xl text-slate-800 tracking-tight">
            Typing<span className="text-orange-500">Kids</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
          <a href="#for-students" className="hover:text-orange-500 transition-colors">Students</a>
          <a href="#for-educators" className="hover:text-orange-500 transition-colors">Educators</a>
          <a href="#stats" className="hover:text-orange-500 transition-colors">Why Us</a>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors hidden sm:block"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors shadow-sm"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-300 via-orange-500 to-rose-500 pt-16">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-white"
        >
          <motion.div variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
          >
            <Zap size={14} className="text-emerald-200" />
            Free · Fun · Fast
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1}
            className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6"
          >
            Learn to Type Faster<br />
            <span className="text-emerald-200">and Easier</span> for Free
          </motion.h1>

          <motion.p variants={fadeUp} custom={2}
            className="text-lg text-orange-50 mb-10 max-w-lg leading-relaxed"
          >
            Gamified typing lessons for kids and students — with real-time feedback,
            multiplayer races, and progress tracking built in.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold px-7 py-3.5 rounded-full transition-colors shadow-lg text-base"
            >
              Start Typing Today
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-7 py-3.5 rounded-full transition-colors text-base"
            >
              See Features
            </a>
          </motion.div>
        </motion.div>

        {/* Right cards */}
        <div className="flex flex-col sm:flex-row gap-6 lg:flex-col xl:flex-row">
          {/* For Students */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.55 }}
            className="flex-1 bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-2xl font-bold text-slate-800 mb-2">For Students</div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Learn to type at your own pace with gamified lessons, real-time stats,
              and student-led progression.
            </p>
            <Link
              to="/register"
              className="block text-center bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Start Typing Today »
            </Link>
          </motion.div>

          {/* For Educators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55 }}
            className="flex-1 bg-white rounded-3xl p-8 shadow-2xl"
          >
            <div className="text-2xl font-bold text-slate-800 mb-2">For Educators</div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Manage class settings, assign lessons by difficulty, and track student
              progress with detailed reports.
            </p>
            <Link
              to="/register"
              className="block text-center border-2 border-emerald-400 hover:bg-emerald-50 text-slate-800 font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Create Educator Account »
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Diagonal bottom cut */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-white"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Everything you need
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-800 leading-tight">
            Go Beyond Typing with<br />
            <span className="text-orange-500">Lessons, Races & Analytics</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-100 hover:shadow-xl rounded-2xl p-8 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceSection({ id, audience, perks, ctaLabel }) {
  const isStudent = audience === 'Students';
  return (
    <section
      id={id}
      className={`py-28 ${isStudent ? 'bg-slate-50' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className={isStudent ? '' : 'lg:order-2'}
        >
          <motion.p variants={fadeUp} custom={0}
            className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3"
          >
            {audience}
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-4xl font-extrabold text-slate-800 mb-6 leading-tight"
          >
            {isStudent
              ? 'Learn at Your Own Pace, Compete on Your Own Terms'
              : 'Powerful Tools for Every Classroom'}
          </motion.h2>
          <motion.p variants={fadeUp} custom={2}
            className="text-slate-500 mb-8 leading-relaxed"
          >
            {isStudent
              ? 'TypingKids guides you from your very first keystroke to blazing-fast typing speeds with structured lessons that adapt to your skill level.'
              : 'Assign lessons, track progress, and generate reports — all from a single educator dashboard designed to save you time.'}
          </motion.p>

          <motion.ul variants={fadeUp} custom={3} className="space-y-3 mb-10">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-slate-600 text-sm">
                <CheckCircle2 size={18} className="text-teal-500 mt-0.5 shrink-0" />
                {p}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} custom={4}>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3.5 rounded-full transition-colors shadow-md"
            >
              {ctaLabel} <ChevronRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Illustration card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className={`relative ${isStudent ? 'lg:order-2' : 'lg:order-1'}`}
        >
          <div className={`rounded-3xl p-10 flex flex-col gap-4 shadow-2xl ${isStudent ? 'bg-gradient-to-br from-orange-400 to-rose-500' : 'bg-gradient-to-br from-teal-500 to-cyan-600'}`}>
            {/* Fake typing window */}
            <div className="bg-white/15 rounded-2xl p-5">
              <p className="text-xs text-white/60 mb-3 font-mono uppercase tracking-widest">
                {isStudent ? 'Lesson 12 — Intermediate' : 'Class Dashboard'}
              </p>
              {isStudent ? (
                <p className="font-mono text-white text-sm leading-loose">
                  <span className="bg-white/20 rounded px-0.5">The</span>{' '}
                  <span className="bg-white/20 rounded px-0.5">quick</span>{' '}
                  <span className="bg-yellow-300/30 rounded px-0.5 text-yellow-200">brown</span>{' '}
                  <span className="opacity-40">fox jumps over the lazy dog.</span>
                </p>
              ) : (
                <div className="space-y-2">
                  {['Alice — 68 WPM · 97%', 'Bob — 54 WPM · 91%', 'Carol — 72 WPM · 99%'].map((row) => (
                    <div key={row} className="bg-white/10 rounded-lg px-4 py-2 text-white text-xs font-mono">
                      {row}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mini stat row */}
            <div className="grid grid-cols-3 gap-3">
              {(isStudent
                ? [['72', 'WPM'], ['98%', 'Accuracy'], ['Lv 7', 'Rank']]
                : [['24', 'Students'], ['89%', 'Avg Acc.'], ['Top', 'Class']]
              ).map(([val, lbl]) => (
                <div key={lbl} className="bg-white/15 rounded-2xl p-3 text-center">
                  <div className="text-white font-extrabold text-lg">{val}</div>
                  <div className="text-white/60 text-xs">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" className="bg-teal-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i}>
              <div className="text-5xl font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-teal-100 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Ms. Rodriguez',
      role: 'Elementary School Teacher',
      text: "My students' WPM doubled in just four weeks. The gamified approach keeps them engaged way longer than any other tool I've tried.",
      stars: 5,
    },
    {
      name: 'Jake, age 12',
      role: 'Student',
      text: "I love the multiplayer races! I went from 30 WPM to 65 WPM in two months and now I'm in the top 10 on the leaderboard.",
      stars: 5,
    },
    {
      name: 'Parent of 2',
      role: 'Home-schooling Parent',
      text: "Finally a typing app that my kids actually want to use. The badge system is genius — they compete with each other every evening.",
      stars: 5,
    },
  ];

  return (
    <section className="bg-slate-50 py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-4xl font-extrabold text-slate-800">Loved by Kids &amp; Educators</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <div className="font-bold text-slate-800">{t.name}</div>
                <div className="text-slate-400 text-xs">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient-to-br from-teal-600 to-emerald-700 py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2 variants={fadeUp} custom={0}
            className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Ready to Start Your Typing Journey?
          </motion.h2>
          <motion.p variants={fadeUp} custom={1}
            className="text-teal-100 text-lg mb-10"
          >
            Join thousands of kids and educators already on TypingKids — completely free.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-300 text-slate-900 font-bold px-8 py-4 rounded-full transition-colors shadow-xl text-base"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors text-base"
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="bg-orange-500 text-white rounded-lg p-1.5">
            <Keyboard size={16} />
          </span>
          <span className="font-extrabold text-white">
            Typing<span className="text-orange-400">Kids</span>
          </span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} TypingKids. All rights reserved.</p>
        <div className="flex gap-6 text-sm">
          <Link to="/login" className="hover:text-orange-400 transition-colors">Log In</Link>
          <Link to="/register" className="hover:text-orange-400 transition-colors">Sign Up</Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="text-slate-900">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <AudienceSection
        id="for-students"
        audience="Students"
        perks={studentPerks}
        ctaLabel="Start Learning Free"
      />
      <AudienceSection
        id="for-educators"
        audience="Educators"
        perks={educatorPerks}
        ctaLabel="Create Educator Account"
      />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
