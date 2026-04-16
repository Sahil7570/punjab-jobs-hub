import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/SharedComponents';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import ApplyNow from './pages/ApplyNow';
import JobDetail from './pages/JobDetail';
import Unsubscribe from './pages/Unsubscribe';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import JobManagement from './pages/JobManagement';

const PublicLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-stone-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="text-sm text-stone-400">
          Copyright {new Date().getFullYear()} <span className="font-medium text-stone-600">Punjab Jobs Hub</span>
        </p>
        <p className="text-xs text-stone-400">
          All job data is for informational purposes only. Apply only via official government websites.
        </p>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/apply-now" element={<PublicLayout><ApplyNow /></PublicLayout>} />
          <Route path="/jobs/:id" element={<PublicLayout><JobDetail /></PublicLayout>} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <PublicLayout>
                <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
                  <div className="text-6xl">?</div>
                  <h1 className="font-display text-3xl font-semibold text-slate-800">Page Not Found</h1>
                  <p className="text-stone-500">The page you are looking for does not exist.</p>
                  <a href="/" className="btn-primary mt-2">
                    Back to Jobs
                  </a>
                </div>
              </PublicLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
