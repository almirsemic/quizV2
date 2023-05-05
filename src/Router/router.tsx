import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home/Home'
import QuizSolver from '../components/Quiz/QuizSolver'
import NotFound from '../components/NotFound/NotFound'

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz/:id" element={<QuizSolver />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default Router