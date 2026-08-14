import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { LoadingSpinner } from '@/components/ui';
import type { ReactNode } from 'react';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import OnboardingPage from '@/pages/OnboardingPage';
import DashboardPage from '@/pages/DashboardPage';
import AssessmentPage from '@/pages/AssessmentPage';
import GamePage from '@/pages/GamePage';
import ResultsPage from '@/pages/ResultsPage';
import SkillsPage from '@/pages/SkillsPage';
import CareersPage from '@/pages/CareersPage';
import CareerDetailPage from '@/pages/CareerDetailPage';
import RoadmapPage from '@/pages/RoadmapPage';
import ProgressPage from '@/pages/ProgressPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" label="Loading your quest..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" label="Loading..." />;
  if (user) {
    if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function OnboardingGate({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingSpinner size="lg" label="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && !profile.onboarding_completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <OnboardingGate><WithNav><DashboardPage /></WithNav></OnboardingGate>
      } />
      <Route path="/assessment" element={
        <OnboardingGate><WithNav><AssessmentPage /></WithNav></OnboardingGate>
      } />
      <Route path="/game/:gameId" element={
        <OnboardingGate><GamePage /></OnboardingGate>
      } />
      <Route path="/results" element={
        <OnboardingGate><WithNav><ResultsPage /></WithNav></OnboardingGate>
      } />
      <Route path="/skills" element={
        <OnboardingGate><WithNav><SkillsPage /></WithNav></OnboardingGate>
      } />
      <Route path="/careers" element={
        <OnboardingGate><WithNav><CareersPage /></WithNav></OnboardingGate>
      } />
      <Route path="/careers/:careerId" element={
        <OnboardingGate><WithNav><CareerDetailPage /></WithNav></OnboardingGate>
      } />
      <Route path="/roadmap" element={
        <OnboardingGate><WithNav><RoadmapPage /></WithNav></OnboardingGate>
      } />
      <Route path="/progress" element={
        <OnboardingGate><WithNav><ProgressPage /></WithNav></OnboardingGate>
      } />
      <Route path="/profile" element={
        <OnboardingGate><WithNav><ProfilePage /></WithNav></OnboardingGate>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function WithNav({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
