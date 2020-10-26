import { fetchPoll } from "./questionsSlice";

const { createEntityAdapter, createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const responsesAdapter = createEntityAdapter()

export const fetchVote = createAsyncThunk('responses/fetchVote', (voteId, {dispatch}) => {
    return fetch(`/api/vote/${voteId}`)
    .then(r => r.json())
    .then(r => {
        dispatch(fetchPoll(r.pollId))
        return r
    })
})

export const submitResponses = createAsyncThunk('responses/submitResponses', (voteId, {getState}) => {
    const responses = selectAllResponses(getState())
    const vote = selectVote(getState())

    return fetch(`/api/vote/${voteId}`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(Object.assign({}, vote, {responses: responses}))
    }).then(r => {
        if (r.ok) return r.json()
        console.log("Failed to submit response.")
        throw new Error(r.text())
    })
})

export const responsesSlice = createSlice({
    name: 'responses',
    initialState: responsesAdapter.getInitialState({
        vote: null
    }),
    reducers: {
        upsertResponse: responsesAdapter.upsertOne,
        setAll: responsesAdapter.setAll
    },
    extraReducers: {
        [fetchVote.fulfilled]: (state, action) => {
            state.vote = Object.assign({}, action.payload)
            delete state.vote.responses
            responsesAdapter.setAll(state, action.payload.responses)
        }
    }
})

export const { setAll, upsertResponse } = responsesSlice.actions

export const {
    selectById: selectResponseByIdGivenState,
    selectIds: selectResponseIds,
    selectAll: selectAllResponses
} = responsesAdapter.getSelectors(state => state.responses)

export const selectVote = state => state.responses.vote
export const selectResponseById = responseId => state => selectResponseByIdGivenState(state, responseId)

export default responsesSlice.reducer