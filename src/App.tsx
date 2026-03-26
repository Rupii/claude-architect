import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import StudyPlan from './components/StudyPlan/StudyPlan';
import StudyGuide from './components/StudyGuide/StudyGuide';
import MockTest from './components/MockTest/MockTest';
import Progress from './components/Progress/Progress';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StudyPlan />} />
          <Route path="guide" element={<StudyGuide />} />
          <Route path="test" element={<MockTest />} />
          <Route path="progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
