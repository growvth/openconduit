import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ConversationsPage } from "@/pages/ConversationsPage";
import { ConversationDetailPage } from "@/pages/ConversationDetailPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { ContactDetailPage } from "@/pages/ContactDetailPage";
import { RemindersPage } from "@/pages/RemindersPage";
import { SettingsPage } from "@/pages/SettingsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/conversations" element={<ConversationsPage />} />
                <Route path="/conversations/:id" element={<ConversationDetailPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/contacts/:id" element={<ContactDetailPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
