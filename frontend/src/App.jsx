import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/SharedComponents';
import Navbar    from './components/Navbar';

// Public pages
import Home        from './pages/Home';
import ApplyNow    from './pages/ApplyNow';
import JobDetail   from './pages/JobDetail';
import Unsubscribe from './pages/Unsubscribe';

// Admin pages
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobForm   from './pages/AdminJobForm';

// Layout for public pages (with Navbar + Footer)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-stone-50">
    <Navbar />
    <main className="flex-1">{children}</main>
    <footer className="border-t border-stone-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-stone-400 text-sm">
          © {new Date().getFullYear()} <span className="font-medium text-stone-600">Punjab Jobs Hub</span>
        </p>
        <p className="text-stone-400 text-xs text-center">
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
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/apply-now" element={<PublicLayout><ApplyNow /></PublicLayout>} />
          <Route path="/jobs/:id" element={<PublicLayout><JobDetail /></PublicLayout>} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/jobs/new" element={
            <ProtectedRoute><AdminJobForm /></ProtectedRoute>
          } />
          <Route path="/admin/jobs/edit/:id" element={
            <ProtectedRoute><AdminJobForm /></ProtectedRoute>
          } />

          {/* ── 404 ── */}
          <Route path="*" element={
            <PublicLayout>
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                <div className="text-6xl">🔍</div>
                <h1 className="font-display text-3xl font-semibold text-slate-800">Page Not Found</h1>
                <p className="text-stone-500">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary mt-2">← Go to Jobs</a>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
