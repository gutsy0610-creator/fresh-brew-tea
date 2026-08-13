
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import QuestionSolve from './pages/QuestionSolve'
import DerivedSolve from './pages/DerivedSolve'
import Review from './pages/Review'
import GoldenBell from './pages/GoldenBell'
import Stats from './pages/Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="solve" element={<QuestionSolve />} />
          <Route path="derived" element={<DerivedSolve />} />
          <Route path="review" element={<Review />} />
          <Route path="goldenbell" element={<GoldenBell />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
