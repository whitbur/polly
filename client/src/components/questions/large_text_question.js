import React, { useState } from 'react'
import { Box, TextField, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectResponseById, upsertResponse } from '../../features/responsesSlice';

const LargeTextQuestion = function({ question, editing }) {
    const dispatch = useDispatch()
    const response = useSelector(selectResponseById(question.id)) || {id: question.id, choice: null}

    const [text, setText] = useState(response.choice !== null ? response.choice : "")
    
    const handleChangeText = function(event) {
        setText(event.target.value)
        dispatch(upsertResponse({id: question.id, choice: event.target.value}))
    }

    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginTop={2} >
            <TextField multiline style={{width: "100%"}} label={question.textLabel} value={text} onChange={handleChangeText} />
        </Box>
    </Box>
}

export default LargeTextQuestion