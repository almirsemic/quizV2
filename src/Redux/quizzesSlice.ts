import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Quiz } from '../Types/types'
import quizzes from '../utils/quizzes'

const initialState: Quiz[] = quizzes

interface SetQuizAction {
  type: 'DELETE' | 'UPDATE' | 'CREATE'
  id?: number | string | undefined
  quiz?: Quiz
}

const deleteQuiz = (state: Quiz[], id: number | string | undefined) => {
  return state.filter((quiz) => quiz.id !== id)
}

const updateQuiz = (state: Quiz[], updatedQuiz: Quiz) => {
  return state.map((quiz) => (quiz.id === updatedQuiz.id ? updatedQuiz : quiz))
}

const createQuiz = (state: Quiz[], newQuiz: Quiz) => {
  const quizWithId = { ...newQuiz, id: new Date().getTime().toString(36) }
  return [...state, quizWithId]
}

export const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    setQuiz: (state, action: PayloadAction<SetQuizAction>) => {
      const { type, id, quiz } = action.payload

      switch (type) {
        case 'DELETE':
          return deleteQuiz(state, id)
        case 'UPDATE':
          return updateQuiz(state, quiz!)
        case 'CREATE':
          return createQuiz(state, quiz!)
        default:
          return state
      }
    },
  },
})

export const { setQuiz } = quizzesSlice.actions

export default quizzesSlice.reducer
