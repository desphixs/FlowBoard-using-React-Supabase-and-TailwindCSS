import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { isSupabaseConfigured } from './lib/supabase';
import StaticApp from './static/StaticApp';
import AuthPage from './pages/AuthPage';
import BoardPage from './pages/BoardPage';

/**
 * RealApp:
 * This is the full version of FlowBoard.
 * It includes Authentication, Supabase database sync, and Protected Routes.
 */
const RealApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Route */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <BoardPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch all - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

/**
 * App Entry Point:
 * We check if the environment variables for Supabase are present.
 * If they are missing, we automatically switch to the "Static Demo" mode.
 */
const App = () => {
  if (!isSupabaseConfigured) {
    return <StaticApp />;
  }

  return <RealApp />;
};

export default App;