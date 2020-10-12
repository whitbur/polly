const { createEntityAdapter, createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const questionsAdapter = createEntityAdapter()

export const fetchDataForVote = createAsyncThunk('questions/fetchDataForVote', voteId => {
    return fetch(`/api/vote/${voteId}`).then(r => r.json())
})

export const questionsSlice = createSlice({
    name: 'questions',
    initialState: questionsAdapter.getInitialState({
        poll: null
    }),
    reducers: {},
    extraReducers: {
        [fetchDataForVote.fulfilled]: (state, action) => {
            state.poll = action.payload.poll
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