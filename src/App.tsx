import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { UserProfileProvider } from './contexts/UserProfileContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardHome from './pages/DashboardHome';
import RLHFPage from './pages/RLHFPage';
import SDKPage from './pages/SDKPage';

// Datasets
import MyDatasetsPage from './pages/datasets/MyDatasetsPage';
import MarketplacePage from './pages/datasets/MarketplacePage';
import SyntheticDataPage from './pages/datasets/SyntheticDataPage';
import DatasetDetailPage from './pages/datasets/DatasetDetailPage';
import MyPurchasesPage from './pages/datasets/MyPurchasesPage';

// Evaluations
import AllRunsPage from './pages/evaluations/AllRunsPage';
import ScheduledPage from './pages/evaluations/ScheduledPage';
import LayerEvaluationPage from './pages/evaluations/LayerEvaluationPage';
import RunDetailedMetricPage from './pages/evaluations/RunDetailedMetricPage';

// Configurations
import AgentConfigPage from './pages/configurations/AgentConfigPage';
import MetricsConfigPage from './pages/configurations/MetricsConfigPage';

// Benchmarks
import SuitesPage from './pages/benchmarks/SuitesPage';
import ComparisonsPage from './pages/benchmarks/ComparisonsPage';
import RegressionPage from './pages/benchmarks/RegressionPage';

// Agents
import ConnectedAgentsPage from './pages/agents/ConnectedAgentsPage';
import EndpointsPage from './pages/agents/EndpointsPage';

// Other
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import TeamPage from './pages/TeamPage';

// Resources
import CostAnalysisPage from './pages/resources/CostAnalysisPage';
import PricingTierPage from './pages/resources/PricingTierPage';
import UsageManagementPage from './pages/resources/UsageManagementPage';

// Onboarding
import OnboardingPage from './pages/onboarding/OnboardingPage';

function App() {
  return (
    <BrowserRouter>
      <UserProfileProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route element={<Layout />}>
              <Route path="/" element={<DashboardHome />} />

              {/* Datasets */}
              <Route path="/datasets/my-datasets" element={<MyDatasetsPage />} />
              <Route path="/datasets/my-purchases" element={<MyPurchasesPage />} />
              <Route path="/datasets/marketplace" element={<MarketplacePage />} />
              <Route path="/datasets/synthetic-data" element={<SyntheticDataPage />} />
              <Route path="/datasets/:id" element={<DatasetDetailPage />} />
              <Route path="/datasets" element={<Navigate to="/datasets/my-datasets" replace />} />

              {/* Evaluations */}
              <Route path="/evaluations/runs" element={<AllRunsPage />} />
              <Route path="/evaluations/scheduled" element={<ScheduledPage />} />
              <Route path="/evaluations/layer-by-layer" element={<LayerEvaluationPage />} />
              <Route path="/evaluations/run-details" element={<RunDetailedMetricPage />} />
              <Route path="/evaluations" element={<Navigate to="/evaluations/runs" replace />} />

              {/* Configurations */}
              <Route path="/configurations/agents" element={<AgentConfigPage />} />
              <Route path="/configurations/metrics" element={<MetricsConfigPage />} />
              <Route path="/configurations" element={<Navigate to="/configurations/agents" replace />} />

              {/* Benchmarks */}
              <Route path="/benchmarks/suites" element={<SuitesPage />} />
              <Route path="/benchmarks/comparisons" element={<ComparisonsPage />} />
              <Route path="/benchmarks/regression" element={<RegressionPage />} />
              <Route path="/benchmarks" element={<Navigate to="/benchmarks/suites" replace />} />

              {/* Agents */}
              <Route path="/agents/connected" element={<ConnectedAgentsPage />} />
              <Route path="/agents/endpoints" element={<EndpointsPage />} />
              <Route path="/agents" element={<Navigate to="/agents/connected" replace />} />

              {/* Other */}
              <Route path="/metrics" element={<MetricsPage />} />
              <Route path="/rlhf" element={<RLHFPage />} />
              <Route path="/sdk" element={<SDKPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/team" element={<TeamPage />} />

              {/* Resources */}
              <Route path="/resources/cost-analysis" element={<CostAnalysisPage />} />
              <Route path="/resources/pricing-tier" element={<PricingTierPage />} />
              <Route path="/resources/usage-management" element={<UsageManagementPage />} />

              <Route path="/onboarding" element={<OnboardingPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </UserProfileProvider>
    </BrowserRouter>
  );
}

export default App;
