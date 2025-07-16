import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import QuizSetup from './pages/QuizSetup';
import QuizLive from './pages/QuizLive';
import QuizResults from './pages/QuizResults';
import Chatbot from './pages/Chatbot';
import Videos from './pages/Videos';
import WatchedLibrary from './pages/WatchedLibrary';
import Reminders from './pages/Reminders';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = !!localStorage.getItem('token');
  return isAuth ? <>{children}</> : <Navigate to="/auth" replace />;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = !!localStorage.getItem('token');
  return (
    <>
      {isAuth && <Navbar />}
      {children}
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Layout>
              <QuizSetup />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/quiz/live" element={
          <ProtectedRoute>
            <Layout>
              <QuizLive />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/quiz/results" element={
          <ProtectedRoute>
            <Layout>
              <QuizResults />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute>
            <Layout>
              <Chatbot />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/videos" element={
          <ProtectedRoute>
            <Layout>
              <Videos />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/library" element={<WatchedLibrary />} />
        <Route path="/reminders" element={
          <ProtectedRoute>
            <Layout>
              <Reminders />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<div className="flex items-center justify-center min-h-screen text-2xl">Welcome to Lore</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
