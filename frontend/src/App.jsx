import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LessonsPage from './pages/LessonsPage';
import BeginnerLessonsPage from './pages/BeginnerLessonsPage';
import BeginnerLessonJSPage from './pages/BeginnerLessonJSPage';
import ProfilePage from './pages/ProfilePage';
import EducatorPage from './pages/EducatorPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROLE } from './utils/roleUtils';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* USER/EDUCATOR/ADMIN shared routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/beginner" element={<BeginnerLessonsPage />} />
            <Route path="/lessons/beginner/:lessonNumber" element={<BeginnerLessonJSPage />} />
            <Route path="/lessons/beginner/01-js" element={<Navigate to="/lessons/beginner/1" replace />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* EDUCATOR + ADMIN routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLE.EDUCATOR, ROLE.ADMIN]} />}>
            <Route path="/educator" element={<EducatorPage />} />
          </Route>

          {/* ADMIN-only routes */}
          <Route element={<ProtectedRoute allowedRoles={[ROLE.ADMIN]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
