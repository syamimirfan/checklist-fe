import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignUpPage,
} from "../modules/auth";
import { ChecklistPage } from "../modules/checklists";
import { DashboardPage } from "../modules/dashboard";
import { LandingPage } from "../modules/landing";
import { ConfirmProvider } from "../shared/components/ui";
import {
  checklistRoutePattern,
  routes,
  workspaceRoutePattern,
} from "../shared/constants/routes";
import { AppShell } from "./AppShell";

export function App() {
  return (
    // The one shared "are you sure?" popup; features ask for it with `useConfirm()`.
    <ConfirmProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Logged-in app: AppShell guards auth, loads data and renders the sidebar. */}
          <Route element={<AppShell />}>
            <Route path={routes.dashboard} element={<DashboardPage view="all" />} />
            <Route path={routes.dueSoon} element={<DashboardPage view="dueSoon" />} />
            <Route path={routes.templates} element={<DashboardPage view="templates" />} />
            <Route path={routes.assigned} element={<DashboardPage view="assigned" />} />
            <Route path={workspaceRoutePattern} element={<DashboardPage view="workspace" />} />
            <Route path={checklistRoutePattern} element={<ChecklistPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfirmProvider>
  );
}
