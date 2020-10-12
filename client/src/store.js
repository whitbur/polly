import { configureStore } from '@reduxjs/toolkit'
import questionsReducer from './features/questionsSlice'
import responsesReducer from './features/responsesSlice'

export default configureStore({
    reducer: {
        questions: questionsReducer,
        responses: responsesReducer
    }
})