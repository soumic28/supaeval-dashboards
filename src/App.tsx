
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import DashboardHome from './pages/DashboardHome';
import DatasetsPage from './pages/DatasetsPage';
import ConfigsPage from './pages/ConfigsPage';
import EvaluationsPage from './pages/EvaluationsPage';
import DashboardsPage from './pages/DashboardsPage';
import RLHFPage from './pages/RLHFPage';
import SDKPage from './pages/SDKPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/datasets" element={<DatasetsPage />} />
          <Route path="/configs" element={<ConfigsPage />} />
          <Route path="/evaluations" element={<EvaluationsPage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
          <Route path="/rlhf" element={<RLHFPage />} />
          <Route path="/sdk" element={<SDKPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
