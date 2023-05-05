import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Question } from '../Types/types'
import questions from '../utils/questions'

const initialState: Question[] = questions

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<Question[]>) => {
        return state.concat(action.payload);
    },
  },
})

export const { setQuestion } = questionsSlice.actions

export default questionsSlice.reducer
