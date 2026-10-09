import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Landing from './pages/Landing.jsx';
import MissionSetup from './pages/MissionSetup.jsx';
import BaseBuilder from './pages/BaseBuilder.jsx';
import MissionControl from './pages/MissionControl.jsx';
import ScienceLibrary from './pages/ScienceLibrary.jsx';
import Results from './pages/Results.jsx';
import HowToPlay from './pages/HowToPlay.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/setup" element={<MissionSetup />} />
        <Route path="/build" element={<BaseBuilder />} />
        <Route path="/mission" element={<MissionControl />} />
        <Route path="/science" element={<ScienceLibrary />} />
        <Route path="/results" element={<Results />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
      </Route>
    </Routes>
  );
}