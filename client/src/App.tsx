import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import ForbiddenPage from "./pages/Forbidden";
import { OpportunityListPage, OpportunityDetailPage } from "./pages/Opportunities";
import DueDiligencePage from "./pages/DueDiligence";
import DueDiligenceListPage from "./pages/DueDiligenceList";
import { DiagnosisListPage, DiagnosisEditPage } from "./pages/Diagnosis";
import { ProposalListPage, ProposalEditPage } from "./pages/Proposals";
import { QuotationListPage, QuotationEditPage } from "./pages/Quotations";
import { ContractListPage, ContractEditPage } from "./pages/Contracts";
import ApprovalsPage from "./pages/Approvals";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import UserManagementPage from "./pages/UserManagement";
import type { ComponentType } from "react";

/*
 * ProtectedRoute - 路由守卫组件
 * 检查用户是否已登录且有权限访问该路由
 */
function ProtectedRoute({
  component: Component,
  routePrefix,
}: {
  component: ComponentType<any>;
  routePrefix: string;
}) {
  const { isAuthenticated, hasRouteAccess } = useAuth();
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (!hasRouteAccess(routePrefix)) {
    return <ForbiddenPage />;
  }

  return <Component />;
}

function AuthenticatedRouter() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // make sure to consider if you need authentication for certain routes
  return (
    <AppLayout>
      <Switch>
        <Route path="/">
          {() => <ProtectedRoute component={Home} routePrefix="/" />}
        </Route>
        {/* 商机管理 */}
        <Route path="/opportunities">
          {() => <ProtectedRoute component={OpportunityListPage} routePrefix="/opportunities" />}
        </Route>
        <Route path="/opportunities/:id">
          {() => <ProtectedRoute component={OpportunityDetailPage} routePrefix="/opportunities" />}
        </Route>
        {/* 客户尽调 - 独立列表入口 */}
        <Route path="/due-diligence">
          {() => <ProtectedRoute component={DueDiligenceListPage} routePrefix="/due-diligence" />}
        </Route>
        {/* 客户尽调 - 详情编辑 */}
        <Route path="/opportunities/:id/dd">
          {() => <ProtectedRoute component={DueDiligencePage} routePrefix="/due-diligence" />}
        </Route>
        {/* 行业诊断 */}
        <Route path="/diagnosis">
          {() => <ProtectedRoute component={DiagnosisListPage} routePrefix="/diagnosis" />}
        </Route>
        <Route path="/opportunities/:id/diagnosis">
          {() => <ProtectedRoute component={DiagnosisEditPage} routePrefix="/diagnosis" />}
        </Route>
        {/* 全案方案 */}
        <Route path="/proposals">
          {() => <ProtectedRoute component={ProposalListPage} routePrefix="/proposals" />}
        </Route>
        <Route path="/opportunities/:id/proposal">
          {() => <ProtectedRoute component={ProposalEditPage} routePrefix="/proposals" />}
        </Route>
        {/* 签约定价 - 报价管理 */}
        <Route path="/quotations">
          {() => <ProtectedRoute component={QuotationListPage} routePrefix="/quotations" />}
        </Route>
        <Route path="/opportunities/:id/quotation">
          {() => <ProtectedRoute component={QuotationEditPage} routePrefix="/quotations" />}
        </Route>
        {/* 合同签约 */}
        <Route path="/contracts">
          {() => <ProtectedRoute component={ContractListPage} routePrefix="/contracts" />}
        </Route>
        <Route path="/opportunities/:id/contract">
          {() => <ProtectedRoute component={ContractEditPage} routePrefix="/contracts" />}
        </Route>
        {/* 审批中心 */}
        <Route path="/approvals">
          {() => <ProtectedRoute component={ApprovalsPage} routePrefix="/approvals" />}
        </Route>
        {/* 数据看板 */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={DashboardPage} routePrefix="/dashboard" />}
        </Route>
        {/* 用户管理（仅管理员） */}
        <Route path="/users">
          {() => <ProtectedRoute component={UserManagementPage} routePrefix="/users" />}
        </Route>
        {/* 系统配置（仅管理员） */}
        <Route path="/settings">
          {() => <ProtectedRoute component={SettingsPage} routePrefix="/settings" />}
        </Route>
        {/* 404 */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function AppRouter() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  // 登录页不需要 AppLayout
  if (location === "/login") {
    if (isAuthenticated) {
      return <Redirect to="/" />;
    }
    return <LoginPage />;
  }

  return <AuthenticatedRouter />;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
