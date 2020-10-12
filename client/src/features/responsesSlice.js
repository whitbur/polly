const { createEntityAdapter, createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

const responsesAdapter = createEntityAdapter()

export const submitResponses = createAsyncThunk('responses/submitResponses', (voteId, {getState}) => {
    const responses = selectAllResponses(getState())

    return fetch(`/api/vote/${voteId}`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({responses: responses})
    }).then(r => r.json())
})

export const responsesSlice = createSlice({
    name: 'responses',
    initialState: responsesAdapter.getInitialState(),
    reducers: {
        upsertResponse: responsesAdapter.upsertOne
    }
})

export const { upsertResponse } = responsesSlice.actions

export const {
    selectById: selectResponseByIdGivenState,
    selectIds: selectResponseIds,
    selectAll: selectAllResponses
} = responsesAdapter.getSelectors(state => state.responses)

export const selectResponseById = responseId => state => selectResponseByIdGivenState(state, responseId)

export default responsesSlice.reducer