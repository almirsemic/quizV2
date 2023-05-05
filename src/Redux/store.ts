import { configureStore } from '@reduxjs/toolkit'
import quizzesReducer from './quizzesSlice'
import questionsReducer from './questionsSlice'

const store = configureStore({
  reducer: {
    quizzes: quizzesReducer,
    questions: questionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export default store