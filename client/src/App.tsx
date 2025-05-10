// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { DashboardLayout } from "./components/DashboardLayout"
import { AccountPage } from "./pages/AccountPage"
import { SubscriptionPage } from "./pages/SubscriptionPage"
import { PaymentsPage } from "./pages/PaymentsPage"
import { DomainsPage } from "./pages/DomainsPage"
import { SettingsPage } from "./pages/SettingsPage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { TeamPage } from "./pages/TeamPage"
import { NewProjectPage } from "./pages/NewProjectPage"

function App() {
  return (
    <AuthProvider>
      {/* Default to dark mode here */}
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="domains" element={<DomainsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="projects">
                <Route index element={<Navigate to="/projects/drafts" replace />} />
                <Route path="drafts" element={<ProjectsPage type="drafts" />} />
                <Route path="deployed" element={<ProjectsPage type="deployed" />} />
                <Route path="new" element={<NewProjectPage />} />
              </Route>
              <Route path="team" element={<TeamPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
