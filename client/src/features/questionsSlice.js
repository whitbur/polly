const { createEntityAdapter, createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const questionsAdapter = createEntityAdapter({
    sortComparer: (a, b) => a.rank - b.rank
})

export const fetchPoll = createAsyncThunk('questions/fetchPoll', pollId => {
    return fetch(`/api/poll/${pollId}`).then(r => r.json())
})

export const questionsSlice = createSlice({
    name: 'questions',
    initialState: questionsAdapter.getInitialState({
        poll: null
    }),
    reducers: {},
    extraReducers: {
        [fetchPoll.fulfilled]: (state, action) => {
            state.poll = Object.assign({}, action.payload)
            delete state.poll.questions
            questionsAdapter.setAll(state, action.payload.questions)
        }
    }
})

export const {
    selectById: selectQuestionByIdGivenState,
    selectIds: selectQuestionIds,
    selectAll: selectAllQuestions
} = questionsAdapter.getSelectors(state => state.questions)

export const selectPoll = state => state.questions.poll
export const selectQuestionById = questionId => state => selectQuestionByIdGivenState(state, questionId)

export default questionsSlice.reducer