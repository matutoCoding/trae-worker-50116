import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import RoutesPage from "@/pages/Routes";
import Sampling from "@/pages/Sampling";
import Attitude from "@/pages/Attitude";
import Records from "@/pages/Records";
import Safety from "@/pages/Safety";
import Results from "@/pages/Results";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/sampling" element={<Sampling />} />
          <Route path="/attitude" element={<Attitude />} />
          <Route path="/records" element={<Records />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/results" element={<Results />} />
        </Route>
      </Routes>
    </Router>
  );
}
