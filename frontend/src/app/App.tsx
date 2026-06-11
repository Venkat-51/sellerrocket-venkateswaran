import { Routes, Route } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { LeadForm } from './components/LeadForm';
import { Footer } from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const HomePage = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Hero />
      <Services />
      <LeadForm />
    </main>
    <Footer />
    <Toaster />
  </div>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function Navigate({ to }: { to: string }) {
  window.location.href = to;
  return null;
}