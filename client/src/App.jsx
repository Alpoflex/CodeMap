import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/UI/Layout';
import LandingPage from './pages/LandingPage';
import VisualizerPage from './pages/VisualizerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="visualize" element={<VisualizerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
